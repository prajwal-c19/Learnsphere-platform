from fastapi import HTTPException
from sqlalchemy.orm import Session, joinedload

from app.models.course import Course
from app.models.enrollment import Enrollment
from app.models.user import User


class EnrollmentService:

    @staticmethod
    def enroll_user(
        db: Session,
        current_user: User,
        course_id: int
    ):

        course = (
            db.query(Course)
            .filter(Course.id == course_id)
            .first()
        )

        if not course:
            raise HTTPException(
                status_code=404,
                detail="Course not found."
            )

        existing = (
            db.query(Enrollment)
            .filter(
                Enrollment.user_id == current_user.id,
                Enrollment.course_id == course_id
            )
            .first()
        )

        if existing:
            raise HTTPException(
                status_code=400,
                detail="You are already enrolled in this course."
            )

        enrollment = Enrollment(
            user_id=current_user.id,
            course_id=course_id,
            progress=0,
            status="Enrolled"
        )

        db.add(enrollment)
        db.commit()
        db.refresh(enrollment)

        return enrollment

    @staticmethod
    def get_my_enrollments(
        db: Session,
        current_user: User
    ):

        enrollments = (
            db.query(Enrollment)
            .options(joinedload(Enrollment.course))
            .filter(
                Enrollment.user_id == current_user.id
            )
            .all()
        )

        return enrollments

    @staticmethod
    def get_all_enrollments(
        db: Session
    ):

        enrollments = (
            db.query(Enrollment)
            .options(joinedload(Enrollment.course))
            .all()
        )

        return enrollments

    @staticmethod
    def update_progress(
        db: Session,
        current_user: User,
        course_id: int
    ):

        enrollment = (
            db.query(Enrollment)
            .filter(
                Enrollment.user_id == current_user.id,
                Enrollment.course_id == course_id
            )
            .first()
        )

        if not enrollment:
            raise HTTPException(
                status_code=404,
                detail="Enrollment not found."
            )

        if enrollment.progress >= 80:
            raise HTTPException(
                status_code=400,
                detail="Assessment is already unlocked."
            )

        enrollment.progress += 20

        if enrollment.progress > 80:
            enrollment.progress = 80

        db.commit()
        db.refresh(enrollment)

        return enrollment
