from sqlalchemy import (
    Column,
    Integer,
    Boolean,
    ForeignKey,
    DateTime
)
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from app.database import Base


class Result(Base):
    __tablename__ = "results"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(
        Integer,
        ForeignKey("users.id")
    )

    assessment_id = Column(
        Integer,
        ForeignKey("assessments.id")
    )

    score = Column(Integer)

    percentage = Column(Integer)

    passed = Column(Boolean)

    submitted_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )

    user = relationship("User")

    assessment = relationship("Assessment")
