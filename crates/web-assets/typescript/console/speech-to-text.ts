/**
 * Speech-to-text functionality using Web Speech API
 */

interface SpeechRecognitionResult {
    isFinal: boolean;
    [index: number]: {
        transcript: string;
        confidence: number;
    };
}

interface SpeechRecognitionEvent {
    results: SpeechRecognitionResult[];
    resultIndex: number;
}

// Check if browser supports the Web Speech API
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = SpeechRecognition ? new SpeechRecognition() : null;

/**
 * Start speech recognition and convert speech to text
 * @param targetElement - The textarea element to insert the text into
 * @returns A cleanup function to stop the recognition
 */
export function startSpeechRecognition(targetElement: HTMLTextAreaElement): () => void {
    if (!recognition) {
        console.error('Speech recognition is not supported in this browser');
        return () => {};
    }

    // Configure recognition
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    // Handle results
    recognition.onresult = (event: SpeechRecognitionEvent) => {
        const result = event.results[event.resultIndex];
        if (result.isFinal) {
            const transcript = result[0].transcript;
            const currentValue = targetElement.value;
            const cursorPosition = targetElement.selectionStart || currentValue.length;
            
            // Insert text at cursor position
            targetElement.value = 
                currentValue.slice(0, cursorPosition) + 
                transcript + 
                currentValue.slice(cursorPosition);
            
            // Move cursor to end of inserted text
            targetElement.selectionStart = cursorPosition + transcript.length;
            targetElement.selectionEnd = cursorPosition + transcript.length;
        }
    };

    // Handle errors
    recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
    };

    // Start recognition
    recognition.start();

    // Return cleanup function
    return () => {
        recognition.stop();
    };
}