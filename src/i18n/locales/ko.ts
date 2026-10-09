import type { TranslationSchema } from '../types';

export const ko: TranslationSchema = {
  common: {
    appTitle: 'TickTen',
    appSubtitle: '스트레칭 & 운동 비프 타이머',
    language: '언어 (Language)',
    langAuto: '자동 (시스템 기본값)',
    langEn: 'English',
    langKo: '한국어',
    footerTip: (intervalSec: number) =>
      `💡 화면을 보지 않아도 ${intervalSec}초 비프음과 1초 틱 소리로 흐름을 파악할 수 있습니다.`,
  },
  wakeLock: {
    unsupported: '화면 꺼짐 방지 미지원 기기',
    active: '화면 켜짐 유지 중',
    idle: '시작 시 화면 켜짐 유지됨',
  },
  timerDisplay: {
    ready: '준비 완료',
    reached: (sec: number) => `🔔 ${sec}초 도달!`,
    nextBeep: (sec: number) => `다음 비프까지 ${sec}초`,
    intervalInfo: (sec: number) => `주기: ${sec}초 단위 비프`,
  },
  timerControls: {
    start: '시작',
    resume: '계속하기',
    pause: '일시정지',
    reset: '초기화',
    resetAria: '타이머 초기화',
  },
  install: {
    installButton: '스마트폰에 앱으로 설치하기',
    iosTitle: '아이폰(iOS) 앱 설치 안내',
    iosDesc: '아이폰 Safari에서는 아래 순서로 홈 화면에 앱을 추가할 수 있습니다:',
    iosStep1: '사파리 화면 하단(또는 상단)의 공유 아이콘 터치',
    iosStep2: "메뉴를 아래로 스크롤하여 '홈 화면에 추가' 선택",
    iosStep3: "우측 상단 '추가'를 누르면 설치 완료!",
    confirm: '확인했습니다',
    fallbackAlert: '브라우저 메뉴(⋮)에서 "홈 화면에 추가" 또는 "앱 설치"를 선택해주세요.',
  },
  settings: {
    panelTitle: '타이머 및 사운드 설정',
    beepIntervalTitle: '비프 알림 주기',
    everySec: (sec: number) => `${sec}초 마다`,
    secUnit: (sec: number) => `${sec}초`,
    tickSoundTitle: '1초 단위 미세 틱 소리',
    tickSoundDesc: '매 초마다 은은한 소리로 시간 흐름 인지',
    targetTimeTitle: '목표 유지 시간 (선택)',
    targetUnlimited: '무제한',
    targetSubtext: (sec: number | null) =>
      sec ? `${sec}초 (도달 시 2회 비프)` : '무제한',
    soundPreviewTitle: '사운드 미리듣기 & 볼륨',
    tickTest: '틱 테스트',
    beepTest: '비프 테스트 🔔',
    mute: '음소거',
    unmute: '음소거 해제',
    resetDefaults: '설정 초기화',
    resetSuccess: '기본값으로 초기화됨',
  },
};
