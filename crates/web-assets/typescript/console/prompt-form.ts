import { startSpeechRecognition } from './speech-to-text';

let currentStopRecognition: (() => void) | null = null;

function initializeSpeechToText() {
    const button = document.getElementById('speech-to-text-button');
    const textarea = document.getElementById('prompt-textarea') as HTMLTextAreaElement;

    if (!button || !textarea) {
        console.error('Speech-to-text elements not found');
        return;
    }

    button.addEventListener('click', () => {
        if (currentStopRecognition) {
            // If recognition is active, stop it
            currentStopRecognition();
            currentStopRecognition = null;
            button.classList.remove('bg-primary');
            button.classList.add('bg-secondary');
        } else {
            // Start new recognition
            currentStopRecognition = startSpeechRecognition(textarea);
            button.classList.remove('bg-secondary');
            button.classList.add('bg-primary');
        }
    });
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeSpeechToText);