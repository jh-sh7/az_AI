# npm 환경 변수 수정 스크립트
# 관리자 권한으로 실행해야 할 수 있습니다.

Write-Host "현재 npm 관련 환경 변수 확인 중..." -ForegroundColor Yellow

# 현재 세션의 환경 변수 확인
Write-Host "`n현재 세션 환경 변수:" -ForegroundColor Cyan
$env:npm_config_offline
$env:npm_config_prefer_offline

# 시스템 환경 변수 확인
Write-Host "`n시스템 환경 변수:" -ForegroundColor Cyan
[System.Environment]::GetEnvironmentVariable("npm_config_offline", "User")
[System.Environment]::GetEnvironmentVariable("npm_config_prefer_offline", "User")
[System.Environment]::GetEnvironmentVariable("npm_config_offline", "Machine")
[System.Environment]::GetEnvironmentVariable("npm_config_prefer_offline", "Machine")

# 환경 변수 제거
Write-Host "`n환경 변수 제거 중..." -ForegroundColor Yellow
try {
    [System.Environment]::SetEnvironmentVariable("npm_config_offline", $null, "User")
    [System.Environment]::SetEnvironmentVariable("npm_config_prefer_offline", $null, "User")
    Write-Host "사용자 환경 변수 제거 완료" -ForegroundColor Green
} catch {
    Write-Host "사용자 환경 변수 제거 실패: $_" -ForegroundColor Red
}

try {
    [System.Environment]::SetEnvironmentVariable("npm_config_offline", $null, "Machine")
    [System.Environment]::SetEnvironmentVariable("npm_config_prefer_offline", $null, "Machine")
    Write-Host "시스템 환경 변수 제거 완료" -ForegroundColor Green
} catch {
    Write-Host "시스템 환경 변수 제거 실패 (관리자 권한 필요): $_" -ForegroundColor Yellow
}

# 현재 세션에서도 제거
$env:npm_config_offline = $null
$env:npm_config_prefer_offline = $null

Write-Host "`n완료! 새 PowerShell 창을 열고 npm install을 다시 시도하세요." -ForegroundColor Green
Write-Host "또는 현재 창에서 다음 명령을 실행하세요:" -ForegroundColor Yellow
Write-Host "  cd frontend" -ForegroundColor Cyan
Write-Host "  npm install" -ForegroundColor Cyan
