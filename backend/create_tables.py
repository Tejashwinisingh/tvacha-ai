from app.db.database import Base, engine

# Import all database models
from app.models.user import User
from app.models.password_reset import PasswordResetToken
from app.models.email_verification import EmailVerificationToken
from app.models.skin_profile import SkinProfile
from app.models.chat_conversation import ChatConversation
from app.models.chat_message import ChatMessage

# Create all registered database tables
Base.metadata.create_all(bind=engine)

print("TvachaAI database tables created successfully!")