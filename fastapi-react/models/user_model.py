from sqlalchemy import Column, Integer, String, Enum
from database.connection import Base
from enum import Enum as PyEnum

class Role(str, PyEnum):
    USER = "User"
    MANAGER = "Manager"
    ADMIN = "Admin"

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    password = Column(String)
    role = Column(Enum(Role), default=Role.USER)
