import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv(dotenv_path=".env")
print("API KEY:", os.getenv("GEMINI_API_KEY"))

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

model = genai.GenerativeModel("gemini-2.5-flash-lite")


def ask_gemini(question, context):
    prompt = f"""
You are an industrial knowledge assistant.

Context:
{context}

Question:
{question}

Answer based only on the provided context.
"""

    response = model.generate_content(prompt)
    return response.text