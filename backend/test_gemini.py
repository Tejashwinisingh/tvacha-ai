
from app.ai.model_client import generate_ai_response

try:
    print("Connecting to Gemini...")

    response = generate_ai_response(
        "Hello! Introduce yourself as the AI assistant for TvachaAI in two sentences."
    )

    print("\nGemini response:")
    print(response)

except Exception as error:
    print("\nGemini connection failed:")
    print(error)
