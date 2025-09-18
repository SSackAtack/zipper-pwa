import os
import uvicorn
from fastapi import FastAPI, Response
from pydantic import BaseModel
import requests
from bs4 import BeautifulSoup
import google.generativeai as genai
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from gtts import gTTS

# Konfiguracja ładowania zmiennych środowiskowych
load_dotenv()
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

# Inicjalizacja aplikacji FastAPI
app = FastAPI()

# Konfiguracja CORS, aby zezwolić na zapytania z dowolnego źródła
origins = ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Model danych dla przychodzącego URL
class Item(BaseModel):
    url: str


# Funkcje pomocnicze
def get_article_text(url: str):
    """Pobiera i oczyszcza tekst artykułu ze strony internetowej."""
    try:
        response = requests.get(url)
        response.raise_for_status()
        soup = BeautifulSoup(response.content, 'html.parser')
        paragrafy = soup.find_all('p')
        return ' '.join([p.get_text() for p in paragrafy])
    except requests.exceptions.RequestException as e:
        print(f"Błąd pobierania strony: {e}")
        return None


def summarize_text(text: str):
    """Wysyła tekst do modelu AI w celu streszczenia."""
    model = genai.GenerativeModel('gemini-1.5-flash')
    prompt = "Przeanalizuj poniższy artykuł i streść go w maksymalnie 5 kluczowych punktach. Twoja odpowiedź ma być zwięzła, konkretna i gotowa do przeczytania przez lektora."
    response = model.generate_content(prompt + text)
    return response.text


def text_to_audio(text: str, file_path: str):
    """Konwertuje tekst na mowę i zapisuje jako plik MP3."""
    try:
        os.makedirs(os.path.dirname(file_path), exist_ok=True)
        tts = gTTS(text=text, lang='pl')
        tts.save(file_path)
        return True
    except Exception as e:
        print(f"Błąd podczas tworzenia pliku audio: {e}")
        return False


# Główny endpoint API
@app.post("/summarize")
def summarize_endpoint(item: Item):
    """Przyjmuje URL, zwraca streszczenie i link do pliku audio."""
    article_text = get_article_text(item.url)
    if article_text:
        summary = summarize_text(article_text)

        audio_file_path = "static/audio/summary.mp3"
        audio_url = "/audio/summary.mp3"

        if text_to_audio(summary, audio_file_path):
            return {"summary": summary, "audio_url": audio_url}
        else:
            return {"summary": summary, "audio_url": None}

    return {"error": "Could not fetch or process the article"}


# Serwowanie plików statycznych (frontendu)
# html=True sprawia, że ścieżka "/" automatycznie serwuje plik index.html
app.mount("/", StaticFiles(directory="static", html=True), name="static")

# Uruchomienie serwera Uvicorn (dla Render)
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)