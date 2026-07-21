from sqlalchemy import (
    Column,
    Integer,
    String,
    ForeignKey,
)
from sqlalchemy.orm import relationship

from app.database import Base


class Lesson(Base):
    __tablename__ = "lessons"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    course_id = Column(
        Integer,
        ForeignKey("courses.id"),
        nullable=False
    )

    title = Column(
        String(255),
        nullable=False
    )

    description = Column(
        String(1000),
        nullable=True
    )

    # -----------------------------------------
    # Video Source
    # youtube -> YouTube Link
    # upload  -> Uploaded Video
    # -----------------------------------------
    video_type = Column(
        String(20),
        nullable=False,
        default="youtube"
    )

    # Stores either:
    # https://youtube.com/...
    # OR
    # /uploads/videos/filename.mp4
    video_url = Column(
        String(500),
        nullable=True
    )

    # Future support for lesson notes
    notes_url = Column(
        String(500),
        nullable=True
    )

    order = Column(
        Integer,
        default=1
    )

    course = relationship("Course")