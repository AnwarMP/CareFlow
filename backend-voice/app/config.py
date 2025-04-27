import os, functools
from dotenv import load_dotenv
load_dotenv()                       # no-op on Vercel – it injects env vars

@functools.lru_cache
def settings():
    return {
        "SUPABASE_URL":                 os.environ["SUPABASE_URL"],
        "SUPABASE_SERVICE_ROLE_KEY":    os.environ["SUPABASE_SERVICE_ROLE_KEY"],
        "GROQ_API_KEY":                 os.environ["GROQ_API_KEY"],
        "POSTGRES_CONN":                os.environ["POSTGRES_CONNECTION_STRING"],
        "EMBED_DIM":                    384,              # keep in sync with model
        "OPENAI_API_KEY":               os.environ["OPENAI_API_KEY"]
    }
