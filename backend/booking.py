from fastapi import APIRouter, Depends, HTTPException, Header, Form
from backend import db
import jwt

SECRET_KEY = "your-secret-key"
ALGORITHM = "HS256"

router = APIRouter()

def get_current_user(Authorization: str = Header(None)):
    if not Authorization or not Authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing or invalid Authorization header")
    token = Authorization.split()[1]
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

@router.post("/events/{event_id}/bookings")
def book_slot(
    event_id: int,
    slotId: int = Form(...),
    name: str = Form(...),
    email: str = Form(...),
    user=Depends(get_current_user)
):
    conn = db.get_connection()
    cur = conn.cursor()
    slot = cur.execute(
        "SELECT * FROM slots WHERE id = ? AND eventId = ?", (slotId, event_id)
    ).fetchone()
    if not slot:
        conn.close()
        raise HTTPException(404, "Slot not found")
    count = cur.execute(
        "SELECT COUNT(*) AS cnt FROM bookings WHERE slotId = ?", (slotId,)
    ).fetchone()["cnt"]
    if count >= slot["maxBookings"]:
        conn.close()
        raise HTTPException(400, "Slot is full")
    if cur.execute(
        "SELECT 1 FROM bookings WHERE slotId = ? AND email = ?",
        (slotId, email),
    ).fetchone():
        conn.close()
        raise HTTPException(
            status_code=400,
            detail=f"You cannot book again: this email ({email}) has already been used for this event."
        )
    cur.execute(
        "INSERT INTO bookings (slotId, name, email) VALUES (?, ?, ?)",
        (slotId, name, email),
    )
    booking_id = cur.lastrowid
    event = cur.execute(
        "SELECT title, description FROM events WHERE id = ?", (event_id,)
    ).fetchone()
    event_title = event["title"] if event else None
    event_description = event["description"] if event else None
    slot_time_utc = slot["timeUtc"] if slot else None
    conn.commit()
    conn.close()
    return {
        "id": booking_id,
        "eventTitle": event_title,
        "eventDescription": event_description,
        "slotTimeUtc": slot_time_utc
    }
