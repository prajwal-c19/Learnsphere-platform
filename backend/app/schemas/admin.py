from datetime import datetime
from pydantic import BaseModel


class AdminDashboardResponse(BaseModel):
    total_users: int
    total_learners: int
    total_admins: int

    total_courses: int

    total_assessments: int

    total_questions: int

    quiz_attempts: int

    average_score: float

    pass_rate: float


class UserResponse(BaseModel):

    id: int

    name: str

    email: str

    role: str

    is_verified: bool

    created_at: datetime

    class Config:

        from_attributes = True
