
from uuid import UUID

from pydantic import BaseModel, Field


class AgentChatRequest(BaseModel):

    message: str = Field(
        ...,
        min_length=1,
        max_length=2000,
        description="Message sent by the user"
    )

    conversation_id: UUID | None = Field(
        default=None,
        description="Existing conversation UUID. Leave empty to start a new conversation."
    )


class AgentChatResponse(BaseModel):

    response: str

    agent_name: str = "TvachaAI"

    conversation_id: UUID
