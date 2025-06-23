from fastapi import APIRouter, Depends, HTTPException, Header, UploadFile, File, Form
from pydantic import BaseModel, Field
from backend import db

import jwt
import os
import shutil
import json

SECRET_KEY = "your-secret-key"
ALGORITHM = "HS256"

router = APIRouter()

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

class SlotIn(BaseModel):
    timeUtc: str
    maxBookings: int = Field(gt=0)

class EventIn(BaseModel):
    title: str
    description: str | None = None
    slots: list[SlotIn]

# JWT token check
def get_current_user(Authorization: str = Header(None)):
    if not Authorization or not Authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing or invalid Authorization header")
    token = Authorization.split()[1]
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

# POST /events with image upload
@router.post("/events")
async def create_event(
    title: str = Form(...),
    description: str = Form(""),
    slots: str = Form(...),  # frontend must send this as a JSON string!
    image: UploadFile = File(None),
    user=Depends(get_current_user)
):
    # Save the uploaded image (if provided)
    image_url = None
    if image:
        file_location = os.path.join(UPLOAD_DIR, image.filename)
        with open(file_location, "wb") as buffer:
            shutil.copyfileobj(image.file, buffer)
        image_url = f"/uploads/{image.filename}"

    # Parse slots (expects JSON string)
    try:
        slots_list = json.loads(slots)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid slots format; must be JSON list")

    conn = db.get_connection()
    cur = conn.cursor()
    cur.execute(
        "INSERT INTO events (title, description, image_url) VALUES (?, ?, ?)",
        (title, description, image_url)
    )
    event_id = cur.lastrowid
    for s in slots_list:
        cur.execute("INSERT INTO slots (eventId, timeUtc, maxBookings) VALUES (?, ?, ?)",
                    (event_id, s['timeUtc'], s['maxBookings']))
    conn.commit()
    conn.close()
    return {
        "id": event_id,
        "title": title,
        "description": description,
        "image_url": image_url,
        "slots": slots_list
    }

@router.get("/events")
def list_events():
    conn = db.get_connection()
    cur = conn.cursor()
    events = cur.execute("SELECT * FROM events ORDER BY createdAt DESC").fetchall()
    placeholders = ",".join("?" for _ in events) or "''"
    ids = tuple(e["id"] for e in events)
    slots = cur.execute(f"SELECT * FROM slots WHERE eventId IN ({placeholders})", ids).fetchall() if events else []
    by_event = {}
    for s in slots:
        by_event.setdefault(s["eventId"], []).append(dict(s))
    result = [{**dict(e), "slots": by_event.get(e["id"], [])} for e in events]
    conn.close()
    return result

@router.get("/events/{event_id}")
def get_event(event_id: int):
    conn = db.get_connection()
    cur = conn.cursor()
    event = cur.execute("SELECT * FROM events WHERE id = ?", (event_id,)).fetchone()
    if not event:
        conn.close()
        raise HTTPException(404, "Event not found")
    slots = cur.execute("SELECT * FROM slots WHERE eventId = ?", (event_id,)).fetchall()
    slots_with_left = []
    for s in slots:
        booked_count = cur.execute(
            "SELECT COUNT(*) FROM bookings WHERE slotId = ?", (s["id"],)
        ).fetchone()[0]
        left = s["maxBookings"] - booked_count
        slots_with_left.append({**dict(s), "left": left})
    conn.close()
    return {**dict(event), "slots": slots_with_left}
