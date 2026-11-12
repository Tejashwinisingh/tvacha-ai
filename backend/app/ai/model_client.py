
import logging
import time

from google import genai
from google.genai import errors, types

from app.core.config import settings
from app.agents.agent_prompts import TVACHAI_SYSTEM_PROMPT


logger = logging.getLogger(__name__)

MAX_RETRIES = 3
RETRY_DELAY = 2


def get_gemini_client():

    if settings.AI_PROVIDER.lower() != "gemini":
        raise ValueError("Unsupported AI provider.")

    if not settings.AI_API_KEY:
        raise ValueError("Gemini API key is missing.")

    return genai.Client(api_key=settings.AI_API_KEY)


def generate_ai_response(
    prompt: str,
    profile_context: str = "",
    image_attachments: list[dict] | None = None
) -> str:

    client = get_gemini_client()

    text_content = f"""
{TVACHAI_SYSTEM_PROMPT}

USER SKIN PROFILE:
{profile_context if profile_context else "No saved skin profile is available. Ask the user relevant questions when needed."}

USER MESSAGE:
{prompt}
"""

    # Build Gemini content parts
    contents = [
        types.Part.from_text(text=text_content)
    ]

    # Add image attachments when provided
    for attachment in image_attachments or []:

        image_data = attachment["data"]
        mime_type = attachment["mime_type"]

        contents.append(
            types.Part.from_bytes(
                data=image_data,
                mime_type=mime_type
            )
        )

    for attempt in range(1, MAX_RETRIES + 1):

        try:
            response = client.models.generate_content(
                model=settings.AI_MODEL,
                contents=contents
            )

            if response.text:
                return response.text.strip()

            logger.warning("Gemini returned an empty response.")

            return "I'm sorry, I couldn't generate a response. Please try again."

        except errors.ServerError as exc:

            logger.warning(
                "Gemini server error on attempt %s/%s: %s",
                attempt,
                MAX_RETRIES,
                exc
            )

            if attempt == MAX_RETRIES:
                logger.error("Gemini remained unavailable after retries.")
                raise

            delay = RETRY_DELAY * (2 ** (attempt - 1))
            time.sleep(delay)

    raise RuntimeError("TvachaAI is temporarily unavailable.")
