# Zipper - Kompresor Wiedzy Audio (PWA)

* **Status:** Aktywny / Wdrożony
* **Wersja:** 1.0

[![Status Wdrożenia](https://img.shields.io/badge/Render-Live-brightgreen)](https://zipper-pwa.onrender.com)

**Aplikacja na żywo: [https://zipper-pwa.onrender.com](https://zipper-pwa.onrender.com)**

---

## 1. Opis Projektu

**Zipper** to aplikacja webowa typu **PWA (Progressive Web App)**, która umożliwia kompresję informacji z artykułów online do skondensowanej formy tekstowej i dźwiękowej. Aplikacja została stworzona z myślą o urządzeniach mobilnych, oferując szybki dostęp do wiedzy w formacie audio. Można ją zainstalować na ekranie głównym telefonu lub komputera.



---

## 2. Jak uruchomić lokalnie?

1.  **Sklonuj repozytorium:**
    ```bash
    git clone [https://github.com/SSackAtack/zipper-pwa.git](https://github.com/SSackAtack/zipper-pwa.git)
    cd zipper-pwa
    ```
2.  **Stwórz plik `.env`:**
    W głównym folderze stwórz plik `.env` i dodaj do niego swój klucz API:
    ```
    GOOGLE_API_KEY="...twój klucz..."
    ```
3.  **Zainstaluj zależności:**
    ```bash
    pip install -r requirements.txt
    ```
4.  **Uruchom serwer backendu:**
    ```bash
    python -m uvicorn backend:app --reload
    ```
    Aplikacja będzie dostępna pod adresem `http://127.0.0.1:8000`.

---

## 3. Architektura i Stos Technologiczny

Aplikacja zbudowana jest w architekturze klient-serwer.

* **Backend:**
    * **Technologia:** Python, FastAPI
    * **Zadania:** Serwowanie frontendu, udostępnianie API do pobierania, streszczania (przez Google Gemini API) i konwersji tekstu na mowę (gTTS).

* **Frontend:**
    * **Technologie:** HTML, CSS, JavaScript
    * **Typ:** Progressive Web App (PWA)
    * **Zadania:** Interfejs użytkownika, komunikacja z API backendu, obsługa Service Workera i manifestu aplikacji.

---

## 4. Status Projektu i Dalsze Kroki

### ### Zrealizowane Fazy:
* ✅ **Faza 1:** Utworzenie Backendu API w FastAPI.
* ✅ **Faza 2:** Zbudowanie prototypu Frontendu (HTML/JS).
* ✅ **Faza 3:** Implementacja PWA (manifest, service worker).
* ✅ **Faza 4:** Integracja generowania audio.
* ✅ **Faza 5:** Wdrożenie na platformie Render.

### ### Planowany Dalszy Rozwój:
* Integracja z profesjonalnym API TTS (np. ElevenLabs) dla lepszej jakości głosu.
* Dodanie obsługi linków z YouTube (streszczanie transkrypcji).
* Wprowadzenie historii wygenerowanych streszczeń.
* Możliwość wyboru stylu i długości streszczenia w interfejsie.