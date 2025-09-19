document.addEventListener('DOMContentLoaded', () => {
    const urlInput = document.getElementById('url-input');
    const submitBtn = document.getElementById('submit-btn');
    const resultContainer = document.getElementById('result-container');
    const summaryText = document.getElementById('summary-text');
    const audioPlayer = document.getElementById('audio-player');
    const playbackSpeedContainer = document.getElementById('playback-speed-container');
    const speedSlider = document.getElementById('speed-slider');
    const speedLabel = document.getElementById('speed-label');
    const styleSelector = document.getElementById('style-selector'); // Nowy element

    submitBtn.addEventListener('click', async () => {
        const url = urlInput.value;
        const style = styleSelector.value; // Pobranie wartości stylu

        if (!url) {
            alert('Proszę wkleić URL!');
            return;
        }

        summaryText.textContent = 'Przetwarzam...';
        resultContainer.style.display = 'block';
        audioPlayer.style.display = 'none';
        playbackSpeedContainer.style.display = 'none';

        try {
            const response = await fetch('/summarize', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                // Wysłanie URL i stylu do backendu
                body: JSON.stringify({ url: url, style: style }),
            });

            const data = await response.json();

            if (data.summary) {
                summaryText.textContent = data.summary;

                if (data.audio_url) {
                    audioPlayer.src = `${data.audio_url}?t=${new Date().getTime()}`;
                    audioPlayer.load();
                    audioPlayer.style.display = 'block';
                    playbackSpeedContainer.style.display = 'block';
                }

            } else {
                summaryText.textContent = 'Wystąpił błąd: ' + data.error;
            }

        } catch (error) {
            summaryText.textContent = 'Nie można połączyć się z serwerem. Upewnij się, że backend jest uruchomiony.';
            console.error('Błąd:', error);
        }
    });

    // Rejestracja Service Workera dla PWA
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/service-worker.js')
                .then(registration => console.log('Service Worker zarejestrowany:', registration))
                .catch(error => console.log('Rejestracja Service Workera nie powiodła się:', error));
        });
    }

    speedSlider.addEventListener('input', () => {
        const speed = parseFloat(speedSlider.value);
        audioPlayer.playbackRate = speed;
        speedLabel.textContent = `${speed.toFixed(2)}x`;
    });
});