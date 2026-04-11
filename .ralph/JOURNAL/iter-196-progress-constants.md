# Iteration 196 — extract StudioPage progress constants

## BACKLOG 항목
자가 생성: StudioPage 더빙 진행률 매직 넘버를 명명 상수로 추출

## 원인 / 배경
- iter-196은 원래 dub-flow 회귀 실패 수정 모드였으나, 실패 원인이 exit 77 (upstream Perso API 500)으로 코드 회귀 아님
- 대신 자가 생성 풀에서 매직 넘버 추출 작업 진행

## 변경 파일
- `src/utils/studio.ts` — PROGRESS_GET_SPACE, PROGRESS_UPLOAD_START, PROGRESS_UPLOAD_DONE, PROGRESS_QUEUE_ENSURED, PROGRESS_TRANSLATION_REQUESTED, PROGRESS_POLL_COMPLETE, PROGRESS_SCRIPT_FETCHED, PROGRESS_LIP_SYNC_BASE, PROGRESS_LIP_SYNC_SCALE 상수 추가 + computeDubbingProgress 내부 DUBBING_PROGRESS_OFFSET/SCALE 추출
- `src/pages/StudioPage.tsx` — 8개 setProgress() 호출에서 매직 넘버를 상수로 교체

## 검증 결과
- `npm run build` ✔
- `vitest run studio.test.ts` — 18/18 pass ✔
- `dub-flow.mjs` — exit 77 (upstream Perso API 500, 코드 회귀 아님) ✔
- 배포 후 재검증: exit 77 (동일, upstream 장애 지속)

## 다음 루프 주의사항
- Perso API 500 지속 — dub-flow exit 0 확인은 API 복구 후 가능
- P2 미완료 2개(다운로드 URL HEAD 검증, 다국어 회귀)도 API 필요
- 자가 생성 풀에서 다른 매직 넘버/리팩터 계속 진행 가능
