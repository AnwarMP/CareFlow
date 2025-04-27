from groq import Groq
from llama_index.core import PromptTemplate
from .vector import query_engine
from .config import settings

_cfg = settings()

# Initialize Groq clients without specifying model
_groq_client = Groq(api_key=_cfg["GROQ_API_KEY"])

def oncall_agent(question: str) -> str:
    # Get the query engine (don't pass llm parameter)
    qe = query_engine()
    
    # First, get the response from the query engine
    response = qe.query(question)
    
    # If you need to format or process using Groq, you can do it here
    # For example:
    # response_text = str(response)
    # groq_response = _groq_client.chat.completions.create(
    #     messages=[{"role": "user", "content": response_text}],
    #     model="llama2-70b-7b-chat",
    #     temperature=0.2,
    # )
    # return groq_response.choices[0].message.content
    
    # For now, just return the query engine response
    return str(response)

_SUMMARY_PROMPT = PromptTemplate(
    "Summarise the following medical call transcript. "
    "Extract (1) medication adherence issues, (2) pain level, "
    "(3) red-flag symptoms.  Transcript: {transcript}"
)

def postcall_agent(transcript: str) -> dict:
    try:
        print(f"[DEBUG] postcall_agent called with transcript of length: {len(transcript)}")
        
        prompt = _SUMMARY_PROMPT.format(transcript=transcript)
        print(f"[DEBUG] Formatted prompt: {prompt[:100]}...")
        
        print("[DEBUG] Sending request to Groq API...")
        summary = _groq_client.chat.completions.create(
            messages=[{"role": "user", "content": prompt}],
            model="deepseek-r1-distill-llama-70b",  # Specify model here
            temperature=0.2,
        ).choices[0].message.content
        
        print(f"[DEBUG] Received summary of length: {len(summary)}")
        print(f"[DEBUG] Summary preview: {summary[:100]}...")
        
        return {"summary": summary}
    except Exception as e:
        error_msg = f"AGENT ERROR: {str(e)}"
        print(error_msg)
        return {"error": error_msg}