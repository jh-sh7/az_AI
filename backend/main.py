from fastapi import FastAPI, Depends, HTTPException, status, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
import uvicorn
from dotenv import load_dotenv
import traceback
import re

from database import SessionLocal, engine, Base
from models import User, Task
from schemas import UserCreate, UserLogin, TaskCreate, TaskResponse, TaskStatus
from auth import (
    verify_password, 
    get_password_hash, 
    create_access_token, 
    get_current_user,
    verify_google_token
)
from automation_engine import AutomationEngine
from routers import auth, tasks

load_dotenv()

# 데이터베이스 테이블 생성
Base.metadata.create_all(bind=engine)

app = FastAPI(title="AI 자동화 서비스", version="1.0.0")

# CORS 설정 (개발: localhost, 배포: Vercel 프론트엔드)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:3001",
        "http://localhost:3002",
        "http://localhost:3003",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:3001",
        "http://127.0.0.1:3002",
        "http://127.0.0.1:3003",
        "https://az-ai-git-main-jh-sh7s-projects.vercel.app",
    ],
    allow_origin_regex=r"https?://(localhost|127\.0\.0\.1)(:\d+)?|https://.*\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
    max_age=3600,
)

# 라우터 등록
app.include_router(auth.router, prefix="/api/auth", tags=["인증"])
app.include_router(tasks.router, prefix="/api/tasks", tags=["작업"])

@app.get("/")
async def root():
    return {"message": "AI 자동화 서비스 API", "version": "1.0.0"}

@app.get("/api/health")
async def health_check():
    return {"status": "healthy"}

# 전역 예외 핸들러 - 모든 예외에 CORS 헤더 추가
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """모든 예외에 CORS 헤더를 포함한 응답 반환"""
    origin = request.headers.get("origin")
    
    # 허용된 origin인지 확인
    allowed_origins = [
        "http://localhost:3000",
        "http://localhost:3001",
        "http://localhost:3002",
        "http://localhost:3003",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:3001",
        "http://127.0.0.1:3002",
        "http://127.0.0.1:3003",
    ]
    
    is_allowed = origin in allowed_origins or (
        origin and re.match(r"https?://(localhost|127\.0\.0\.1)(:\d+)?", origin)
    )
    
    headers = {}
    if is_allowed:
        headers = {
            "Access-Control-Allow-Origin": origin,
            "Access-Control-Allow-Credentials": "true",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS, PATCH",
            "Access-Control-Allow-Headers": "*",
        }
    
    # HTTPException인 경우 해당 상태 코드 사용
    if isinstance(exc, HTTPException):
        return JSONResponse(
            status_code=exc.status_code,
            content={"detail": exc.detail},
            headers=headers
        )
    
    # 기타 예외는 500 에러로 처리
    print(f"Internal Server Error: {exc}")
    print(traceback.format_exc())
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal Server Error"},
        headers=headers
    )

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
