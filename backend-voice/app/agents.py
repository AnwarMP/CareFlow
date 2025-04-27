from groq import Groq
from llama_index.core import PromptTemplate
from .vector import query_engine
from .config import settings
from supabase import create_client


_cfg = settings()

# Initialize Groq clients without specifying model
_groq_client = Groq(api_key=_cfg["GROQ_API_KEY"])

_supabase = create_client(_cfg["SUPABASE_URL"], _cfg["SUPABASE_SERVICE_ROLE_KEY"])



def oncall_agent(question: str) -> str:
    try:
        # Get the query engine (now using proper vector store and embedding model)
        qe = query_engine()
        
        # Get response from query engine
        response = qe.query(question)
        
        # Return the text response
        return str(response)
    except Exception as e:
        error_msg = f"ONCALL AGENT ERROR: {str(e)}"
        print(error_msg)
        return f"I'm having trouble accessing the information right now. Error: {str(e)}"


# Updated prompt to extract actionable information about events
_EVENT_UPDATE_PROMPT = PromptTemplate(
    """
    Analyze the following medical call transcript from a patient after knee arthroscopy surgery.
    
    1. Extract critical information about:
       - Medication adherence (what medications they took or missed)
       - Exercise compliance (what exercises they did or skipped)
       - Pain levels (on a scale of 1-10, with 10 being worst)
       - Any symptoms that need attention
    
    2. Format your response as a structured JSON with these fields:
       - summary: A brief overview of the call (1-2 sentences)
       - medication_events: Array of objects with {medication_name: "string", status: "missed"|"taken"|"unknown"}
       - exercise_events: Array of objects with {exercise_name: "string", status: "completed"|"skipped"|"partial"}
       - pain_level: Number 1-10
       - symptoms: Array of strings describing concerning symptoms
    
    Only include events that were specifically mentioned in the transcript.
    
    Transcript: {transcript}
    """
)

def update_events_in_db(event_updates):
    """Update events in the events_duplicate table based on transcript analysis"""
    updated_count = 0
    
    try:
        # Process medication events
        for med_event in event_updates.get("medication_events", []):
            # Using ILIKE for case-insensitive partial matching
            medication_name = med_event.get("medication_name")
            if medication_name:
                response = _supabase.table("events_duplicate") \
                    .select("id, event_header, event_description") \
                    .eq("type", "medication") \
                    .ilike("event_description", f"%{medication_name}%") \
                    .execute()
                
                if response.data and len(response.data) > 0:
                    # Update the first matching event
                    event_id = response.data[0]["id"]
                    status = med_event.get("status", "unknown")
                    
                    # Map the statuses
                    status_map = {
                        "missed": "missed",
                        "taken": "completed",
                        "unknown": "pending"
                    }
                    
                    # Update the event with status
                    _supabase.table("events_duplicate") \
                        .update({
                            "status": status_map.get(status, "pending"),
                            "updated_at": "now()"
                        }) \
                        .eq("id", event_id) \
                        .execute()
                    
                    updated_count += 1
        
        # Process exercise events
        for ex_event in event_updates.get("exercise_events", []):
            exercise_name = ex_event.get("exercise_name")
            if exercise_name:
                response = _supabase.table("events_duplicate") \
                    .select("id, event_header, event_description") \
                    .eq("type", "exercise") \
                    .ilike("event_description", f"%{exercise_name}%") \
                    .execute()
                
                if response.data and len(response.data) > 0:
                    # Update the first matching event
                    event_id = response.data[0]["id"]
                    status = ex_event.get("status", "unknown")
                    
                    # Map the statuses
                    status_map = {
                        "completed": "completed",
                        "skipped": "missed",
                        "partial": "partial",
                        "unknown": "pending"
                    }
                    
                    # Update the event with status
                    _supabase.table("events_duplicate") \
                        .update({
                            "status": status_map.get(status, "pending"),
                            "updated_at": "now()"
                        }) \
                        .eq("id", event_id) \
                        .execute()
                    
                    updated_count += 1
        
        # For appointments, we could also process similarly if mentioned in the transcript
        # If you want to handle appointments, add similar code here
                    
        return updated_count
    except Exception as e:
        print(f"Error updating events: {str(e)}")
        return 0

def postcall_agent(transcript: str) -> dict:
    try:
        print(f"[DEBUG] postcall_agent called with transcript of length: {len(transcript)}")
        
        # First, generate the structured analysis of the transcript
        prompt = _EVENT_UPDATE_PROMPT.format(transcript=transcript)
        print(f"[DEBUG] Formatted prompt: {prompt[:100]}...")
        
        print("[DEBUG] Sending request to Groq API for event analysis...")
        response = _groq_client.chat.completions.create(
            messages=[{"role": "user", "content": prompt}],
            model="meta-llama/llama-4-scout-17b-16e-instruct",
            temperature=0.2,
        ).choices[0].message.content
        
        print(f"[DEBUG] Received analysis of length: {len(response)}")
        
        # Parse the JSON response
        import json
        try:
            event_updates = json.loads(response)
            print(f"[DEBUG] Successfully parsed JSON response")
        except json.JSONDecodeError:
            print(f"[DEBUG] Failed to parse JSON response. Attempting to extract JSON...")
            # Try to extract JSON from the text (in case the model added extra text)
            import re
            json_match = re.search(r'```json\s*([\s\S]*?)\s*```|({[\s\S]*})', response)
            if json_match:
                json_str = json_match.group(1) or json_match.group(2)
                event_updates = json.loads(json_str)
                print(f"[DEBUG] Successfully extracted and parsed JSON")
            else:
                print(f"[DEBUG] Could not extract JSON. Using fallback structure.")
                # Fallback to a basic structure
                event_updates = {
                    "summary": "Processed call transcript but could not structure the data.",
                    "medication_events": [],
                    "exercise_events": [],
                    "pain_level": 0,
                    "symptoms": []
                }
        
        # Update events in the database
        updated_count = update_events_in_db(event_updates)
        print(f"[DEBUG] Updated {updated_count} events in the database")
        
        # Return the summary and update count
        result = {
            "summary": event_updates.get("summary", "Call processed."),
            "events_updated": updated_count,
            "pain_level": event_updates.get("pain_level", 0),
            "symptoms": event_updates.get("symptoms", [])
        }
        
        return result
    except Exception as e:
        error_msg = f"AGENT ERROR: {str(e)}"
        print(error_msg)
        return {"error": error_msg, "summary": "Error processing call transcript."}