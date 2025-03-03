
/**
 * Utility functions for audio processing in the music AI application
 */

/**
 * Converts audio file to the correct format for model input
 * @param file Audio file to process
 * @returns Promise resolving to the processed audio data
 */
export async function processAudioFileForTraining(file: File): Promise<ArrayBuffer> {
  // In a real implementation, this would convert audio to the correct format,
  // sample rate, etc. for model input
  
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = () => {
      if (reader.result instanceof ArrayBuffer) {
        resolve(reader.result);
      } else {
        reject(new Error("Failed to read file as ArrayBuffer"));
      }
    };
    
    reader.onerror = () => {
      reject(reader.error);
    };
    
    reader.readAsArrayBuffer(file);
  });
}

/**
 * Extracts audio features for visualization
 * @param audioBuffer Audio data buffer
 * @returns Array of amplitude values for visualization
 */
export function extractAudioFeatures(audioBuffer: ArrayBuffer): number[] {
  // This is a placeholder - in a real app, you'd use the Web Audio API
  // to extract meaningful features from the audio for visualization
  
  // For simplicity, just returning random values for demo
  const dataView = new DataView(audioBuffer);
  const result: number[] = [];
  
  // Sample the audio buffer at regular intervals
  const step = Math.floor(audioBuffer.byteLength / 100);
  
  for (let i = 0; i < 100; i++) {
    const index = i * step;
    if (index < audioBuffer.byteLength) {
      // Get a value between 0 and 1 based on the byte value
      const value = dataView.getUint8(index) / 255;
      result.push(value);
    }
  }
  
  return result;
}

/**
 * Calculates audio duration in seconds
 * @param audioBuffer Audio data buffer
 * @returns Duration in seconds
 */
export function calculateAudioDuration(audioBuffer: AudioBuffer): number {
  return audioBuffer.duration;
}

/**
 * Creates a simple audio visualization for waveform display
 * @param canvas Canvas element for drawing
 * @param audioData Audio data for visualization
 * @param color Color for the waveform
 */
export function drawWaveform(canvas: HTMLCanvasElement, audioData: number[], color: string = '#3b82f6'): void {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  
  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Set up drawing properties
  ctx.lineWidth = 2;
  ctx.strokeStyle = color;
  ctx.beginPath();
  
  // Draw the waveform
  const width = canvas.width;
  const height = canvas.height;
  const step = width / audioData.length;
  
  for (let i = 0; i < audioData.length; i++) {
    const x = i * step;
    const y = height - (audioData[i] * height);
    
    if (i === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  }
  
  ctx.stroke();
}

/**
 * Converts frequency data to a visual representation
 * @param frequencyData Frequency data from analyzer node
 * @param maxHeight Maximum height for visualization
 * @returns Array of heights for visualization bars
 */
export function normalizeFrequencyData(frequencyData: Uint8Array, maxHeight: number): number[] {
  return Array.from(frequencyData).map(value => {
    // Convert from 0-255 to a proportion of maxHeight
    return (value / 255) * maxHeight;
  });
}
