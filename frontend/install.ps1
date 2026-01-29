# 프론트엔드 의존성 설치 스크립트
# npm 환경 변수 문제를 우회하여 설치합니다.

Write-Host "프론트엔드 의존성 설치를 시작합니다..." -ForegroundColor Yellow

# 환경 변수 강제 설정
$env:npm_config_offline = 'false'
$env:npm_config_prefer_offline = 'false'

# npm 설정 확인
Write-Host "`nnpm 설정 확인:" -ForegroundColor Cyan
npm config list | Select-String -Pattern "offline|prefer-offline"

# npm install 실행
Write-Host "`nnpm install 실행 중..." -ForegroundColor Yellow
npm install --no-offline --prefer-online --verbose

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n설치 완료!" -ForegroundColor Green
} else {
    Write-Host "`n설치 실패. 오류 코드: $LASTEXITCODE" -ForegroundColor Red
    Write-Host "`n대안: Yarn을 사용해보세요:" -ForegroundColor Yellow
    Write-Host "  yarn install" -ForegroundColor Cyan
}
