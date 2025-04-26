import os
from fastapi import UploadFile

UPLOAD_DIRECTORY = "app/uploaded_pdfs"
os.makedirs(UPLOAD_DIRECTORY, exist_ok=True)

async def save_uploaded_pdf(file: UploadFile) -> str:
    if not file.filename.endswith(".pdf"):
        raise ValueError("Only PDF files are allowed.")

    file_location = os.path.join(UPLOAD_DIRECTORY, file.filename)

    with open(file_location, "wb+") as file_object:
        file_object.write(await file.read())

    return file.filename
