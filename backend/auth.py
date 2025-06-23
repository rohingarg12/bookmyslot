from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from passlib.context import CryptContext
from datetime import datetime, timedelta
import jwt
from backend import db

SECRET_KEY = "your-secret-key"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

router = APIRouter()

class UserIn(BaseModel):
    email: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"

def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

@router.post("/signup", response_model=Token)
def signup(user: UserIn):
    conn = db.get_connection()
    cur = conn.cursor()
    if cur.execute("SELECT 1 FROM users WHERE email = ?", (user.email,)).fetchone():
        conn.close()
        raise HTTPException(400, "Email already registered")
    hashed = pwd_context.hash(user.password)
    cur.execute(
        "INSERT INTO users (email, hashed_password, role) VALUES (?, ?, ?)",
        (user.email, hashed, "public")
    )
    conn.commit()
    conn.close()
    access_token = create_access_token({"sub": user.email})
    return {"access_token": access_token}

@router.post("/login", response_model=Token)
def login(user: UserIn):
    conn = db.get_connection()
    cur = conn.cursor()
    row = cur.execute("SELECT hashed_password FROM users WHERE email = ?", (user.email,)).fetchone()
    if not row or not pwd_context.verify(user.password, row[0]):
        conn.close()
        raise HTTPException(401, "Invalid credentials")
    conn.close()
    access_token = create_access_token({"sub": user.email})
    return {"access_token": access_token}
