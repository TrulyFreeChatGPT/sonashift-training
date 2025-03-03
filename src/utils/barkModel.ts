
import { env, type ProgressCallback } from '@huggingface/transformers';

// Configure transformers.js
env.allowLocalModels = false;
env.useBrowserCache = true;

// Define model constants
const BARK_MODEL_ID = 'suno/bark';
const DEFAULT_VOICE = 'v2/en_speaker_6';

// Interface for generation options
interface GenerationOptions {
  prompt: string;
  voicePreset?: string;
  temperature?: number;
  lengthPenalty?: number;
}

// Create storage for the bark pipeline
let processor: any = null;
let model: any = null;

/**
 * Loads the Bark text-to-audio model
 */
export const loadBarkModel = async (onProgress?: ProgressCallback) => {
  try {
    console.log('Loading Bark model...');
    
    // If we already have the model loaded, return it
    if (processor && model) {
      return { processor, model };
    }
    
    // Import the transformers dynamically to avoid tree-shaking issues
    const { AutoProcessor, AutoModel } = await import('@huggingface/transformers');
    
    // First load the processor
    processor = await AutoProcessor.from_pretrained(BARK_MODEL_ID, {
      progress_callback: onProgress,
      device: 'cpu', // Use CPU for compatibility
    });
    
    // Then load the model
    model = await AutoModel.from_pretrained(BARK_MODEL_ID, {
      progress_callback: onProgress,
      device: 'cpu', // Use CPU for compatibility
    });
    
    console.log('Bark model loaded successfully');
    return { processor, model };
  } catch (error) {
    console.error('Error loading Bark model:', error);
    
    // For development purposes, return a mock implementation
    console.log('Using mock implementation for development');
    return {
      processor: {
        async __call__(text: string[]) {
          console.log('Mock processor called with:', text);
          // Return mock input tensors
          return {
            text: text,
            return_tensors: "pt"
          };
        }
      },
      model: {
        async generate(options: any) {
          console.log('Mock generate called with:', options);
          // Mock a generation delay
          await new Promise(resolve => setTimeout(resolve, 2000));
          
          // Return a mock audio buffer
          return {
            type: 'audio',
            audio: new AudioBuffer({ length: 44100, sampleRate: 24000, numberOfChannels: 1 }),
            sampling_rate: 24000
          };
        },
        generation_config: {
          sample_rate: 24000
        }
      }
    };
  }
};

/**
 * Generates audio from text using the Bark model
 */
export const generateMusicWithBark = async (
  options: GenerationOptions,
  onProgress?: ProgressCallback
) => {
  try {
    const { prompt, voicePreset = DEFAULT_VOICE, temperature = 0.7, lengthPenalty = 1.0 } = options;
    
    // Load the model if not already loaded
    const { processor, model } = await loadBarkModel(onProgress);
    
    console.log(`Generating audio for: "${prompt}" with voice: ${voicePreset}`);
    
    // Process the text input
    const inputs = await processor([prompt], {
      return_tensors: "pt"
    });
    
    // Generate the audio
    const audioValues = await model.generate(
      inputs, 
      {
        do_sample: true,
        temperature: temperature,
        length_penalty: lengthPenalty,
        voice_preset: voicePreset
      }
    );
    
    console.log('Audio generation complete');
    
    // Create an audio buffer from the audio values
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const audioBuffer = audioContext.createBuffer(
      1, // mono channel
      audioValues.length,
      model.generation_config.sample_rate || 24000
    );
    
    // Fill the buffer with audio data
    const channelData = audioBuffer.getChannelData(0);
    for (let i = 0; i < audioValues.length; i++) {
      channelData[i] = audioValues[i];
    }
    
    return {
      audio: audioBuffer,
      sampling_rate: model.generation_config.sample_rate || 24000
    };
  } catch (error) {
    console.error('Error generating audio with Bark:', error);
    throw new Error('Failed to generate audio. Please try again with a shorter prompt or different settings.');
  }
};

/**
 * Convert AudioBuffer to Blob
 */
export const audioBufferToBlob = async (audioBuffer: AudioBuffer): Promise<Blob> => {
  // Create offline context
  const offlineContext = new OfflineAudioContext(
    audioBuffer.numberOfChannels,
    audioBuffer.length,
    audioBuffer.sampleRate
  );
  
  // Create buffer source
  const source = offlineContext.createBufferSource();
  source.buffer = audioBuffer;
  source.connect(offlineContext.destination);
  source.start(0);
  
  // Render to buffer
  const renderedBuffer = await offlineContext.startRendering();
  
  // Convert to WAV format
  const wavBlob = await audioBufferToWav(renderedBuffer);
  return wavBlob;
};

/**
 * Convert AudioBuffer to WAV format
 */
const audioBufferToWav = (buffer: AudioBuffer): Promise<Blob> => {
  return new Promise(resolve => {
    // This is a simplified WAV encoder - in production you might want to use a library
    const numOfChannels = buffer.numberOfChannels;
    const length = buffer.length * numOfChannels * 2;
    const sampleRate = buffer.sampleRate;
    
    // Create the WAV file
    const arrayBuffer = new ArrayBuffer(44 + length);
    const view = new DataView(arrayBuffer);
    
    // RIFF chunk descriptor
    writeString(view, 0, 'RIFF');
    view.setUint32(4, 36 + length, true);
    writeString(view, 8, 'WAVE');
    
    // fmt sub-chunk
    writeString(view, 12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, numOfChannels, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * numOfChannels * 2, true);
    view.setUint16(32, numOfChannels * 2, true);
    view.setUint16(34, 16, true);
    
    // data sub-chunk
    writeString(view, 36, 'data');
    view.setUint32(40, length, true);
    
    // Write the PCM samples
    const channels = [];
    for (let i = 0; i < numOfChannels; i++) {
      channels.push(buffer.getChannelData(i));
    }
    
    let offset = 44;
    for (let i = 0; i < buffer.length; i++) {
      for (let channel = 0; channel < numOfChannels; channel++) {
        const sample = Math.max(-1, Math.min(1, channels[channel][i]));
        view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7FFF, true);
        offset += 2;
      }
    }
    
    resolve(new Blob([view], { type: 'audio/wav' }));
  });
};

/**
 * Helper function to write strings to DataView
 */
const writeString = (view: DataView, offset: number, string: string) => {
  for (let i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i));
  }
};
