from pydantic import BaseModel, EmailStr, Field, ConfigDict

class UserCreate(BaseModel):
    full_name: str = Field(min_length=2, max_length=100)
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)

class UserResponse(BaseModel):
    id: int
    full_name: str
    email: EmailStr
    auth_provider: str
    is_active: bool
    is_verified: bool

    model_config = ConfigDict(from_attributes=True)

class UserLogin(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    
class ForgotPasswordRequest(BaseModel):
    email: EmailStr


class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str = Field(min_length=8, max_length=128)


class ChangePasswordRequest(BaseModel):
    current_password: str = Field(min_length=8, max_length=128)
    new_password: str = Field(min_length=8, max_length=128)
