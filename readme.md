# Założenia Projektu Zipper: Kompresor Wiedzy Audio (PWA)

* **Wersja:** 1.0
* **Data:** 18.09.2025

---

## 1. Streszczenie

Celem projektu jest stworzenie aplikacji webowej typu **PWA (Progressive Web App)**, która umożliwia kompresję informacji z różnych źródeł (np. artykułów online, a docelowo również z np. YT, X, itp.) do skondensowanej formy tekstowej i dźwiękowej. Aplikacja ma być zoptymalizowana pod kątem urządzeń mobilnych, oferując użytkownikowi szybki i wygodny dostęp do wiedzy w formacie audio, możliwy do uruchomienia bezpośrednio z ikony na ekranie głównym telefonu.

---

## 2. Główne Cele

* **Przetwarzanie Treści:** Aplikacja musi być w stanie pobrać treść z podanego adresu URL.
* **Inteligentne Streszczanie:** Wykorzystanie modeli językowych (AI) do ekstrakcji najważniejszych informacji z pobranej treści.
* **Generowanie Audio:** Konwersja streszczenia tekstowego na plik audio (Text-to-Speech).
* **Dostępność Mobilna:** Stworzenie aplikacji jako PWA, co umożliwi jej "instalację" na urządzeniach mobilnych i stacjonarnych oraz zapewni natywny wygląd i odczucia.
* **Łatwość Użycia:** Uproszczenie procesu od podania linku do odsłuchania streszczenia do kilku kliknięć w intuicyjnym interfejsie.
* **Skalowalność:** Architektura musi pozwalać na łatwą rozbudowę o nowe źródła danych (np. YouTube, pliki PDF) i funkcje w przyszłości.

---

## 3. Architektura Systemu

Projekt zostanie zbudowany w architekturze rozproszonej, oddzielającej logikę biznesową od interfejsu użytkownika.

### ### Backend

* **Technologia:** Python
* **Framework:** FastAPI
* **Zadania:**
    1.  Udostępnienie **REST API** do komunikacji z frontendem.
    2.  Pobieranie i parsowanie treści ze stron internetowych (scraping).
    3.  Komunikacja z API modeli językowych (np. Google Gemini) w celu streszczenia tekstu.
    4.  Generowanie plików audio na podstawie streszczenia.
    5.  Serwowanie wygenerowanych plików audio do frontendu.

### ### Frontend

* **Technologie:** HTML, CSS, JavaScript (bez frameworka na początkowym etapie)
* **Typ Aplikacji:** Progressive Web App (PWA)
* **Zadania:**
    1.  Stworzenie intuicyjnego interfejsu użytkownika (pole na URL, przycisk, wyświetlanie wyników, odtwarzacz audio).
    2.  Wysyłanie zapytań (np. za pomocą `fetch`) do backendowego API.
    3.  Dynamiczne wyświetlanie otrzymanego streszczenia i odtwarzacza audio.
    4.  Implementacja mechanizmów PWA:
        * `manifest.json` do definicji aplikacji (ikona, nazwa, kolory).
        * `service-worker.js` do obsługi (w przyszłości) trybu offline i powiadomień.

---

## 4. Plan Rozwoju (Roadmap)

1.  **Faza 1: Utworzenie Backendu API:** Zbudowanie i przetestowanie serwera FastAPI z jednym endpointem `/summarize`, który przyjmuje URL i zwraca streszczenie.
2.  **Faza 2: Prototyp Frontendu:** Stworzenie podstawowej strony HTML/JS, która potrafi komunikować się z backendem, wysyłać URL i wyświetlać odpowiedź.
3.  **Faza 3: Implementacja PWA:** Przekształcenie frontendu w instalowalną aplikację PWA poprzez dodanie plików `manifest.json` i `service-worker.js`.
4.  **Faza 4: Integracja Audio:** Rozbudowa backendu i frontendu o funkcjonalność generowania i odtwarzania plików audio.
5.  **Faza 5: Wdrożenie (Deployment):** Umieszczenie backendu i frontendu na serwerach hostingowych, aby aplikacja była publicznie dostępna.
6.  **Faza 6: Dalszy Rozwój:** Dodawanie nowych funkcji, takich jak obsługa YouTube, logowanie użytkowników, personalizacja promptów AI w interfejsie.

---

## 5. Stos Technologiczny

* **Backend:** Python 3.x, FastAPI, Uvicorn, Gunicorn
* **Frontend:** HTML5, CSS3, JavaScript (ES6+)
* **AI:** Google Gemini API
* **TTS:** gTTS (początkowo), potencjalnie inne API (np. ElevenLabs)
* **Narzędzia:** Git, Docker (opcjonalnie do wdrożenia)