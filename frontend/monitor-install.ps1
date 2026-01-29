# 설치 모니터링 스크립트
Write-Host "설치 진행 상황을 모니터링합니다..." -ForegroundColor Yellow
Write-Host ""

$maxWait = 600  # 최대 10분
$interval = 30  # 30초마다 확인
$elapsed = 0

while ($elapsed -lt $maxWait) {
    if (Test-Path "node_modules") {
        Write-Host ""
        Write-Host "========================================" -ForegroundColor Green
        Write-Host "✓✓✓ 설치 완료! ✓✓✓" -ForegroundColor Green
        Write-Host "========================================" -ForegroundColor Green
        Write-Host ""
        
        $count = (Get-ChildItem node_modules -Directory -ErrorAction SilentlyContinue | Measure-Object).Count
        Write-Host "설치된 패키지 수: $count 개" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "설치가 성공적으로 완료되었습니다!" -ForegroundColor Green
        Write-Host ""
        Write-Host "다음 단계:" -ForegroundColor Yellow
        Write-Host "  npm start" -ForegroundColor White
        Write-Host ""
        exit 0
    }
    
    $minutes = [math]::Floor($elapsed / 60)
    $seconds = $elapsed % 60
    Write-Host "⏳ 진행 중... (경과 시간: ${minutes}분 ${seconds}초)" -ForegroundColor Yellow
    
    Start-Sleep -Seconds $interval
    $elapsed += $interval
}

Write-Host ""
Write-Host "시간 초과 (10분). 설치 상태를 확인해주세요." -ForegroundColor Yellow
