# TickTen (스트레칭 & 운동 비프 타이머)

시계를 보지 않고 소리만으로 경과 시간을 직관적으로 파악할 수 있는 스트레칭/플랭크/자세유지용 정적 웹 타이머(PWA)입니다.  
백엔드 서버 없이 브라우저 자체 오디오 합성 및 Screen Wake Lock API로 동작합니다.

---

## ⚡ 주요 특징
- **10초 인터벌 비프음 (기본값)**: 880Hz 명확한 듀얼톤 비프 (5/10/15/20/30초 조절 가능)
- **1초 미세 틱 소리**: 시간의 흐름을 느끼게 해주는 은은한 클릭음 (On/Off 토글 지원)
- **0ms Web Audio API**: 외부 음원 다운로드 없이 브라우저에서 직접 합성
- **화면 꺼짐 방지**: Screen Wake Lock 연동으로 운동 중 화면 자동 잠금 차단
- **100% 순수 정적 웹**: 서버 유지비 0원, 모바일 PWA(홈 화면 추가) 지원

---

## 🚀 빠른 시작 (개발 및 빌드)

```bash
# 의존성 설치
npm install

# 1. 로컬 개발 서버 실행
npm run dev

# 2. 프로덕션 정적 빌드
npm run build

# 3. 빌드 결과물 미리보기
npm run preview
```

---

## 🚀 프로덕션 배포 방법 (tools.gimslab.com)

TickTen은 **`main` 브랜치에 푸시하면 GitHub Actions를 통해 약 30초 내에 자동으로 빌드 및 실서버(`tools.gimslab.com/tickten`)에 배포**됩니다.

### 📌 초간단 배포 3단계
```bash
# 1. 빌드 사전 검증 (타입 체크 및 빌드 오류 방지)
npm run build

# 2. 커밋 및 푸시 (푸시 즉시 자동 배포 시작)
git add .
git commit -m "feat: 업데이트 내용 요약"
git push origin main
```

### 🔍 배포 상태 및 실서버 확인
```bash
# GitHub Actions 배포 진행 상태 확인
gh run list --limit 1
```
- **실서버 접속**: [https://tools.gimslab.com/tickten/](https://tools.gimslab.com/tickten/)
- **캐시 갱신 팁**: Cloudflare 및 PWA Service Worker 캐시가 적용되어 있으므로, 배포 직후 새 화면이 안 보일 경우 **강력 새로고침(`Ctrl + F5` 또는 `Ctrl + Shift + R`)**을 해주세요.

---

## 🌐 호스팅 구조 및 설정

TickTen은 **GitHub Pages**에 정적 호스팅되며, 앞단의 **Cloudflare Gateway (`tools-gateway`)**를 통해 `tools.gimslab.com/tickten` 도메인으로 초고속 서빙됩니다.

> 📌 **배포 및 도메인 DNS(CNAME) 설정 상세 안내**: [docs/deployment-guide.md](docs/deployment-guide.md)  
> 📌 **버전 관리 및 PWA 캐시(`sw.js`) 갱신 상세 안내**: [docs/release-and-versioning.md](docs/release-and-versioning.md)

---

## 📚 상세 문서 목록
- 📋 [기획 및 기술 분석 문서](docs/research-and-tech-analysis.md)
- 🚀 [정적 웹 배포 및 개인 도메인 설정 가이드](docs/deployment-guide.md)
- 📦 [버전 관리 및 업데이트 배포 가이드](docs/release-and-versioning.md)
