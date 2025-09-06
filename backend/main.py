from fastapi import FastAPI
from pydantic import BaseModel
from datetime import datetime
from typing import List

# Initialize app
app = FastAPI(title="Stampede Prevention Backend")

# Temporary in-memory event storage
events = []

# Data model for incoming events
class Event(BaseModel):
    source: str
    location: str
    density: float  # percentage (0-100)

# Root route
@app.get("/")
def root():
    return {"message": "Backend is running 🚀"}

# POST /report → record a new event
@app.post("/report")
def report_event(event: Event):
    event_data = {
        "timestamp": datetime.utcnow().isoformat(),
        "source": event.source,
        "location": event.location,
        "density": event.density,
    }
    events.append(event_data)

    # Alert logic
    alert = None
    if event.density > 90:
        alert = f"🚨 Critical: {event.location} overcrowded!"
    elif event.density > 70:
        alert = f"⚠️ Warning: {event.location} nearing limit."

    return {"status": "ok", "event": event_data, "alert": alert}

# GET /events → fetch last 20 events
@app.get("/events")
def get_events() -> List[dict]:
    return events[-20:]
