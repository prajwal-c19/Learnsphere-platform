from pydantic import BaseModel, Field


class AssessmentCreate(BaseModel):
    course_id: int
    title: str = Field(..., min_length=3)
    total_questions: int = 10
    pass_percentage: int = 80


class AssessmentResponse(BaseModel):
    id: int
    course_id: int
    title: str
    total_questions: int
    pass_percentage: int

    class Config:
        from_attributes = True
