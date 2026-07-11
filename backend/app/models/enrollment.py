from sqlalchemy import Column, Integer, ForeignKey, String, DateTime
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from app.database import Base


class Enrollment(Base):
    __tablename__ = "enrollments"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(Integer, ForeignKey("users.id"))

    course_id = Column(Integer, ForeignKey("courses.id"))

    progress = Column(Integer, default=0)

    status = Column(String(30), default="Enrolled")

    enrolled_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User")

    course = relationship("Course")
