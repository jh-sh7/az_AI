# 설치 완료 확인 스크립트
Write-Host "설치 완료 여부를 확인합니다..." -ForegroundColor Yellow
Write-Host ""

$maxWait = 600  # 최대 10분 대기
$interval = 10  # 10초마다 확인
$elapsed = 0

while ($elapsed -lt $maxWait) {
    if (Test-Path "node_modules") {
        Write-Host ""
        Write-Host "========================================" -ForegroundColor Green
        Write-Host "✓✓✓ 설치 완료! ✓✓✓" -ForegroundColor Green
        Write-Host "========================================" -ForegroundColor Green
        Write-Host ""
        Write-Host "node_modules 폴더가 생성되었습니다." -ForegroundColor Cyan
        
        # 패키지 수 확인
        $packageCount = (Get-ChildItem node_modules -Directory -ErrorAction SilentlyContinue | Measure-Object).Count
        Write-Host "설치된 패키지 수: $packageCount" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "다음 단계:" -ForegroundColor Yellow
        Write-Host "  npm start" -ForegroundColor White
        Write-Host ""
        exit 0
    }
    
    Write-Host "." -NoNewline -ForegroundColor Gray
    Start-Sleep -Seconds $interval
    $elapsed += $interval
}

Write-Host ""
Write-Host "시간 초과 (10분). 설치 상태를 수동으로 확인해주세요." -ForegroundColor Yellow
Write-Host "터미널에서 npm install 프로세스 상태를 확인하세요." -ForegroundColor Yellow
