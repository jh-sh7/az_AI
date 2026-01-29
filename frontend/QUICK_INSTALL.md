# 빠른 설치 가이드

npm install이 계속 실패하는 경우, 다음 방법들을 시도해보세요:

## 방법 1: npm 캐시 클리어 후 재시도

```powershell
cd frontend
npm cache clean --force
npm install
```

## 방법 2: 관리자 권한으로 실행

1. PowerShell을 관리자 권한으로 실행
2. 다음 명령 실행:

```powershell
cd c:\Users\S\Desktop\az-AI\frontend
npm install
```

## 방법 3: pnpm 사용 (가장 빠름)

```powershell
# pnpm 설치
npm install -g pnpm

# 의존성 설치
cd frontend
pnpm install
```

## 방법 4: 수동 설치 (최후의 수단)

다른 컴퓨터나 환경에서 설치 후 `node_modules` 폴더를 복사

## 방법 5: 최소 패키지로 시작

필수 패키지만 먼저 설치:

```powershell
cd frontend
npm install react react-dom
npm install react-scripts
npm install @mui/material @mui/icons-material
npm install react-router-dom axios
npm install typescript @types/react @types/react-dom
```

## 현재 시도 중인 방법

백그라운드에서 `npm install --legacy-peer-deps --no-audit` 실행 중입니다.

완료되면 `node_modules` 폴더가 생성됩니다.
