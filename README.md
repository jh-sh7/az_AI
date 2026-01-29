# AI 자동화 서비스 시스템

사용자 계정으로 로그인하여 업무를 자동으로 처리하는 AI 서비스입니다.

## 주요 기능

- **인증 시스템**: 이메일 또는 구글 계정으로 로그인
- **명령 처리**: 사용자 명령을 받아 자동화 작업 수행
- **자동화 엔진**: 사용자 계정으로 웹 서비스에 접속하여 업무 처리
- **세션 관리**: 작업 상태 추적 및 관리
- **실시간 상태 업데이트**: 작업 진행 상황 실시간 모니터링

## 기술 스택

### 백엔드
- FastAPI (Python 웹 프레임워크)
- SQLAlchemy (데이터베이스 ORM)
- JWT (인증 토큰)
- Selenium (웹 자동화)
- Python 3.8+

### 프론트엔드
- React 18
- TypeScript
- Material-UI
- Axios

## 설치 및 실행

### 사전 요구사항

- Python 3.8 이상
- Node.js 16 이상
- Chrome 브라우저 (Selenium 자동화용)

### 백엔드 설정

1. 백엔드 디렉토리로 이동:
```bash
cd backend
```

2. 가상환경 생성 및 활성화 (선택사항):
```bash
python -m venv venv
# Windows
venv\Scripts\activate
# Linux/Mac
source venv/bin/activate
```

3. 의존성 설치:
```bash
pip install -r requirements.txt
```

4. 환경 변수 설정:
`.env` 파일을 생성하고 `backend/.env.example`을 참고하여 설정:
```env
DATABASE_URL=sqlite:///./automation.db
SECRET_KEY=your-secret-key-change-this-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_REDIRECT_URI=http://localhost:8000/auth/google/callback
```

5. 서버 실행:
```bash
# Windows
python main.py
# 또는
uvicorn main:app --reload

# Linux/Mac
./run.sh
```

백엔드 서버는 http://localhost:8000 에서 실행됩니다.

### 프론트엔드 설정

1. 프론트엔드 디렉토리로 이동:
```bash
cd frontend
```

2. 의존성 설치:
```bash
npm install
```

3. 환경 변수 설정:
`.env` 파일을 생성하고 `frontend/.env.example`을 참고하여 설정:
```env
REACT_APP_API_URL=http://localhost:8000
REACT_APP_GOOGLE_CLIENT_ID=your-google-client-id
```

4. 개발 서버 실행:
```bash
npm start
```

프론트엔드는 http://localhost:3000 에서 실행됩니다.

## 구글 OAuth 설정

1. [Google Cloud Console](https://console.cloud.google.com/)에서 프로젝트 생성
2. OAuth 2.0 클라이언트 ID 생성
3. 승인된 리디렉션 URI에 `http://localhost:3000` 추가
4. 클라이언트 ID를 `.env` 파일에 설정

## 사용 방법

1. 웹 브라우저에서 http://localhost:3000 접속
2. 이메일/비밀번호 또는 구글 계정으로 로그인
3. 대시보드에서 수행할 업무를 명령으로 입력
   - 예: "https://example.com에 접속"
   - 예: "업무 종료"
4. 작업이 백그라운드에서 실행되며 실시간으로 상태 확인 가능
5. 작업 완료 후 결과 확인

## API 문서

서버 실행 후 http://localhost:8000/docs 에서 Swagger UI를 통해 API 문서를 확인할 수 있습니다.

## 프로젝트 구조

```
az-AI/
├── backend/              # FastAPI 백엔드
│   ├── main.py          # 메인 애플리케이션
│   ├── database.py      # 데이터베이스 설정
│   ├── models.py        # 데이터베이스 모델
│   ├── schemas.py       # Pydantic 스키마
│   ├── auth.py          # 인증 로직
│   ├── automation_engine.py  # 자동화 엔진
│   └── routers/         # API 라우터
│       ├── auth.py      # 인증 엔드포인트
│       └── tasks.py     # 작업 엔드포인트
├── frontend/            # React 프론트엔드
│   ├── src/
│   │   ├── pages/       # 페이지 컴포넌트
│   │   ├── components/  # 재사용 컴포넌트
│   │   └── contexts/    # React 컨텍스트
│   └── public/
└── README.md
```

## 주의사항

- 프로덕션 환경에서는 반드시 `SECRET_KEY`를 안전한 값으로 변경하세요
- Selenium은 헤드리스 모드로 실행되며, Chrome 브라우저가 필요합니다
- 실제 자동화 작업은 보안 및 정책을 고려하여 구현해야 합니다
