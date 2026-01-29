# 문제 해결 가이드

## npm 설치 오류 해결

터미널에서 `npm install` 실행 시 "cache mode is 'only-if-cached'" 오류가 발생하는 경우:

### 해결 방법 1: npm 캐시 모드 확인 및 수정

관리자 권한으로 PowerShell을 실행하고 다음 명령을 실행하세요:

```powershell
# npm 설정 확인
npm config get cache

# 오프라인 모드 해제
npm config set offline false
npm config set prefer-offline false

# 캐시 디렉토리 확인 및 재설정
npm config set cache C:\Users\S\AppData\Local\npm-cache
```

### 해결 방법 2: 전역 .npmrc 파일 확인

`C:\Users\S\.npmrc` 파일을 열어서 다음 설정이 있는지 확인하고 제거하세요:

```
cache=...
offline=true
prefer-offline=true
```

### 해결 방법 3: Yarn 사용 (대안)

npm 대신 yarn을 사용할 수 있습니다:

```powershell
# Yarn 설치 (아직 설치되지 않은 경우)
npm install -g yarn

# Yarn으로 의존성 설치
cd frontend
yarn install
```

### 해결 방법 4: 프로젝트별 npm 설정 (권장)

프로젝트의 `frontend/.npmrc` 파일이 이미 생성되어 있습니다. 이 파일은 다음과 같은 설정을 포함합니다:

```
offline=false
prefer-offline=false
cache=C:\Users\S\AppData\Local\npm-cache
fetch-retries=3
fetch-retry-factor=10
fetch-retry-mintimeout=10000
fetch-retry-maxtimeout=60000
```

설치 스크립트 사용:
```powershell
cd frontend
.\install.ps1
```

또는 수동으로:
```powershell
cd frontend
$env:npm_config_offline = 'false'
npm install --no-offline --prefer-online
```

## 백엔드 실행 오류

### 데이터베이스 오류
- SQLite 데이터베이스는 자동으로 생성됩니다
- `backend/automation.db` 파일이 생성되는지 확인하세요

### 포트 충돌
- 백엔드 기본 포트: 8000
- 프론트엔드 기본 포트: 3000
- 다른 포트를 사용하려면 설정 파일 수정

## Chrome 드라이버 오류

Selenium이 Chrome을 찾을 수 없는 경우:
- Chrome 브라우저가 설치되어 있는지 확인
- `webdriver-manager`가 자동으로 드라이버를 다운로드합니다
- 수동 설치가 필요한 경우 ChromeDriver를 직접 다운로드
