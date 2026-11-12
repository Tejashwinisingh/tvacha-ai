
from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


# CREATE CONVERSATION
class ChatConversationCreate(BaseModel):
    title: str = "New Conversation"


# UPDATE CONVERSATION
class ChatConversationUpdate(BaseModel):
    title: str | None = Field(
        default=None,
        min_length=1,
        max_length=200
    )

    is_pinned: bool | None = None


# CONVERSATION RESPONSE
class ChatConversationResponse(BaseModel):
    id: UUID
    user_id: int
    title: str
    is_pinned: bool
    created_at: datetime
    updated_at: datetime
    last_message_at: datetime

    model_config = ConfigDict(from_attributes=True)


# CREATE MESSAGE
class ChatMessageCreate(BaseModel):
    role: str
    content: str


# MESSAGE RESPONSE
class ChatMessageResponse(BaseModel):
    id: int
    conversation_id: UUID
    role: str
    content: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


# CONVERSATION DETAIL
class ChatConversationDetail(ChatConversationResponse):
    messages: list[ChatMessageResponse] = Field(
        default_factory=list
    )
