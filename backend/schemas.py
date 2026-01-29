from pydantic import BaseModel, EmailStr, Field, field_validator
from typing import Optional
from datetime import datetime
from models import TaskStatusEnum

class UserBase(BaseModel):
    email: EmailStr
    full_name: Optional[str] = None

class UserCreate(UserBase):
    password: str = Field(..., min_length=1, description="비밀번호는 최소 1자 이상, UTF-8 인코딩 시 최대 72바이트까지 가능합니다")
    
    @field_validator('password')
    @classmethod
    def validate_password_length(cls, v: str) -> str:
        # UTF-8 바이트 길이 검증 (bcrypt 제한: 72바이트)
        password_bytes = v.encode('utf-8')
        if len(password_bytes) > 72:
            # 한글 기준으로 대략적인 문자 수 계산 (한글 1자 = 3바이트)
            max_chars_kr = 72 // 3  # 약 24자
            raise ValueError(f'비밀번호가 너무 깁니다. UTF-8 인코딩 시 최대 72바이트까지 가능합니다. (한글 기준 약 {max_chars_kr}자)')
        if len(password_bytes) == 0:
            raise ValueError('비밀번호를 입력해주세요.')
        return v

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class GoogleLogin(BaseModel):
    token: str  # 구글 ID 토큰

class UserResponse(UserBase):
    id: int
    is_active: bool
    is_google_user: bool
    created_at: datetime

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TaskBase(BaseModel):
    command: str

class TaskCreate(TaskBase):
    pass

class TaskResponse(TaskBase):
    id: int
    user_id: int
    status: TaskStatusEnum
    result: Optional[str] = None
    error_message: Optional[str] = None
    created_at: datetime
    updated_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class TaskStatus(BaseModel):
    status: TaskStatusEnum
    result: Optional[str] = None
    error_message: Optional[str] = None
