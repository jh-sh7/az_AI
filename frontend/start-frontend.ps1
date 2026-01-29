# 프론트엔드 서버 시작 스크립트
Write-Host "프론트엔드 서버를 시작합니다..." -ForegroundColor Green
Write-Host ""

# 현재 디렉토리로 이동
Set-Location $PSScriptRoot

# 포트 설정 (환경 변수로 설정)
$env:PORT = 3003

Write-Host "포트: $env:PORT" -ForegroundColor Cyan
Write-Host "서버 시작 중... (몇 초 걸릴 수 있습니다)" -ForegroundColor Yellow
Write-Host ""

# pnpm이 있으면 pnpm 사용, 없으면 npm 사용
if (Get-Command pnpm -ErrorAction SilentlyContinue) {
    Write-Host "pnpm을 사용하여 서버를 시작합니다." -ForegroundColor Green
    pnpm start
} else {
    Write-Host "npm을 사용하여 서버를 시작합니다." -ForegroundColor Yellow
    npm start
}
