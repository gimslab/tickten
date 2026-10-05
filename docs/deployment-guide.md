# TickTen 정적 웹 배포 및 개인 도메인 설정 가이드

TickTen은 백엔드 서버(Node.js, DB 등)가 전혀 필요 없는 **100% 클라이언트 사이드 순수 정적 웹 애플리케이션**입니다.  
따라서 AWS S3, GitHub Pages, Cloudflare Pages, Vercel 등의 **무료 정적 호스팅**을 통해 비용 0원으로 호스팅하고 개인 도메인을 연결할 수 있습니다.

---

## 1. 정적 빌드 생성

배포 전 프로젝트 루트에서 빌드 명령어를 실행합니다.

```bash
npm run build
```

빌드가 완료되면 루트 디렉터리에 `dist/` 폴더가 생성됩니다:
- `dist/index.html`: 메인 웹 페이지
- `dist/assets/`: 번들링 및 압축된 JS/CSS 파일
- `dist/manifest.json`, `dist/icon.svg`, `dist/sw.js`: PWA 관련 정적 리소스

이 `dist/` 폴더 내의 파일들을 아래 호스팅 서비스 중 하나에 업로드/연동하면 배포가 완료됩니다.

---

## 2. 추천 무료 호스팅 및 배포 방법

### 옵션 1. GitHub Pages (추천 - 소스코드가 GitHub에 있을 때)

GitHub 레포지토리에 코드를 푸시하면 자동으로 빌드 및 배포되도록 **GitHub Actions**를 구성할 수 있습니다.

#### 자동 배포 설정 단계:
1. 프로젝트 루트에 `.github/workflows/deploy.yml` 파일 생성 (아래 템플릿 사용).
2. GitHub 저장소의 `Settings` $\rightarrow$ `Pages` 메뉴 이동.
3. **Build and deployment** 섹션의 Source를 **GitHub Actions**로 변경.
4. 코드를 `main` 브랜치에 푸시하면 자동으로 배포 완료!

#### GitHub Actions 워크플로 예시 (`.github/workflows/deploy.yml`):
```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: 'pages'
  cancel-in-progress: true

jobs:
  build-and-deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 20

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Setup Pages
        uses: actions/configure-pages@v4

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: './dist'

      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

---

### 옵션 2. Cloudflare Pages (강력 추천 - 전세계 최고 속도 & 트래픽 무제한)

1. [Cloudflare 대시보드](https://dash.cloudflare.com/)에 로그인합니다.
2. `Workers & Pages` $\rightarrow$ `Create application` $\rightarrow$ `Pages` $\rightarrow$ `Connect to Git` 클릭.
3. GitHub 저장소를 선택합니다.
4. 빌드 설정을 입력합니다:
   - **Framework preset**: `Vite`
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
5. `Save and Deploy`를 누르면 즉시 전 세계 엣지 네트워크에 무료로 배포됩니다.

---

### 옵션 3. Vercel

1. [Vercel](https://vercel.com/) 가입 후 `Add New...` $\rightarrow$ `Project` 클릭.
2. GitHub 저장소를 Import 합니다.
3. 프레임워크가 자동으로 `Vite`로 감지되므로 `Deploy` 버튼만 클릭하면 끝납니다.

---

## 3. 개인 도메인 (Custom Domain) 연결 방법

보유 중인 도메인(예: `timer.mybrand.com` 또는 `mybrand.com`)을 호스팅 서비스에 연결하는 절차입니다.

### 1단계: 호스팅 대시보드에서 도메인 추가
- **GitHub Pages**: 저장소 `Settings` $\rightarrow$ `Pages` $\rightarrow$ `Custom domain` 입력란에 `timer.yourdomain.com` 입력 후 Save.
- **Cloudflare Pages**: 프로젝트 $\rightarrow$ `Custom domains` 탭 $\rightarrow$ `Set up a custom domain` 클릭 후 도메인 입력.
- **Vercel**: 프로젝트 `Settings` $\rightarrow$ `Domains` 메뉴에서 도메인 입력.

### 2단계: 도메인 구매처(DNS 관리자)에서 DNS 레코드 등록
도메인을 구매한 사이트(가비아, 후이즈, Cloudflare, Namecheap 등)의 **DNS 레코드 설정** 페이지로 이동하여 아래와 같이 등록합니다.

* **서브도메인을 사용할 때 (예: `timer.yourdomain.com`) - 가장 권장**:
  - **유형(Type)**: `CNAME`
  - **호스트/이름(Host/Name)**: `timer`
  - **값/대상(Value/Target)**:
    - GitHub Pages: `<github-username>.github.io`
    - Cloudflare Pages: `<project-name>.pages.dev`
    - Vercel: `cname.vercel-dns.com`

* **루트 도메인을 사용할 때 (예: `yourdomain.com`)**:
  - 각 서비스에서 제공하는 안내에 따라 **A 레코드 IP** 또는 **CNAME Flattening (ALIAS)**을 설정합니다.

### 3단계: SSL(HTTPS) 인증서 자동 발급 확인
- DNS 전파(보통 5분~최대 수 시간)가 완료되면, 호스팅 서비스가 **무료 SSL 인증서(Let's Encrypt / Cloudflare SSL)**를 자동 발급합니다.
- `https://timer.yourdomain.com`으로 접속하여 자물쇠 표시가 정상적으로 뜨는지 확인합니다.
