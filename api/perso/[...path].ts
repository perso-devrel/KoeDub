import type { VercelRequest, VercelResponse } from '@vercel/node';

/**
 * Perso API 프록시 서버리스 함수.
 *
 * 클라이언트는 `/api/perso/<perso 경로>` 로 호출하고, 이 함수가
 * XP-API-KEY 헤더를 주입해서 https://api.perso.ai 로 전달한다.
 *
 * 이렇게 해야 클라이언트에 API 키가 노출되지 않고, 로컬(`vercel dev`)과
 * 프로덕션(Vercel 배포) 동작이 동일해진다.
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  const apiKey = process.env.XP_API_KEY;
  const baseUrl = (process.env.PERSO_API_BASE_URL || 'https://api.perso.ai').replace(/\/+$/, '');

  if (!apiKey) {
    return res.status(500).json({
      error: 'XP_API_KEY 환경변수가 설정되지 않았습니다. .env.local 또는 Vercel 환경변수를 확인하세요.',
    });
  }

  // [...path] 동적 라우트는 path에 배열로 잡히고, 나머지 쿼리 파라미터는 분리해야 함
  const { path: pathParam, ...restQuery } = req.query as Record<string, string | string[]>;
  const persoPath = Array.isArray(pathParam) ? pathParam.join('/') : pathParam || '';

  // 나머지 쿼리 파라미터를 그대로 재구성
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(restQuery)) {
    if (Array.isArray(value)) {
      value.forEach((v) => search.append(key, v));
    } else if (value !== undefined) {
      search.append(key, value);
    }
  }
  const qs = search.toString();
  const targetUrl = qs ? `${baseUrl}/${persoPath}?${qs}` : `${baseUrl}/${persoPath}`;

  // 요청 헤더 구성: XP-API-KEY 주입, host/origin/referer 등은 제거
  const forwardHeaders: Record<string, string> = {
    'XP-API-KEY': apiKey,
  };

  const incomingContentType = req.headers['content-type'];
  if (incomingContentType && typeof incomingContentType === 'string') {
    forwardHeaders['Content-Type'] = incomingContentType;
  } else if (req.method && req.method !== 'GET' && req.method !== 'HEAD') {
    forwardHeaders['Content-Type'] = 'application/json';
  }

  // body 직렬화
  let body: BodyInit | undefined;
  if (req.method && req.method !== 'GET' && req.method !== 'HEAD') {
    if (req.body !== undefined && req.body !== null) {
      body = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
    }
  }

  try {
    const upstream = await fetch(targetUrl, {
      method: req.method,
      headers: forwardHeaders,
      body,
    });

    // 응답 헤더 그대로 전달 (단, hop-by-hop 헤더는 제외)
    const skipHeaders = new Set([
      'connection',
      'transfer-encoding',
      'content-encoding',
      'content-length',
      'keep-alive',
    ]);
    upstream.headers.forEach((value, key) => {
      if (!skipHeaders.has(key.toLowerCase())) {
        res.setHeader(key, value);
      }
    });

    res.status(upstream.status);

    const responseText = await upstream.text();
    if (responseText) {
      res.send(responseText);
    } else {
      res.end();
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return res.status(502).json({
      error: `Perso API 프록시 요청 실패: ${message}`,
      target: targetUrl,
    });
  }
}
