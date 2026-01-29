#!/bin/bash
# 백엔드 서버 실행 스크립트

echo "백엔드 서버를 시작합니다..."

# 가상환경 활성화 (있는 경우)
if [ -d "venv" ]; then
    source venv/bin/activate
fi

# 환경 변수 파일 확인
if [ ! -f ".env" ]; then
    echo "경고: .env 파일이 없습니다. .env.example을 참고하여 .env 파일을 생성하세요."
fi

# 서버 실행
uvicorn main:app --reload --host 0.0.0.0 --port 8000
