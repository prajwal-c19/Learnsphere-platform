from pydantic import BaseModel, Field


class CourseCreate(BaseModel):
    title: str = Field(..., min_length=3)
    description: str
    category: str
    duration: int = Field(
    ...,
    gt=0,
    description="Course duration in minutes"
    )
    format: str
    thumbnail: str | None = None



class CourseResponse(CourseCreate):
    id: int
    published: bool

    class Config:
        from_attributes = True

class GenerateDescriptionRequest(BaseModel):

    course_name: str = Field(
        ...,
        min_length=3,
        max_length=255
    )

class GenerateThumbnailRequest(BaseModel):

    title: str = Field(
        ...,
        min_length=3,
        max_length=255
    )

    category: str