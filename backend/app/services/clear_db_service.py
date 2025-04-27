# app/services/clear_db_service.py
import os
from supabase import create_client
from dotenv import load_dotenv

load_dotenv()

url = os.getenv("SUPABASE_URL")
key = os.getenv("SUPABASE_SERVICE_KEY")
supabase = create_client(url, key)

# a UUID that will never be present
DUMMY_UUID = "00000000-0000-0000-0000-000000000000"

def clear_documents_and_events():
    """
    Remove every row from `documents` and `events`.
    Uses a dummy filter because PostgREST DELETE requires at least one filter.
    """
    (
        supabase.table("documents")
        .delete()
        .neq("id", DUMMY_UUID)     # safe, valid uuid
        .execute()
    )

    (
        supabase.table("events")
        .delete()
        .neq("id", DUMMY_UUID)
        .execute()
    )
