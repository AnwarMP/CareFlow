# app/services/query_service.py
from llama_index.core import VectorStoreIndex
from app.services.embedding_service import get_embedding_model, get_llm_transformations
from app.services.vector_store_service import load_nodes_from_supabase

def query_vector_store(user_query: str):
    hf_embeddings = get_embedding_model()
    llm_model = get_llm_transformations()
    
    # load all nodes from Supabase
    nodes = load_nodes_from_supabase()

    index = VectorStoreIndex(nodes, embed_model=hf_embeddings)
    query_engine = index.as_query_engine(llm=llm_model)

    response = query_engine.query(user_query)
    return response.response
