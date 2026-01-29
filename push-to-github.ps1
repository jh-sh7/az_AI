# GitHub에 푸시하는 스크립트
# 사용법: .\push-to-github.ps1
# 또는: .\push-to-github.ps1 -RepoUrl "https://github.com/YOUR_USERNAME/az-AI.git"

param(
    [string]$RepoUrl = ""
)

if ($RepoUrl -eq "") {
    Write-Host "GitHub 저장소 URL을 입력하세요 (예: https://github.com/username/az-AI.git): " -NoNewline
    $RepoUrl = Read-Host
}

if ($RepoUrl -eq "") {
    Write-Host "오류: 저장소 URL이 필요합니다." -ForegroundColor Red
    exit 1
}

Set-Location $PSScriptRoot

# 이미 origin이 있으면 제거
git remote remove origin 2>$null

git remote add origin $RepoUrl
git branch -M main
Write-Host "푸시 중... (GitHub 로그인 필요할 수 있음)" -ForegroundColor Green
git push -u origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host "푸시 완료! 이제 Vercel에서 이 저장소를 Import 하세요: https://vercel.com/new" -ForegroundColor Green
} else {
    Write-Host "푸시 실패. GitHub에서 저장소를 먼저 생성했는지 확인하세요: https://github.com/new" -ForegroundColor Red
}
