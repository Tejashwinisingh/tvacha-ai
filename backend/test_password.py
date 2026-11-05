
from getpass import getpass

from app.core.security import verify_password
from app.db.database import SessionLocal
from app.models.user import User


db = SessionLocal()

try:
    # Enter your registered email
    email = input("Enter your registered email: ").strip().lower()

    user = db.query(User).filter(
        User.email == email
    ).first()

    if not user:
        print("User not found. Check your registered email.")

    else:
        print("\nUser found successfully!")
        print("User ID:", user.id)
        print("Account active:", user.is_active)
        print("Email verified:", user.is_verified)

        # Password input will remain hidden
        entered_password = input("Enter your password: ")

        if not user.hashed_password:
            print("This account does not have a password.")
        else:
            result = verify_password(
                entered_password,
                user.hashed_password
            )

            if result:
                print("\nPassword verification: TRUE")
                print("Your password matches the stored password hash.")
            else:
                print("\nPassword verification: FALSE")
                print("Your entered password does not match the stored hash.")

finally:
    db.close()
