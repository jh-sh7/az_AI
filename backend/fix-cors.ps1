# CORS 문제 해결을 위한 백엔드 서버 재시작 스크립트
Write-Host "백엔드 서버 재시작 중..." -ForegroundColor Green

# 포트 8000을 사용하는 모든 프로세스 찾기
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
    Start-Sleep -Seconds 2
}

# 서버 시작
Write-Host "백엔드 서버 시작 중..." -ForegroundColor Green
Set-Location $PSScriptRoot
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot'; Write-Host '백엔드 서버 시작 중...' -ForegroundColor Green; uvicorn main:app --reload --host 0.0.0.0 --port 8000"

Write-Host "백엔드 서버가 http://0.0.0.0:8000 (http://localhost:8000) 에서 시작되었습니다." -ForegroundColor Green
Write-Host "서버 로그를 확인하려면 새로 열린 PowerShell 창을 확인하세요." -ForegroundColor Yellow
Write-Host ""
Write-Host "CORS 설정이 적용되었는지 확인하려면:" -ForegroundColor Cyan
Write-Host "  브라우저에서 http://localhost:3003 접속" -ForegroundColor Cyan
Write-Host "  개발자 도구(F12) -> Network 탭 -> 회원가입 시도 -> 요청 헤더 확인" -ForegroundColor Cyan
