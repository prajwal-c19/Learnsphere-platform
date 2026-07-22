import os
import uuid
from pathlib import Path

from fastapi import (
    HTTPException,
    UploadFile,
)

from sqlalchemy.orm import Session

from app.models.lesson import Lesson
from app.models.lesson_progress import LessonProgress
from app.models.enrollment import Enrollment
from app.models.course import Course

from app.schemas.lesson import LessonCreate


# ==========================================================
# Configuration
# ==========================================================

# Percentage required to unlock the assessment.
ASSESSMENT_UNLOCK_THRESHOLD = 80

# Folder where uploaded lesson videos are stored.
UPLOAD_FOLDER = Path("uploads/videos")

# Maximum allowed upload size (200 MB).
MAX_VIDEO_SIZE = 200 * 1024 * 1024


# ==========================================================
# Allowed Video Formats
# ==========================================================

ALLOWED_EXTENSIONS = {
    ".mp4",
    ".mov",
    ".avi",
    ".webm",
}

ALLOWED_CONTENT_TYPES = {
    "video/mp4",
    "video/quicktime",
    "video/x-msvideo",
    "video/webm",
}


# ==========================================================
# Upload Helper Functions
# ==========================================================

def create_upload_folder():
    """
    Create uploads/videos folder if it doesn't exist.
    """

    UPLOAD_FOLDER.mkdir(
        parents=True,
        exist_ok=True
    )


def validate_video(file: UploadFile):
    """
    Validate uploaded video file.
    """

    extension = Path(
        file.filename
    ).suffix.lower()

    if extension not in ALLOWED_EXTENSIONS:

        raise HTTPException(
            status_code=400,
            detail=(
                "Unsupported file format. "
                "Only MP4, MOV, AVI and WEBM are allowed."
            )
        )

    if file.content_type not in ALLOWED_CONTENT_TYPES:

        raise HTTPException(
            status_code=400,
            detail="Invalid video file."
        )


def validate_file_size(file: UploadFile):
    """
    Validate uploaded file size.
    """

    file.file.seek(
        0,
        os.SEEK_END
    )

    size = file.file.tell()

    file.file.seek(0)

    if size > MAX_VIDEO_SIZE:

        raise HTTPException(
            status_code=400,
            detail="Video size cannot exceed 200 MB."
        )


def generate_unique_filename(filename: str):
    """
    Generate a unique filename while preserving
    the original extension.
    """

    extension = Path(
        filename
    ).suffix

    unique_id = uuid.uuid4().hex

    return f"lesson_{unique_id}{extension}"


def delete_uploaded_video(video_url: str):
    """
    Delete uploaded video from disk.
    """

    if not video_url:
        return

    file_path = Path(
        video_url.lstrip("/")
    )

    if file_path.exists():

        try:

            file_path.unlink()

        except Exception as e:

            print(
                f"Unable to delete video: {e}"
            )
            # ==========================================================
# Upload Video
# ==========================================================

def upload_video(file: UploadFile):
    """
    Upload a lesson video and return its URL.
    """

    create_upload_folder()

    validate_video(file)

    validate_file_size(file)

    filename = generate_unique_filename(
        file.filename
    )

    filepath = UPLOAD_FOLDER / filename

    with open(
        filepath,
        "wb"
    ) as buffer:

        buffer.write(
            file.file.read()
        )

    return {

        "video_type": "upload",

        "video_url": f"/uploads/videos/{filename}"

    }


# ==========================================================
# Create Lesson
# ==========================================================

def create_lesson(
    db: Session,
    lesson: LessonCreate
):
    """
    Create a new lesson.
    """

    course = (

        db.query(Course)

        .filter(
            Course.id == lesson.course_id
        )

        .first()

    )

    if not course:

        raise HTTPException(

            status_code=404,

            detail="Course not found."

        )

    new_lesson = Lesson(

        **lesson.model_dump()

    )

    db.add(
        new_lesson
    )

    db.commit()

    db.refresh(
        new_lesson
    )

    return new_lesson

# ==========================================================
# Update Lesson
# ==========================================================

def update_lesson(
    db: Session,
    lesson_id: int,
    lesson_data: LessonCreate
):
    """
    Update an existing lesson.
    """

    lesson = (

        db.query(Lesson)

        .filter(
            Lesson.id == lesson_id
        )

        .first()

    )

    if not lesson:

        return None

    # ------------------------------------------
    # If an uploaded video is being replaced,
    # remove the old uploaded file.
    # ------------------------------------------

    if (

        lesson.video_type == "upload"

        and lesson.video_url

        and lesson.video_url != lesson_data.video_url

    ):

        delete_uploaded_video(
            lesson.video_url
        )

    # ------------------------------------------
    # Update lesson fields
    # ------------------------------------------

    lesson.title = lesson_data.title

    lesson.description = lesson_data.description

    lesson.video_type = lesson_data.video_type

    lesson.video_url = lesson_data.video_url

    lesson.notes_url = lesson_data.notes_url

    lesson.order = lesson_data.order

    db.commit()

    db.refresh(lesson)

    return lesson


# ==========================================================
# Get Lessons By Course
# ==========================================================

def get_lessons_by_course(
    db: Session,
    course_id: int
):
    """
    Return all lessons belonging to a course.
    """

    return (

        db.query(Lesson)

        .filter(
            Lesson.course_id == course_id
        )

        .order_by(
            Lesson.order.asc()
        )

        .all()

    )
    # ==========================================================
# Get Lessons With Progress
# ==========================================================

def get_lessons_with_progress(
    db: Session,
    course_id: int,
    user_id: int
):
    """
    Return lessons along with the completion
    status for the current learner.
    """

    lessons = get_lessons_by_course(
        db,
        course_id
    )

    completed_ids = {

        progress.lesson_id

        for progress in (

            db.query(LessonProgress)

            .filter(

                LessonProgress.user_id == user_id,

                LessonProgress.completed == True

            )

            .all()

        )

    }

    result = []

    for lesson in lessons:

        result.append({

            "id": lesson.id,

            "course_id": lesson.course_id,

            "title": lesson.title,

            "description": lesson.description,

            "video_type": lesson.video_type,

            "video_url": lesson.video_url,

            "notes_url": lesson.notes_url,

            "order": lesson.order,

            "completed": lesson.id in completed_ids,

        })

    return result


# ==========================================================
# Delete Lesson
# ==========================================================

def delete_lesson(
    db: Session,
    lesson_id: int
):
    """
    Delete a lesson.

    This also removes:

    - Lesson progress
    - Uploaded video file (if present)
    """

    lesson = (

        db.query(Lesson)

        .filter(
            Lesson.id == lesson_id
        )

        .first()

    )

    if not lesson:

        return None

    # --------------------------------------
    # Delete learner progress
    # --------------------------------------

    db.query(LessonProgress).filter(

        LessonProgress.lesson_id == lesson.id

    ).delete()

    # --------------------------------------
    # Delete uploaded video
    # --------------------------------------

    if (

        lesson.video_type == "upload"

        and

        lesson.video_url

    ):

        delete_uploaded_video(

            lesson.video_url

        )

    # --------------------------------------
    # Delete lesson
    # --------------------------------------

    db.delete(
        lesson
    )

    db.commit()

    return lesson
    # ==========================================================
# Course Progress
# ==========================================================

def get_course_progress(
    db: Session,
    user_id: int,
    course_id: int
):
    """
    Calculate the learner's progress for a course.
    Also determines whether the assessment is unlocked.
    """

    total_lessons = (

        db.query(Lesson)

        .filter(
            Lesson.course_id == course_id
        )

        .count()

    )

    # --------------------------------------------------
    # No lessons in the course
    # --------------------------------------------------

    if total_lessons == 0:

        return {

            "total_lessons": 0,

            "completed_lessons": 0,

            "progress": ASSESSMENT_UNLOCK_THRESHOLD,

            "assessment_unlocked": True,

        }

    # --------------------------------------------------
    # Get lesson IDs
    # --------------------------------------------------

    lesson_ids = [

        lesson.id

        for lesson in (

            db.query(Lesson)

            .filter(
                Lesson.course_id == course_id
            )

            .all()

        )

    ]

    # --------------------------------------------------
    # Count completed lessons
    # --------------------------------------------------

    completed_lessons = (

        db.query(LessonProgress)

        .filter(

            LessonProgress.user_id == user_id,

            LessonProgress.lesson_id.in_(lesson_ids),

            LessonProgress.completed == True,

        )

        .count()

    )

    # --------------------------------------------------
    # Calculate percentage
    # --------------------------------------------------

    progress = round(

        (completed_lessons / total_lessons) * 100

    )

    # --------------------------------------------------
    # Return progress details
    # --------------------------------------------------

    return {

        "total_lessons": total_lessons,

        "completed_lessons": completed_lessons,

        "progress": progress,

        "assessment_unlocked":

            progress >= ASSESSMENT_UNLOCK_THRESHOLD,

    }
    # ==========================================================
# Mark Lesson Complete
# ==========================================================

def mark_lesson_complete(
    db: Session,
    user_id: int,
    lesson_id: int
):
    """
    Mark a lesson as completed and update
    the learner's overall course progress.
    """

    lesson = (

        db.query(Lesson)

        .filter(
            Lesson.id == lesson_id
        )

        .first()

    )

    if not lesson:

        raise HTTPException(

            status_code=404,

            detail="Lesson not found."

        )

    # --------------------------------------------------
    # Find existing progress
    # --------------------------------------------------

    progress_row = (

        db.query(LessonProgress)

        .filter(

            LessonProgress.user_id == user_id,

            LessonProgress.lesson_id == lesson_id,

        )

        .first()

    )

    # --------------------------------------------------
    # Create progress if it doesn't exist
    # --------------------------------------------------

    if not progress_row:

        progress_row = LessonProgress(

            user_id=user_id,

            lesson_id=lesson_id,

            completed=True,

        )

        db.add(progress_row)

    else:

        progress_row.completed = True

    db.commit()

    # --------------------------------------------------
    # Calculate latest course progress
    # --------------------------------------------------

    course_progress = get_course_progress(

        db=db,

        user_id=user_id,

        course_id=lesson.course_id,

    )

    # --------------------------------------------------
    # Update Enrollment
    # --------------------------------------------------

    enrollment = (

        db.query(Enrollment)

        .filter(

            Enrollment.user_id == user_id,

            Enrollment.course_id == lesson.course_id,

        )

        .first()

    )

    if enrollment:

        enrollment.progress = course_progress["progress"]

        if course_progress["progress"] >= 100:

            enrollment.status = "Completed"

        elif course_progress["assessment_unlocked"]:

            enrollment.status = "Assessment Unlocked"

        else:

            enrollment.status = "In Progress"

        db.commit()

        db.refresh(enrollment)

    return course_progress