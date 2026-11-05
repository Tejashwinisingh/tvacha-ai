
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    # Password reset configuration
    PASSWORD_RESET_EXPIRE_MINUTES: int = 15

    # Local development configuration
    DEBUG: bool = True

    # Brevo SMTP configuration
    MAIL_USERNAME: str = ""
    MAIL_PASSWORD: str = ""
    MAIL_FROM: str = ""
    MAIL_PORT: int = 587
    MAIL_SERVER: str = "smtp-relay.brevo.com"
    MAIL_STARTTLS: bool = True
    MAIL_SSL_TLS: bool = False
    MAIL_FROM_NAME: str = "TvachaAI"

    # Frontend configuration
    FRONTEND_URL: str = "http://localhost:5173"

    # AI configuration
    AI_PROVIDER: str = "gemini"
    AI_API_KEY: str = ""
    AI_MODEL: str = ""

    model_config = SettingsConfigDict(
        env_file=".env",
        extra="ignore"
    )


settings = Settings()
