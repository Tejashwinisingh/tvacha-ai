
from sqlalchemy.orm import Session

from app.models.user import User
from app.schemas.user import UserCreate, UserLogin
from app.core.security import (
    hash_password,
    verify_password,
    create_access_token
)


# REGISTER USER
def register_user(db: Session, user_data: UserCreate):

    existing_user = db.query(User).filter(
        User.email == user_data.email
    ).first()

    if existing_user:
        raise ValueError("Email is already registered")

    hashed_password = hash_password(user_data.password)

    new_user = User(
        full_name=user_data.full_name,
        email=user_data.email,
        hashed_password=hashed_password,
        auth_provider="email",
        is_active=True,
        is_verified=False
    )

    try:
        db.add(new_user)
        db.commit()
        db.refresh(new_user)

    except Exception:
        db.rollback()
        raise

    return new_user


# USER LOGIN
def login_user(db: Session, credentials: UserLogin):

    user = db.query(User).filter(
        User.email == credentials.email
    ).first()

    if (
        not user
        or not user.hashed_password
        or not verify_password(
            credentials.password,
            user.hashed_password
        )
    ):
        raise ValueError("Invalid email or password")

    if not user.is_active:
        raise ValueError("Invalid email or password")

    if not user.is_verified:
        raise ValueError("Please verify your email before logging in")

    access_token = create_access_token(
        data={"sub": str(user.id)}
    )

    return {
        "access_token": access_token,
        "token_type": "bearer"
    }
