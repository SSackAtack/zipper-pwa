document.addEventListener('DOMContentLoaded', () => {
    const urlInput = document.getElementById('url-input');
    const submitBtn = document.getElementById('submit-btn');
    const resultContainer = document.getElementById('result-container');
    const summaryText = document.getElementById('summary-text');
    const audioPlayer = document.getElementById('audio-player');

    submitBtn.addEventListener('click', async () => {
        const url = urlInput.value;
        if (!url) {
            alert('Proszę wkleić URL!');
            return;
        }

        summaryText.textContent = 'Przetwarzam...';
        resultContainer.style.display = 'block';
        audioPlayer.style.display = 'none';

        try {
            // --- TUTAJ JEST POPRAWKA ---
            const response = await fetch('http://127.0.0.1:8000/summarize', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url: url }),
            });

            const data = await response.json();

            if (data.summary) {
                summaryText.textContent = data.summary;

                if (data.audio_url) {
                    audioPlayer.src = data.audio_url;
                    audioPlayer.load();
                    audioPlayer.style.display = 'block';
                }

            } else {
                summaryText.textContent = 'Wystąpił błąd: ' + data.error;
            }

        } catch (error) {
            summaryText.textContent = 'Nie można połączyć się z serwerem. Upewnij się, że backend jest uruchomiony.';
            console.error('Błąd:', error);
        }
    });

    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/service-worker.js')
                .then(registration => console.log('Service Worker zarejestrowany:', registration))
                .catch(error => console.log('Rejestracja Service Workera nie powiodła się:', error));
        });
    }
});