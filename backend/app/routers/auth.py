
import logging

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.core.dependencies import get_current_user
from app.core.config import settings
from app.models.user import User

from app.schemas.user import (
    UserCreate,
    UserResponse,
    UserLogin,
    Token,
    ForgotPasswordRequest,
    ResetPasswordRequest,
    ChangePasswordRequest
)

from app.services.auth_service import register_user, login_user

from app.services.password_service import (
    create_password_reset_token,
    reset_user_password,
    change_user_password
)

from app.services.email_verification_service import (
    create_email_verification_token,
    verify_email_token
)

from app.services.email_service import (
    send_password_reset_email,
    send_verification_email
)


logger = logging.getLogger(__name__)

router = APIRouter(
    prefix="/api/auth",
    tags=["Authentication"]
)


# USER REGISTRATION
@router.post(
    "/register",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED
)
async def register(
    user_data: UserCreate,
    db: Session = Depends(get_db)
):
    try:
        new_user = register_user(db, user_data)

        verification_token = create_email_verification_token(
            db,
            new_user
        )

        verification_link = (
            f"{settings.FRONTEND_URL}/verify-email"
            f"?token={verification_token}"
        )

        await send_verification_email(
            recipient_email=new_user.email,
            verification_link=verification_link
        )

        return new_user

    except ValueError as error:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=str(error)
        )

    except Exception:
        logger.exception("User registration or verification email failed")

        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Registration completed or email delivery failed. "
                   "Please try the resend verification option."
        )


# VERIFY EMAIL
@router.post("/verify-email")
def verify_email(
    token: str,
    db: Session = Depends(get_db)
):
    try:
        verify_email_token(db, token)

        return {
            "message": "Email verified successfully. You can now log in."
        }

    except ValueError as error:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(error)
        )

    except Exception:
        logger.exception("Email verification failed")

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Unable to verify email"
        )


# RESEND VERIFICATION EMAIL
@router.post("/resend-verification")
async def resend_verification(
    request: ForgotPasswordRequest,
    db: Session = Depends(get_db)
):
    try:
        user = db.query(User).filter(
            User.email == str(request.email)
        ).first()

        if user and user.is_active and not user.is_verified:

            verification_token = create_email_verification_token(
                db,
                user
            )

            verification_link = (
                f"{settings.FRONTEND_URL}/verify-email"
                f"?token={verification_token}"
            )

            await send_verification_email(
                recipient_email=user.email,
                verification_link=verification_link
            )

        return {
            "message": (
                "If the account requires verification, "
                "a verification email will be sent."
            )
        }

    except Exception:
        logger.exception("Resend verification email failed")

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Unable to send verification email"
        )


# USER LOGIN
@router.post(
    "/login",
    response_model=Token,
    status_code=status.HTTP_200_OK
)
def login(
    credentials: UserLogin,
    db: Session = Depends(get_db)
):
    try:
        return login_user(db, credentials)

    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
            headers={"WWW-Authenticate": "Bearer"}
        )


# GET LOGGED-IN USER PROFILE
@router.get(
    "/me",
    response_model=UserResponse
)
def get_my_profile(
    current_user=Depends(get_current_user)
):
    return current_user


# FORGOT PASSWORD
@router.post("/forgot-password")
async def forgot_password(
    request: ForgotPasswordRequest,
    db: Session = Depends(get_db)
):
    try:
        reset_token = create_password_reset_token(
            db,
            str(request.email)
        )

        if reset_token:
            reset_link = (
                f"{settings.FRONTEND_URL}/reset-password"
                f"?token={reset_token}"
            )

            await send_password_reset_email(
                recipient_email=str(request.email),
                reset_link=reset_link
            )

        return {
            "message": (
                "If the account exists, password reset "
                "instructions will be sent to your email."
            )
        }

    except Exception:
        logger.exception("Forgot password request failed")

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Unable to process password reset request"
        )


# RESET PASSWORD
@router.post("/reset-password")
def reset_password(
    request: ResetPasswordRequest,
    db: Session = Depends(get_db)
):
    try:
        reset_user_password(
            db,
            request.token,
            request.new_password
        )

        return {
            "message": "Password reset successfully"
        }

    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired reset token"
        )


# CHANGE PASSWORD
@router.post("/change-password")
def change_password(
    request: ChangePasswordRequest,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):
    try:
        change_user_password(
            db,
            current_user,
            request.current_password,
            request.new_password
        )

        return {
            "message": "Password changed successfully"
        }

    except ValueError as error:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(error)
        )
