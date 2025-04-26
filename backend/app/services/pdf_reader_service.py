# app/services/pdf_reader_service.py
# Extract text & Build Documents
import pdfplumber
from llama_index.core import Document

def load_pdf_as_documents(file_path: str) -> list[Document]:
    docs = []
    with pdfplumber.open(file_path) as pdf:
        for i, page in enumerate(pdf.pages):
            text = page.extract_text()
            if text:
                doc = Document(
                    text=text,
                    metadata={"page_label": f"Page {i+1}"}
                )
                docs.append(doc)
    return docs
