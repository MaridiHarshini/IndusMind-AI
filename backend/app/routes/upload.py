from fastapi import APIRouter, UploadFile, File
import os
import shutil

from app.services.pdf_service import extract_text
from app.services.text_chunker import split_text
from app.services.embedding_service import store_chunks

router = APIRouter()

UPLOAD_FOLDER = "uploads"

# Create uploads folder if it doesn't exist
os.makedirs(UPLOAD_FOLDER, exist_ok=True)


@router.post("/upload")
async def upload_document(file: UploadFile = File(...)):
    # Save uploaded file
    file_path = os.path.join(UPLOAD_FOLDER, file.filename)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Extract text from PDF
    text = extract_text(file_path)

    # Split text into chunks
    chunks = split_text(text)

    # Store chunks in ChromaDB
    store_chunks(chunks)

    # Return response
    return {
        "message": "File uploaded successfully",
        "filename": file.filename,
        "total_chunks": len(chunks),
        "first_chunk": chunks[0] if chunks else ""
    }