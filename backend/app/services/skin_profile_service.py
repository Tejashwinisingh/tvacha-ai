
from sqlalchemy.orm import Session

from app.models.skin_profile import SkinProfile
from app.models.user import User

from app.schemas.skin_profile import (
    SkinProfileCreate,
    SkinProfileUpdate
)


def create_skin_profile(
    db: Session,
    current_user: User,
    profile_data: SkinProfileCreate
):
    # Check whether the user already has a skin profile
    existing_profile = db.query(SkinProfile).filter(
        SkinProfile.user_id == current_user.id
    ).first()

    if existing_profile:
        raise ValueError("Skin profile already exists")

    new_profile = SkinProfile(
        user_id=current_user.id,
        **profile_data.model_dump()
    )

    try:
        db.add(new_profile)
        db.commit()
        db.refresh(new_profile)

        return new_profile

    except Exception:
        db.rollback()
        raise


def get_skin_profile(
    db: Session,
    current_user: User
):
    return db.query(SkinProfile).filter(
        SkinProfile.user_id == current_user.id
    ).first()


def update_skin_profile(
    db: Session,
    current_user: User,
    profile_data: SkinProfileUpdate
):
    profile = get_skin_profile(db, current_user)

    if not profile:
        raise ValueError("Skin profile not found")

    update_data = profile_data.model_dump(exclude_unset=True)

    for field, value in update_data.items():
        setattr(profile, field, value)

    try:
        db.commit()
        db.refresh(profile)

        return profile

    except Exception:
        db.rollback()
        raise


def delete_skin_profile(
    db: Session,
    current_user: User
):
    profile = get_skin_profile(db, current_user)

    if not profile:
        raise ValueError("Skin profile not found")

    try:
        db.delete(profile)
        db.commit()

        return True

    except Exception:
        db.rollback()
        raise
