from sqlalchemy import Column, Integer, Boolean, ForeignKey, DateTime
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from app.database import Base


class LessonProgress(Base):
    __tablename__ = "lesson_progress"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(
        Integer,
        ForeignKey("users.id")
    )

    lesson_id = Column(
        Integer,
        ForeignKey("lessons.id")
    )

    completed = Column(Boolean, default=False)

    completed_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )

    user = relationship("User")

    lesson = relationship("Lesson")
