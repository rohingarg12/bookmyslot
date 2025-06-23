from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from backend.auth import router as auth_router
from backend.event import router as events_router
from backend.booking import router as bookings_router
from backend.user import router as users_router
from backend import db

import os

app = FastAPI()

# Set up CORS (adjust origins as needed)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change this to your frontend domain in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static files (uploads directory inside backend)
app.mount(
    "/uploads", 
    StaticFiles(directory=os.path.join("backend", "uploads")), 
    name="uploads"
)

# Include your routers
app.include_router(auth_router, prefix="/auth")
app.include_router(events_router, prefix="/events")
app.include_router(bookings_router, prefix="/bookings")
app.include_router(users_router, prefix="/users")

# If you need a simple root route
@app.get("/")
def read_root():
    return {"message": "API is running"}

