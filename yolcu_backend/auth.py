from passlib.context import CryptContext
from datetime import datetime, timedelta
from jose import JWTError, jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from database import SessionLocal
from models import User

# ----------------- Şifre ve JWT Ayarları -----------------
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

SECRET_KEY = "supersecret"  # TODO: .env içine taşı
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

# OAuth2 şeması
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")


# ----------------- Şifre Fonksiyonları -----------------
def get_password_hash(password: str) -> str:
    """Parolayı hashler"""
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Parolayı hash ile karşılaştırır"""
    return pwd_context.verify(plain_password, hashed_password)


# ----------------- JWT Fonksiyonları -----------------
def create_access_token(data: dict, expires_delta: timedelta | None = None) -> str:
    """JWT token oluşturur"""
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta if expires_delta else timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


def verify_token(token: str) -> dict:
    """JWT token doğrulama"""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")


# ----------------- Kullanıcı Fonksiyonu -----------------
def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(SessionLocal)):
    """Token'dan kullanıcıyı alır"""
    payload = verify_token(token)
    user_id = payload.get("user_id")
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    return user