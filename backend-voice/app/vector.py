from llama_index.vector_stores.supabase import SupabaseVectorStore
from llama_index.core import StorageContext, VectorStoreIndex
from supabase import create_client
from .config import settings

_cfg = settings()
_client = create_client(_cfg["SUPABASE_URL"], _cfg["SUPABASE_SERVICE_ROLE_KEY"])

_vec_store = SupabaseVectorStore(
    postgres_connection_string=_cfg["POSTGRES_CONN"],
    collection_name="care_plans_collection",
    client=_client,
    table_name="care_plans",
    dimension=_cfg["EMBED_DIM"],
)

# Create the index directly from the vector store, not from storage context
_index = VectorStoreIndex.from_vector_store(vector_store=_vec_store)

def query_engine():
    # returns a cached QueryEngine instance
    return _index.as_query_engine()