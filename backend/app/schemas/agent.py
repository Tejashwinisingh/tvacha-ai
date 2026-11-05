
from pydantic import BaseModel, Field


class AgentChatRequest(BaseModel):
    message: str = Field(
        ...,
        min_length=1,
        max_length=2000,
        description="Message sent by the user"
    )

    conversation_id: int | None = Field(
        default=None,
        description="Existing conversation ID. Leave empty to start a new conversation."
    )


class AgentChatResponse(BaseModel):
    response: str
    agent_name: str = "TvachaAI"
    conversation_id: int
