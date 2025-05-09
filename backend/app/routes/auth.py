from fastapi import APIRouter, Response, Request, HTTPException, Depends
from pydantic import BaseModel
from app.config import get_current_signing_key, get_redis_client, get_verification_keys
import jwt  # type: ignore
import time
from sqlalchemy.orm import Session  # type: ignore
from app.database import SessionLocal  # type: ignore
from app.models.user import User
from passlib.context import CryptContext
import os

router = APIRouter()

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_db():  # type: ignore
    db = SessionLocal()  # type: ignore
    try:
        yield db
    finally:
        db.close()  # type: ignore

def verify_password(plain_password, hashed_password):  # type: ignore
    return pwd_context.verify(plain_password, hashed_password)

class LoginRequest(BaseModel):
    username: str
    password: str

class LoginResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    expires_in: int

class RefreshResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    expires_in: int

@router.post("/auth/login", response_model=LoginResponse)
def login_endpoint(request: LoginRequest, response: Response, db: Session = Depends(get_db)):
    username = request.username
    user = db.query(User).filter(User.username == username).first()  # type: ignore
    if not user or not verify_password(request.password, user.hashed_password):  # type: ignore
        raise HTTPException(status_code=401, detail="Invalid username or password")
    kid, secret = get_current_signing_key()
    now = int(time.time())
    access_payload = {
        "sub": username,
        "iat": now,
        "exp": now + 900,  # 15 min
        "kid": kid,
    }
    access_token = jwt.encode(access_payload, secret, algorithm="HS256")  # type: ignore
    refresh_payload = {
        "sub": username,
        "iat": now,
        "exp": now + 7 * 24 * 60 * 60,  # 7 days
        "kid": kid,
    }
    refresh_token = jwt.encode(refresh_payload, secret, algorithm="HS256")  # type: ignore
    is_prod = os.getenv("IS_PROD", "false").lower() == "true"
    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,
        secure=is_prod,
        samesite="none" if is_prod else "lax",
        max_age=7 * 24 * 60 * 60,
    )
    return LoginResponse(access_token=access_token, expires_in=900)

@router.post("/auth/refresh", response_model=RefreshResponse)
def refresh_endpoint(request: Request, response: Response):
    redis = get_redis_client()
    refresh_token = request.cookies.get("refresh_token")
    if not refresh_token:
        raise HTTPException(status_code=401, detail="Missing refresh token")
    if redis.get(f"bl:{refresh_token}"):
        raise HTTPException(status_code=401, detail="Refresh token revoked")
    try:
        keys = get_verification_keys()
        unverified = jwt.decode(refresh_token, options={"verify_signature": False})  # type: ignore
        kid = unverified.get("kid")
        secret = keys[kid]
        payload = jwt.decode(refresh_token, secret, algorithms=["HS256"])  # type: ignore
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid refresh token")
    username = payload["sub"]
    exp = payload["exp"]
    ttl = max(0, exp - int(time.time()))
    redis.setex(f"bl:{refresh_token}", ttl, "1")  # type: ignore
    kid, secret = get_current_signing_key()
    now = int(time.time())
    access_payload = {"sub": username, "iat": now, "exp": now + 900, "kid": kid}
    access_token = jwt.encode(access_payload, secret, algorithm="HS256")
    refresh_payload = {
        "sub": username,
        "iat": now,
        "exp": now + 7 * 24 * 60 * 60,
        "kid": kid,
    }
    new_refresh_token = jwt.encode(refresh_payload, secret, algorithm="HS256")  # type: ignore
    is_prod = os.getenv("IS_PROD", "false").lower() == "true"
    response.set_cookie(
        key="refresh_token",
        value=new_refresh_token,  # type: ignore
        httponly=True,
        secure=is_prod,
        samesite="none" if is_prod else "lax",
        max_age=7 * 24 * 60 * 60,
    )  # type: ignore
    return RefreshResponse(access_token=access_token, expires_in=900)

@router.post("/auth/logout")
def logout_endpoint(request: Request, response: Response):
    redis = get_redis_client()
    refresh_token = request.cookies.get("refresh_token")
    if refresh_token:
        try:
            keys = get_verification_keys()
            unverified = jwt.decode(refresh_token, options={"verify_signature": False})  # type: ignore
            kid = unverified.get("kid")
            secret = keys[kid]
            payload = jwt.decode(refresh_token, secret, algorithms=["HS256"])  # type: ignore
            exp = payload["exp"]
            ttl = max(0, exp - int(time.time()))
            redis.setex(f"bl:{refresh_token}", ttl, "1")  # type: ignore
        except Exception:
            pass  # Ignore errors on logout
    response.delete_cookie("refresh_token")  # type: ignore
    return {"detail": "Logged out"}
