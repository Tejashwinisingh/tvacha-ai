
import logging

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_user
from app.db.database import get_db
from app.models.user import User

from app.schemas.agent import AgentChatRequest, AgentChatResponse

from app.ai.model_client import generate_ai_response

from app.services.skin_profile_service import get_skin_profile

from app.services.chat_service import (
    create_conversation,
    get_conversation_by_id,
    get_conversation_messages,
    save_chat_message
)

logger = logging.getLogger(__name__)

router = APIRouter(
    prefix="/api/skincare-agent",
    tags=["TvachaAI Agent"]
)


def build_profile_context(profile) -> str:
    """Convert saved skin profile into AI context."""

    if not profile:
        return ""

    return f"""
Skin type: {profile.skin_type or "Not specified"}
Skin concerns: {profile.skin_concerns or []}
Skin goals: {profile.skin_goals or []}
Allergies: {profile.allergies or []}
Preferred language: {profile.preferred_language or "en"}
Routine preference: {profile.routine_preference or "Not specified"}

Important:
Respect the user's allergies and preferences.
Do not assume missing information.
"""


@router.post(
    "/chat",
    response_model=AgentChatResponse
)
def chat_with_agent(
    body: AgentChatRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    message = body.message.strip()

    if not message:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Message cannot be empty."
        )

    try:
        # 1. Create or retrieve conversation
        if body.conversation_id is None:

            conversation = create_conversation(
                db=db,
                user_id=current_user.id
            )

        else:

            conversation = get_conversation_by_id(
                db=db,
                conversation_id=body.conversation_id,
                user_id=current_user.id
            )

            if not conversation:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Conversation not found."
                )

        # 2. Retrieve previous messages
        previous_messages = get_conversation_messages(
            db=db,
            conversation_id=conversation.id
        )

        # 3. Save user message
        save_chat_message(
            db=db,
            conversation_id=conversation.id,
            role="user",
            content=message
        )

        # 4. Get user's skin profile
        profile = get_skin_profile(
            db=db,
            current_user=current_user
        )

        profile_context = build_profile_context(profile)

        # 5. Build conversation context
        conversation_context = "\n".join(
            [
                f"{item.role}: {item.content}"
                for item in previous_messages
            ]
        )

        full_prompt = f"""
Previous conversation:
{conversation_context if conversation_context else "This is the beginning of the conversation."}

Current user message:
{message}
"""

        # 6. Generate Gemini response
        ai_response = generate_ai_response(
            prompt=full_prompt,
            profile_context=profile_context
        )

        # 7. Save AI response
        save_chat_message(
            db=db,
            conversation_id=conversation.id,
            role="assistant",
            content=ai_response
        )

        return AgentChatResponse(
            response=ai_response,
            agent_name="TvachaAI",
            conversation_id=conversation.id
        )

    except HTTPException:
        raise

    except Exception:

        db.rollback()

        logger.exception(
            "TvachaAI agent failed for user ID: %s",
            current_user.id
        )

        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="TvachaAI is temporarily unavailable. Please try again."
        )
