# 백엔드 배포 가이드 (Railway / Render)

프론트엔드(Vercel)에서 API를 호출하려면 백엔드(FastAPI)를 별도 서비스에 배포해야 합니다.

---

## Railway에 Root Directory가 없을 때

Railway UI 버전에 따라 **Root Directory**가 다음 위치에 있을 수 있습니다.

- **Settings** 탭 → 아래로 스크롤 → **Build** 또는 **Source** 섹션
- 서비스 추가 시 **Deploy from GitHub** 단계에서 **Root Directory** 입력란

여전히 보이지 않으면 **Render로 배포**하는 것을 권장합니다 (아래 2번). Render는 Web Service 생성 화면에 **Root Directory** 입력란이 있습니다.

---

## 1. Railway로 배포 (Root Directory가 보일 때)

1. **https://railway.app** 접속 후 로그인 (GitHub 연동 가능).
2. **New Project** → **Deploy from GitHub repo** 선택.
3. **jh-sh7/az_AI** 저장소 선택.
4. **Settings**에서:
   - **Root Directory**: `backend` 로 설정 (반드시 필요).
   - **Start Command**:  
     `uvicorn main:app --host 0.0.0.0 --port $PORT`  
     (Railway가 `PORT` 환경 변수를 넣어 줌.)
   - **Build Command**: 비워두거나 `pip install -r requirements.txt`
5. **Variables** 탭에서 환경 변수 추가 (선택):
   - `SECRET_KEY`: JWT용 비밀 키 (예: 랜덤 문자열).
   - `DATABASE_URL`: 비워두면 기본값 `sqlite:///./automation.db` 사용 (Railway는 재배포 시 SQLite 데이터가 초기화될 수 있음).
6. 배포 완료 후 **Settings** → **Networking** → **Generate Domain** 으로 URL 확인 (예: `https://xxx.up.railway.app`).

**프론트엔드 연동**: Vercel 프로젝트 **Settings** → **Environment Variables** 에서  
`REACT_APP_API_URL` = `https://xxx.up.railway.app` 로 설정 후 Vercel에서 다시 배포.

---

## 2. Render로 배포 (Root Directory 있음, 권장)

1. **https://render.com** 접속 후 로그인 (GitHub 연동).
2. **Dashboard** → **New +** → **Web Service**.
3. **Build and deploy from a Git repository** → **Connect account** 또는 **Connect a repository** → **jh-sh7/az_AI** 선택.
4. **Create Web Service** 화면에서 아래처럼 입력:
   - **Name**: `az-ai-backend` (원하는 이름)
   - **Region**: 원하는 지역 (예: Singapore)
   - **Branch**: `main`
   - **Root Directory**: **`backend`** ← 여기에 `backend` 입력 (반드시 필요).
   - **Runtime**: **Python 3**
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
5. **Advanced** (펼치기) → **Environment Variables** → **Add Environment Variable** (선택):
   - `SECRET_KEY`: 아무 랜덤 문자열
   - `DATABASE_URL`: 비워두면 SQLite 기본값 (재배포 시 데이터 초기화될 수 있음).
6. **Create Web Service** 클릭 → 배포 완료될 때까지 대기.
7. 상단 **URL** 확인 (예: `https://az-ai-backend.onrender.com`).

**프론트엔드 연동**: Vercel 프로젝트 **Settings** → **Environment Variables** 에서  
`REACT_APP_API_URL` = 위 Render URL 로 설정 후 Vercel **Redeploy**.

---

## 3. 배포 후 확인

- 브라우저에서 `https://[백엔드-URL]/` 접속 → `{"message":"AI 자동화 서비스 API",...}` 응답 확인.
- `https://[백엔드-URL]/docs` 로 Swagger 문서 확인.

---

## 4. CORS / 프론트엔드 URL

백엔드 `main.py` 에서 다음 프론트엔드 주소는 이미 허용되어 있습니다.

- `https://az-ai-git-main-jh-sh7s-projects.vercel.app`
- `https://*.vercel.app` (정규식)

다른 도메인으로 프론트를 쓰면 `main.py` 의 `allow_origins` / `allow_origin_regex` 에 해당 URL을 추가해야 합니다.

---

## 5. 데이터베이스 참고

- **SQLite** (기본): `DATABASE_URL` 없으면 `sqlite:///./automation.db` 사용. Railway/Render는 재배포 시 디스크가 초기화될 수 있어 **데이터가 사라질 수 있음**.
- **영구 저장**이 필요하면 Railway/Render에서 **PostgreSQL** 추가 후 `DATABASE_URL` 를 해당 DB URL로 설정하면 됩니다.

문제가 있으면 배포 로그와 함께 알려주시면 됩니다.
