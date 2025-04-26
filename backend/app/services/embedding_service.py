# app/services/embedding_service.py
# Embeddings Service
from llama_index.embeddings.huggingface import HuggingFaceEmbedding
from llama_index.llms.groq import Groq
import os

from dotenv import load_dotenv
load_dotenv()

def get_embedding_model():
    return HuggingFaceEmbedding(model_name="BAAI/bge-small-en-v1.5")

def get_llm_transformations():
    return Groq(model="llama-3.1-8b-instant", api_key=os.getenv("GROQ_API_KEY"))
