
from datetime import datetime
from pydantic import BaseModel, ConfigDict


# Create conversation request
class ChatConversationCreate(BaseModel):
    title: str = "New Conversation"


# Conversation response
class ChatConversationResponse(BaseModel):
    id: int
    user_id: int
    title: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


# Save message request
class ChatMessageCreate(BaseModel):
    role: str
    content: str


# Message response
class ChatMessageResponse(BaseModel):
    id: int
    conversation_id: int
    role: str
    content: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


# Conversation with its messages
class ChatConversationDetail(ChatConversationResponse):
    messages: list[ChatMessageResponse] = []
