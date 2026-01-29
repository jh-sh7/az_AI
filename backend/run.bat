@echo off
REM 백엔드 서버 실행 스크립트 (Windows)

echo 백엔드 서버를 시작합니다...

REM 가상환경 활성화 (있는 경우)
if exist venv\Scripts\activate.bat (
    call venv\Scripts\activate.bat
)

REM 환경 변수 파일 확인
if not exist .env (
    echo 경고: .env 파일이 없습니다. .env.example을 참고하여 .env 파일을 생성하세요.
)

REM 서버 실행
uvicorn main:app --reload --host 0.0.0.0 --port 8000

pause
