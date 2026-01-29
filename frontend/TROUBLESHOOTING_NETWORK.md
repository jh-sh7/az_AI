# 네트워크 오류 해결 가이드

## 문제: ERR_CONNECTION_REFUSED 또는 Network Error

### 해결 방법 1: 프론트엔드 서버 수동 시작

터미널에서 다음 명령을 실행하세요:

```powershell
cd c:\Users\S\Desktop\az-AI\frontend
pnpm start
```

또는:

```powershell
npm start
```

서버가 시작되면 다음과 같은 메시지가 표시됩니다:
```
Compiled successfully!
You can now view automation-service-frontend in the browser.
  Local:            http://localhost:3000
```

### 해결 방법 2: 포트 확인

포트 3000이 사용 중이면 자동으로 다른 포트(3001, 3002 등)로 변경됩니다.
터미널 메시지를 확인하여 실제 포트 번호를 확인하세요.

### 해결 방법 3: 백엔드 서버 확인

백엔드가 실행 중인지 확인:

```powershell
# 백엔드 디렉토리에서
cd c:\Users\S\Desktop\az-AI\backend
uvicorn main:app --reload
```

백엔드가 http://127.0.0.1:8000 에서 실행되어야 합니다.

### 해결 방법 4: 환경 변수 확인

프론트엔드 디렉토리에 `.env` 파일이 있는지 확인:

```powershell
cd c:\Users\S\Desktop\az-AI\frontend
if (Test-Path ".env") { Get-Content .env } else { Write-Host ".env 파일이 없습니다. .env.example을 복사하여 생성하세요." }
```

`.env` 파일에 다음 내용이 있어야 합니다:
```
REACT_APP_API_URL=http://localhost:8000
REACT_APP_GOOGLE_CLIENT_ID=your-google-client-id
```

### 해결 방법 5: 브라우저 캐시 클리어

브라우저에서:
1. `Ctrl + Shift + Delete` (캐시 삭제)
2. 또는 시크릿 모드로 접속

### 해결 방법 6: 방화벽 확인

Windows 방화벽이 Node.js를 차단하지 않는지 확인하세요.

## 빠른 확인 체크리스트

- [ ] 백엔드 서버가 실행 중인가? (포트 8000)
- [ ] 프론트엔드 서버가 실행 중인가? (포트 3000 또는 3001)
- [ ] `.env` 파일이 올바르게 설정되었는가?
- [ ] 브라우저에서 올바른 포트로 접속하고 있는가?

## 서버 시작 순서

1. **터미널 1 - 백엔드:**
   ```powershell
   cd c:\Users\S\Desktop\az-AI\backend
   uvicorn main:app --reload
   ```

2. **터미널 2 - 프론트엔드:**
   ```powershell
   cd c:\Users\S\Desktop\az-AI\frontend
   pnpm start
   ```

3. **브라우저에서 접속:**
   - 터미널에 표시된 URL 확인 (보통 http://localhost:3000)
   - 해당 URL로 접속
