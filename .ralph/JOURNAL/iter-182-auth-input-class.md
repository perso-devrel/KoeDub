# iter-182 — extract AuthPage duplicate input className

## BACKLOG 항목
자가 생성 풀 — 중복 CSS 클래스 상수 추출

## 원인 / 가설
AuthPage의 3개 input 요소(displayName, email, password)에 동일한 Tailwind 클래스 문자열(`w-full rounded-lg bg-surface-900 border border-surface-700 px-4 py-2.5 text-sm text-white placeholder-gray-500 outline-none focus:border-primary-500 transition-colors`)이 그대로 반복됨. 모듈 수준 AUTH_INPUT_CLASS 상수로 추출.

## 변경 파일
- `src/pages/AuthPage.tsx`: 중복 className 3개를 `AUTH_INPUT_CLASS` 상수 참조로 교체

## 검증 결과
- `npm run build` ✔ 통과
- `node .ralph/test/dub-flow.mjs` → exit 77 (Perso API upstream 500, 코드 회귀 아님)
- PR #615 → develop squash merge ✔
- PR #616 → main merge ✔

## 다음 루프 주의사항
- Perso API 500 지속 — exit 77 upstream-down
- dub-flow exit 0 검증은 API 복구 시까지 불가
- ProfileTab/CheckoutModal도 유사한 input 스타일이 있으나 디자인이 의도적으로 다름 (rounded-xl/py-3/bg-surface-800 vs rounded-lg/py-2.5/bg-surface-900) — 통합 부적합
