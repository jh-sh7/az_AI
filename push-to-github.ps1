# GitHub에 푸시하는 스크립트
# 사용법: .\push-to-github.ps1
# 또는: .\push-to-github.ps1 -RepoUrl "https://github.com/YOUR_USERNAME/az-AI.git"

param(
    [string]$RepoUrl = ""
)

if ($RepoUrl -eq "") {
    Write-Host "Enter GitHub repo URL (e.g. https://github.com/username/az-AI.git): " -NoNewline
    $RepoUrl = Read-Host
}

if ($RepoUrl -eq "") {
    Write-Host "Error: Repository URL is required." -ForegroundColor Red
    exit 1
}

Set-Location $PSScriptRoot

# 이미 origin이 있으면 제거
git remote remove origin 2>$null

git remote add origin $RepoUrl
git branch -M main
Write-Host "Pushing to GitHub..." -ForegroundColor Green
git push -u origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host "Done! Import this repo on Vercel: https://vercel.com/new" -ForegroundColor Green
} else {
    Write-Host "Push failed. Create the repo first: https://github.com/new" -ForegroundColor Red
}
