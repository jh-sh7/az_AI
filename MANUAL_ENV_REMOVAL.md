# Windows 환경 변수 수동 제거 가이드

## 단계별 안내

### 1단계: 시스템 속성 열기

1. `Win + R` 키를 동시에 누릅니다
2. `sysdm.cpl`을 입력하고 Enter를 누릅니다
3. "시스템 속성" 창이 열립니다

### 2단계: 환경 변수 편집

1. "고급" 탭을 클릭합니다
2. 하단의 "환경 변수" 버튼을 클릭합니다
3. "환경 변수" 창이 열립니다

### 3단계: 환경 변수 확인 및 제거

**사용자 변수 섹션 확인:**
1. 상단의 "사용자 변수" 섹션을 확인합니다
2. 다음 변수들을 찾습니다:
   - `npm_config_offline`
   - `npm_config_prefer_offline`
3. 각 변수를 선택하고 "삭제" 버튼을 클릭합니다

**시스템 변수 섹션 확인:**
1. 하단의 "시스템 변수" 섹션을 확인합니다
2. 같은 변수들이 있는지 확인합니다
3. 있으면 삭제합니다 (관리자 권한 필요할 수 있음)

### 4단계: 확인 및 재시작

1. "확인" 버튼을 클릭하여 모든 창을 닫습니다
2. **모든 PowerShell 및 명령 프롬프트 창을 완전히 닫습니다**
3. 새 PowerShell 창을 엽니다

### 5단계: npm 설치 재시도

새 PowerShell 창에서:

```powershell
cd c:\Users\S\Desktop\az-AI\frontend
npm install
```

## 대안: Yarn 사용

환경 변수 제거가 어렵거나 계속 문제가 발생하는 경우, Yarn을 사용하는 것을 권장합니다:

```powershell
# Yarn 설치 (한 번만)
npm install -g yarn

# 프론트엔드 의존성 설치
cd c:\Users\S\Desktop\az-AI\frontend
yarn install

# 서버 실행
yarn start
```

Yarn은 npm의 환경 변수 설정에 영향을 받지 않아 더 안정적으로 작동합니다.

## 문제가 계속되는 경우

1. 컴퓨터를 재시작해보세요
2. 또는 Yarn을 사용하세요 (권장)
