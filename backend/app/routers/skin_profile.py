
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.core.dependencies import get_current_user
from app.models.user import User

from app.schemas.skin_profile import (
    SkinProfileCreate,
    SkinProfileUpdate,
    SkinProfileResponse
)

from app.services.skin_profile_service import (
    create_skin_profile,
    get_skin_profile,
    update_skin_profile,
    delete_skin_profile
)


router = APIRouter(
    prefix="/api/skin-profile",
    tags=["Skin Profile"]
)


# CREATE SKIN PROFILE
@router.post(
    "",
    response_model=SkinProfileResponse,
    status_code=status.HTTP_201_CREATED
)
def create_profile(
    profile_data: SkinProfileCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    try:
        return create_skin_profile(
            db,
            current_user,
            profile_data
        )

    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=str(e)
        )


# GET MY SKIN PROFILE
@router.get(
    "/me",
    response_model=SkinProfileResponse
)
def read_my_profile(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    profile = get_skin_profile(db, current_user)

    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Skin profile not found"
        )

    return profile


# UPDATE MY SKIN PROFILE
@router.put(
    "/me",
    response_model=SkinProfileResponse
)
def update_my_profile(
    profile_data: SkinProfileUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    try:
        return update_skin_profile(
            db,
            current_user,
            profile_data
        )

    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )


# DELETE MY SKIN PROFILE
@router.delete(
    "/me"
)
def remove_my_profile(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    try:
        delete_skin_profile(db, current_user)

        return {
            "message": "Skin profile deleted successfully"
        }

    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )
