from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer
from sqlmodel import Session, select
from database import engine, init_db
from models import Issue, User
from auth import hash_password, verify_password, create_access_token, decode_access_token
from pydantic import BaseModel
from fastapi import Depends
import uuid

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

@app.on_event("startup")
def on_startup():
    init_db()

# --- Auth Schemas ---
class SignupRequest(BaseModel):
    full_name: str
    email: str
    password: str

class LoginRequest(BaseModel):
    email: str
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"

class UpdateUserRequest(BaseModel):
    full_name: str | None = None
    email: str | None = None
    avatar: str | None = None

# --- Issue Schemas ---
class IssueCreate(BaseModel):
    title: str
    description: str | None = None
    latitude: float
    longitude: float
    category: str = "Other"

# --- Auth Routes ---
@app.post("/signup", response_model=TokenResponse)
def signup_user(request: SignupRequest):
    with Session(engine) as session:
        statement = select(User).where(User.email == request.email)
        existing_user = session.exec(statement).first()
        if existing_user:
            raise HTTPException(status_code=400, detail="Account with this email already exists")
        
        hashed_pw = hash_password(request.password)
        new_user = User(
            email=request.email,
            full_name=request.full_name,
            hashed_password=hashed_pw
        )
        session.add(new_user)
        session.commit()
        session.refresh(new_user)
        
        token = create_access_token(data={"sub": str(new_user.id)})
        return TokenResponse(access_token=token)

@app.post("/login", response_model=TokenResponse)
def login_user(request: LoginRequest):
    with Session(engine) as session:
        statement = select(User).where(User.email == request.email)
        user = session.exec(statement).first()
        
        if not user:
            raise HTTPException(status_code=404, detail="Account not found. Please create an account first.")
        
        if not verify_password(request.password, user.hashed_password):
            raise HTTPException(status_code=401, detail="Invalid email or password.")
        
        token = create_access_token(data={"sub": str(user.id)})
        return TokenResponse(access_token=token)

# --- User Profile Routes ---
@app.get("/users/me")
def get_current_user(token: str = Depends(oauth2_scheme)):
    user_id = decode_access_token(token)
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid authentication credentials")
    
    with Session(engine) as session:
        user = session.get(User, uuid.UUID(user_id))
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        return {
            "id": str(user.id),
            "email": user.email,
            "full_name": user.full_name,
            "avatar": user.avatar,
            "is_admin": user.is_admin,
            "created_at": user.created_at.isoformat()
        }

@app.put("/users/me")
def update_current_user(request: UpdateUserRequest, token: str = Depends(oauth2_scheme)):
    user_id = decode_access_token(token)
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid authentication credentials")
    
    with Session(engine) as session:
        user = session.get(User, uuid.UUID(user_id))
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        if request.full_name:
            user.full_name = request.full_name
        if request.email:
            user.email = request.email
        if request.avatar is not None:
            user.avatar = request.avatar
        
        session.add(user)
        session.commit()
        session.refresh(user)
        
        return {
            "id": str(user.id),
            "email": user.email,
            "full_name": user.full_name,
            "avatar": user.avatar,
            "is_admin": user.is_admin,
            "created_at": user.created_at.isoformat()
        }

# --- Issue Routes ---
@app.post("/issues/")
def create_issue(issue: IssueCreate, token: str = Depends(oauth2_scheme)):
    user_id = decode_access_token(token)
    if not user_id:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    with Session(engine) as session:
        db_issue = Issue(
            **issue.dict(),
            user_id=uuid.UUID(user_id),
            status="Pending",
            priority="Medium"
        )
        session.add(db_issue)
        session.commit()
        session.refresh(db_issue)
        return db_issue

@app.get("/issues/")
def get_all_issues():
    with Session(engine) as session:
        issues = session.exec(select(Issue)).all()
    return issues

#Get issues for the logged-in user
@app.get("/users/me/issues")
def get_my_issues(token: str = Depends(oauth2_scheme)):
    user_id = decode_access_token(token)
    if not user_id:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    with Session(engine) as session:
        statement = select(Issue).where(Issue.user_id == uuid.UUID(user_id))
        issues = session.exec(statement).all()
        return issues

# --- Admin Schemas ---
class IssueStatusUpdate(BaseModel):
    status: str

# --- Admin Dependency ---
def get_current_admin(token: str = Depends(oauth2_scheme)):
    user_id = decode_access_token(token)
    if not user_id:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    with Session(engine) as session:
        user = session.get(User, uuid.UUID(user_id))
        if not user or not user.is_admin:
            raise HTTPException(status_code=403, detail="Not authorized. Admins only.")
    return user

# --- Admin Routes ---
@app.get("/admin/issues")
def get_all_issues_for_admin(admin: User = Depends(get_current_admin)):
    with Session(engine) as session:
        issues = session.exec(select(Issue)).all()
    return issues

@app.put("/admin/issues/{issue_id}")
def update_issue_status(issue_id: uuid.UUID, status_update: IssueStatusUpdate, admin: User = Depends(get_current_admin)):
    with Session(engine) as session:
        issue = session.get(Issue, issue_id)
        if not issue:
            raise HTTPException(status_code=404, detail="Issue not found")
        
        issue.status = status_update.status
        session.add(issue)
        session.commit()
        session.refresh(issue)
        return issue