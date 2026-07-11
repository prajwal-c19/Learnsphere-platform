from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models.lesson import Lesson
from app.models.lesson_progress import LessonProgress
from app.models.enrollment import Enrollment
from app.models.course import Course
from app.schemas.lesson import LessonCreate

# Progress percentage at which the assessment unlocks.
# Kept in sync with the pass_percentage-style gate already used
# on the frontend (MyCourses.jsx checks `progress < 80`).
ASSESSMENT_UNLOCK_THRESHOLD = 80


def create_lesson(db: Session, lesson: LessonCreate):

    course = (
        db.query(Course)
        .filter(Course.id == lesson.course_id)
        .first()
    )

    if not course:
        raise HTTPException(
            status_code=404,
            detail="Course not found."
        )

    new_lesson = Lesson(**lesson.model_dump())

    db.add(new_lesson)
    db.commit()
    db.refresh(new_lesson)

    return new_lesson


def get_lessons_by_course(db: Session, course_id: int):

    return (
        db.query(Lesson)
        .filter(Lesson.course_id == course_id)
        .order_by(Lesson.order.asc())
        .all()
    )


def get_lessons_with_progress(
    db: Session,
    course_id: int,
    user_id: int
):

    lessons = get_lessons_by_course(db, course_id)

    completed_ids = {
        progress.lesson_id
        for progress in (
            db.query(LessonProgress)
            .filter(
                LessonProgress.user_id == user_id,
                LessonProgress.completed == True,
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
            "video_url": lesson.video_url,
            "notes_url": lesson.notes_url,
            "order": lesson.order,
            "completed": lesson.id in completed_ids,
        })

    return result


def delete_lesson(db: Session, lesson_id: int):

    lesson = (
        db.query(Lesson)
        .filter(Lesson.id == lesson_id)
        .first()
    )

    if lesson:
        db.delete(lesson)
        db.commit()

    return lesson


def get_course_progress(
    db: Session,
    user_id: int,
    course_id: int
):

    total_lessons = (
        db.query(Lesson)
        .filter(Lesson.course_id == course_id)
        .count()
    )

    if total_lessons == 0:

        # Courses without lessons behave like v1: the assessment
        # is immediately available.
        return {
            "total_lessons": 0,
            "completed_lessons": 0,
            "progress": ASSESSMENT_UNLOCK_THRESHOLD,
            "assessment_unlocked": True,
        }

    lesson_ids = [
        lesson.id
        for lesson in (
            db.query(Lesson)
            .filter(Lesson.course_id == course_id)
            .all()
        )
    ]

    completed_lessons = (
        db.query(LessonProgress)
        .filter(
            LessonProgress.user_id == user_id,
            LessonProgress.lesson_id.in_(lesson_ids),
            LessonProgress.completed == True,
        )
        .count()
    )

    progress = round(
        (completed_lessons / total_lessons) * 100
    )

    return {
        "total_lessons": total_lessons,
        "completed_lessons": completed_lessons,
        "progress": progress,
        "assessment_unlocked": progress >= ASSESSMENT_UNLOCK_THRESHOLD,
    }


def mark_lesson_complete(
    db: Session,
    user_id: int,
    lesson_id: int
):

    lesson = (
        db.query(Lesson)
        .filter(Lesson.id == lesson_id)
        .first()
    )

    if not lesson:
        raise HTTPException(
            status_code=404,
            detail="Lesson not found."
        )

    progress_row = (
        db.query(LessonProgress)
        .filter(
            LessonProgress.user_id == user_id,
            LessonProgress.lesson_id == lesson_id,
        )
        .first()
    )

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

    # Sync the enrollment's stored progress so existing dashboard /
    # my-courses screens (which read Enrollment.progress) stay accurate.
    course_progress = get_course_progress(
        db=db,
        user_id=user_id,
        course_id=lesson.course_id,
    )

    enrollment = (
        db.query(Enrollment)
        .filter(
            Enrollment.user_id == user_id,
            Enrollment.course_id == lesson.course_id,
        )
        .first()
    )

    if enrollment and enrollment.status != "Completed":

        enrollment.progress = course_progress["progress"]

        if course_progress["progress"] >= ASSESSMENT_UNLOCK_THRESHOLD:
            enrollment.status = "Assessment Unlocked"
        else:
            enrollment.status = "In Progress"

        db.commit()

    return course_progress
