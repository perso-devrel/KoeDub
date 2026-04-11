# Iteration 192 — extract LandingPage section padding constant

## BACKLOG item
자가 생성 풀: 중복 className 추출

## 회귀 테스트 실패 분석
- 직전 실패 로그: exit 77 (upstream-down) — Perso API `/portal/api/v1/spaces` HTTP 500
- 코드 회귀 아님. auth-guard/spa-fallback 모두 통과.

## 변경 내용
- `src/pages/LandingPage.tsx`: `LANDING_SECTION_CLASS = "px-4 py-20 md:py-28 mx-auto"` 상수 추가
  - Features, How it works, Languages, Pricing, FAQ 5개 section의 중복 패딩 className 교체
  - 각 section은 `max-w-3xl` / `max-w-5xl` / `max-w-6xl` 만 개별 지정

## 검증
- `npm run build` ✅ (975ms)
- `npx vitest run` 382 tests passed ✅
- `node .ralph/test/dub-flow.mjs` exit 77 (upstream-down, Perso API 장애 지속)

## PR
- Issue: #661, PR: #662 (develop), #663 (main)

## 다음 루프 참고
- Perso API 500 지속 — exit 77/78 모두 외부 장애
- 남은 P2: 다운로드 URL HEAD 검증, 다국어 회귀 (둘 다 API 필요)
- LandingPage 402줄 → 403줄 (상수 1줄 추가, 5줄 단축)
