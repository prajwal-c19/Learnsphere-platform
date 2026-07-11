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
