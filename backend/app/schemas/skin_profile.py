
from typing import List, Optional
from pydantic import BaseModel, Field


class SkinProfileCreate(BaseModel):
    skin_type: Optional[str] = Field(default=None, max_length=30)
    skin_concerns: Optional[List[str]] = None
    skin_goals: Optional[List[str]] = None
    allergies: Optional[List[str]] = None
    preferred_language: str = Field(default="en", max_length=10)
    routine_preference: Optional[str] = Field(default=None, max_length=100)


class SkinProfileUpdate(BaseModel):
    skin_type: Optional[str] = Field(default=None, max_length=30)
    skin_concerns: Optional[List[str]] = None
    skin_goals: Optional[List[str]] = None
    allergies: Optional[List[str]] = None
    preferred_language: Optional[str] = Field(default=None, max_length=10)
    routine_preference: Optional[str] = Field(default=None, max_length=100)


class SkinProfileResponse(BaseModel):
    id: int
    user_id: int
    skin_type: Optional[str] = None
    skin_concerns: Optional[List[str]] = None
    skin_goals: Optional[List[str]] = None
    allergies: Optional[List[str]] = None
    preferred_language: str
    routine_preference: Optional[str] = None

    model_config = {"from_attributes": True}
