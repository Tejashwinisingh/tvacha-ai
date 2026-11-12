
import re
from uuid import UUID

from sqlalchemy.orm import Session, selectinload
from sqlalchemy.sql import func

from app.models.chat_conversation import ChatConversation
from app.models.chat_message import ChatMessage


# --------------------------------------------------
# GENERATE CONVERSATION TITLE
# --------------------------------------------------

def generate_conversation_title(message: str) -> str:

    message = re.sub(r"\s+", " ", message.strip())

    if not message:
        return "New Conversation"

    message = re.sub(
        r"^(hi|hello|hey)[,!\s]+",
        "",
        message,
        flags=re.IGNORECASE
    )

    title = re.split(r"(?<=[.!?])\s+", message)[0]
    title = title.strip(" .!?")

    words = title.split()

    if len(words) > 7:
        title = " ".join(words[:7]) + "..."

    if len(title) > 60:
        title = title[:57].rsplit(" ", 1)[0] + "..."

    return title or "New Conversation"


# --------------------------------------------------
# CREATE NEW CONVERSATION
# --------------------------------------------------

def create_conversation(
    db: Session,
    user_id: int,
    title: str = "New Conversation"
):

    conversation = ChatConversation(
        user_id=user_id,
        title=title
    )

    try:
        db.add(conversation)
        db.commit()
        db.refresh(conversation)

        return conversation

    except Exception:
        db.rollback()
        raise


# --------------------------------------------------
# GET ALL USER CONVERSATIONS
# --------------------------------------------------

def get_user_conversations(
    db: Session,
    user_id: int
):

    return (
        db.query(ChatConversation)
        .filter(ChatConversation.user_id == user_id)
        .order_by(
            ChatConversation.is_pinned.desc(),
            ChatConversation.last_message_at.desc()
        )
        .all()
    )


# --------------------------------------------------
# GET CONVERSATION BY UUID
# --------------------------------------------------

def get_conversation_by_id(
    db: Session,
    conversation_id: UUID,
    user_id: int
):

    return (
        db.query(ChatConversation)
        .options(selectinload(ChatConversation.messages))
        .filter(
            ChatConversation.id == conversation_id,
            ChatConversation.user_id == user_id
        )
        .first()
    )


# --------------------------------------------------
# GET MESSAGES FOR A CONVERSATION
# --------------------------------------------------

def get_conversation_messages(
    db: Session,
    conversation_id: UUID
):

    return (
        db.query(ChatMessage)
        .filter(ChatMessage.conversation_id == conversation_id)
        .order_by(ChatMessage.created_at.asc())
        .all()
    )


# --------------------------------------------------
# SAVE CHAT MESSAGE
# --------------------------------------------------

def save_chat_message(
    db: Session,
    conversation_id: UUID,
    role: str,
    content: str
):

    conversation = (
        db.query(ChatConversation)
        .filter(ChatConversation.id == conversation_id)
        .first()
    )

    if not conversation:
        return None

    # Generate title from the first user message.
    # Check before adding the new message to avoid autoflush issues.
    if role == "user" and conversation.title == "New Conversation":

        existing_message = (
            db.query(ChatMessage.id)
            .filter(
                ChatMessage.conversation_id == conversation_id,
                ChatMessage.role == "user"
            )
            .first()
        )

        if not existing_message:
            conversation.title = generate_conversation_title(content)

    message = ChatMessage(
        conversation_id=conversation_id,
        role=role,
        content=content
    )

    try:
        db.add(message)

        conversation.updated_at = func.now()
        conversation.last_message_at = func.now()

        db.commit()
        db.refresh(message)

        return message

    except Exception:
        db.rollback()
        raise


# --------------------------------------------------
# RENAME / PIN / UNPIN CONVERSATION
# --------------------------------------------------

def update_conversation(
    db: Session,
    conversation_id: UUID,
    user_id: int,
    title: str | None = None,
    is_pinned: bool | None = None
):

    conversation = (
        db.query(ChatConversation)
        .filter(
            ChatConversation.id == conversation_id,
            ChatConversation.user_id == user_id
        )
        .first()
    )

    if not conversation:
        return None

    if title is not None:
        conversation.title = title.strip()

    if is_pinned is not None:
        conversation.is_pinned = is_pinned

    conversation.updated_at = func.now()

    try:
        db.commit()
        db.refresh(conversation)

        return conversation

    except Exception:
        db.rollback()
        raise


# --------------------------------------------------
# DELETE CONVERSATION
# --------------------------------------------------

def delete_conversation(
    db: Session,
    conversation_id: UUID,
    user_id: int
):

    conversation = (
        db.query(ChatConversation)
        .filter(
            ChatConversation.id == conversation_id,
            ChatConversation.user_id == user_id
        )
        .first()
    )

    if not conversation:
        return False

    try:
        db.delete(conversation)
        db.commit()

        return True

    except Exception:
        db.rollback()
        raise
