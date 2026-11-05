
from fastapi_mail import FastMail, MessageSchema, ConnectionConfig, MessageType

from app.core.config import settings


mail_config = ConnectionConfig(
    MAIL_USERNAME=settings.MAIL_USERNAME,
    MAIL_PASSWORD=settings.MAIL_PASSWORD,
    MAIL_FROM=settings.MAIL_FROM,
    MAIL_PORT=settings.MAIL_PORT,
    MAIL_SERVER=settings.MAIL_SERVER,
    MAIL_STARTTLS=settings.MAIL_STARTTLS,
    MAIL_SSL_TLS=settings.MAIL_SSL_TLS,
    USE_CREDENTIALS=True,
    VALIDATE_CERTS=True,
    MAIL_FROM_NAME=settings.MAIL_FROM_NAME
)


# Password Reset Email
async def send_password_reset_email(
    recipient_email: str,
    reset_link: str
):
    message = MessageSchema(
        subject="Reset Your TvachaAI Password",
        recipients=[recipient_email],
        body=f"""
        <html>
            <body style="font-family: Arial, sans-serif; color: #333;">
                <h2>Reset Your TvachaAI Password 🌿</h2>

                <p>Hello,</p>

                <p>
                    We received a request to reset your TvachaAI password.
                </p>

                <p>
                    Click the button below to create a new password:
                </p>

                <a href="{reset_link}"
                   style="
                     display: inline-block;
                     padding: 12px 24px;
                     background-color: #387b55;
                     color: white;
                     text-decoration: none;
                     border-radius: 6px;
                   ">
                    Reset My Password
                </a>

                <p>
                    This link expires in
                    {settings.PASSWORD_RESET_EXPIRE_MINUTES} minutes.
                </p>

                <p>
                    If you did not request this, you can ignore this email.
                </p>

                <p>Regards,<br>TvachaAI Team 🌿</p>
            </body>
        </html>
        """,
        subtype=MessageType.html
    )

    mailer = FastMail(mail_config)
    await mailer.send_message(message)


# Email Verification
async def send_verification_email(
    recipient_email: str,
    verification_link: str
):
    message = MessageSchema(
        subject="Verify Your TvachaAI Email",
        recipients=[recipient_email],
        body=f"""
        <html>
            <body style="font-family: Arial, sans-serif; color: #333;">

                <h2>Welcome to TvachaAI! 🌿</h2>

                <p>Hello,</p>

                <p>
                    Thank you for registering with TvachaAI.
                </p>

                <p>
                    Please verify your email address by clicking below:
                </p>

                <a href="{verification_link}"
                   style="
                     display: inline-block;
                     padding: 12px 24px;
                     background-color: #387b55;
                     color: white;
                     text-decoration: none;
                     border-radius: 6px;
                   ">
                    Verify My Email
                </a>

                <p>
                    This verification link expires in 30 minutes.
                </p>

                <p>
                    If you did not create this account, please ignore this email.
                </p>

                <p>Regards,<br>TvachaAI Team 🌿</p>

            </body>
        </html>
        """,
        subtype=MessageType.html
    )

    mailer = FastMail(mail_config)
    await mailer.send_message(message)
