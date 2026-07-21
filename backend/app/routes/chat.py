from fastapi import APIRouter
from pydantic import BaseModel

from app.services.embedding_service import search_chunks
from app.services.groq_service import ask_groq

router = APIRouter()

class ChatRequest(BaseModel):
    question: str

@router.post("/ask")
def ask_question(request: ChatRequest):
    # Retrieve relevant chunks from ChromaDB
    context = "\n\n".join(search_chunks(request.question))

    # Get answer from Gemini
    print(">>> USING GROQ <<<")
    answer = ask_groq(request.question, context)
    return {
        "question": request.question,
        "answer": answer
    }