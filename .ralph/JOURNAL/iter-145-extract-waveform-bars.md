# iter-145 — extract WaveformBars component

## BACKLOG item
자가 생성 풀: LandingPage 중복 waveform 렌더링 패턴 추출

## 원인 / 가설
LandingPage의 Original/Dubbed 영상 비교 섹션에서 동일한 waveform `.map()` 패턴이 2회 반복.
색상 클래스(`bg-primary-400/60` vs `bg-accent-400/60`)만 다름.

## 변경 파일
- `src/pages/LandingPage.tsx`: WaveformBars 서브컴포넌트 추출 (+12줄 / -11줄)

## 검증 결과
- `npm run build` ✔ (257KB 메인 번들 유지)
- `node .ralph/test/dub-flow.mjs` → exit 77 (upstream Perso API 500, 코드 회귀 아님)
- PR #434 → develop squash merge, PR #435 → main merge

## 다음 루프 주의사항
- Perso API 500 지속 — API 의존 항목은 계속 [blocked]
- dub-flow 회귀가 exit 77인 한 코드 회귀 아닌 것으로 분류
- iter-145 회귀 실패 모드 "fix"로 진입했으나 실제 코드 결함 없이 upstream 장애 → 자가 생성 풀에서 리팩터 1건 처리
