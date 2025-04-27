# app/services/event_extraction_service.py

import os
from typing import List, Dict
from llama_index.llms.groq import Groq
from dotenv import load_dotenv

load_dotenv()

# Initialize Groq LLM
llm = Groq(
    model="llama-3.1-8b-instant",  # Fast model for event extraction
    api_key=os.getenv("GROQ_API_KEY"),
)

def extract_events_from_text(text: str) -> List[Dict]:
    """
    Given raw PDF text, ask Groq LLM to extract structured events.
    Returns a list of event dictionaries.
    """
    prompt = f"""
You are an expert medical assistant.  
The following text is from a post-surgical care plan.

Extract a list of events that the patient needs to complete.  
Each event must have these fields:
- type: ("medication", "exercise", or "appointment")
- event_header: A short title (e.g., "Morning Medication", "Physical Therapy")
- event_description: Full details (e.g., "Take 2 tablets of Amoxicillin at 8 AM with food.")
- event_date_to_complete_by: ISO 8601 format like "2025-04-26T08:00:00". Format as YYYY-MM-DDTHH:MM:SS.
  * For Day 1 (Saturday, April 26, 2025) events, use 2025-04-26
  * For Day 2 (Sunday, April 27, 2025) events, use 2025-04-27
  * For Day 3 (Monday, April 28, 2025) events, use 2025-04-28
  * For Day 4 (Tuesday, April 29, 2025) events, use 2025-04-29
  * For Day 5 (Wednesday, April 30, 2025) events, use 2025-04-30
  * For Day 6 (Thursday, May 1, 2025) events, use 2025-05-01
  
  For time-specific events:
  * Use the exact time specified (e.g., "8:00 AM" becomes "T08:00:00")
  * For events without a specific time but that occur on a particular day, use T08:00:00 as the default time
  * For recurring daily events without specific times, assign sequential times starting at T08:00:00 with 30-minute intervals
  * Order multiple events on the same day chronologically
- priority: Always set to 1

Return ONLY valid JSON list. No other text.  
Here is the care plan text:

{text}
"""

    response = llm.complete(prompt)

    try:
        events_json = response.text.strip()
        import json
        structured_events = json.loads(events_json)
        return structured_events
    except Exception as e:
        raise ValueError(f"Failed to parse LLM response into JSON: {str(e)}")

