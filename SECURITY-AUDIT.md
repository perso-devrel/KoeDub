# 보안 감사 보고서 (Security Audit Report)

> **검사 일자:** 2026-04-16
> **검사 대상:** `main` 브랜치 `HEAD` (`d00d870`)
> **검사 도구:** `npm audit` (GitHub Advisory DB), 수동 리뷰
> **후속 자동 검사:** `.github/workflows/security-audit.yml` (매일 + PR 시 OSV-Scanner + npm audit)

---

## 1. 요약 (Executive Summary)

| 항목 | 결과 |
|------|------|
| 감지된 취약점 | **10건** |
| High severity | 6 |
| Moderate severity | 4 |
| Critical severity | 0 |
| Runtime(프로덕션 번들) 영향 | **없음** |
| 수정 가능 | 전부 (`@vercel/node@4` 업그레이드 시) |

**결론:** 모든 취약점이 `@vercel/node` devDependency 트리에 한정되어 있으며, 최종 배포 번들에는 포함되지 않습니다. 단, 서버리스 함수(`api/`) 빌드 시 `@vercel/node`를 사용하므로 **우선 순위 높은 업그레이드 권장**.

---

## 2. 상세 취약점 목록

아래 취약점은 전부 `@vercel/node` 패키지 의존성 체인에서 유래합니다.

| 패키지 | 심각도 | CVE / Advisory | 설명 | 경로 |
|--------|--------|----------------|------|------|
| `@vercel/node` | **High** | - | Transitive 취약점 집약 | `devDependency` (direct) |
| `@vercel/build-utils` | High | via `@vercel/python-analysis` | 전이 취약점 | `devDependency` |
| `@vercel/python-analysis` | High | via `minimatch`, `smol-toml` | 전이 취약점 | `devDependency` |
| `minimatch` 10.0.0–10.2.2 | High | [GHSA-3ppc-4f35-3m26](https://github.com/advisories/GHSA-3ppc-4f35-3m26) | ReDoS via repeated wildcards | `devDependency` |
| `minimatch` | High | [GHSA-7r86-cg39-jmmj](https://github.com/advisories/GHSA-7r86-cg39-jmmj) | ReDoS in `matchOne()` backtracking (CVSS 7.5) | `devDependency` |
| `minimatch` | High | [GHSA-23c5-xmqv-rm74](https://github.com/advisories/GHSA-23c5-xmqv-rm74) | ReDoS via nested extglobs (CVSS 7.5) | `devDependency` |
| `path-to-regexp` 4.0.0–6.2.2 | High | [GHSA-9wv6-86v2-598j](https://github.com/advisories/GHSA-9wv6-86v2-598j) | Backtracking regex output (CVSS 7.5) | `devDependency` |
| `undici` ≤ 6.23.0 | High | [GHSA-c76h-2ccp-4975](https://github.com/advisories/GHSA-c76h-2ccp-4975) 외 6건 | Insufficient randomness, HTTP smuggling, CRLF injection, WebSocket 관련 (CVSS 6.8) | `devDependency` |
| `ajv` 7.0.0–8.17.1 | Moderate | [GHSA-2g4f-4pwh-qvx6](https://github.com/advisories/GHSA-2g4f-4pwh-qvx6) | ReDoS via `$data` option | `devDependency` |
| `follow-redirects` ≤ 1.15.11 | Moderate | [GHSA-r4q5-vmmm-2653](https://github.com/advisories/GHSA-r4q5-vmmm-2653) | Auth header leak on cross-domain redirect | `devDependency` |
| `smol-toml` < 1.6.1 | Moderate | [GHSA-v3rj-xjv7-4jmq](https://github.com/advisories/GHSA-v3rj-xjv7-4jmq) | DoS via TOML 주석 라인 (CVSS 5.3) | `devDependency` |
| `@vercel/static-config` | Moderate | via `ajv` | 전이 취약점 | `devDependency` |

**프로덕션 런타임 (`dependencies`) 취약점:** 0건

---

## 3. 권장 조치 (Remediation Plan)

### 즉시 조치 (High)

```bash
npm install --save-dev @vercel/node@^4.0.0
```

> ⚠️ **Breaking change** — `@vercel/node` v4는 Node 18+ 필수 및 serverless 함수 시그니처 일부 변경. `api/` 폴더 내 함수 서명 재검증 필요.

### 점진 조치

1. **의존성 고정** — `package-lock.json` 커밋 유지 (이미 적용됨)
2. **CI 게이트** — `.github/workflows/security-audit.yml`가 매 PR에서 `npm audit --audit-level=high --omit=dev`로 프로덕션 취약점 발견 시 빌드 실패
3. **OSV-Scanner** — GitHub Advisory DB 외 Google OSV.dev 교차 검증, SARIF 결과를 Code Scanning에 업로드
4. **Dependabot** — 주간 자동 PR 생성 (`.github/dependabot.yml`)

---

## 4. 런타임 (Runtime) 의존성 리뷰

프로덕션 번들 (`dependencies`)에 대한 수동 리뷰:

| 패키지 | 버전 | 상태 |
|--------|------|------|
| `react` | ^19.2.4 | ✅ 최신 |
| `react-dom` | ^19.2.4 | ✅ 최신 |
| `react-router-dom` | ^7.14.0 | ✅ 최신 |
| `firebase` | ^12.11.0 | ✅ 최신 |
| `@libsql/client` | ^0.17.2 | ✅ 최신 |
| `axios` | ^1.14.0 | ✅ 최신 |
| `i18next` | ^26.0.3 | ✅ 최신 |
| `react-i18next` | ^17.0.2 | ✅ 최신 |
| `recharts` | ^3.8.1 | ✅ 최신 |
| `tailwindcss` | ^4.2.2 | ✅ 최신 |
| `zustand` | ^5.0.12 | ✅ 최신 |

---

## 5. 자동화된 보안 통제 (운영 중)

| 통제 | 파일 | 트리거 |
|------|------|--------|
| **Dependabot alerts** | GitHub 기본 + `dependabot.yml` | 실시간 + 주간 |
| **Dependabot security updates** | `dependabot.yml` | CVE 공개 즉시 |
| **CodeQL (security-extended)** | `.github/workflows/codeql.yml` | push / PR / 주간 |
| **OSV-Scanner** | `.github/workflows/security-audit.yml` | 일간 |
| **npm audit** (PR 게이트) | `.github/workflows/security-audit.yml` | push / PR |
| **Secret scanning + push protection** | GitHub 설정 | 실시간 |
| **Private vulnerability reporting** | GitHub 설정 | 항상 |
| **Branch protection (`main`)** | GitHub 설정 | PR 머지 시 |

---

## 6. 다음 재검사

| 항목 | 주기 |
|------|------|
| CVE 자동 스캔 | 매일 09:00 KST |
| CodeQL | 매주 월요일 09:00 KST + 모든 PR |
| 수동 감사 보고서 갱신 | 분기별 또는 중대 취약점 공개 시 |

---

*본 보고서는 오픈소스 공개 투명성을 위해 저장소에 포함됩니다. 갱신 이력은 git 로그를 참조하세요.*
