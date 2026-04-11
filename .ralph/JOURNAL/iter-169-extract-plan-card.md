# iter-169 — extract PricingPage plan card to PlanCard component

## BACKLOG 항목
자가 생성 풀 — PricingPage 컴포넌트 분해 (259줄로 축소)

## 원인 / 가설
- 이번 iteration은 mode: fix로 시작했으나 dub-flow 실패 원인은 exit 77 (Perso API 500 upstream-down)
- 코드 회귀 아님 — auth-guard/SPA fallback 모두 정상
- Perso API 서버 에러가 지속되는 동안 코드 품질 개선 항목 선택

## 변경 파일 목록과 이유
- `src/components/PlanCard.tsx` (신규): plan card 렌더링 JSX + PlanConfig 인터페이스 독립 컴포넌트로 추출
  - isCurrent/onSelect props로 부모와 연결
  - CheckmarkIcon import 자체 관리
- `src/pages/PricingPage.tsx` (수정): 인라인 plan card JSX 제거, PlanCard import
  - PlanConfig 인터페이스를 PlanCard.tsx에서 import
  - CheckmarkIcon import 제거 (PlanCard가 자체 관리)
  - 336줄 → 259줄

## 검증 결과
- `npm run build` ✔ (PricingPage 10.22KB)
- `npm run test` ✔ (372 passed)
- `node .ralph/test/dub-flow.mjs` → exit 77 (upstream-down, 코드 회귀 아님)
- 배포 후 재검증: 대기 중

## 다음 루프가 알아야 할 주의사항
- Perso API 500 상태 여전히 지속
- P2 미완료 2개 (다운로드 URL HEAD 검증, 다국어 회귀)는 API 복구 필요
- PricingPage 259줄로 축소 완료
- issue #549, PR #550/#551
