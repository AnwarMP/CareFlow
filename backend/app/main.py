import os
import traceback
from dotenv import load_dotenv
import nest_asyncio
nest_asyncio.apply()

from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.responses import JSONResponse
from pydantic import BaseModel

from app.services.file_upload_service import save_uploaded_pdf
from app.services.pdf_reader_service import load_pdf_as_documents
from app.services.ingestion_pipeline_service import process_documents
from app.services.vector_store_service import store_nodes_in_supabase
from app.services.embedding_service import get_embedding_model
from app.services.query_service import query_vector_store
from app.services.initialize_events_service import initialize_events_from_pdf
from app.services.event_service import get_all_events
from app.services.event_service import update_event_status
from app.services.clear_db_service import clear_documents_and_events

from fastapi.middleware.cors import CORSMiddleware

nest_asyncio.apply()

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8080"],  # Replace with your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Hello --CareFlow Server"}

@app.get("/health")
async def health():
    return {"status": "healthy"}

@app.get("/get-events")
async def get_events():
    try:
        events = get_all_events()
        return events
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    

class UpdateEventStatusRequest(BaseModel):
    id: str
    status: str  # 'pending', 'completed', or 'missed'

@app.post("/update-event-status")
async def update_status(request: UpdateEventStatusRequest):
    try:
        update_event_status(request.id, request.status)
        return {"message": "Status updated successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/upload-pdf")
async def upload_pdf(file: UploadFile = File(...)):
    try:
        # 1. Clear existing DB entries
        clear_documents_and_events()

        # 2. Save new file
        filename = await save_uploaded_pdf(file)
        return JSONResponse(content={"filename": filename, "message": "Upload successful!"})
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        print("UPLOAD ERROR:", traceback.format_exc())
        raise HTTPException(status_code=500, detail="Internal server error.")
    
class IngestRequest(BaseModel):
    filename: str

class InitializeEventsRequest(BaseModel):
    filename: str
    
@app.post("/ingest-pdf/")
async def ingest_pdf(request: IngestRequest):
    try:
        file_path = f"app/uploaded_pdfs/{request.filename}"
        if not os.path.exists(file_path):
            raise HTTPException(status_code=404, detail="File not found.")

        documents = load_pdf_as_documents(file_path)
        if not documents:
            raise HTTPException(status_code=400, detail="Failed to extract any text from the uploaded PDF.")

        nodes = process_documents(documents)
        if not nodes:
            raise HTTPException(status_code=400, detail="Failed to process any nodes from the uploaded PDF.")

        embed_model = get_embedding_model()
        store_nodes_in_supabase(nodes, embed_model)

        return {"message": "✅ PDF processed and data stored successfully."}

    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Server error during ingestion: {str(e)}")


@app.get("/query/")
async def query_knowledgebase(q: str):
    try:
        if not q:
            raise HTTPException(status_code=400, detail="Query parameter 'q' cannot be empty.")

        response = query_vector_store(q)

        if not response:
            raise HTTPException(status_code=404, detail="No relevant information found for the query.")

        return {"response": response}

    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Server error during query: {str(e)}")
    
@app.post("/initialize-events/")
async def initialize_events(request: InitializeEventsRequest):
    try:
        inserted_count = initialize_events_from_pdf(request.filename)
        return {"message": f"✅ Initialized events from PDF", "events_inserted": inserted_count}
    except FileNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Server error during event initialization: {str(e)}")

