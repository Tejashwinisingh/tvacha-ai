
from datetime import datetime, timezone

from sqlalchemy.orm import Session

from app.models.chat_conversation import ChatConversation
from app.models.chat_message import ChatMessage


# 1. Create a new conversation
def create_conversation(db: Session, user_id: int):
    conversation = ChatConversation(
        user_id=user_id,
        title="New Conversation"
    )

    db.add(conversation)
    db.commit()
    db.refresh(conversation)

    return conversation


# 2. Get all conversations of a user
def get_user_conversations(db: Session, user_id: int):
    return (
        db.query(ChatConversation)
        .filter(ChatConversation.user_id == user_id)
        .order_by(ChatConversation.updated_at.desc())
        .all()
    )


# 3. Get conversation by ID
def get_conversation_by_id(
    db: Session,
    conversation_id: int,
    user_id: int
):
    return (
        db.query(ChatConversation)
        .filter(
            ChatConversation.id == conversation_id,
            ChatConversation.user_id == user_id
        )
        .first()
    )


# 4. Delete conversation
def delete_conversation(
    db: Session,
    conversation_id: int,
    user_id: int
):
    conversation = get_conversation_by_id(
        db, conversation_id, user_id
    )

    if not conversation:
        return False

    db.delete(conversation)
    db.commit()

    return True


# 5. Save user or AI message
def save_chat_message(
    db: Session,
    conversation_id: int,
    role: str,
    content: str
):
    message = ChatMessage(
        conversation_id=conversation_id,
        role=role,
        content=content
    )

    db.add(message)

    conversation = (
        db.query(ChatConversation)
        .filter(ChatConversation.id == conversation_id)
        .first()
    )

    if conversation:
        conversation.updated_at = datetime.now(timezone.utc)

    db.commit()
    db.refresh(message)

    return message


# 6. Retrieve conversation messages
def get_conversation_messages(
    db: Session,
    conversation_id: int
):
    return (
        db.query(ChatMessage)
        .filter(ChatMessage.conversation_id == conversation_id)
        .order_by(ChatMessage.created_at.asc())
        .all()
    )
