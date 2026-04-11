# iter-154 — extract formatCreditTime helper

## BACKLOG 항목
자가생성: 5개 페이지에서 반복되는 `formatSeconds` + i18n 레이블 패턴 중복 제거

## 원인 / 가설
DashboardPage, PricingPage, SettingsPage, LibraryDetailPage, LibraryPage 5곳에서
`formatSeconds(value, { hours: t('common.hours'), minutes: t('common.minutes'), seconds: t('common.seconds') })`
동일 패턴이 반복됨. `t` 함수를 받아 내부에서 레이블을 구성하는 래퍼 함수로 추출.

## 변경 파일
- `src/utils/format.ts` — `formatCreditTime(seconds, t)` 함수 추가
- `src/utils/format.test.ts` — `formatCreditTime` 테스트 3개 추가 (378→381 tests)
- `src/pages/DashboardPage.tsx` — import 변경 + 호출 교체
- `src/pages/PricingPage.tsx` — import 변경 + 호출 교체
- `src/pages/SettingsPage.tsx` — import 변경 + 호출 교체
- `src/pages/LibraryDetailPage.tsx` — import 변경 + 호출 교체
- `src/pages/LibraryPage.tsx` — import 변경 + 호출 교체

## 검증 결과
- `npm run build` ✔ (257KB main bundle 유지)
- `npx vitest run` ✔ (381 tests passed)
- `dub-flow.mjs` → exit 77 (upstream Perso API 500 지속, 코드 회귀 아님)

## 다음 루프 주의사항
- Perso API 500 지속 — API 의존 항목은 여전히 blocked
- `formatSeconds`는 export 유지 (기존 테스트에서 직접 사용), 향후 페이지에서 직접 임포트 불필요
- iter-154 시점에서 dub-flow 실패는 iter-153과 동일한 upstream-down 상태
