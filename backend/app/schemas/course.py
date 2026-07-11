from pydantic import BaseModel, Field


class CourseCreate(BaseModel):
    title: str = Field(..., min_length=3)
    description: str
    category: str
    duration: str
    format: str
    thumbnail: str | None = None
    content_url: str | None = None


class CourseResponse(CourseCreate):
    id: int
    published: bool

    class Config:
        from_attributes = True
