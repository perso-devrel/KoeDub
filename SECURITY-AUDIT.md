# 보안 감사 보고서 (Security Audit Report)

> **최종 갱신:** 2026-04-22
> **검사 도구:** `npm audit` (GitHub Advisory DB), 수동 리뷰
> **후속 자동 검사:** `.github/workflows/security-audit.yml` (매일 + PR 시 OSV-Scanner + npm audit)

---

## 1. 요약 (Executive Summary)

| 구분 | 취약점 수 |
|------|-----------|
| **프로덕션 런타임 번들 (`--omit=dev`)** | **0 건** |
| 전체 (dev 포함) | 9 건 (High 6, Moderate 3) |
| Critical | 0 건 |

**결론:** 프로덕션 번들은 **클린(0건)**. 남은 취약점은 전부 `@vercel/node` devDependency 트리 내부 도구 체인에서 유래하며, 최종 빌드 산출물에는 포함되지 않습니다.

### 변경 이력
- **2026-04-22 [현재]** 9 건 (High 6, Moderate 3) — `@vercel/node@5.7.12`
- **2026-04-16** 7 건 (High 3, Moderate 4) — `@vercel/node@^4.0.0` 업그레이드 후

---

## 2. 프로덕션 취약점 (Runtime)

`dependencies` 트리에서 감지된 취약점: **없음**

직접 번들링되는 런타임 의존성(React 19, axios, Firebase, `@libsql/client`, i18next, zustand, react-router-dom, tailwindcss, recharts)은 모두 최신 버전을 유지합니다.

---

## 3. 개발 전용 취약점 (devDependencies)

아래 9건은 `@vercel/node` 내부 빌드 도구 체인에서 유래하며, 프로덕션 번들/서버리스 함수 런타임에 **영향 없음**. CI 환경에서만 실행됩니다.

| 패키지 | 심각도 | 비고 |
|--------|--------|------|
| `undici` <= 6.23.0 | High (7 CVE) | `@vercel/node` 내부 fetch: 요청 스머글링, CRLF 인젝션, 메모리 소비, 인증서 DoS 등 |
| `path-to-regexp` 4.0.0-6.2.2 | High | 백트래킹 ReDoS |
| `minimatch` 10.0.0-10.2.2 | High (3 CVE) | 와일드카드/GLOBSTAR/extglob ReDoS |
| `ajv` 7.x-8.17.1 | Moderate | `$data` 옵션 사용 시 ReDoS |
| `smol-toml` < 1.6.1 | Moderate | 대량 주석 TOML 문서 DoS |

**해결 방법:** `npm audit fix --force`로 `@vercel/node@4.0.0`으로 다운그레이드 가능하나, breaking change. `@vercel/node` 업스트림 패치를 대기 중.

---

## 4. 런타임 의존성 리뷰

| 패키지 | 버전 | 상태 |
|--------|------|------|
| `react` / `react-dom` | ^19.2.5 | 최신 |
| `react-router-dom` | ^7.14.1 | 최신 |
| `firebase` | ^12.12.0 | 최신 |
| `@libsql/client` | ^0.17.2 | 최신 |
| `axios` | ^1.15.1 | 최신 |
| `i18next` / `react-i18next` | ^26 / ^17 | 최신 |
| `recharts` | ^3.8.1 | 최신 |
| `tailwindcss` | ^4.2.2 | 최신 |
| `zustand` | ^5.0.12 | 최신 |

---

## 5. 코드 보안 리뷰

| 항목 | 결과 |
|------|------|
| `eval()` / `innerHTML` / `dangerouslySetInnerHTML` | 미사용 |
| SQL Injection | 파라미터화된 쿼리 사용 (안전) |
| API 키 노출 | 서버 사이드 프록시로 차단 |
| 프록시 SSRF | 경로 허용 목록 적용 (`api/perso.ts`) |
| 에러 정보 노출 | 내부 URL 미노출 (2026-04-22 수정) |
| Mock 인증 폴백 | Firebase 미설정 시에만 활성화 |

---

## 6. 자동화된 보안 통제

| 통제 | 파일 | 트리거 |
|------|------|--------|
| Dependabot alerts | GitHub 기본 + `dependabot.yml` | 실시간 + 주간 |
| Dependabot security updates | `dependabot.yml` | CVE 공개 즉시 |
| CodeQL (security-extended) | `.github/workflows/codeql.yml` | push / PR / 주간 |
| OSV-Scanner | `.github/workflows/security-audit.yml` | 일간 |
| npm audit (PR 게이트, `--omit=dev`) | `.github/workflows/security-audit.yml` | push / PR |
| Secret scanning + push protection | GitHub 설정 | 실시간 |
| Private vulnerability reporting | GitHub 설정 | 항상 |
| Branch protection (`main`) | GitHub 설정 | PR 머지 시 |

---

## 7. 다음 재검사

| 항목 | 주기 |
|------|------|
| CVE 자동 스캔 | 매일 09:00 KST |
| CodeQL | 매주 월요일 09:00 KST + 모든 PR |
| 수동 감사 보고서 갱신 | 분기별 또는 중대 취약점 공개 시 |

---

*본 보고서는 오픈소스 공개 투명성을 위해 저장소에 포함됩니다. 갱신 이력은 git 로그를 참조하세요.*
