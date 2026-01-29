# 백엔드 서버 재시작 스크립트
Write-Host "백엔드 서버 재시작 중..." -ForegroundColor Green

# 포트 8000을 사용하는 모든 프로세스 종료
$port = 8000
$connections = netstat -ano | findstr ":$port.*LISTENING"
$pids = $connections | ForEach-Object {
    if ($_ -match '\s+(\d+)$') {
        $matches[1]
    }
} | Select-Object -Unique

if ($pids) {
    Write-Host "포트 $port 를 사용하는 프로세스 종료 중..." -ForegroundColor Yellow
    foreach ($pid in $pids) {
        try {
            Stop-Process -Id $pid -Force -ErrorAction SilentlyContinue
            Write-Host "  프로세스 $pid 종료됨" -ForegroundColor Gray
        } catch {
            Write-Host "  프로세스 $pid 종료 실패: $_" -ForegroundColor Red
        }
    }
    Start-Sleep -Seconds 3
}

# 현재 디렉토리로 이동
Set-Location $PSScriptRoot

# 서버 시작
Write-Host "백엔드 서버 시작 중..." -ForegroundColor Green
Write-Host "서버가 시작되면 이 창에서 계속 실행됩니다." -ForegroundColor Yellow
Write-Host "서버를 중지하려면 Ctrl+C를 누르세요." -ForegroundColor Yellow
Write-Host ""

# 직접 실행 (새 창이 아닌 현재 창에서)
uvicorn main:app --reload --host 0.0.0.0 --port 8000
