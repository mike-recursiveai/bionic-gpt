/**
 * Speech-to-text functionality using Web Speech API
 */

// Define type for the recognition result callback
type RecognitionCallback = (text: string) => void;

export class SpeechToText {
    private recognition: SpeechRecognition | null = null;
    private isListening: boolean = false;
    private onResultCallback: RecognitionCallback | null = null;

    constructor() {
        // Check if browser supports speech recognition
        if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
            const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
            this.recognition = new SpeechRecognitionAPI();
            this.setupRecognition();
        } else {
            console.error('Speech recognition is not supported in this browser');
        }
    }

    private setupRecognition(): void {
        if (!this.recognition) return;

        this.recognition.continuous = true;
        this.recognition.interimResults = true;

        this.recognition.onresult = (event: SpeechRecognitionEvent) => {
            const result = event.results[event.results.length - 1];
            const text = result[0].transcript;
            
            if (result.isFinal && this.onResultCallback) {
                this.onResultCallback(text);
            }
        };

        this.recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
            console.error('Speech recognition error:', event.error);
            this.stop();
        };
    }

    public start(callback: RecognitionCallback): void {
        if (!this.recognition) {
            console.error('Speech recognition is not supported');
            return;
        }

        if (this.isListening) {
            console.warn('Speech recognition is already running');
            return;
        }

        this.onResultCallback = callback;
        this.isListening = true;
        this.recognition.start();
    }

    public stop(): void {
        if (!this.recognition || !this.isListening) return;

        this.isListening = false;
        this.recognition.stop();
    }

    public isSupported(): boolean {
        return this.recognition !== null;
    }
}