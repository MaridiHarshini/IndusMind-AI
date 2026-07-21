from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes.upload import router as upload_router
from app.routes.chat import router as chat_router

app = FastAPI(
    title="IndusMind AI",
    description="Unified Industrial Knowledge Intelligence Platform",
    version="1.0.0"
)

# Allow React frontend to access the backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routes
app.include_router(upload_router)
app.include_router(chat_router)

# Home route
@app.get("/")
def home():
    return {
        "message": "Welcome to IndusMind AI 🚀"
    }

# Health check
@app.get("/health")
def health():
    return {
        "status": "Backend Running Successfully"
    }