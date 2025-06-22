import sqlite3
from pathlib import Path

# 1) point at a file-backed SQLite DB in this folder
DB_PATH = Path(__file__).parent / "database.sqlite"

def get_connection():
    """Return a sqlite3.Connection using rows as dicts."""
    conn = sqlite3.connect(DB_PATH, check_same_thread=False)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    """Create tables if they don’t exist already."""
    conn = get_connection()
    cur  = conn.cursor()

    # Users table for authentication
    cur.execute("""
      CREATE TABLE IF NOT EXISTS users (
        id               INTEGER PRIMARY KEY AUTOINCREMENT,
        email            TEXT    UNIQUE NOT NULL,
        hashed_password  TEXT    NOT NULL,
        createdAt        TEXT    DEFAULT CURRENT_TIMESTAMP
      )
    """
    )

    # Events table
    cur.execute("""
      CREATE TABLE IF NOT EXISTS events (
        id          INTEGER PRIMARY KEY AUTOINCREMENT,
        title       TEXT    NOT NULL,
        description TEXT,
        createdAt   TEXT    DEFAULT CURRENT_TIMESTAMP
      )
    """
    )

    # Slots table
    cur.execute("""
      CREATE TABLE IF NOT EXISTS slots (
        id           INTEGER PRIMARY KEY AUTOINCREMENT,
        eventId      INTEGER NOT NULL,
        timeUtc      TEXT    NOT NULL,
        maxBookings  INTEGER NOT NULL,
        FOREIGN KEY(eventId) REFERENCES events(id)
      )
    """
    )

    # Bookings table
    cur.execute("""
      CREATE TABLE IF NOT EXISTS bookings (
        id        INTEGER PRIMARY KEY AUTOINCREMENT,
        slotId    INTEGER NOT NULL,
        name      TEXT    NOT NULL,
        email     TEXT    NOT NULL,
        createdAt TEXT    DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(slotId) REFERENCES slots(id)
      )
    """
    )

    conn.commit()
    conn.close()
