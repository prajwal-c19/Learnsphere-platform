from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db

from app.dependencies import (
    get_current_admin,
    get_current_user
)

from app.models.user import User

from app.schemas.question import (
    QuestionCreate,
    QuestionResponse
)

from app.services import question_service

router = APIRouter(
    prefix="/questions",
    tags=["Questions"]
)


@router.post(
    "/",
    response_model=QuestionResponse
)
def create_question(
    question: QuestionCreate,
    admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):

    return question_service.create_question(
        db,
        question
    )


@router.get(
    "/",
    response_model=list[QuestionResponse]
)
def get_all_questions(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    return question_service.get_all_questions(db)


@router.get(
    "/assessment/{assessment_id}",
    response_model=list[QuestionResponse]
)
def get_questions(
    assessment_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    return question_service.get_questions_by_assessment(
        db,
        assessment_id
    )


@router.delete("/{question_id}")
def delete_question(
    question_id: int,
    admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):

    question = question_service.delete_question(
        db,
        question_id
    )

    if not question:

        raise HTTPException(
            status_code=404,
            detail="Question not found"
        )

    return {
        "message": "Question deleted successfully"
    }
