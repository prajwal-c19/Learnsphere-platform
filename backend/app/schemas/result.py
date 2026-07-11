from pydantic import BaseModel
from typing import Dict


class QuizSubmission(BaseModel):
    assessment_id: int
    answers: Dict[int, str]


class ResultResponse(BaseModel):
    score: int
    percentage: float
    passed: bool
