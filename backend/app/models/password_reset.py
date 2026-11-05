from sqlalchemy import Column, Integer, ForeignKey, DateTime, Boolean, String
from sqlalchemy.sql import func

from app.db.database import Base


class PasswordResetToken(Base):
    __tablename__ = "password_reset_tokens"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(
        Integer,
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False
    )

    token_hash = Column(String(255), nullable=False, unique=True)

    expires_at = Column(DateTime(timezone=True), nullable=False)

    is_used = Column(Boolean, default=False, nullable=False)

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )