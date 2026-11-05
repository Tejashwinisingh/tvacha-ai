
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers.auth import router as auth_router
from app.routers.skin_profile import router as skin_profile_router
from app.routers.skincare_agent import router as skincare_agent_router
from app.routers.chat_history import router as chat_history_router


app = FastAPI(
    title="TvachaAI API",
    description="AI-powered skincare platform",
    version="1.0.0"
)


# Allow React frontend to communicate with FastAPI
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Register authentication routes
app.include_router(auth_router)

# Register skin profile routes
app.include_router(skin_profile_router)

# Register TvachaAI agent routes
app.include_router(skincare_agent_router)

# Register chat history routes
app.include_router(chat_history_router)


@app.get("/")
def home():
    return {
        "message": "Welcome to TvachaAI API!"
    }
