from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from app.database import Base


class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    full_name = Column(String, nullable=True)
    hashed_password = Column(String, nullable=False)
    # Relationship to feedback (if Feedback model exists)
    feedback = relationship("Feedback", back_populates="user", cascade="all, delete-orphan", lazy="dynamic")
    # For future fields/relationships, add via Alembic migrations as needed. Current model is complete for MVP.
