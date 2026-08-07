from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.models.course import Course
from app.models.lesson import Lesson
from app.models.question import Question
from app.services.assessment_ai import generate_questions
from app.models.assessment import Assessment

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

@router.post("/{assessment_id}/generate-ai")
def generate_ai_assessment(
    assessment_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin),
):

    # ==========================================
    # Find Assessment
    # ==========================================

    assessment = (
        db.query(Assessment)
        .filter(Assessment.id == assessment_id)
        .first()
    )

    if not assessment:

        raise HTTPException(
            status_code=404,
            detail="Assessment not found."
        )

    # ==========================================
    # Find Course
    # ==========================================

    course = (
        db.query(Course)
        .filter(Course.id == assessment.course_id)
        .first()
    )
    if not course:

        raise HTTPException(
            status_code=404,
            detail="Course not found."
        )

    # ==========================================
    # Fetch Lessons
    # ==========================================

    lessons = (
        db.query(Lesson)
        .filter(Lesson.course_id == course.id)
        .order_by(Lesson.order)
        .all()
    )

    if not lessons:

        raise HTTPException(
            status_code=400,
            detail="Course has no lessons."
        )

    # ==========================================
    # Generate Questions using AI
    # ==========================================

    ai_questions = generate_questions(
        course,
        lessons,
        total_questions=10,
    )

    # ==========================================
    # Remove old questions (optional)
    # ==========================================

    db.query(Question).filter(
        Question.assessment_id == assessment.id
    ).delete()

    # ==========================================
    # Save Questions
    # ==========================================

    for q in ai_questions:

        question = Question(
            assessment_id=assessment.id,
            question=q["question"],
            option_a=q["option_a"],
            option_b=q["option_b"],
            option_c=q["option_c"],
            option_d=q["option_d"],
            correct_answer=q["correct_answer"],
        )

        db.add(question)

    db.commit()

    return {
        "message": f"{len(ai_questions)} questions generated successfully."
    }