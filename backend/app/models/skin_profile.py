
from sqlalchemy import (
    Column,
    Integer,
    String,
    ForeignKey,
    DateTime,
    JSON
)
from sqlalchemy.sql import func

from app.db.database import Base


class SkinProfile(Base):
    __tablename__ = "skin_profiles"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(
        Integer,
        ForeignKey("users.id", ondelete="CASCADE"),
        unique=True,
        nullable=False,
        index=True
    )

    # Basic skin information
    skin_type = Column(String(30), nullable=True)

    # Multiple selections
    skin_concerns = Column(JSON, nullable=True)
    skin_goals = Column(JSON, nullable=True)
    allergies = Column(JSON, nullable=True)

    # User preferences
    preferred_language = Column(
        String(10),
        default="en",
        nullable=False
    )

    routine_preference = Column(String(100), nullable=True)

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )

    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now()
    )
