# 설치 가이드

## 빠른 시작

### 1. 백엔드 설정

```bash
# 백엔드 디렉토리로 이동
cd backend

# 가상환경 생성 (선택사항)
python -m venv venv

# 가상환경 활성화
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# 의존성 설치
pip install -r requirements.txt

# 환경 변수 파일 생성
copy .env.example .env  # Windows
# 또는
cp .env.example .env    # Linux/Mac

# .env 파일 편집하여 필요한 값 설정
```

### 2. 프론트엔드 설정

```bash
# 프론트엔드 디렉토리로 이동
cd frontend

# 의존성 설치
npm install

# 환경 변수 파일 생성
copy .env.example .env  # Windows
# 또는
cp .env.example .env    # Linux/Mac

# .env 파일 편집하여 필요한 값 설정
```

### 3. 서버 실행

**터미널 1 - 백엔드:**
```bash
cd backend
uvicorn main:app --reload
```

**터미널 2 - 프론트엔드:**
```bash
cd frontend
npm start
```

### 4. 브라우저에서 접속

http://localhost:3000 으로 접속하여 서비스를 사용하세요.

## 구글 OAuth 설정

1. [Google Cloud Console](https://console.cloud.google.com/) 접속
2. 새 프로젝트 생성 또는 기존 프로젝트 선택
3. "API 및 서비스" > "사용자 인증 정보" 이동
4. "사용자 인증 정보 만들기" > "OAuth 클라이언트 ID" 선택
5. 애플리케이션 유형: "웹 애플리케이션"
6. 승인된 리디렉션 URI에 추가:
   - `http://localhost:3000`
   - `http://localhost:8000/auth/google/callback`
7. 생성된 클라이언트 ID를 `.env` 파일에 설정

## 문제 해결

### Chrome 드라이버 오류
Selenium이 Chrome을 찾을 수 없는 경우:
- Chrome 브라우저가 설치되어 있는지 확인
- `webdriver-manager`가 자동으로 드라이버를 다운로드하지만, 수동 설치가 필요한 경우도 있음

### 포트 충돌
- 백엔드 기본 포트: 8000
- 프론트엔드 기본 포트: 3000
- 다른 포트를 사용하려면 설정 파일 수정

### 데이터베이스 오류
- SQLite 데이터베이스는 자동으로 생성됩니다
- `backend/automation.db` 파일이 생성되는지 확인
