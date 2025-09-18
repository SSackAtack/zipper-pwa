from fastapi import FastAPI, Response
from pydantic import BaseModel
import requests
from bs4 import BeautifulSoup
import google.generativeai as genai
import os
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from gtts import gTTS  # Nowy import

# Konfiguracja
load_dotenv()
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

app = FastAPI()

# Konfiguracja CORS (bez zmian)
origins = ["*"]
app.add_middleware(CORSMiddleware, allow_origins=origins, allow_credentials=True, allow_methods=["*"],
                   allow_headers=["*"])


class Item(BaseModel):
    url: str


def get_article_text(url: str):
    try:
        response = requests.get(url)
        soup = BeautifulSoup(response.content, 'html.parser')
        paragrafy = soup.find_all('p')
        return ' '.join([p.get_text() for p in paragrafy])
    except Exception:
        return None


def summarize_text(text: str):
    model = genai.GenerativeModel('gemini-1.5-flash')
    prompt = "Przeanalizuj poniższy artykuł i streść go w 3-5 kluczowych punktach..."
    response = model.generate_content(prompt + text)
    return response.text


# --- NOWA FUNKCJA DO TWORZENIA AUDIO ---
def text_to_audio(text: str, file_path: str):
    try:
        # Utwórz folder /audio jeśli nie istnieje
        os.makedirs(os.path.dirname(file_path), exist_ok=True)
        tts = gTTS(text=text, lang='pl')
        tts.save(file_path)
        return True
    except Exception as e:
        print(f"Błąd podczas tworzenia audio: {e}")
        return False


@app.post("/summarize")
def summarize_endpoint(item: Item):
    article_text = get_article_text(item.url)
    if article_text:
        summary = summarize_text(article_text)

        # --- ZMIANA: GENEROWANIE I ZWRACANIE LINKU DO AUDIO ---
        audio_file_path = "static/audio/summary.mp3"
        audio_url = "/audio/summary.mp3"

        if text_to_audio(summary, audio_file_path):
            return {"summary": summary, "audio_url": audio_url}
        else:
            return {"summary": summary, "audio_url": None}

    return {"error": "Could not fetch article"}


@app.get("/")
def read_root():
    with open('static/index.html') as f:
        return Response(content=f.read(), media_type='text/html')


app.mount("/", StaticFiles(directory="static"), name="static")