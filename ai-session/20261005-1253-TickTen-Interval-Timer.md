# Session: TickTen 스트레칭/운동용 인터벌 비프 타이머 웹앱 구축, GitHub 배포 및 PWA 설치 활성화

- **날짜**: 2026-10-05 12:53 (업데이트: 17:00)
- **주제**: 스트레칭 자세 유지를 위한 10초 비프 및 1초 미세 틱 타이머 기획, 기술 검토, 웹앱(PWA) 구현, GitHub Pages 무료 정적 배포 및 모바일 브라우저 PWA 앱 설치 기능 활성화

---

## 1. 개요 및 요구사항
- 스트레칭, 플랭크 등 자세 유지 운동 시 화면을 보지 않고 청각 피드백만으로 시간을 인지하는 도구
- 10초 단위의 또렷한 메인 비프음 (기본값, 커스텀 조절 가능)
- 1초 단위의 미세한 틱 사운드 (토글 가능)
- 모바일 무설치 웹앱(PWA) 우선 개발 및 Screen Wake Lock(화면 꺼짐 방지) 연동
- 백엔드 서버 없는 100% 순수 정적 웹 리소스 구조 검증 및 무료 호스팅/개인 도메인 연동 방안 정리
- `gimslab/tickten` GitHub 레포지토리 생성, 코드 푸시 및 GitHub Pages 자동 배포 파이프라인 가동
- **모바일 브라우저 '앱으로 설치하기' 기능 활성화**: 서브패스(GitHub Pages) 경로 문제 수정, Chromium 필수 규격(192px/512px PNG 아이콘) 생성, 인앱 원클릭 설치 버튼(`InstallPrompt`) 추가

---

## 2. 주요 산출물
1. **GitHub 저장소 및 배포 URL**:
   - **Repository**: [https://github.com/gimslab/tickten](https://github.com/gimslab/tickten)
   - **배포 라이브 URL**: [https://github.gimslab.com/tickten/](https://github.com/gimslab/tickten/) (또는 [https://gimslab.github.io/tickten/](https://gimslab.github.io/tickten/))
2. **문서**:
   - [`README.md`](../README.md): 프로젝트 개요, 빠른 시작, 핵심 배포 및 버전 관리 요약
   - [`docs/research-and-tech-analysis.md`](../docs/research-and-tech-analysis.md): 웹앱 vs 네이티브 앱 상세 기술 분석 및 타당성 평가
   - [`docs/deployment-guide.md`](../docs/deployment-guide.md): 무료 정적 웹 호스팅 및 개인 도메인(DNS CNAME) 연동 가이드
   - [`docs/release-and-versioning.md`](../docs/release-and-versioning.md): 시맨틱 버저닝, PWA 캐시 갱신 및 지속적 배포(CI/CD) 가이드
3. **PWA 개선 모듈**:
   - [`src/components/InstallPrompt.tsx`](../src/components/InstallPrompt.tsx): `beforeinstallprompt` 연동 원터치 설치 버튼 및 iOS 설치 안내 모달
   - [`public/pwa-192x192.png`](../public/pwa-192x192.png), [`public/pwa-512x512.png`](../public/pwa-512x512.png): 브라우저 설치 필수 PNG 규격
   - [`public/manifest.json`](../public/manifest.json): 상대경로 `start_url` 및 PNG 아이콘 매핑
   - [`public/sw.js`](../public/sw.js): v2 캐시 및 상대경로 자산 캐싱
   - [`src/main.tsx`](../src/main.tsx): `import.meta.env.BASE_URL` 기반 정밀 SW 등록
4. **소스 코드 및 엔진**:
   - [`src/lib/audioEngine.ts`](../src/lib/audioEngine.ts): Web Audio API 오실레이터 합성 엔진 (880Hz 비프, 25ms 틱)
   - [`src/lib/wakeLock.ts`](../src/lib/wakeLock.ts): Screen Wake Lock 연동 및 탭 복귀 자동 재획득
   - [`src/hooks/useTimer.ts`](../src/hooks/useTimer.ts): 타임스탬프 델타 기반 오차 없는 정밀 타이머
   - [`src/components/`](../src/components/): TimerDisplay, TimerControls, SettingsPanel, WakeLockBadge, InstallPrompt
   - [`.github/workflows/deploy.yml`](../.github/workflows/deploy.yml): GitHub Pages 자동 빌드/배포 워크플로

---

## 3. 검증 결과
- GitHub Actions 최신 커밋 자동 배포 성공 (37280808114)
- `manifest.json`, `pwa-192x192.png`, `pwa-512x512.png`, `sw.js` 모두 HTTP 200 OK 응답 확인
- 브라우저 PWA 설치 규격(Lighthouse Criteria) 완벽 충족
