from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship

from app.database import Base


class Question(Base):
    __tablename__ = "questions"

    id = Column(Integer, primary_key=True, index=True)

    assessment_id = Column(
        Integer,
        ForeignKey("assessments.id")
    )

    question = Column(String(500), nullable=False)

    option_a = Column(String(255), nullable=False)

    option_b = Column(String(255), nullable=False)

    option_c = Column(String(255), nullable=False)

    option_d = Column(String(255), nullable=False)

    correct_answer = Column(String(1), nullable=False)

    assessment = relationship("Assessment")
