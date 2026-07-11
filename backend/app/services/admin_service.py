from sqlalchemy import func
from sqlalchemy.orm import Session

from app.models.user import User
from app.models.course import Course
from app.models.assessment import Assessment
from app.models.question import Question
from app.models.result import Result


def get_dashboard(db: Session):

    total_users = db.query(User).count()

    total_learners = (
        db.query(User)
        .filter(User.role == "learner")
        .count()
    )

    total_admins = (
        db.query(User)
        .filter(User.role == "admin")
        .count()
    )

    total_courses = db.query(Course).count()

    total_assessments = db.query(Assessment).count()

    total_questions = db.query(Question).count()

    quiz_attempts = db.query(Result).count()

    average_score = (
        db.query(func.avg(Result.percentage))
        .scalar()
    )

    pass_count = (
        db.query(Result)
        .filter(Result.passed == True)
        .count()
    )

    pass_rate = 0

    if quiz_attempts > 0:

        pass_rate = round(
            (pass_count / quiz_attempts) * 100,
            2
        )

    return {

        "total_users": total_users,

        "total_learners": total_learners,

        "total_admins": total_admins,

        "total_courses": total_courses,

        "total_assessments": total_assessments,

        "total_questions": total_questions,

        "quiz_attempts": quiz_attempts,

        "average_score": round(
            average_score or 0,
            2
        ),

        "pass_rate": pass_rate
    }


def get_all_users(db: Session):

    users = (
        db.query(User)
        .order_by(User.created_at.desc())
        .all()
    )

    return users
