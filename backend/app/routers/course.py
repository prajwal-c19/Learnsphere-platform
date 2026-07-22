from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db

from app.dependencies import (
    get_current_admin,
    get_current_user
)

from app.models.user import User
from app.models.course import Course

from app.schemas.course import CourseCreate,GenerateDescriptionRequest, CourseResponse

from app.services import gemini_service

router = APIRouter(
    prefix="/courses",
    tags=["Courses"]
)


@router.post("/")
def create_course(
    course: CourseCreate,
    admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):

    new_course = Course(**course.model_dump())

    db.add(new_course)
    db.commit()
    db.refresh(new_course)

    return {
        "message": "Course created successfully",
        "course": new_course
    }


@router.get("/")
def get_all_courses(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    return db.query(Course).all()


@router.get("/{course_id}")
def get_course(
    course_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    course = (
        db.query(Course)
        .filter(Course.id == course_id)
        .first()
    )

    if not course:

        raise HTTPException(
            status_code=404,
            detail="Course not found"
        )

    return course


@router.put("/{course_id}")
def update_course(
    course_id: int,
    updated_course: CourseCreate,
    admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):

    course = (
        db.query(Course)
        .filter(Course.id == course_id)
        .first()
    )

    if not course:

        raise HTTPException(
            status_code=404,
            detail="Course not found"
        )

    for key, value in updated_course.model_dump().items():

        setattr(course, key, value)

    db.commit()
    db.refresh(course)

    return {
        "message": "Course updated successfully",
        "course": course
    }


@router.delete("/{course_id}")
def delete_course(
    course_id: int,
    admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):

    course = (
        db.query(Course)
        .filter(Course.id == course_id)
        .first()
    )

    if not course:

        raise HTTPException(
            status_code=404,
            detail="Course not found"
        )

    db.delete(course)
    db.commit()

    return {
        "message": "Course deleted successfully"
    }

# ==========================================================
# Generate Course Description (AI)
# ==========================================================

@router.post("/generate-description")
def generate_course_description(
    request: GenerateDescriptionRequest,
    admin: User = Depends(get_current_admin),
):

    description = gemini_service.generate_course_description(
        request.course_name
    )

    return {
        "description": description
    }