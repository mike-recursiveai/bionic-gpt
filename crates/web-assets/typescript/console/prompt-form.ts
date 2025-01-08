import { SpeechToText } from './speech-to-text';

document.addEventListener('DOMContentLoaded', () => {
    const speechToText = new SpeechToText();
    const button = document.getElementById('speech-to-text-button');
    const textarea = document.querySelector('textarea[name="message"]') as HTMLTextAreaElement;
    let isListening = false;

    if (!button || !textarea) {
        console.error('Required elements not found');
        return;
    }

    button.addEventListener('click', () => {
        if (!speechToText.isSupported()) {
            console.error('Speech recognition is not supported in this browser');
            return;
        }

        if (isListening) {
            speechToText.stop();
            isListening = false;
            button.classList.remove('bg-primary');
            button.classList.add('bg-secondary');
        } else {
            speechToText.start((text: string) => {
                // Insert text at cursor position or append to end
                const cursorPos = textarea.selectionStart;
                const textBefore = textarea.value.substring(0, cursorPos);
                const textAfter = textarea.value.substring(cursorPos);
                textarea.value = textBefore + text + ' ' + textAfter;
                
                // Update cursor position
                const newPos = cursorPos + text.length + 1;
                textarea.setSelectionRange(newPos, newPos);
                textarea.focus();
            });
            isListening = true;
            button.classList.remove('bg-secondary');
            button.classList.add('bg-primary');
        }
    });
});