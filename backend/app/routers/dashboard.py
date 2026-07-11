from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies import get_current_user

from app.models.user import User

from app.schemas.dashboard import DashboardResponse

from app.services import dashboard_service

router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"]
)


@router.get(
    "/",
    response_model=DashboardResponse
)
def dashboard(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    return dashboard_service.get_dashboard(
        db=db,
        current_user=current_user
    )
