from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User

from app.schemas.user import (
    UserRegister,
    UserLogin,
    Token
)

from app.core.security import (
    hash_password,
    verify_password,
    create_access_token
)

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)


def authenticate_user(
    email: str,
    password: str,
    db: Session
):

    db_user = (
        db.query(User)
        .filter(User.email == email)
        .first()
    )

    if not db_user:

        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    if not verify_password(
        password,
        db_user.password
    ):

        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    return db_user


@router.post("/register")
def register(
    user: UserRegister,
    db: Session = Depends(get_db)
):

    existing_user = (
        db.query(User)
        .filter(User.email == user.email)
        .first()
    )

    if existing_user:

        raise HTTPException(
            status_code=400,
            detail="Email already exists"
        )

    new_user = User(
        name=user.name,
        email=user.email,
        password=hash_password(user.password)
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {
        "message": "User registered successfully",
        "user": {
            "id": new_user.id,
            "name": new_user.name,
            "email": new_user.email,
            "role": new_user.role
        }
    }


# -------------------------------
# React Login (JSON)
# -------------------------------

@router.post("/login", response_model=Token)
def login(
    user: UserLogin,
    db: Session = Depends(get_db)
):

    db_user = authenticate_user(
        user.email,
        user.password,
        db
    )

    access_token = create_access_token(
        data={
            "sub": db_user.email,
            "role": db_user.role
        }
    )

    return {
        "access_token": access_token,
        "token_type": "bearer"
    }


# -------------------------------
# Swagger OAuth2 Login
# -------------------------------

@router.post("/token", response_model=Token)
def login_for_swagger(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):

    db_user = authenticate_user(
        form_data.username,
        form_data.password,
        db
    )

    access_token = create_access_token(
        data={
            "sub": db_user.email,
            "role": db_user.role
        }
    )

    return {
        "access_token": access_token,
        "token_type": "bearer"
    }


@router.post("/create-admin")
def create_admin(
    db: Session = Depends(get_db)
):

    existing = (
        db.query(User)
        .filter(
            User.email == "admin@learnsphere.com"
        )
        .first()
    )

    if existing:

        raise HTTPException(
            status_code=400,
            detail="Admin already exists."
        )

    admin = User(
        name="System Admin",
        email="admin@learnsphere.com",
        password=hash_password("Admin@123"),
        role="admin",
        is_verified=True
    )

    db.add(admin)
    db.commit()

    return {
        "message": "Admin created successfully."
    }
