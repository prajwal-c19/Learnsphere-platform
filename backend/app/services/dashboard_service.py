from sqlalchemy.orm import Session, joinedload

from app.models.course import Course
from app.models.enrollment import Enrollment
from app.models.result import Result
from app.models.user import User


def get_dashboard(
    db: Session,
    current_user: User
):

    total_courses = db.query(Course).count()

    enrollments = (
        db.query(Enrollment)
        .options(
            joinedload(Enrollment.course)
        )
        .filter(
            Enrollment.user_id == current_user.id
        )
        .all()
    )

    enrolled_courses = len(enrollments)

    completed_courses = len(
        [
            enrollment
            for enrollment in enrollments
            if enrollment.progress == 100
        ]
    )

    in_progress_courses = len(
        [
            enrollment
            for enrollment in enrollments
            if enrollment.progress < 100
        ]
    )

    overall_progress = 0

    if enrolled_courses > 0:

        overall_progress = round(

            sum(
                enrollment.progress
                for enrollment in enrollments
            ) / enrolled_courses,

            2

        )

    recent_results = (
        db.query(Result)
        .filter(
            Result.user_id == current_user.id
        )
        .order_by(Result.id.desc())
        .limit(5)
        .all()
    )

    return {

        "name": current_user.name,

        "total_courses": total_courses,

        "enrolled_courses": enrolled_courses,

        "completed_courses": completed_courses,

        "in_progress_courses": in_progress_courses,

        "overall_progress": overall_progress,

        "enrollments": enrollments,

        "recent_results": recent_results

    }


def get_leaderboard(db: Session):

    learners = (
        db.query(User)
        .filter(User.role == "learner")
        .all()
    )

    leaderboard = []

    for user in learners:

        enrollments = (
            db.query(Enrollment)
            .filter(Enrollment.user_id == user.id)
            .all()
        )

        results = (
            db.query(Result)
            .filter(Result.user_id == user.id)
            .all()
        )

        completed_courses = len(
            [
                enrollment
                for enrollment in enrollments
                if enrollment.progress == 100
            ]
        )

        completed_assessments = len(
            [
                result
                for result in results
                if result.passed
            ]
        )

        avg_quiz_score = (
            sum(result.percentage for result in results) / len(results)
            if results else 0
        )

        progress_percentage = (
            sum(enrollment.progress for enrollment in enrollments) / len(enrollments)
            if enrollments else 0
        )

        xp = (
            (completed_courses * 50)
            + (completed_assessments * 40)
            + (avg_quiz_score * 2)
            + progress_percentage
        )

        leaderboard.append(
            {

                "user_id": user.id,

                "name": user.name,

                "completed_courses": completed_courses,

                "completed_assessments": completed_assessments,

                "avg_quiz_score": round(avg_quiz_score, 2),

                "progress_percentage": round(progress_percentage, 2),

                "xp": round(xp, 2)

            }
        )

    leaderboard.sort(
        key=lambda entry: entry["xp"],
        reverse=True
    )

    return leaderboard[:10]