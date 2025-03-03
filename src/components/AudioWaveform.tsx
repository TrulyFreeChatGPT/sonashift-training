
import React, { useEffect, useRef } from 'react';

interface AudioWaveformProps {
  audioUrl?: string;
  isPlaying?: boolean;
  className?: string;
  animated?: boolean;
}

const AudioWaveform: React.FC<AudioWaveformProps> = ({ 
  audioUrl, 
  isPlaying = false, 
  className = "",
  animated = false
}) => {
  const waveformRef = useRef<HTMLDivElement>(null);
  
  // For a real implementation, we would use a library like wavesurfer.js
  // This is a simple animated placeholder

  if (animated) {
    return (
      <div className={`waveform-container ${className}`}>
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className={`waveform-bar animate-waveform-${(i % 5) + 1}`}
            style={{ 
              height: `${Math.max(15, Math.random() * 40)}%`,
              opacity: isPlaying ? 1 : 0.4
            }}
          />
        ))}
      </div>
    );
  }
  
  return (
    <div 
      ref={waveformRef} 
      className={`relative h-20 w-full bg-secondary/30 rounded-md overflow-hidden ${className}`}
    >
      {audioUrl ? (
        <div className="absolute inset-0 flex items-center justify-center">
          {/* Placeholder waveform visualization */}
          {[...Array(50)].map((_, i) => (
            <div 
              key={i}
              className="w-1 mx-[1px] bg-primary/50 rounded-full"
              style={{ 
                height: `${15 + Math.sin(i * 0.2) * 10 + Math.random() * 15}px`,
                opacity: isPlaying ? 0.8 : 0.4
              }}
            />
          ))}
        </div>
      ) : (
        <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
          No audio loaded
        </div>
      )}
    </div>
  );
};

export default AudioWaveform;
