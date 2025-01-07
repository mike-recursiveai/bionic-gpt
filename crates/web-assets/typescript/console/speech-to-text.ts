interface Window {
    webkitSpeechRecognition: typeof SpeechRecognition;
}

export class SpeechToText {
    private recognition: SpeechRecognition | null = null;
    private isRecording: boolean = false;
    private activeButton: HTMLElement | null = null;

    constructor() {
        this.initializeSpeechRecognition();
        this.setupEventListeners();
    }

    private initializeSpeechRecognition(): void {
        // Check for browser support
        if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
            const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
            this.recognition = new SpeechRecognitionAPI();
            
            if (this.recognition) {
                this.recognition.continuous = false;
                this.recognition.interimResults = false;
                this.recognition.lang = 'en-US';

                this.setupRecognitionEvents();
            }
        } else {
            console.warn('Speech recognition is not supported in this browser');
        }
    }

    private setupRecognitionEvents(): void {
        if (!this.recognition) return;

        this.recognition.onresult = (event: SpeechRecognitionEvent) => {
            const transcript = event.results[0][0].transcript;
            this.insertTranscriptToTextarea(transcript);
            this.stopRecording();
        };

        this.recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
            console.error('Speech recognition error:', event.error);
            this.stopRecording();
        };

        this.recognition.onend = () => {
            this.stopRecording();
        };
    }

    private setupEventListeners(): void {
        document.addEventListener('click', (event: Event) => {
            const target = event.target as HTMLElement;
            if (target.matches('[data-speech-to-text="true"]')) {
                this.handleButtonClick(target);
            }
        });
    }

    private handleButtonClick(button: HTMLElement): void {
        if (!this.recognition) {
            alert('Speech recognition is not supported in your browser');
            return;
        }

        if (this.isRecording) {
            this.stopRecording();
        } else {
            this.startRecording(button);
        }
    }

    private startRecording(button: HTMLElement): void {
        if (!this.recognition || this.isRecording) return;

        this.activeButton = button;
        this.isRecording = true;
        this.updateButtonState(true);
        
        try {
            this.recognition.start();
        } catch (error) {
            console.error('Error starting speech recognition:', error);
            this.stopRecording();
        }
    }

    private stopRecording(): void {
        if (!this.recognition || !this.isRecording) return;

        this.isRecording = false;
        this.updateButtonState(false);
        
        try {
            this.recognition.stop();
        } catch (error) {
            console.error('Error stopping speech recognition:', error);
        }
    }

    private updateButtonState(isRecording: boolean): void {
        if (this.activeButton) {
            this.activeButton.classList.toggle('recording', isRecording);
            this.activeButton.setAttribute('aria-pressed', isRecording.toString());
        }
    }

    private insertTranscriptToTextarea(transcript: string): void {
        if (!this.activeButton) return;

        const textarea = this.findNearestTextarea(this.activeButton);
        if (textarea) {
            const startPos = textarea.selectionStart || textarea.value.length;
            const endPos = textarea.selectionEnd || textarea.value.length;
            
            const textBefore = textarea.value.substring(0, startPos);
            const textAfter = textarea.value.substring(endPos);
            
            textarea.value = textBefore + transcript + textAfter;
            
            // Set cursor position after inserted text
            const newCursorPos = startPos + transcript.length;
            textarea.setSelectionRange(newCursorPos, newCursorPos);
            textarea.focus();
        }
    }

    private findNearestTextarea(element: HTMLElement): HTMLTextAreaElement | null {
        // First check if there's a textarea within the same parent container
        let parent = element.parentElement;
        while (parent) {
            const textarea = parent.querySelector('textarea');
            if (textarea) {
                return textarea;
            }
            parent = parent.parentElement;
        }
        
        // If no textarea found in parents, get the first textarea on the page
        return document.querySelector('textarea');
    }
}

// Initialize the speech-to-text functionality when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new SpeechToText();
});