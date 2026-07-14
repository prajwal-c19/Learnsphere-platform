from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db

from app.dependencies import (
    get_current_admin,
    get_current_user
)

from app.models.user import User

from app.schemas.assessment import (
    AssessmentCreate,
    AssessmentResponse
)

from app.services import assessment_service

router = APIRouter(
    prefix="/assessments",
    tags=["Assessments"]
)


@router.post(
    "/",
    response_model=AssessmentResponse
)
def create_assessment(
    assessment: AssessmentCreate,
    admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):

    return assessment_service.create_assessment(
        db,
        assessment
    )


@router.get(
    "/",
    response_model=list[AssessmentResponse]
)
def get_all_assessments(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    return assessment_service.get_all_assessments(
        db
    )


@router.get(
    "/course/{course_id}",
    response_model=AssessmentResponse
)
def get_assessment_by_course(
    course_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    assessment = (
        assessment_service.get_assessment_by_course(
            db,
            course_id
        )
    )

    if not assessment:

        raise HTTPException(
            status_code=404,
            detail="Assessment not found."
        )

    return assessment

@router.get("/my")
def get_my_assessments(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    return assessment_service.get_my_assessments(
        db=db,
        current_user=current_user
    )

@router.get(
    "/{assessment_id}",
    response_model=AssessmentResponse
)
def get_assessment(
    assessment_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    assessment = assessment_service.get_assessment(
        db,
        assessment_id
    )

    if not assessment:

        raise HTTPException(
            status_code=404,
            detail="Assessment not found."
        )

    return assessment


@router.put(
    "/{assessment_id}",
    response_model=AssessmentResponse
)
def update_assessment(
    assessment_id: int,
    assessment: AssessmentCreate,
    admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):

    updated = (
        assessment_service.update_assessment(
            db,
            assessment_id,
            assessment
        )
    )

    if not updated:

        raise HTTPException(
            status_code=404,
            detail="Assessment not found."
        )

    return updated


@router.delete(
    "/{assessment_id}"
)
def delete_assessment(
    assessment_id: int,
    admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):

    assessment = (
        assessment_service.delete_assessment(
            db,
            assessment_id
        )
    )

    if not assessment:

        raise HTTPException(
            status_code=404,
            detail="Assessment not found."
        )

    return {
        "message": "Assessment deleted successfully."
    }
