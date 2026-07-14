from sqlalchemy.orm import Session

from app.models.assessment import Assessment
from app.schemas.assessment import AssessmentCreate

from app.models.course import Course
from app.models.enrollment import Enrollment
from app.models.result import Result
from app.models.user import User
from sqlalchemy import func


def create_assessment(
    db: Session,
    assessment: AssessmentCreate
):

    new_assessment = Assessment(
        **assessment.model_dump()
    )

    db.add(new_assessment)

    db.commit()

    db.refresh(new_assessment)

    return new_assessment


def get_all_assessments(
    db: Session
):

    return (
        db.query(Assessment)
        .order_by(Assessment.id.desc())
        .all()
    )


def get_assessment(
    db: Session,
    assessment_id: int
):

    return (
        db.query(Assessment)
        .filter(
            Assessment.id == assessment_id
        )
        .first()
    )


def get_assessment_by_course(
    db: Session,
    course_id: int
):

    return (
        db.query(Assessment)
        .filter(
            Assessment.course_id == course_id
        )
        .first()
    )


def update_assessment(
    db: Session,
    assessment_id: int,
    assessment_data: AssessmentCreate
):

    assessment = get_assessment(
        db,
        assessment_id
    )

    if not assessment:

        return None

    for key, value in assessment_data.model_dump().items():

        setattr(
            assessment,
            key,
            value
        )

    db.commit()

    db.refresh(
        assessment
    )

    return assessment


def delete_assessment(
    db: Session,
    assessment_id: int
):

    assessment = get_assessment(
        db,
        assessment_id
    )

    if assessment:

        db.delete(
            assessment
        )

        db.commit()

    return assessment

def get_my_assessments(
    db: Session,
    current_user: User
):

    enrollments = (
        db.query(Enrollment)
        .filter(
            Enrollment.user_id == current_user.id
        )
        .all()
    )

    data = []

    for enrollment in enrollments:

        course = (
            db.query(Course)
            .filter(
                Course.id == enrollment.course_id
            )
            .first()
        )

        assessment = (
            db.query(Assessment)
            .filter(
                Assessment.course_id == course.id
            )
            .first()
        )

        if not assessment:
            continue

        attempts = (
            db.query(Result)
            .filter(
                Result.user_id == current_user.id,
                Result.assessment_id == assessment.id
            )
            .count()
        )

        best_result = (
            db.query(func.max(Result.percentage))
            .filter(
                Result.user_id == current_user.id,
                Result.assessment_id == assessment.id
            )
            .scalar()
        )

        data.append({

            "assessment_id": assessment.id,

            "course_id": course.id,

            "course_name": course.title,

            "assessment_title": assessment.title,

            "progress": enrollment.progress,

            "status": enrollment.status,

            "available": enrollment.progress >= 80,

            "attempts": attempts,

            "best_score": best_result or 0

        })

    return data