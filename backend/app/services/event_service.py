# app/services/event_service.py

import os
from supabase import create_client
from dotenv import load_dotenv

load_dotenv()

url = os.getenv("SUPABASE_URL")
key = os.getenv("SUPABASE_SERVICE_KEY")
supabase = create_client(url, key)

def get_all_events():
    response = supabase.table("events").select("*").execute()
    if not response.data:
        return []
    return response.data

def update_event_status(event_id: str, new_status: str):
    response = supabase.table("events").update({"status": new_status}).eq("id", event_id).execute()
    if not response.data:
        raise ValueError(f"Failed to update event {event_id}")
