
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.openapi.utils import get_openapi

from app.routers.auth import router as auth_router
from app.routers.skin_profile import router as skin_profile_router
from app.routers.skincare_agent import router as skincare_agent_router
from app.routers.chat_history import router as chat_history_router


app = FastAPI(
    title="TvachaAI API",
    description="AI-powered skincare platform",
    version="1.0.0"
)


# ==========================================================
# CORS CONFIGURATION
# ==========================================================

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


# ==========================================================
# REGISTER ROUTERS
# ==========================================================

app.include_router(auth_router)

app.include_router(skin_profile_router)

app.include_router(skincare_agent_router)

app.include_router(chat_history_router)


# ==========================================================
# CUSTOM OPENAPI SCHEMA
# ==========================================================

def custom_openapi():

    if app.openapi_schema:
        return app.openapi_schema

    openapi_schema = get_openapi(
        title=app.title,
        version=app.version,
        description=app.description,
        routes=app.routes,
    )

    # Fix Swagger file upload schema
    upload_schema_name = (
        "Body_chat_with_attachments_api_skincare_agent_chat_with_attachments_post"
    )

    upload_schema = (
        openapi_schema
        .get("components", {})
        .get("schemas", {})
        .get(upload_schema_name)
    )

    if upload_schema:

        files_property = (
            upload_schema
            .get("properties", {})
            .get("files")
        )

        if files_property:

            items = files_property.get("items", {})

            items.pop("contentMediaType", None)

            items["format"] = "binary"

    app.openapi_schema = openapi_schema

    return app.openapi_schema


app.openapi = custom_openapi


# ==========================================================
# HOME ROUTE
# ==========================================================

@app.get("/")
def home():

    return {
        "message": "Welcome to TvachaAI API!"
    }
