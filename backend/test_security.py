
from app.core.security import hash_password, verify_password

password = "TvachaAI@123"

# Convert password into a hash
hashed = hash_password(password)

print("Original password:", password)
print("Hashed password:", hashed)

# Verify the correct password
print("Correct password:", verify_password(password, hashed))

# Verify an incorrect password
print("Wrong password:", verify_password("WrongPassword", hashed))
