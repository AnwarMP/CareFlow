from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.responses import JSONResponse
from app.services.file_upload_service import save_uploaded_pdf

app = FastAPI()

@app.get("/")
async def root():
    return {"message": "Hello --CareFlow Server"}

@app.get("/health")
async def health():
    return {"status": "healthy"}

@app.post("/upload-pdf")
async def upload_pdf(file: UploadFile = File(...)):
    try:
        filename = await save_uploaded_pdf(file)
        return JSONResponse(content={"filename": filename, "message": "Upload successful!"})
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail="Internal server error.")
