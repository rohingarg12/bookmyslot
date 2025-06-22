# BookMySlot

BookMySlot is a full-stack event booking platform built with **FastAPI** (backend, Python) and **React + Material UI** (frontend).  
It allows users to create events with images and time slots, view upcoming events, and book slots.  
Authentication is managed via JWT tokens. Database: SQLite.

---

## Features

- **User authentication:** Sign up, log in (JWT-based)
- **Event creation:** Create events with title, description, time slots, and image upload
- **Event listing:** See all upcoming events with images and available slots
- **Slot booking:** Book a slot for an event (email-restricted, prevents double booking)
- **My Bookings:** View your bookings by email
- **Image upload:** Upload and view event images
- **Admin/Organizer features:** (Optional, extendable)
- **CORS-ready:** Frontend-backend separation for local dev

---

## Project Structure

bookmyslot/
├── backend/ # FastAPI backend (Python)
│ ├── auth.py
│ ├── event.py
│ ├── booking.py
│ ├── user.py
│ ├── db.py
│ ├── database.sqlite # SQLite database (do NOT use for production!)
│ └── schema.sql # (optional) DB schema export
├── frontend/ # React frontend (Material UI)
│ ├── src/
│ └── ...
├── .gitignore
└── README.md


---

## Setup

### Backend (FastAPI + SQLite)

``bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install fastapi uvicorn passlib[bcrypt] python-multipart pydantic jwt
uvicorn main:app --reload
App runs at: http://localhost:8000

Uploaded event images are stored in /backend/uploads/

Frontend (React + Material UI)
cd frontend
npm install
npm start
App runs at: http://localhost:5173 (or as shown in your terminal)

Set API URL in .env if needed:

VITE_API_URL=http://localhost:8000
Database
Default DB: backend/database.sqlite

(Optional) To reset DB, remove the file and restart the backend

API Endpoints
Method	Endpoint	Description
POST	/signup	Create user (email, password)
POST	/login	User login, returns JWT token
GET	/events	List all events (+images, slots)
POST	/events	Create event (requires JWT)
GET	/events/{id}	Get single event details
POST	/events/{id}/bookings	Book slot for event
GET	/users/{email}/bookings	View bookings by email
Screenshots
(Add screenshots of UI pages if you want)

License
This project is for educational/demo purposes only.
Not for production use without further hardening.

Rohin
[rohingarg12]

Your GitHub
