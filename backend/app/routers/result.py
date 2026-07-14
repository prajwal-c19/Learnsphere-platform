from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies import get_current_user

from app.models.user import User

from app.schemas.result import (
    QuizSubmission,
    ResultResponse
)

from app.services import result_service

router = APIRouter(
    prefix="/results",
    tags=["Results"]
)


@router.post(
    "/submit",
    response_model=ResultResponse
)
def submit_quiz(
    submission: QuizSubmission,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    try:

        return result_service.submit_quiz(
            db=db,
            current_user=current_user,
            submission=submission
        )

    except HTTPException:
        raise

    except Exception as e:

        raise HTTPException(
            status_code=400,
            detail=str(e)
        )


@router.get(
    "/assessment/{assessment_id}",
    response_model=ResultResponse
)
def get_latest_result(
    assessment_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    return result_service.get_latest_result(
        db=db,
        current_user=current_user,
        assessment_id=assessment_id
    )

@router.get("/history")
def get_result_history(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    return result_service.get_result_history(
        db=db,
        current_user=current_user
    )