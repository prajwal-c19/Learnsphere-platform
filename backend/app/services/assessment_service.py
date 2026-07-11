from sqlalchemy.orm import Session

from app.models.assessment import Assessment
from app.schemas.assessment import AssessmentCreate


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
