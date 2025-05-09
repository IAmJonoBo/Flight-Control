from sqlalchemy import Column, Integer, String
from app.database import Base


class CodeSmell(Base):
    __tablename__ = "code_smells"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(String)
    severity = Column(String)
    function_name = Column(String, nullable=True)  # Optionally link to a function
    file_path = Column(String, nullable=True)      # Optionally link to a file
    # Relationships to code entities can be normalized in future migrations
