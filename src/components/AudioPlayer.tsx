
import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Play, Pause, SkipBack, SkipForward, Volume, Volume2 } from "lucide-react";
import AudioWaveform from './AudioWaveform';

interface AudioPlayerProps {
  audioUrl?: string;
  title?: string;
  artist?: string;
  className?: string;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ 
  audioUrl,
  title = "Untitled",
  artist = "AI Generated",
  className = ""
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const audioRef = useRef<HTMLAudioElement>(null);

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(error => {
          console.error("Error playing audio:", error);
        });
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
    }
  };

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  const handleTimeChange = (value: number[]) => {
    const newTime = value[0];
    setCurrentTime(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  useEffect(() => {
    // Reset player when audio URL changes
    setIsPlaying(false);
    setCurrentTime(0);
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, [audioUrl]);

  return (
    <div className={`glass-morphism p-4 transition-all duration-300 ${className}`}>
      <div className="mb-3">
        <h3 className="font-medium text-sm truncate">{title}</h3>
        <p className="text-xs text-muted-foreground">{artist}</p>
      </div>
      
      <AudioWaveform
        audioUrl={audioUrl}
        isPlaying={isPlaying}
        animated={true}
        className="h-10 my-3"
      />
      
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration || 0)}</span>
        </div>
        
        <Slider
          value={[currentTime]}
          min={0}
          max={duration || 100}
          step={0.01}
          onValueChange={handleTimeChange}
          className="my-2"
        />
        
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="sm"
              className="rounded-full w-8 h-8 p-0"
            >
              <SkipBack className="h-4 w-4" />
              <span className="sr-only">Previous</span>
            </Button>
            
            <Button
              onClick={handlePlayPause}
              variant="default"
              size="default"
              className="rounded-full w-10 h-10 p-0 mx-1"
            >
              {isPlaying ? (
                <Pause className="h-5 w-5" />
              ) : (
                <Play className="h-5 w-5 ml-0.5" />
              )}
              <span className="sr-only">
                {isPlaying ? "Pause" : "Play"}
              </span>
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              className="rounded-full w-8 h-8 p-0"
            >
              <SkipForward className="h-4 w-4" />
              <span className="sr-only">Next</span>
            </Button>
          </div>
          
          <div className="flex items-center gap-2 w-24">
            {volume > 0 ? (
              <Volume2 className="h-4 w-4 text-muted-foreground" />
            ) : (
              <Volume className="h-4 w-4 text-muted-foreground" />
            )}
            <Slider
              value={[volume]}
              min={0}
              max={1}
              step={0.01}
              onValueChange={handleVolumeChange}
              className="w-full"
            />
          </div>
        </div>
      </div>
      
      {audioUrl && (
        <audio
          ref={audioRef}
          src={audioUrl}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={handleEnded}
          className="hidden"
        />
      )}
    </div>
  );
};

export default AudioPlayer;
