from typing import Optional

from pydantic import BaseModel


class DashboardCourse(BaseModel):

    id: int

    title: str

    category: str

    format: str

    class Config:

        from_attributes = True


class DashboardEnrollment(BaseModel):

    id: int

    progress: int

    status: str

    course: DashboardCourse

    class Config:

        from_attributes = True


class DashboardResult(BaseModel):

    id: int

    percentage: float

    passed: bool

    class Config:

        from_attributes = True


class DashboardResponse(BaseModel):

    user_id: int

    name: str

    total_courses: int

    enrolled_courses: int

    completed_courses: int

    in_progress_courses: int

    overall_progress: float

    enrollments: list[DashboardEnrollment]

    recent_results: list[DashboardResult]

    class Config:

        from_attributes = True


class LeaderboardEntry(BaseModel):

    id: int

    name: str

    avatar: Optional[str] = None

    completed_courses: int

    completed_assessments: int

    progress: float

    xp: float

    rank: int

    class Config:

        from_attributes = True


class LeaderboardResponse(BaseModel):

    leaderboard: list[LeaderboardEntry]

    class Config:

        from_attributes = True