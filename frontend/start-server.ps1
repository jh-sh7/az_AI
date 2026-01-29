# 프론트엔드 서버 시작 스크립트
Write-Host "프론트엔드 서버를 시작합니다..." -ForegroundColor Yellow
Write-Host ""

# 포트 3000이 사용 중이면 3001로 변경
$port = 3000
$portInUse = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue

if ($portInUse) {
    Write-Host "포트 3000이 이미 사용 중입니다." -ForegroundColor Yellow
    Write-Host "포트 3001에서 실행합니다." -ForegroundColor Cyan
    $env:PORT = 3001
} else {
    $env:PORT = 3000
}

Write-Host "서버 시작 중..." -ForegroundColor Green
Write-Host "브라우저에서 http://localhost:$env:PORT 으로 접속하세요." -ForegroundColor Cyan
Write-Host ""

# pnpm이 있으면 pnpm 사용, 없으면 npm 사용
if (Get-Command pnpm -ErrorAction SilentlyContinue) {
    pnpm start
} else {
    npm start
}
