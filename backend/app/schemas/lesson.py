from pydantic import BaseModel, Field


class LessonCreate(BaseModel):
    course_id: int
    title: str = Field(..., min_length=3)
    description: str | None = None
    video_url: str | None = None
    notes_url: str | None = None
    order: int = 1


class LessonResponse(BaseModel):
    id: int
    course_id: int
    title: str
    description: str | None = None
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
