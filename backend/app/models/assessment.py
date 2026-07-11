from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship

from app.database import Base


class Assessment(Base):
    __tablename__ = "assessments"

    id = Column(Integer, primary_key=True, index=True)

    course_id = Column(Integer, ForeignKey("courses.id"))

    title = Column(String(255), nullable=False)

    total_questions = Column(Integer, default=10)

    pass_percentage = Column(Integer, default=80)

    course = relationship("Course")
