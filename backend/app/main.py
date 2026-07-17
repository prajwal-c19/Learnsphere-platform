from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.routers import (
    auth,
    course,
    enrollment,
    dashboard,
    assessment,
    question,
    result,
    admin,
    profile,
    lesson,
    certificate,
)

app = FastAPI(
    title="Learning Experience Platform API",
    version="2.0.0",
)

# ==========================================================
# CORS
# ==========================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==========================================================
# Static Files
# ==========================================================

app.mount(
    "/uploads",
    StaticFiles(directory="uploads"),
    name="uploads",
)

# ==========================================================
# Routers
# ==========================================================

app.include_router(auth.router)
app.include_router(course.router)
app.include_router(enrollment.router)
app.include_router(dashboard.router)
app.include_router(assessment.router)
app.include_router(question.router)
app.include_router(result.router)
app.include_router(admin.router)
app.include_router(profile.router)
app.include_router(lesson.router)
app.include_router(certificate.router)

# ==========================================================
# Root
# ==========================================================

@app.get("/")
def root():

    return {
        "message": "Welcome to Learning Experience Platform"
    }