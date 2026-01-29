from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import timedelta

from database import get_db
from models import User
from schemas import UserCreate, UserLogin, GoogleLogin, UserResponse, Token
from auth import (
    verify_password,
    get_password_hash,
    create_access_token,
    verify_google_token,
    get_current_user,
    ACCESS_TOKEN_EXPIRE_MINUTES
)

router = APIRouter()

@router.post("/register", response_model=UserResponse)
async def register(user_data: UserCreate, db: Session = Depends(get_db)):
    """이메일로 회원가입"""
    try:
        # 이메일 중복 확인
        db_user = db.query(User).filter(User.email == user_data.email).first()
        if db_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="이미 등록된 이메일입니다"
            )
        
        # 새 사용자 생성
        hashed_password = get_password_hash(user_data.password)
        db_user = User(
            email=user_data.email,
            hashed_password=hashed_password,
            full_name=user_data.full_name,
            is_google_user=False
        )
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        return db_user
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        print(f"회원가입 오류: {type(e).__name__}: {str(e)}")
        import traceback
        traceback.print_exc()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"회원가입 중 오류가 발생했습니다: {str(e)}"
        )

@router.post("/login", response_model=Token)
async def login(user_data: UserLogin, db: Session = Depends(get_db)):
    """이메일/비밀번호로 로그인"""
    user = db.query(User).filter(User.email == user_data.email).first()
    
    if not user or not user.hashed_password:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="이메일 또는 비밀번호가 올바르지 않습니다"
        )
    
    if not verify_password(user_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="이메일 또는 비밀번호가 올바르지 않습니다"
        )
    
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="비활성화된 계정입니다"
        )
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.id}, expires_delta=access_token_expires
    )
    
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/google", response_model=Token)
async def google_login(google_data: GoogleLogin, db: Session = Depends(get_db)):
    """구글 계정으로 로그인"""
    # 구글 토큰 검증
    google_user_info = await verify_google_token(google_data.token)
    
    email = google_user_info.get("email")
    google_id = google_user_info.get("sub")
    name = google_user_info.get("name")
    
    if not email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="구글 계정에서 이메일을 가져올 수 없습니다"
        )
    
    # 기존 사용자 확인
    user = db.query(User).filter(
        (User.email == email) | (User.google_id == google_id)
    ).first()
    
    if user:
        # 기존 사용자 업데이트
        user.google_id = google_id
        user.is_google_user = True
        if name:
            user.full_name = name
    else:
        # 새 사용자 생성
        user = User(
            email=email,
            full_name=name,
            is_google_user=True,
            google_id=google_id,
            hashed_password=None
        )
        db.add(user)
    
    db.commit()
    db.refresh(user)
    
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="비활성화된 계정입니다"
        )
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.id}, expires_delta=access_token_expires
    )
    
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/me", response_model=UserResponse)
async def get_current_user_info(current_user: User = Depends(get_current_user)):
    """현재 로그인한 사용자 정보"""
    return current_user
