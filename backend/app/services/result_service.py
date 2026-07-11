from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models.question import Question
from app.models.result import Result
from app.models.enrollment import Enrollment
from app.models.assessment import Assessment
from app.models.user import User


def submit_quiz(
    db: Session,
    current_user: User,
    submission
):

    assessment = (
        db.query(Assessment)
        .filter(
            Assessment.id == submission.assessment_id
        )
        .first()
    )

    if not assessment:
        raise HTTPException(
            status_code=404,
            detail="Assessment not found."
        )

    questions = (
        db.query(Question)
        .filter(
            Question.assessment_id == submission.assessment_id
        )
        .all()
    )

    if not questions:
        raise HTTPException(
            status_code=404,
            detail="No questions found for this assessment."
        )

    correct = 0

    for question in questions:

        selected = submission.answers.get(question.id)

        if (
            selected
            and
            selected.upper() ==
            question.correct_answer.upper()
        ):
            correct += 1

    total = len(questions)

    percentage = round(
        (correct / total) * 100,
        2
    )

    passed = percentage >= 80

    result = Result(
        user_id=current_user.id,
        assessment_id=submission.assessment_id,
        score=correct,
        percentage=percentage,
        passed=passed
    )

    db.add(result)

    enrollment = (
        db.query(Enrollment)
        .filter(
            Enrollment.user_id == current_user.id,
            Enrollment.course_id == assessment.course_id
        )
        .first()
    )

    if enrollment:

        if passed:
            enrollment.progress = 100
            enrollment.status = "Completed"
        else:
            enrollment.status = "Assessment Attempted"

    db.commit()
    db.refresh(result)

    return {
        "score": correct,
        "percentage": percentage,
        "passed": passed
    }


def get_latest_result(
    db: Session,
    current_user: User,
    assessment_id: int
):

    result = (
        db.query(Result)
        .filter(
            Result.user_id == current_user.id,
            Result.assessment_id == assessment_id
        )
        .order_by(Result.submitted_at.desc())
        .first()
    )

    if not result:
        raise HTTPException(
            status_code=404,
            detail="Result not found."
        )

    return {
        "score": result.score,
        "percentage": result.percentage,
        "passed": result.passed
    }
