# 배포 가이드 (GitHub + Vercel)

## 1. GitHub에 업로드

### 1) GitHub에서 새 저장소 생성
1. https://github.com/new 접속
2. Repository name: `az-AI` (또는 원하는 이름)
3. Public 선택, **Initialize this repository with a README** 체크 해제
4. Create repository 클릭

### 2) 로컬에서 GitHub로 푸시
**이미 `git init`과 첫 커밋은 완료된 상태입니다.** GitHub에서 저장소만 만들고 아래 중 하나를 실행하세요.

**방법 A: 스크립트 사용 (권장)**  
프로젝트 폴더에서 PowerShell을 열고:

```powershell
cd c:\Users\S\Desktop\az-AI
.\push-to-github.ps1
```
실행 후 저장소 URL 입력 (예: `https://github.com/사용자명/az-AI.git`)

**방법 B: 직접 명령어**
```powershell
cd c:\Users\S\Desktop\az-AI

# YOUR_USERNAME, YOUR_REPO를 본인 GitHub 사용자명/저장소명으로 변경
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git branch -M main
git push -u origin main
```

GitHub 사용자명/저장소명을 모르면 GitHub 저장소 페이지 URL을 확인하세요.  
예: `https://github.com/hong/az-AI` → 사용자명 `hong` / 저장소명 `az-AI`

---

## 2. Vercel에 배포 (프론트엔드)

Vercel은 **프론트엔드(React)** 만 배포합니다. 백엔드(FastAPI)는 별도 서비스(Railway, Render 등)에 배포해야 합니다.

### 방법 A: Vercel 웹에서 GitHub 연동 (권장)
1. https://vercel.com 접속 후 로그인
2. **Add New** → **Project** 선택
3. **Import Git Repository**에서 방금 푸시한 GitHub 저장소 선택
4. **Configure Project** (반드시 확인):
   - **Root Directory**: **`frontend`** 로 설정 (Edit 클릭 → `frontend` 입력 → **Save**)
     - 이렇게 해야 Vercel이 `frontend` 폴더만 빌드합니다. 비우면 루트에서 빌드해 실패할 수 있습니다.
   - **Framework Preset**: Create React App
   - **Build Command**: `npm run build` (비워두면 기본값 사용)
   - **Output Directory**: `build` (비워두면 기본값 사용)
   - **Environment Variables** (선택): `CI` = `false` — 경고로 빌드가 실패하는 것을 막을 수 있음
5. **Environment Variables** (선택):
   - `REACT_APP_API_URL`: 배포된 백엔드 API 주소  
     예: `https://your-backend.railway.app` (백엔드를 다른 곳에 배포한 경우)
   - 로컬 백엔드만 쓸 경우 비워두면 프론트는 `http://localhost:8000` 사용
6. **Deploy** 클릭

### 방법 B: Vercel CLI
```powershell
# Vercel CLI 설치 (한 번만)
npm i -g vercel

cd c:\Users\S\Desktop\az-AI\frontend
vercel
# 로그인 후 프로젝트 이름, root 등 질문에 답한 뒤 배포
```

---

## 3. 백엔드 배포 (선택)

프론트엔드만 Vercel에 올리고, API는 로컬 또는 다른 서비스에서 실행할 수 있습니다.

- **Railway**: https://railway.app — Python/FastAPI 배포 가능
- **Render**: https://render.com — Web Service로 FastAPI 배포 가능
- **Fly.io**: https://fly.io — Docker 또는 Python 앱 배포 가능

백엔드를 위 서비스 중 하나에 배포한 뒤, 해당 URL을 Vercel 프로젝트의 `REACT_APP_API_URL` 환경 변수로 설정하면 됩니다.

---

## 4. 요약

| 단계 | 작업 |
|------|------|
| 1 | GitHub에서 새 저장소 생성 |
| 2 | 로컬에서 `git init`, `git add .`, `git commit`, `git remote add origin`, `git push` |
| 3 | Vercel에서 해당 GitHub 저장소 Import, Root Directory = `frontend` |
| 4 | (선택) 백엔드 별도 호스팅 후 `REACT_APP_API_URL` 설정 |

---

## 5. 404 오류가 날 때

**증상**: `Failed to load resource: the server responded with a status of 404` 또는 페이지가 안 뜸

**조치**:
1. **Vercel 프로젝트 설정**  
   Vercel 대시보드 → 해당 프로젝트 → **Settings** → **General**  
   - **Root Directory**: `frontend` 로 되어 있는지 확인 (없으면 Edit → `frontend` 입력 후 Save)
2. **다시 배포**  
   **Deployments** 탭 → 맨 위 배포 오른쪽 **⋯** → **Redeploy**
3. **브라우저에서 어떤 요청이 404인지 확인**  
   F12 → **Network** 탭 → 새로고침 → 빨간색(실패)인 요청의 **Request URL** 확인  
   - `/` 또는 `index.html` 이 404 → Root Directory를 `frontend`로 설정 후 재배포  
   - `/api/...` 이 404 → 백엔드가 배포되지 않았거나 `REACT_APP_API_URL`이 잘못됨 (Vercel 배포 환경에서는 백엔드 URL을 환경 변수로 넣어야 함)

문제가 있으면 터미널/브라우저에 나온 오류 메시지를 알려주시면 됩니다.
