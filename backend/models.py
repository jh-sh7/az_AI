from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text, Enum as SQLEnum
from sqlalchemy.sql import func
from database import Base
import enum

class TaskStatusEnum(str, enum.Enum):
    PENDING = "pending"
    RUNNING = "running"
    COMPLETED = "completed"
    FAILED = "failed"
    CANCELLED = "cancelled"

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=True)  # 구글 로그인 사용자는 None
    full_name = Column(String, nullable=True)
    is_active = Column(Boolean, default=True)
    is_google_user = Column(Boolean, default=False)
    google_id = Column(String, nullable=True, unique=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

class Task(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, index=True, nullable=False)
    command = Column(Text, nullable=False)  # 사용자 명령
    status = Column(SQLEnum(TaskStatusEnum), default=TaskStatusEnum.PENDING)
    result = Column(Text, nullable=True)  # 작업 결과
    error_message = Column(Text, nullable=True)  # 에러 메시지
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    completed_at = Column(DateTime(timezone=True), nullable=True)
