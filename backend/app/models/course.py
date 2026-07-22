from sqlalchemy import Column, Integer, String, Boolean, DateTime
from sqlalchemy.sql import func

from app.database import Base


class Course(Base):
    __tablename__ = "courses"

    id = Column(Integer, primary_key=True, index=True)

    title = Column(String(255), nullable=False)

    description = Column(String(1000), nullable=False)

    category = Column(String(100), nullable=False)

    duration = Column(Integer, nullable=False)

    format = Column(String(20), nullable=False)   # Video or PDF

    thumbnail = Column(String(255), nullable=True)

    content_url = Column(String(255), nullable=True)

    published = Column(Boolean, default=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
