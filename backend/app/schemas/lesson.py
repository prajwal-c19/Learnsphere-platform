from pydantic import BaseModel, Field


class LessonCreate(BaseModel):

    course_id: int

    title: str = Field(
        ...,
        min_length=3,
        max_length=255
    )

    description: str | None = None

    # youtube | upload
    video_type: str = "youtube"

    # Stores either:
    # https://youtube.com/...
    # OR
    # /uploads/videos/lesson.mp4
    video_url: str | None = None

    notes_url: str | None = None

    duration: int = Field(
    ...,
    gt=0,
    description="Lesson duration in minutes"
    )

    order: int = 1


class LessonResponse(BaseModel):

    id: int

    course_id: int

    title: str

    description: str | None = None

    video_type: str

    video_url: str | None = None

    notes_url: str | None = None

    order: int

    class Config:

        from_attributes = True


class LessonWithProgress(LessonResponse):

    completed: bool = False


class CourseProgressResponse(BaseModel):

    total_lessons: int

    completed_lessons: int

    progress: int

    assessment_unlocked: bool