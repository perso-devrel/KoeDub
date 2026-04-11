# iter-144 — extract SettingsPage language buttons to LANGUAGE_OPTIONS constant

## BACKLOG 항목
자가생성: SettingsPage 언어 탭 중복 JSX 제거

## 원인 / 가설
SettingsPage 언어 선택 탭에서 한국어/영어 버튼 2개가 동일한 JSX 구조를 반복 (각 17줄, 총 34줄).
LANGUAGE_OPTIONS 모듈 수준 상수로 추출하면 map() 한 번으로 대체 가능.

## 변경 파일
- `src/pages/SettingsPage.tsx`: LANGUAGE_OPTIONS 상수 추가, 중복 버튼 JSX를 map()으로 교체 (-12줄 순감소)

## 검증 결과
- `npm run build`: 통과
- `npm run test`: 378개 통과
- `dub-flow.mjs`: exit 77 (upstream Perso API 500 지속, 코드 회귀 아님)

## dub-flow 실패 분석
직전 iteration(143)과 동일한 Perso API 업스트림 500 에러. `/portal/api/v1/spaces` 4회 재시도 후 exit 77.
BACKLOG의 [blocked] Perso API 복구 대기 항목에 해당.

## PR
- Issue: #428
- PR: #429 (→develop), #430 (→main)

## 다음 루프 주의사항
- Perso API 500 지속 — exit 77은 외부 장애
- 인라인 배열 hoisting 시리즈 이후 새 자가생성 카테고리 진행 중 (중복 JSX 제거)
