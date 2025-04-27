# app/services/initialize_events_service.py

import os
from app.services.pdf_reader_service import load_pdf_as_documents
from app.services.event_extraction_service import extract_events_from_text
from app.services.event_insertion_service import insert_events_to_db

def initialize_events_from_pdf(filename: str) -> int:
    """
    Full pipeline:
    - Load a saved PDF
    - Extract structured events using LLM
    - Insert them into the events database
    """
    file_path = os.path.join("app", "uploaded_pdfs", filename)

    if not os.path.exists(file_path):
        raise FileNotFoundError(f"Uploaded PDF file not found: {filename}")

    documents = load_pdf_as_documents(file_path)
    if not documents:
        raise ValueError("No content extracted from PDF.")

    # Join all page texts into one block
    full_text = "\n\n".join(doc.text for doc in documents)

    structured_events = extract_events_from_text(full_text)

    if not structured_events:
        raise ValueError("No events extracted from the document.")

    inserted_count = insert_events_to_db(structured_events)

    return inserted_count
