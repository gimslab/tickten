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

## 🌐 배포 및 개인 도메인 설정 (요약)

TickTen은 백엔드가 없는 **순수 정적 웹**이므로, 무료 정적 호스팅 서비스를 통해 비용 0원으로 배포하고 개인 도메인을 연결할 수 있습니다.

| 호스팅 | 추천 특징 | 도메인 & SSL |
| :--- | :--- | :--- |
| **Cloudflare Pages** | 전 세계 최고 속도 CDN, 대역폭 무제한 | 무료 자동 지원 |
| **GitHub Pages** | GitHub 레포지토리 푸시 시 Actions 자동 배포 | 무료 자동 지원 |
| **Vercel** | 간편한 원클릭 Git 연동 | 무료 자동 지원 |

> 📌 **배포 및 도메인 DNS(CNAME) 설정 상세 안내**: [docs/deployment-guide.md](docs/deployment-guide.md)

---

## 🔄 버전 업그레이드 및 업데이트 배포 (요약)

1. **버전 수정**: `package.json`의 `version` 및 `public/sw.js`의 `CACHE_NAME` 갱신
2. **빌드 검증**: `npm run build`
3. **푸시 및 자동 배포**: `git push origin main` (연동된 CI/CD가 1분 내 자동 배포)

> 📌 **버전 관리 및 PWA 캐시 갱신 상세 안내**: [docs/release-and-versioning.md](docs/release-and-versioning.md)

---

## 📚 상세 문서 목록
- 📋 [기획 및 기술 분석 문서](docs/research-and-tech-analysis.md)
- 🚀 [정적 웹 배포 및 개인 도메인 설정 가이드](docs/deployment-guide.md)
- 📦 [버전 관리 및 업데이트 배포 가이드](docs/release-and-versioning.md)
