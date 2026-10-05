# Session: TickTen 스트레칭/운동용 인터벌 비프 타이머 웹앱 구축 및 i18n 다국어 지원

- **날짜**: 2026-10-05 12:53 (업데이트: 17:15)
- **주제**: 스트레칭 자세 유지를 위한 10초 비프 및 1초 미세 틱 타이머 기획, 기술 검토, 웹앱(PWA) 구현, GitHub Pages 무료 정적 배포, PWA 앱 설치 기능 활성화 및 i18n(영어 기본, 한국어 지원, 시스템 언어 자동 감지) 구현 완료

---

## 1. 개요 및 요구사항
- 스트레칭, 플랭크 등 자세 유지 운동 시 화면을 보지 않고 청각 피드백만으로 시간을 인지하는 도구
- 10초 단위의 또렷한 메인 비프음 (기본값, 커스텀 조절 가능)
- 1초 단위의 미세한 틱 사운드 (토글 가능)
- 모바일 무설치 웹앱(PWA) 우선 개발 및 Screen Wake Lock(화면 꺼짐 방지) 연동
- 백엔드 서버 없는 100% 순수 정적 웹 리소스 구조 검증 및 무료 호스팅/개인 도메인 연동 방안 정리
- `gimslab/tickten` GitHub 레포지토리 생성, 코드 푸시 및 GitHub Pages 자동 배포 파이프라인 가동
- 모바일 브라우저 PWA 앱 설치 규격(PNG 아이콘, SW 경로) 보완 및 인앱 원터치 설치 버튼 추가
- **i18n 국제화 지원**:
  - 기본 언어: `en` (English)
  - 지원 언어: `en` (English), `ko` (한국어)
  - 언어 감지: `auto` 시 사용자의 브라우저/OS 기본 언어(`navigator.languages`)를 자동 감지하여 한국어 환경이면 `ko`, 그 외는 `en` 적용
  - 사용자 선택 유지: 헤더 및 설정 패널에서 사용자가 수동으로 선택 가능하며 `localStorage`에 영구 보관
  - 확장 가능한 TypeScript 타입 정의 스키마 구조 채택

---

## 2. 주요 산출물
1. **GitHub 저장소 및 배포 URL**:
   - **Repository**: [https://github.com/gimslab/tickten](https://github.com/gimslab/tickten)
   - **배포 라이브 URL**: [https://github.gimslab.com/tickten/](https://github.com/gimslab/tickten/) (또는 [https://gimslab.github.io/tickten/](https://gimslab.github.io/tickten/))
2. **i18n 모듈**:
   - [`src/i18n/types.ts`](../src/i18n/types.ts): 시맨틱 다국어 스키마 및 타입
   - [`src/i18n/locales/en.ts`](../src/i18n/locales/en.ts): 영어(기본) 번역 사전
   - [`src/i18n/locales/ko.ts`](../src/i18n/locales/ko.ts): 한국어 번역 사전
   - [`src/i18n/I18nContext.tsx`](../src/i18n/I18nContext.tsx): 브라우저 언어 감지 및 설정 Context Provider
   - [`src/components/LanguageSelector.tsx`](../src/components/LanguageSelector.tsx): 헤더 및 설정창 언어 전환기
3. **PWA 및 UI 컴포넌트**:
   - [`src/components/InstallPrompt.tsx`](../src/components/InstallPrompt.tsx): PWA 원클릭 설치 버튼 및 다국어 안내
   - [`src/components/TimerDisplay.tsx`](../src/components/TimerDisplay.tsx), [`TimerControls.tsx`](../src/components/TimerControls.tsx), [`SettingsPanel.tsx`](../src/components/SettingsPanel.tsx), [`WakeLockBadge.tsx`](../src/components/WakeLockBadge.tsx)
   - [`public/pwa-192x192.png`](../public/pwa-192x192.png), [`public/pwa-512x512.png`](../public/pwa-512x512.png), [`public/sw.js`](../public/sw.js)
4. **문서**:
   - [`README.md`](../README.md), [`docs/`](../docs/) 하위 기술 문서

---

## 3. 검증 결과
- GitHub Actions 최신 커밋 자동 배포 성공 (`37282273714`)
- 브라우저 언어에 따른 자동 한국어/영어 전환 및 헤더 언어 스위처 동작 확인
- 빌드 0 errors, HTTP/2 200 OK 라이브 배포 완료
