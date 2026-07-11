from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models.question import Question
from app.models.assessment import Assessment
from app.schemas.question import QuestionCreate


def create_question(db: Session, question: QuestionCreate):

    assessment = (
        db.query(Assessment)
        .filter(Assessment.id == question.assessment_id)
        .first()
    )

    if not assessment:
        raise HTTPException(
            status_code=404,
            detail="Assessment not found."
        )

    existing_questions = (
        db.query(Question)
        .filter(
            Question.assessment_id == question.assessment_id
        )
        .count()
    )

    if existing_questions >= assessment.total_questions:
        raise HTTPException(
            status_code=400,
            detail=f"Only {assessment.total_questions} questions are allowed for this assessment."
        )

    new_question = Question(**question.model_dump())

    db.add(new_question)
    db.commit()
    db.refresh(new_question)

    return new_question


def get_all_questions(db: Session):
    return db.query(Question).all()


def get_question(db: Session, question_id: int):
    return (
        db.query(Question)
        .filter(Question.id == question_id)
        .first()
    )


def get_questions_by_assessment(
    db: Session,
    assessment_id: int
):
    return (
        db.query(Question)
        .filter(Question.assessment_id == assessment_id)
        .all()
    )


def delete_question(
    db: Session,
    question_id: int
):
    question = get_question(db, question_id)

    if question:
        db.delete(question)
        db.commit()

    return question
