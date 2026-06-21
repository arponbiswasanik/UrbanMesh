from sqlmodel import SQLModel, Field
from datetime import datetime
import uuid

class Issue(SQLModel, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    title: str
    description: str | None = None
    latitude: float
    longitude: float
    category: str = "Other"
    status: str = "Pending"
    priority: str = "Medium"
    user_id: uuid.UUID = Field(foreign_key="user.id")
    created_at: datetime = Field(default_factory=datetime.utcnow)

class User(SQLModel, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    email: str = Field(index=True, unique=True)
    full_name: str
    hashed_password: str
    avatar: str | None = None
    is_admin: bool = False 
    created_at: datetime = Field(default_factory=datetime.utcnow)