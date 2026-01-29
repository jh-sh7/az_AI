# 프론트엔드 설치 가이드

## 현재 상황

npm 설치 중 네트워크 연결 문제(`ECONNREFUSED`)가 발생할 수 있습니다. 다음 방법들을 시도해보세요.

## 설치 방법

### 방법 1: 기본 설치 (권장)

```powershell
cd frontend
npm install
```

### 방법 2: 설치 스크립트 사용

```powershell
cd frontend
.\install.ps1
```

### 방법 3: 네트워크 문제 해결 후 설치

인터넷 연결을 확인하고, 방화벽/프록시 설정을 확인한 후:

```powershell
cd frontend
npm config set registry https://registry.npmjs.org/
npm install
```

### 방법 4: Yarn 사용 (대안)

npm이 계속 실패하는 경우:

```powershell
# Yarn 설치 (필요한 경우)
npm install -g yarn

# Yarn으로 설치
cd frontend
yarn install
```

### 방법 5: 캐시 클리어 후 재시도

```powershell
cd frontend
npm cache clean --force
npm install
```

## 문제 해결

### ECONNREFUSED 오류
- 인터넷 연결 확인
- 방화벽/보안 소프트웨어 확인
- 회사 네트워크인 경우 프록시 설정 확인
- npm 레지스트리 접근 가능 여부 확인: `npm ping`

### 권한 오류 (EPERM)
- 관리자 권한으로 PowerShell 실행
- 또는 `C:\Users\S\AppData\Local\npm-cache` 폴더 권한 확인

### 오프라인 모드 오류
- `frontend/.npmrc` 파일이 올바르게 설정되어 있는지 확인
- 환경 변수 확인: `$env:npm_config_offline`

## 설치 확인

설치가 완료되면 `node_modules` 폴더가 생성됩니다:

```powershell
cd frontend
dir node_modules
```

## 서버 실행

설치 완료 후:

```powershell
cd frontend
npm start
```

브라우저에서 http://localhost:3000 으로 접속하세요.
