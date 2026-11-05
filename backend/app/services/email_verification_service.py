import secrets
import hashlib
from datetime import datetime, timedelta, timezone

from sqlalchemy.orm import Session

from app.models.user import User
from app.models.email_verification import EmailVerificationToken


def create_email_verification_token(db: Session, user: User):
    # Invalidate previous unused verification tokens
    db.query(EmailVerificationToken).filter(
        EmailVerificationToken.user_id == user.id,
        EmailVerificationToken.is_used == False
    ).update({"is_used": True})

    # Generate a secure random token
    raw_token = secrets.token_urlsafe(32)

    # Store only the hashed token
    token_hash = hashlib.sha256(
        raw_token.encode("utf-8")
    ).hexdigest()

    expires_at = datetime.now(timezone.utc) + timedelta(minutes=30)

    verification_record = EmailVerificationToken(
        user_id=user.id,
        token_hash=token_hash,
        expires_at=expires_at,
        is_used=False
    )

    try:
        db.add(verification_record)
        db.commit()
    except Exception:
        db.rollback()
        raise

    # Return the original token for the email link
    return raw_token


def verify_email_token(db: Session, raw_token: str):
    token_hash = hashlib.sha256(
        raw_token.encode("utf-8")
    ).hexdigest()

    verification_record = db.query(EmailVerificationToken).filter(
        EmailVerificationToken.token_hash == token_hash,
        EmailVerificationToken.is_used == False
    ).first()

    if not verification_record:
        raise ValueError("Invalid or already used verification link")

    if verification_record.expires_at <= datetime.now(timezone.utc):
        raise ValueError("Verification link has expired")

    user = db.query(User).filter(
        User.id == verification_record.user_id
    ).first()

    if not user or not user.is_active:
        raise ValueError("User account not found")

    try:
        user.is_verified = True
        verification_record.is_used = True

        db.query(EmailVerificationToken).filter(
            EmailVerificationToken.user_id == user.id,
            EmailVerificationToken.is_used == False
        ).update({"is_used": True})

        db.commit()
    except Exception:
        db.rollback()
        raise

    return user