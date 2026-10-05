# Session: TickTen 스트레칭/운동용 인터벌 비프 타이머 웹앱 구축

- **날짜**: 2026-10-05 12:53
- **주제**: 스트레칭 자세 유지를 위한 10초 비프 및 1초 미세 틱 타이머 기획, 기술 검토, 웹앱(PWA) 구현, 정적 배포 및 도메인 설정 문서화

---

## 1. 개요 및 요구사항
- 스트레칭, 플랭크 등 자세 유지 운동 시 화면을 보지 않고 청각 피드백만으로 시간을 인지하는 도구
- 10초 단위의 또렷한 메인 비프음 (기본값, 커스텀 조절 가능)
- 1초 단위의 미세한 틱 사운드 (토글 가능)
- 모바일 무설치 웹앱(PWA) 우선 개발 및 Screen Wake Lock(화면 꺼짐 방지) 연동
- 백엔드 서버 없는 100% 순수 정적 웹 리소스 구조 검증 및 무료 호스팅/개인 도메인 연동 방안 정리

---

## 2. 주요 산출물
1. **기획 및 배포 문서**:
   - [`README.md`](../README.md): 프로젝트 개요, 빠른 시작, 핵심 배포 및 버전 관리 요약
   - [`docs/research-and-tech-analysis.md`](../docs/research-and-tech-analysis.md): 웹앱 vs 네이티브 앱 상세 기술 분석 및 타당성 평가
   - [`docs/deployment-guide.md`](../docs/deployment-guide.md): 무료 정적 웹 호스팅(GitHub Pages, Cloudflare Pages, Vercel) 및 개인 도메인(DNS CNAME) 연동 가이드
   - [`docs/release-and-versioning.md`](../docs/release-and-versioning.md): 시맨틱 버저닝, PWA 캐시 갱신 및 지속적 배포(CI/CD) 가이드
2. **사운드 엔진**:
   - [`src/lib/audioEngine.ts`](../src/lib/audioEngine.ts): Web Audio API 기반 오실레이터 합성 엔진 (880Hz 비프, 25ms 틱)
3. **화면 켜짐 유지 모듈**:
   - [`src/lib/wakeLock.ts`](../src/lib/wakeLock.ts): Screen Wake Lock API 연동 및 탭 복귀 자동 재획득
4. **타이머 훅 & UI**:
   - [`src/hooks/useTimer.ts`](../src/hooks/useTimer.ts): 타임스탬프 델타 기반 오차 없는 정밀 타이머
   - [`src/components/TimerDisplay.tsx`](../src/components/TimerDisplay.tsx): 대형 시계 및 인터벌 프로그레스 링
   - [`src/components/TimerControls.tsx`](../src/components/TimerControls.tsx): 대형 원터치 조작 버튼
   - [`src/components/SettingsPanel.tsx`](../src/components/SettingsPanel.tsx): 주기 설정, 틱 토글, 사운드 테스트, 볼륨 제어
   - [`src/components/WakeLockBadge.tsx`](../src/components/WakeLockBadge.tsx): 화면 유지 상태 표시
5. **PWA & CI/CD**:
   - [`public/manifest.json`](../public/manifest.json), [`public/icon.svg`](../public/icon.svg), [`public/sw.js`](../public/sw.js)
   - [`.github/workflows/deploy.yml`](../.github/workflows/deploy.yml): GitHub Pages 자동 빌드/배포 파이프라인

---

## 3. 검증
- `npm run build`: TypeScript 빌드 성공 (0 errors)
- Vite 정적 번들 생성 확인 (`dist/` 생성)
