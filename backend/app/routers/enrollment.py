from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies import get_current_user

from app.models.user import User

from app.schemas.enrollment import EnrollmentCreate

from app.services.enrollment_service import EnrollmentService


router = APIRouter(
    prefix="/enrollments",
    tags=["Enrollments"]
)


@router.post("/")
def enroll_user(
    enrollment: EnrollmentCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    enrolled_course = EnrollmentService.enroll_user(
        db=db,
        current_user=current_user,
        course_id=enrollment.course_id
    )

    return {
        "success": True,
        "message": "Enrollment successful.",
        "data": enrolled_course
    }


@router.get("/")
def get_all_enrollments(
    db: Session = Depends(get_db)
):

    enrollments = EnrollmentService.get_all_enrollments(db)

    return {
        "success": True,
        "data": enrollments
    }


@router.get("/my")
def get_my_enrollments(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    enrollments = EnrollmentService.get_my_enrollments(
        db=db,
        current_user=current_user
    )

    return {
        "success": True,
        "data": enrollments
    }


@router.patch("/{course_id}/progress")
def update_progress(
    course_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    enrollment = EnrollmentService.update_progress(
        db=db,
        current_user=current_user,
        course_id=course_id
    )

    return {
        "success": True,
        "message": "Progress updated successfully.",
        "data": enrollment
    }
