# 배포 가이드 (GitHub + Vercel)

## 1. GitHub에 업로드

### 1) GitHub에서 새 저장소 생성
1. https://github.com/new 접속
2. Repository name: `az-AI` (또는 원하는 이름)
3. Public 선택, **Initialize this repository with a README** 체크 해제
4. Create repository 클릭

### 2) 로컬에서 Git 초기화 및 푸시
프로젝트 폴더에서 PowerShell 또는 터미널을 열고:

```powershell
cd c:\Users\S\Desktop\az-AI

# Git 초기화 (이미 했다면 생략)
git init

# 모든 파일 스테이징
git add .

# 첫 커밋
git commit -m "Initial commit: AI 자동화 서비스 (React + FastAPI)"

# GitHub 저장소 연결 (아래 YOUR_USERNAME, YOUR_REPO를 본인 것으로 변경)
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git

# 기본 브랜치 이름 설정
git branch -M main

# 푸시
git push -u origin main
```

GitHub 사용자명/저장소명을 모르면 GitHub 저장소 페이지 URL을 확인하세요.  
예: `https://github.com/hong/test-repo` → `hong` / `test-repo`

---

## 2. Vercel에 배포 (프론트엔드)

Vercel은 **프론트엔드(React)** 만 배포합니다. 백엔드(FastAPI)는 별도 서비스(Railway, Render 등)에 배포해야 합니다.

### 방법 A: Vercel 웹에서 GitHub 연동 (권장)
1. https://vercel.com 접속 후 로그인
2. **Add New** → **Project** 선택
3. **Import Git Repository**에서 방금 푸시한 GitHub 저장소 선택
4. **Configure Project**:
   - **Root Directory**: `frontend` 로 설정 (Edit 클릭 후 `frontend` 입력)
   - **Framework Preset**: Create React App
   - **Build Command**: `npm run build` (기본값 유지)
   - **Output Directory**: `build` (기본값 유지)
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

문제가 있으면 터미널/브라우저에 나온 오류 메시지를 알려주시면 됩니다.
