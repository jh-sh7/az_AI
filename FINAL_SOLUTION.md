# 최종 해결 방법

## 문제 원인

시스템 환경 변수에 `npm_config_offline=true`가 설정되어 있어 npm이 오프라인 모드로 작동하고 있습니다.

## 해결 방법 (순서대로 시도)

### 방법 1: 시스템 환경 변수 수동 제거 (가장 확실한 방법)

1. **Windows 설정 열기**
   - `Win + R` 키를 누르고 `sysdm.cpl` 입력 후 Enter

2. **환경 변수 편집**
   - "고급" 탭 클릭
   - "환경 변수" 버튼 클릭

3. **사용자 변수 확인 및 제거**
   - "사용자 변수" 섹션에서 다음 변수들을 찾아서 삭제:
     - `npm_config_offline`
     - `npm_config_prefer_offline`
   - 없으면 "시스템 변수" 섹션도 확인

4. **PowerShell 재시작**
   - 모든 PowerShell 창을 닫고 새로 열기

5. **설치 실행**
   ```powershell
   cd c:\Users\S\Desktop\az-AI\frontend
   npm install
   ```

### 방법 2: 관리자 권한으로 환경 변수 제거

관리자 권한으로 PowerShell을 열고:

```powershell
# 사용자 환경 변수 제거
[System.Environment]::SetEnvironmentVariable("npm_config_offline", $null, "User")
[System.Environment]::SetEnvironmentVariable("npm_config_prefer_offline", $null, "User")

# 시스템 환경 변수 제거 (관리자 권한 필요)
[System.Environment]::SetEnvironmentVariable("npm_config_offline", $null, "Machine")
[System.Environment]::SetEnvironmentVariable("npm_config_prefer_offline", $null, "Machine")

# PowerShell 재시작 후
cd c:\Users\S\Desktop\az-AI\frontend
npm install
```

### 방법 3: Yarn 사용 (가장 빠른 해결책)

npm 문제를 우회하여 Yarn을 사용:

```powershell
# Yarn 설치 (한 번만)
npm install -g yarn

# 프론트엔드 의존성 설치
cd c:\Users\S\Desktop\az-AI\frontend
yarn install

# 서버 실행
yarn start
```

### 방법 4: 새 사용자 프로필에서 실행

환경 변수 문제를 완전히 피하기 위해:

1. 새 Windows 사용자 계정 생성 (선택사항)
2. 또는 다른 컴퓨터에서 설치 후 `node_modules` 폴더 복사

## 권장 순서

1. **먼저 방법 3 (Yarn) 시도** - 가장 빠르고 확실함
2. 안 되면 **방법 1 (수동 제거)** - 가장 확실함
3. 그래도 안 되면 **방법 2 (관리자 권한)**

## 설치 확인

설치가 성공하면 `frontend/node_modules` 폴더가 생성됩니다.

```powershell
cd c:\Users\S\Desktop\az-AI\frontend
Test-Path node_modules
```

## 다음 단계

설치가 완료되면:

```powershell
# 백엔드 실행 (터미널 1)
cd c:\Users\S\Desktop\az-AI\backend
uvicorn main:app --reload

# 프론트엔드 실행 (터미널 2)
cd c:\Users\S\Desktop\az-AI\frontend
npm start  # 또는 yarn start
```
