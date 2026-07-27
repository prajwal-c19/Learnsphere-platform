from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies import get_current_user

from app.models.user import User

from app.schemas.dashboard import DashboardResponse, LeaderboardResponse

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


@router.get(
    "/leaderboard",
    response_model=LeaderboardResponse
)
def leaderboard(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    top_learners = dashboard_service.get_leaderboard(db=db)

    ranked_entries = [
        {

            "id": entry["user_id"],

            "name": entry["name"],

            "avatar": entry.get("avatar"),

            "completed_courses": entry["completed_courses"],

            "completed_assessments": entry["completed_assessments"],

            "progress": entry["progress_percentage"],

            "xp": entry["xp"],

            "rank": rank

        }
        for rank, entry in enumerate(top_learners, start=1)
    ]

    return {
        "leaderboard": ranked_entries
    }