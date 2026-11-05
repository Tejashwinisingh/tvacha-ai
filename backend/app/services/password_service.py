
import secrets
import hashlib

from datetime import datetime, timedelta, timezone
from sqlalchemy.orm import Session

from app.core.security import hash_password, verify_password
from app.core.config import settings

from app.models.user import User
from app.models.password_reset import PasswordResetToken


# CREATE PASSWORD RESET TOKEN
def create_password_reset_token(
    db: Session,
    email: str
):
    user = db.query(User).filter(
        User.email == email
    ).first()

    if not user or not user.is_active:
        return None

    # Invalidate previous unused reset tokens
    db.query(PasswordResetToken).filter(
        PasswordResetToken.user_id == user.id,
        PasswordResetToken.is_used == False
    ).update(
        {"is_used": True},
        synchronize_session=False
    )

    # Generate secure random token
    raw_token = secrets.token_urlsafe(32)

    # Store only the SHA-256 hash
    token_hash = hashlib.sha256(
        raw_token.encode("utf-8")
    ).hexdigest()

    expires_at = datetime.now(timezone.utc) + timedelta(
        minutes=settings.PASSWORD_RESET_EXPIRE_MINUTES
    )

    reset_record = PasswordResetToken(
        user_id=user.id,
        token_hash=token_hash,
        expires_at=expires_at,
        is_used=False
    )

    try:
        db.add(reset_record)
        db.commit()

    except Exception:
        db.rollback()
        raise

    # Return raw token internally for email delivery
    return raw_token


# RESET USER PASSWORD
def reset_user_password(
    db: Session,
    raw_token: str,
    new_password: str
):
    token_hash = hashlib.sha256(
        raw_token.encode("utf-8")
    ).hexdigest()

    reset_record = db.query(PasswordResetToken).filter(
        PasswordResetToken.token_hash == token_hash,
        PasswordResetToken.is_used == False
    ).first()

    if not reset_record:
        raise ValueError("Invalid or expired reset token")

    if reset_record.expires_at <= datetime.now(timezone.utc):
        raise ValueError("Invalid or expired reset token")

    user = db.query(User).filter(
        User.id == reset_record.user_id
    ).first()

    if not user or not user.is_active:
        raise ValueError("Invalid or expired reset token")

    try:
        user.hashed_password = hash_password(new_password)

        # Invalidate all outstanding reset tokens
        db.query(PasswordResetToken).filter(
            PasswordResetToken.user_id == user.id,
            PasswordResetToken.is_used == False
        ).update(
            {"is_used": True},
            synchronize_session=False
        )

        db.commit()

    except Exception:
        db.rollback()
        raise

    return True


# CHANGE USER PASSWORD
def change_user_password(
    db: Session,
    user: User,
    current_password: str,
    new_password: str
):
    if not user.hashed_password or not verify_password(
        current_password,
        user.hashed_password
    ):
        raise ValueError("Current password is incorrect")

    if verify_password(new_password, user.hashed_password):
        raise ValueError("New password must be different")

    try:
        user.hashed_password = hash_password(new_password)

        # Invalidate outstanding reset tokens
        db.query(PasswordResetToken).filter(
            PasswordResetToken.user_id == user.id,
            PasswordResetToken.is_used == False
        ).update(
            {"is_used": True},
            synchronize_session=False
        )

        db.commit()

    except Exception:
        db.rollback()
        raise

    return True
