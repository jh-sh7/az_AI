# npm 환경 변수 제거 스크립트
# 관리자 권한으로 실행해야 할 수 있습니다.

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "npm 환경 변수 제거 스크립트" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 현재 환경 변수 확인
Write-Host "현재 환경 변수 상태:" -ForegroundColor Yellow
Write-Host ""

Write-Host "사용자 변수:" -ForegroundColor Cyan
$userOffline = [System.Environment]::GetEnvironmentVariable("npm_config_offline", "User")
$userPreferOffline = [System.Environment]::GetEnvironmentVariable("npm_config_prefer_offline", "User")
Write-Host "  npm_config_offline: $userOffline"
Write-Host "  npm_config_prefer_offline: $userPreferOffline"
Write-Host ""

Write-Host "시스템 변수:" -ForegroundColor Cyan
$machineOffline = [System.Environment]::GetEnvironmentVariable("npm_config_offline", "Machine")
$machinePreferOffline = [System.Environment]::GetEnvironmentVariable("npm_config_prefer_offline", "Machine")
Write-Host "  npm_config_offline: $machineOffline"
Write-Host "  npm_config_prefer_offline: $machinePreferOffline"
Write-Host ""

# 사용자 환경 변수 제거
Write-Host "사용자 환경 변수 제거 중..." -ForegroundColor Yellow
try {
    if ($userOffline) {
        [System.Environment]::SetEnvironmentVariable("npm_config_offline", $null, "User")
        Write-Host "  ✓ npm_config_offline 제거 완료" -ForegroundColor Green
    } else {
        Write-Host "  - npm_config_offline 없음" -ForegroundColor Gray
    }
    
    if ($userPreferOffline) {
        [System.Environment]::SetEnvironmentVariable("npm_config_prefer_offline", $null, "User")
        Write-Host "  ✓ npm_config_prefer_offline 제거 완료" -ForegroundColor Green
    } else {
        Write-Host "  - npm_config_prefer_offline 없음" -ForegroundColor Gray
    }
} catch {
    Write-Host "  ✗ 사용자 환경 변수 제거 실패: $_" -ForegroundColor Red
}
Write-Host ""

# 시스템 환경 변수 제거 (관리자 권한 필요)
Write-Host "시스템 환경 변수 제거 중..." -ForegroundColor Yellow
try {
    if ($machineOffline) {
        [System.Environment]::SetEnvironmentVariable("npm_config_offline", $null, "Machine")
        Write-Host "  ✓ npm_config_offline 제거 완료" -ForegroundColor Green
    } else {
        Write-Host "  - npm_config_offline 없음" -ForegroundColor Gray
    }
    
    if ($machinePreferOffline) {
        [System.Environment]::SetEnvironmentVariable("npm_config_prefer_offline", $null, "Machine")
        Write-Host "  ✓ npm_config_prefer_offline 제거 완료" -ForegroundColor Green
    } else {
        Write-Host "  - npm_config_prefer_offline 없음" -ForegroundColor Gray
    }
} catch {
    Write-Host "  ✗ 시스템 환경 변수 제거 실패 (관리자 권한 필요): $_" -ForegroundColor Yellow
    Write-Host "    관리자 권한으로 PowerShell을 다시 실행하세요." -ForegroundColor Yellow
}
Write-Host ""

# 현재 세션에서도 제거
Write-Host "현재 세션 환경 변수 제거 중..." -ForegroundColor Yellow
$env:npm_config_offline = $null
$env:npm_config_prefer_offline = $null
Write-Host "  ✓ 현재 세션 환경 변수 제거 완료" -ForegroundColor Green
Write-Host ""

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "완료!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "다음 단계:" -ForegroundColor Yellow
Write-Host "1. 모든 PowerShell 창을 닫고 새로 열기" -ForegroundColor White
Write-Host "2. 다음 명령 실행:" -ForegroundColor White
Write-Host "   cd c:\Users\S\Desktop\az-AI\frontend" -ForegroundColor Cyan
Write-Host "   npm install" -ForegroundColor Cyan
Write-Host ""
