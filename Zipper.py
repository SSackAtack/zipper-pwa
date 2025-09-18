from fastapi import FastAPI
from pydantic import BaseModel
import requests
from bs4 import BeautifulSoup
import google.generativeai as genai
import os
from dotenv import load_dotenv

# Konfiguracja - tak jak poprzednio
load_dotenv()
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

app = FastAPI()

class Item(BaseModel):
    url: str

def get_article_text(url: str):
    # Ta funkcja pozostaje praktycznie bez zmian
    try:
        response = requests.get(url)
        soup = BeautifulSoup(response.content, 'html.parser')
        paragrafy = soup.find_all('p')
        return ' '.join([p.get_text() for p in paragrafy])
    except Exception:
        return None

def summarize_text(text: str):
    # Ta funkcja również bez zmian
    model = genai.GenerativeModel('gemini-1.5-flash')
    prompt = "Przeanalizuj poniższy artykuł i streść go w 3-5 kluczowych punktach..." # Można dodać więcej
    response = model.generate_content(prompt + text)
    return response.text

@app.post("/summarize")
def summarize_endpoint(item: Item):
    article_text = get_article_text(item.url)
    if article_text:
        summary = summarize_text(article_text)
        # Na razie zwracamy tylko tekst, audio dodamy później
        return {"summary": summary}
    return {"error": "Could not fetch article"}