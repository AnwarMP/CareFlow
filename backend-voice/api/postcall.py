from fastapi import FastAPI, Header, HTTPException, Request
from app.agents import postcall_agent
from app.config import settings
from supabase import create_client
import os, hmac, hashlib, json

import jwt, os


_cfg = settings()
_client = create_client(_cfg["SUPABASE_URL"], _cfg["SUPABASE_SERVICE_ROLE_KEY"])

SHARED_SECRET = os.environ.get("ELEVENLABS_WEBHOOK_SECRET")   # set in console

def verify(sig: str, body: bytes):
    # For testing purposes, accept a test_mode signature

    payload = jwt.decode(
    os.environ["SUPABASE_SERVICE_ROLE_KEY"],
    options={"verify_signature": False})
    print(payload["role"])

    return
    if sig == "test_mode":
        return
        
    if not SHARED_SECRET:
        raise HTTPException(500, "Webhook secret not configured")
        
    mac = hmac.new(SHARED_SECRET.encode(), body, hashlib.sha256).hexdigest()
    if not hmac.compare_digest(mac, sig):
        raise HTTPException(401, "Invalid webhook signature")

app = FastAPI()

@app.post("/")
async def webhook(req: Request, x_elevenlabs_signature: str | None = Header(None)):
    try:
        raw = await req.body()
        payload = json.loads(raw)
        
        # For debugging
        print(f"Received payload: {payload}")

        transcript = payload["transcript"]
        print(f"Received transcript: {transcript}")
        
        print("Calling Agent")
        result = postcall_agent(payload["transcript"])
        
        # For debugging
        print(f"Agent result: {result}")

        # Insert into the call_logs table (for record keeping)
        try:
            insert_result = _client.table("call_logs").insert({
                "patient_id": "test",
                "transcript": payload["transcript"],
                "summary": result["summary"],
                # "pain_level": result.get("pain_level", 0),
                # "symptoms": ", ".join(result.get("symptoms", [])),
                # "events_updated": result.get("events_updated", 0)
            }).execute()
            
            return {
                "status": "ok", 
                "summary": result["summary"],
                "events_updated": result.get("events_updated", 0)
            }
        except Exception as e:
            print(f"Insert error: {str(e)}")
            return {
                "status": "partial", 
                "message": f"Database error: {str(e)}", 
                "summary": result["summary"]
            }
    except Exception as e:
        print(f"Webhook error: {str(e)}")
        raise HTTPException(500, f"Error: {str(e)}")