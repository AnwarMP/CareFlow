# app/services/vector_store_service.py
# Vector Store Service for Supabase
from supabase import create_client
from llama_index.core.schema import TextNode
import os

from dotenv import load_dotenv
load_dotenv()

url = os.getenv("SUPABASE_URL")
key = os.getenv("SUPABASE_SERVICE_KEY")
supabase = create_client(url, key)

def store_nodes_in_supabase(nodes: list, embed_model):
    for node in nodes:
        content = node.get_content()
        embedding = embed_model.get_text_embedding(content)

        supabase.table("documents").insert({
            "content": content,
            "embedding": embedding
        }).execute()

def load_nodes_from_supabase() -> list[TextNode]:
    # Fetch all documents
    response = supabase.table("documents").select("id, content").execute()
    records = response.data

    nodes = []
    for record in records:
        node = TextNode(
            id_=record["id"],
            text=record["content"]
        )
        nodes.append(node)

    return nodes