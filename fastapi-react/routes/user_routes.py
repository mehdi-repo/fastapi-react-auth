from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database.connection import get_db
from models.user_model import User
from schemas.user_schema import UserCreate, UserLogin
from repositories.user_repository import create_user, get_user_by_username
from security.settings import  admin_required, manager_required, user_required, validate_password, verify_password, create_access_token, verify_token
import datetime

user_router = APIRouter()

@user_router.post("/register")
def register(user: UserCreate, db: Session = Depends(get_db)):
    validate_password(user.password)
    if get_user_by_username(db, user.username):
        raise HTTPException(status_code=400, detail="Username already registered")
    create_user(db, user)
    return {"message": "User created successfully"}


@user_router.post("/login")
def login(user: UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.username == user.username).first()

    if not db_user:
        raise HTTPException(status_code=400, detail="Invalid credentials")

    if not verify_password(user.password, db_user.password):
        raise HTTPException(status_code=400, detail="Invalid credentials")

    access_token = create_access_token(
        data={"sub": db_user.username, "role": db_user.role},
        expires_delta=datetime.timedelta(minutes=15)
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "role": db_user.role
    }


    
@user_router.get("/users-dash")
async def get_user(payload: dict = Depends(user_required)):
    try:
        return {"sub": payload.get("sub")}
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@user_router.get("/manager-dash")
async def get_manager(payload: dict = Depends(manager_required)):
    try:
        return {"sub": payload.get("sub")}
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@user_router.get("/admin-dash")
async def get_Admin(payload: dict = Depends(admin_required)):
    try:
        return {"sub": payload.get("sub")}
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))        