# app/services/event_insertion_service.py

import os
from supabase import create_client
from dotenv import load_dotenv

load_dotenv()

url = os.getenv("SUPABASE_URL")
key = os.getenv("SUPABASE_SERVICE_KEY")
supabase = create_client(url, key)

def insert_events_to_db(events: list) -> int:
    """
    Insert a list of structured events into the events table.
    Returns the number of events inserted.
    """
    inserts = []
    for event in events:
        inserts.append({
            "type": event["type"],
            "status": "pending",
            "event_date_to_complete_by": event.get("event_date_to_complete_by"),
            "event_header": event["event_header"],
            "event_description": event["event_description"],
            "priority": event.get("priority", 1),
        })

    response = supabase.table("events").insert(inserts).execute()

    # New way to check
    if not response.data:
        raise ValueError("Failed to insert events: No data returned.")

    return len(inserts)
