
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_user
from app.db.database import get_db
from app.models.user import User

from app.schemas.chat import (
    ChatConversationCreate,
    ChatConversationResponse,
    ChatConversationDetail,
    ChatConversationUpdate
)

from app.services.chat_service import (
    create_conversation,
    get_user_conversations,
    get_conversation_by_id,
    update_conversation,
    delete_conversation
)


router = APIRouter(
    prefix="/api/chat",
    tags=["Chat History"]
)


# 1. Create new conversation
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
    title = body.title.strip()

    if not title:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Conversation title cannot be empty."
        )

    return create_conversation(
        db=db,
        user_id=current_user.id,
        title=title
    )


# 2. Get all conversations
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


# 3. Open conversation with all messages
@router.get(
    "/conversations/{conversation_id}",
    response_model=ChatConversationDetail
)
def get_conversation(
    conversation_id: UUID,
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


# 4. Rename or pin/unpin conversation
@router.patch(
    "/conversations/{conversation_id}",
    response_model=ChatConversationResponse
)
def edit_conversation(
    conversation_id: UUID,
    body: ChatConversationUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if body.title is None and body.is_pinned is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Provide a title or pin status to update."
        )

    if body.title is not None and not body.title.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Conversation title cannot be empty."
        )

    conversation = update_conversation(
        db=db,
        conversation_id=conversation_id,
        user_id=current_user.id,
        title=body.title,
        is_pinned=body.is_pinned
    )

    if not conversation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Conversation not found."
        )

    return conversation


# 5. Delete conversation
@router.delete("/conversations/{conversation_id}")
def remove_conversation(
    conversation_id: UUID,
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
