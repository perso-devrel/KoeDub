# iter-137 — replace LibraryPage inline languageOptions with shared LANGUAGE_KEYS

## BACKLOG 항목
자가 생성 풀: 인라인 배열을 모듈 수준 상수로 추출 (이전 iter-135, iter-136 패턴 계속)

## 발견 / 가설
- LibraryPage 컴포넌트 내부에 `languageOptions = ['all', 'ja', 'ko', 'en', ...]` 배열이 하드코딩
- `src/constants.ts`에 이미 `LANGUAGE_KEYS`가 동일한 언어 키 목록으로 존재
- 중복 제거 + 언어 추가/삭제 시 자동 동기화

## 변경 파일
- `src/pages/LibraryPage.tsx`: `LANGUAGE_KEYS` import 추가, `LIBRARY_LANGUAGE_OPTIONS` 모듈 수준 상수 정의, 컴포넌트 내부 `languageOptions` 제거

## 검증
- `npm run build` ✅ (257KB 메인 번들 변동 없음)
- `npx vitest run` ✅ (378 tests pass)
- `dub-flow.mjs` → exit 77 (Perso API 500 지속, 코드 회귀 아님)

## PR
- Issue: #392
- PR develop: #393 (squash merged)
- PR main: #394 (merge)

## 다음 루프 참고
- Perso API 500 지속 중 — exit 77 외부 장애
- 인라인 배열 hoisting 시리즈 (iter-135~137) 완료. LandingPage/PricingPage/SettingsPage의 인라인 배열은 `t()` 훅에 의존하므로 모듈 수준 추출 불가
