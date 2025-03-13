from fastapi import Depends, HTTPException, status
from passlib.context import CryptContext
import jwt
import datetime
import os
from dotenv import load_dotenv
from fastapi.security import OAuth2PasswordBearer
import secrets
from pathlib import Path
import re



# Load environment variables from .env file
load_dotenv()

# Secure OAuth2 Password Bearer
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/login")

# Secure Password Hashing: Argon2 instead of bcrypt
pwd_context = CryptContext(schemes=["argon2"], deprecated="auto")

# Secure JWT Configuration
SECRET_KEY = os.getenv("SECRET_KEY", secrets.token_hex(32))  # Generate a random secret key if missing
ALGORITHM = os.getenv("ALGORITHM", "RS256")  # Default to RS256 for stronger security
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 15))
REFRESH_TOKEN_EXPIRE_DAYS = int(os.getenv("REFRESH_TOKEN_EXPIRE_DAYS", 7))

# JWT Public/Private Key Paths (Ensure they exist)
PRIVATE_KEY_PATH = Path(os.getenv("PRIVATE_KEY", "keys/private.pem"))
PUBLIC_KEY_PATH = Path(os.getenv("PUBLIC_KEY", "keys/public.pem"))

if not PRIVATE_KEY_PATH.exists() or not PUBLIC_KEY_PATH.exists():
    raise ValueError("RSA private/public keys not found! Check your .env settings.")

# In-memory Token Blacklist
TOKEN_BLACKLIST = set()


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(plain_password, hashed_password) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def create_access_token(data: dict, expires_delta: datetime.timedelta = None) -> str:
    """Create a secure JWT access token."""
    to_encode = data.copy()
    expire = datetime.datetime.utcnow() + (expires_delta or datetime.timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})

    with open(PRIVATE_KEY_PATH, "r") as key_file:
        private_key = key_file.read()

    return jwt.encode(to_encode, private_key, algorithm=ALGORITHM)


def create_refresh_token(data: dict) -> str:
    """Create a secure refresh token (longer expiration)."""
    to_encode = data.copy()
    expire = datetime.datetime.utcnow() + datetime.timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)
    to_encode.update({"exp": expire})

    with open(PRIVATE_KEY_PATH, "r") as key_file:
        private_key = key_file.read()

    return jwt.encode(to_encode, private_key, algorithm=ALGORITHM)


def verify_token(token: str) -> dict:
    """Verify the JWT token, check expiration, and enforce blacklist."""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        with open(PUBLIC_KEY_PATH, "r") as key_file:
            public_key = key_file.read()

        payload = jwt.decode(token, public_key, algorithms=[ALGORITHM])

        if "sub" not in payload or "role" not in payload:
            raise credentials_exception

        # Check if token is blacklisted (logout or revoked)
        if token in TOKEN_BLACKLIST:
            raise HTTPException(status_code=401, detail="Token has been revoked")

        return payload

    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token has expired")
    except jwt.InvalidTokenError:
        raise credentials_exception


def revoke_token(token: str):
    TOKEN_BLACKLIST.add(token)


def admin_required(payload: dict = Depends(verify_token)) -> dict:
    if payload.get("role") != "Admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied")
    return payload

def manager_required(payload: dict = Depends(verify_token)) -> dict:
    if payload.get("role") != "Manager":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied")
    return payload

def user_required(payload: dict = Depends(verify_token)) -> dict:
    if payload.get("role") != "User":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied")
    return payload


def validate_password(password: str):

    if len(password) < 8:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password must be at least 8 characters long"
        )

    if not re.search(r"[A-Z]", password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password must contain at least one uppercase letter"
        )

    if not re.search(r"[a-z]", password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password must contain at least one lowercase letter"
        )

    if not re.search(r"\d", password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password must contain at least one number"
        )

    if not re.search(r"[!@#$%^&*(),.?\":{}|<>]", password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password must contain at least one special character"
        )

    if " " in password:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password cannot contain spaces"
        )

    return True