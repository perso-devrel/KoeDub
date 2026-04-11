# iter-173 — extract LibraryCard component

## BACKLOG 항목
자가 생성 풀: 컴포넌트 분해 (LibraryPage 인라인 카드 JSX 추출)

## dub-flow 상태
exit 77 — Perso API 서버 에러(500) 지속. auth-guard / SPA fallback 모두 정상. 코드 회귀 아님.

## 변경 파일
- `src/components/LibraryCard.tsx` — 신규: 인라인 카드 JSX를 독립 컴포넌트로 추출 (76줄)
- `src/pages/LibraryPage.tsx` — 285→219줄 (66줄 감소), 미사용 import 정리 (Link, resolvePersoFileUrl, formatCreditTimeMs, PlayIcon, ClockIcon)

## 검증 결과
- `npm run build` ✅ (257KB main bundle 유지)
- `vitest` 372 tests ✅
- `dub-flow` exit 77 (upstream-down, 코드 회귀 아님)

## PR
- #571 (develop), #572 (main)
- Issue: #570

## 다음 루프 주의사항
- Perso API 500 지속 중 — P2 API 의존 항목(다운로드 URL HEAD 검증, 다국어 회귀) 계속 blocked
- LibraryPage 219줄로 축소 완료, 추가 분해 여지 적음
- StudioPage 462줄 — 상태/핸들러를 커스텀 훅으로 추출 가능 (다음 후보)
