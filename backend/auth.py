import bcrypt
from jose import jwt
from datetime import datetime, timedelta
from jose import JWTError

# Password Hashing Setup (Using bcrypt directly)
def hash_password(password: str) -> str:
    # bcrypt requires bytes, so we encode the string
    pwd_bytes = password.encode('utf-8')
    # bcrypt has a 72 byte limit, so we slice it just to be safe
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(pwd_bytes[:72], salt)
    return hashed.decode('utf-8') # Return as string to store in DB

def verify_password(plain_password: str, hashed_password: str) -> bool:
    pwd_bytes = plain_password.encode('utf-8')[:72]
    hashed_bytes = hashed_password.encode('utf-8')
    return bcrypt.checkpw(pwd_bytes, hashed_bytes)

# JWT Token Setup
SECRET_KEY = "urbanmesh_super_secret_key_change_in_production"
ALGORITHM = "HS256"

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(days=7)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


def decode_access_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            return None
        return user_id
    except JWTError:
        return None