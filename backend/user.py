from fastapi import APIRouter
from backend import db


router = APIRouter()

@router.get("/users/{email}/bookings")
def list_user_bookings(email: str):
    conn = db.get_connection()
    cur = conn.cursor()
    rows = cur.execute("""
        SELECT 
            b.id, 
            b.createdAt, 
            s.eventId, 
            s.timeUtc, 
            e.title AS eventTitle
        FROM bookings b
        JOIN slots s ON b.slotId = s.id
        JOIN events e ON s.eventId = e.id
        WHERE b.email = ?
        ORDER BY b.createdAt DESC
    """, (email,)).fetchall()
    conn.close()
    return [dict(r) for r in rows]
