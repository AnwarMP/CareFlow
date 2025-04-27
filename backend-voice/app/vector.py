# app/vector.py (updated for local file-based RAG)
from llama_index.core import SimpleDirectoryReader, VectorStoreIndex
from llama_index.core.node_parser import SimpleNodeParser
from llama_index.core.storage import StorageContext
from llama_index.core.vector_stores import SimpleVectorStore
from llama_index.embeddings.openai import OpenAIEmbedding
import os
from .config import settings

_cfg = settings()

def _load_document():
    """Load the healthcare plan document"""
    # Check if data directory exists, if not create it
    data_dir = os.path.join(os.path.dirname(__file__), "..", "data")
    if not os.path.exists(data_dir):
        os.makedirs(data_dir)
    
    # Path to the healthcare plan
    plan_path = os.path.join(data_dir, "plan.txt")
    
    # Check if plan.txt exists
    if not os.path.exists(plan_path):
        # If not, create a placeholder file
        with open(plan_path, "w") as f:
            f.write("No healthcare plan available. Please add your plan to data/plan.txt")
    
    # Load the document
    documents = SimpleDirectoryReader(input_files=[plan_path]).load_data()
    return documents

# Create embeddings model
_embed_model = OpenAIEmbedding(model="text-embedding-3-small")

# Load documents and create index
_documents = _load_document()
_node_parser = SimpleNodeParser.from_defaults(chunk_size=512, chunk_overlap=20)
_nodes = _node_parser.get_nodes_from_documents(_documents)

# Create a simple in-memory vector store
_vector_store = SimpleVectorStore()
_storage_context = StorageContext.from_defaults(vector_store=_vector_store)
_index = VectorStoreIndex(
    nodes=_nodes, 
    storage_context=_storage_context,
    embed_model=_embed_model
)

def query_engine():
    """Returns a query engine for the local healthcare plan"""
    return _index.as_query_engine()