from pydantic import BaseModel, field_validator


class QuestionCreate(BaseModel):
    assessment_id: int
    question: str

    option_a: str
    option_b: str
    option_c: str
    option_d: str

    correct_answer: str

    @field_validator("correct_answer")
    @classmethod
    def validate_answer(cls, value):

        value = value.upper()

        if value not in ["A", "B", "C", "D"]:
            raise ValueError(
                "Correct answer must be A, B, C or D."
            )

        return value


class QuestionResponse(BaseModel):
    id: int
    assessment_id: int
    question: str
    option_a: str
    option_b: str
    option_c: str
    option_d: str

    class Config:
        from_attributes = True
