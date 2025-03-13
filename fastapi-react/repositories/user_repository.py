from sqlalchemy.orm import Session
from models.user_model import User
from schemas.user_schema import UserCreate
from security.settings import hash_password

def create_user(db: Session, user: UserCreate):
    db_user = User(username=user.username, password=hash_password(user.password))
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def get_user_by_username(db: Session, username: str):
    return db.query(User).filter(User.username == username).first()