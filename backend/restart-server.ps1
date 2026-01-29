# 백엔드 서버 재시작 스크립트
Write-Host "백엔드 서버 재시작 중..." -ForegroundColor Green

# 기존 프로세스 종료
$processes = Get-Process | Where-Object {$_.ProcessName -eq "python" -and $_.CommandLine -like "*uvicorn*main:app*"}
if ($processes) {
    Write-Host "기존 서버 프로세스 종료 중..." -ForegroundColor Yellow
    $processes | Stop-Process -Force
    Start-Sleep -Seconds 2
}

# 서버 시작
Write-Host "백엔드 서버 시작 중..." -ForegroundColor Green
Set-Location $PSScriptRoot
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot'; uvicorn main:app --reload --host 0.0.0.0 --port 8000"

Write-Host "백엔드 서버가 http://localhost:8000 에서 시작되었습니다." -ForegroundColor Green
Write-Host "서버 로그를 확인하려면 새로 열린 PowerShell 창을 확인하세요." -ForegroundColor Yellow
