
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_user
from app.db.database import get_db
from app.models.user import User

from app.schemas.chat import (
    ChatConversationCreate,
    ChatConversationResponse,
)

from app.services.chat_service import (
    create_conversation,
    get_user_conversations,
    get_conversation_by_id,
    delete_conversation,
)


router = APIRouter(
    prefix="/api/chat",
    tags=["Chat History"]
)


# 1. Create a new conversation
@router.post(
    "/conversations",
    response_model=ChatConversationResponse,
    status_code=status.HTTP_201_CREATED
)
def create_new_conversation(
    body: ChatConversationCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return create_conversation(
        db=db,
        user_id=current_user.id
    )


# 2. Get all conversations of logged-in user
@router.get(
    "/conversations",
    response_model=list[ChatConversationResponse]
)
def get_all_conversations(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return get_user_conversations(
        db=db,
        user_id=current_user.id
    )


# 3. Get a conversation by ID
@router.get(
    "/conversations/{conversation_id}",
    response_model=ChatConversationResponse
)
def get_conversation(
    conversation_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    conversation = get_conversation_by_id(
        db=db,
        conversation_id=conversation_id,
        user_id=current_user.id
    )

    if not conversation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Conversation not found."
        )

    return conversation


# 4. Delete a conversation
@router.delete(
    "/conversations/{conversation_id}"
)
def remove_conversation(
    conversation_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    deleted = delete_conversation(
        db=db,
        conversation_id=conversation_id,
        user_id=current_user.id
    )

    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Conversation not found."
        )

    return {
        "message": "Conversation deleted successfully."
    }
