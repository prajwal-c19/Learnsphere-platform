from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies import get_current_admin
from app.models.user import User

from app.schemas.admin import (
    AdminDashboardResponse,
    UserResponse
)

from app.services import admin_service

router = APIRouter(
    prefix="/admin",
    tags=["Admin"]
)


@router.get(
    "/dashboard",
    response_model=AdminDashboardResponse
)
def admin_dashboard(
    admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):

    return admin_service.get_dashboard(db)


@router.get(
    "/users",
    response_model=list[UserResponse]
)
def get_all_users(
    admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):

    return admin_service.get_all_users(db)
