from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    UploadFile,
    File,
)
from sqlalchemy.orm import Session

from app.database import get_db

from app.dependencies import (
    get_current_admin,
    get_current_user,
)

from app.models.user import User

from app.schemas.lesson import (
    LessonCreate,
    LessonResponse,
    CourseProgressResponse,
)

from app.services import lesson_service


router = APIRouter(
    prefix="/lessons",
    tags=["Lessons"]
)


# ==========================================================
# Upload Video
# ==========================================================

@router.post("/upload-video")
def upload_video(
    file: UploadFile = File(...),
    admin: User = Depends(get_current_admin),
):

    return lesson_service.upload_video(file)


# ==========================================================
# Create Lesson
# ==========================================================

@router.post(
    "/",
    response_model=LessonResponse,
)
def create_lesson(
    lesson: LessonCreate,
    admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
):

    return lesson_service.create_lesson(
        db,
        lesson,
    )

# ==========================================================
# Update Lesson
# ==========================================================

@router.put(
    "/{lesson_id}",
    response_model=LessonResponse,
)
def update_lesson(
    lesson_id: int,
    lesson: LessonCreate,
    admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
):

    updated = lesson_service.update_lesson(
        db,
        lesson_id,
        lesson,
    )

    if not updated:

        raise HTTPException(
            status_code=404,
            detail="Lesson not found.",
        )

    return updated
# ==========================================================
# Get Lessons
# ==========================================================

@router.get(
    "/course/{course_id}"
)
def get_lessons(
    course_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):

    return lesson_service.get_lessons_with_progress(
        db=db,
        course_id=course_id,
        user_id=current_user.id,
    )


# ==========================================================
# Course Progress
# ==========================================================

@router.get(
    "/course/{course_id}/progress",
    response_model=CourseProgressResponse,
)
def get_progress(
    course_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):

    return lesson_service.get_course_progress(
        db=db,
        user_id=current_user.id,
        course_id=course_id,
    )


# ==========================================================
# Complete Lesson
# ==========================================================

@router.post(
    "/{lesson_id}/complete",
    response_model=CourseProgressResponse,
)
def complete_lesson(
    lesson_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):

    return lesson_service.mark_lesson_complete(
        db=db,
        user_id=current_user.id,
        lesson_id=lesson_id,
    )


# ==========================================================
# Delete Lesson
# ==========================================================

@router.delete("/{lesson_id}")
def delete_lesson(
    lesson_id: int,
    admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
):

    lesson = lesson_service.delete_lesson(
        db,
        lesson_id,
    )

    if not lesson:

        raise HTTPException(
            status_code=404,
            detail="Lesson not found.",
        )

    return {
        "message": "Lesson deleted successfully."
    }