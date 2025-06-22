from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles   # <-- Add this import

import db
from auth import router as auth_router
from event import router as events_router
from booking import router as bookings_router
from user import router as users_router

db.init_db()

app = FastAPI(title="BookMySlot API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Serve uploaded images from /uploads/*
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

app.include_router(auth_router)
app.include_router(events_router)
app.include_router(bookings_router)
app.include_router(users_router)

@app.get("/")
def root():
    return {"msg": "BookMySlot backend running!"}
