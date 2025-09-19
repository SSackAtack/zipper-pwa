document.addEventListener('DOMContentLoaded', () => {
    // === Główne elementy aplikacji ===
    const urlInput = document.getElementById('url-input');
    const submitBtn = document.getElementById('submit-btn');
    const styleSelector = document.getElementById('style-selector');
    const resultContainer = document.getElementById('result-container');
    const summaryText = document.getElementById('summary-text');
    const audioPlayer = document.getElementById('audio-player');

    // === Elementy sekcji ustawień ===
    const speedSlider = document.getElementById('speed-slider');
    const speedLabel = document.getElementById('speed-label');
    const saveConfirmation = document.getElementById('save-confirmation');

    // --- LOGIKA USTAWIEŃ ---

    // Funkcja wczytująca i stosująca zapisane ustawienia
    function loadAndApplySettings() {
        const savedSpeed = localStorage.getItem('defaultPlaybackSpeed');
        if (savedSpeed) {
            const speedValue = parseFloat(savedSpeed);
            // Zastosuj do odtwarzacza
            audioPlayer.defaultPlaybackRate = speedValue;
            audioPlayer.playbackRate = speedValue;
            // Zaktualizuj suwak i etykietę w sekcji ustawień
            speedSlider.value = speedValue;
            speedLabel.textContent = `${speedValue.toFixed(2)}x`;
        }
    }

    // Funkcja zapisująca ustawienia
    function saveSettings() {
        const speedValue = parseFloat(speedSlider.value);
        localStorage.setItem('defaultPlaybackSpeed', speedValue);

        // Zastosuj zmianę natychmiast do odtwarzacza
        audioPlayer.defaultPlaybackRate = speedValue;
        audioPlayer.playbackRate = speedValue;

        // Pokaż potwierdzenie zapisu
        saveConfirmation.style.display = 'block';
        // Ukryj potwierdzenie po 2 sekundach
        setTimeout(() => {
            saveConfirmation.style.display = 'none';
        }, 2000);
    }

    // Nasłuchuj na zmianę wartości suwaka
    speedSlider.addEventListener('input', () => {
        // Aktualizuj etykietę na bieżąco
        const speedValue = parseFloat(speedSlider.value);
        speedLabel.textContent = `${speedValue.toFixed(2)}x`;
    });

    // Zapisz ustawienia, gdy użytkownik puści suwak
    speedSlider.addEventListener('change', saveSettings);

    // --- GŁÓWNA LOGIKA APLIKACJI ---

    submitBtn.addEventListener('click', async () => {
        const url = urlInput.value;
        const style = styleSelector.value;

        if (!url) {
            alert('Proszę wkleić URL!');
            return;
        }

        summaryText.textContent = 'Przetwarzam...';
        resultContainer.style.display = 'block';
        audioPlayer.style.display = 'none';

        try {
            const response = await fetch('/summarize', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url: url, style: style }),
            });

            const data = await response.json();

            if (data.summary) {
                summaryText.textContent = data.summary;
                if (data.audio_url) {
                    audioPlayer.src = `${data.audio_url}?t=${new Date().getTime()}`;
                    audioPlayer.load();
                    audioPlayer.style.display = 'block';
                }
            } else {
                summaryText.textContent = 'Wystąpił błąd: ' + data.error;
            }
        } catch (error) {
            summaryText.textContent = 'Nie można połączyć się z serwerem.';
            console.error('Błąd:', error);
        }
    });

    // --- INICJALIZACJA ---

    // Wczytaj ustawienia zaraz po załadowaniu strony
    loadAndApplySettings();

    // Rejestracja Service Workera dla PWA
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/service-worker.js')
                .then(registration => console.log('Service Worker zarejestrowany:', registration))
                .catch(error => console.log('Rejestracja Service Workera nie powiodła się:', error));
        });
    }
});