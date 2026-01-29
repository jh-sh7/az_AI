from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime

from database import get_db
from models import User, Task, TaskStatusEnum
from schemas import TaskCreate, TaskResponse, TaskStatus
from auth import get_current_user
from automation_engine import AutomationEngine

router = APIRouter()

@router.post("", response_model=TaskResponse, status_code=status.HTTP_201_CREATED)
async def create_task(
    task_data: TaskCreate,
    background_tasks: BackgroundTasks,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """새 작업 생성 및 실행"""
    # 작업 생성
    db_task = Task(
        user_id=current_user.id,
        command=task_data.command,
        status=TaskStatusEnum.PENDING
    )
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    
    # 백그라운드에서 작업 실행
    background_tasks.add_task(execute_task, db_task.id, task_data.command, current_user.id)
    
    return db_task

@router.get("", response_model=List[TaskResponse])
async def get_tasks(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100
):
    """사용자의 작업 목록 조회"""
    tasks = db.query(Task).filter(
        Task.user_id == current_user.id
    ).order_by(Task.created_at.desc()).offset(skip).limit(limit).all()
    return tasks

@router.get("/{task_id}", response_model=TaskResponse)
async def get_task(
    task_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """특정 작업 조회"""
    task = db.query(Task).filter(
        Task.id == task_id,
        Task.user_id == current_user.id
    ).first()
    
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="작업을 찾을 수 없습니다"
        )
    
    return task

@router.post("/{task_id}/cancel", response_model=TaskResponse)
async def cancel_task(
    task_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """작업 취소"""
    task = db.query(Task).filter(
        Task.id == task_id,
        Task.user_id == current_user.id
    ).first()
    
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="작업을 찾을 수 없습니다"
        )
    
    if task.status == TaskStatusEnum.COMPLETED:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="이미 완료된 작업입니다"
        )
    
    if task.status == TaskStatusEnum.CANCELLED:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="이미 취소된 작업입니다"
        )
    
    task.status = TaskStatusEnum.CANCELLED
    db.commit()
    db.refresh(task)
    
    return task

async def execute_task(task_id: int, command: str, user_id: int):
    """백그라운드에서 작업 실행"""
    from database import SessionLocal
    
    db = SessionLocal()
    try:
        task = db.query(Task).filter(Task.id == task_id).first()
        if not task:
            return
        
        # 작업 상태를 실행 중으로 변경
        task.status = TaskStatusEnum.RUNNING
        db.commit()
        
        # 자동화 엔진으로 작업 실행
        engine = AutomationEngine()
        try:
            result = await engine.execute_command(command, user_id)
            task.status = TaskStatusEnum.COMPLETED
            task.result = result
            task.completed_at = datetime.utcnow()
        except Exception as e:
            task.status = TaskStatusEnum.FAILED
            task.error_message = str(e)
        
        db.commit()
    finally:
        db.close()
