
from google import genai

from app.core.config import settings
from app.agents.agent_prompts import TVACHAI_SYSTEM_PROMPT


def get_gemini_client():

    if settings.AI_PROVIDER.lower() != "gemini":
        raise ValueError("Unsupported AI provider.")

    if not settings.AI_API_KEY:
        raise ValueError("Gemini API key is missing.")

    return genai.Client(api_key=settings.AI_API_KEY)


def generate_ai_response(
    prompt: str,
    profile_context: str = ""
) -> str:

    client = get_gemini_client()

    contents = f"""
{TVACHAI_SYSTEM_PROMPT}

USER SKIN PROFILE:
{profile_context if profile_context else "No saved skin profile is available. Ask the user relevant questions when needed."}

USER MESSAGE:
{prompt}
"""

    response = client.models.generate_content(
        model=settings.AI_MODEL,
        contents=contents
    )

    return response.text or "I'm sorry, I couldn't generate a response."
