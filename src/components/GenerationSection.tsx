
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MusicIcon, DownloadIcon, RefreshCw, Wand2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import AudioPlayer from './AudioPlayer';
import { useIsMobile } from '@/hooks/use-mobile';

const GenerationSection: React.FC = () => {
  const [generating, setGenerating] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [temperature, setTemperature] = useState([0.7]);
  const [duration, setDuration] = useState([30]);
  const [audioUrl, setAudioUrl] = useState<string | undefined>(undefined);
  const [generationHistory, setGenerationHistory] = useState<string[]>([]);
  const isMobile = useIsMobile();
  
  const generateAudio = () => {
    if (!prompt.trim()) {
      toast.error("Please enter a prompt for generation");
      return;
    }
    
    setGenerating(true);
    toast.info("Starting music generation", {
      description: "This could take a minute or two depending on complexity."
    });
    
    // Simulating generation process
    setTimeout(() => {
      // In a real app, this would be a response from the model
      // For now we'll use a dummy audio file or oscillator-generated sound
      generateDummyAudio();
      
      setGenerating(false);
      setGenerationHistory(prev => [...prev, prompt]);
      
      toast.success("Music generated successfully", {
        description: "Your AI-generated music track is ready to play."
      });
    }, 3000);
  };
  
  const generateDummyAudio = () => {
    // Create a simple oscillator-based audio for demo purposes
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(440, audioContext.currentTime);
    gainNode.gain.setValueAtTime(0.5, audioContext.currentTime);
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    // Record the audio to a blob
    const mediaStreamDestination = audioContext.createMediaStreamDestination();
    gainNode.connect(mediaStreamDestination);
    
    const mediaRecorder = new MediaRecorder(mediaStreamDestination.stream);
    const chunks: BlobPart[] = [];
    
    mediaRecorder.ondataavailable = (e) => {
      chunks.push(e.data);
    };
    
    mediaRecorder.onstop = () => {
      const blob = new Blob(chunks, { type: 'audio/wav' });
      const url = URL.createObjectURL(blob);
      setAudioUrl(url);
    };
    
    // Start recording
    mediaRecorder.start();
    oscillator.start();
    
    // Generate a few seconds of audio
    setTimeout(() => {
      oscillator.stop();
      mediaRecorder.stop();
    }, 3000);
  };
  
  const downloadGeneration = () => {
    if (!audioUrl) return;
    
    const a = document.createElement('a');
    a.href = audioUrl;
    a.download = `ai-music-${Date.now()}.wav`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    toast.success("Download started");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Generate Music</CardTitle>
          <CardDescription>
            Describe the music you want to create and our AI will generate it for you.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="prompt" className="text-sm font-medium">
              Prompt
            </label>
            <Textarea
              id="prompt"
              placeholder="E.g., A calm piano melody with soft strings in the background, in the style of Debussy..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="h-32 resize-none"
            />
            <p className="text-xs text-muted-foreground">
              Be specific about instruments, mood, tempo, and style for best results.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-sm font-medium">Temperature</label>
                <span className="text-sm text-muted-foreground">{temperature[0].toFixed(2)}</span>
              </div>
              <Slider
                value={temperature}
                min={0.1}
                max={1.5}
                step={0.01}
                onValueChange={setTemperature}
              />
              <p className="text-xs text-muted-foreground">
                Higher values produce more creative but potentially less coherent music.
              </p>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-sm font-medium">Duration (seconds)</label>
                <span className="text-sm text-muted-foreground">{duration[0]}</span>
              </div>
              <Slider
                value={duration}
                min={10}
                max={120}
                step={5}
                onValueChange={setDuration}
              />
              <p className="text-xs text-muted-foreground">
                Longer durations require more generation time.
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Genre</label>
              <Select defaultValue="any">
                <SelectTrigger>
                  <SelectValue placeholder="Select genre" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any</SelectItem>
                  <SelectItem value="classical">Classical</SelectItem>
                  <SelectItem value="jazz">Jazz</SelectItem>
                  <SelectItem value="ambient">Ambient</SelectItem>
                  <SelectItem value="electronic">Electronic</SelectItem>
                  <SelectItem value="rock">Rock</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Base Model</label>
              <Select defaultValue="standard">
                <SelectTrigger>
                  <SelectValue placeholder="Select model" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">Standard (Balanced)</SelectItem>
                  <SelectItem value="instrumental">Instrumental Focus</SelectItem>
                  <SelectItem value="melody">Melody Specialized</SelectItem>
                  <SelectItem value="custom">Your Trained Model</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => setPrompt("")}
            disabled={!prompt || generating}
          >
            Clear
          </Button>
          <div className="flex gap-3">
            <Button
              variant="secondary"
              onClick={() => {
                setPrompt("A classical piano composition with gentle arpeggios and emotional chord progressions, inspired by Chopin nocturnes.");
              }}
              disabled={generating}
              className="gap-2"
            >
              <Sparkles className="h-4 w-4" />
              <span>Example</span>
            </Button>
            <Button
              onClick={generateAudio}
              disabled={!prompt.trim() || generating}
              className="gap-2"
            >
              {generating ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <Wand2 className="h-4 w-4" />
              )}
              <span>{generating ? "Generating..." : "Generate"}</span>
            </Button>
          </div>
        </CardFooter>
      </Card>
      
      <Card className={isMobile ? "mt-6" : ""}>
        <CardHeader>
          <CardTitle>Music Player</CardTitle>
          <CardDescription>
            Listen to your generated music and download it.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <AudioPlayer
            audioUrl={audioUrl}
            title={audioUrl ? "Generated Music" : "No audio yet"}
            artist="AI Generated"
          />
        </CardContent>
        {audioUrl && (
          <CardFooter className="px-6 pb-6 pt-0">
            <Button
              onClick={downloadGeneration}
              variant="outline"
              className="w-full gap-2"
            >
              <DownloadIcon className="h-4 w-4" />
              <span>Download</span>
            </Button>
          </CardFooter>
        )}
      </Card>
      
      {generationHistory.length > 0 && (
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>History</CardTitle>
            <CardDescription>
              Your recent generation prompts.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {generationHistory.map((item, index) => (
                <div
                  key={index}
                  className="bg-secondary px-3 py-1.5 rounded-full text-sm flex items-center gap-2 max-w-full"
                  title={item}
                >
                  <MusicIcon className="h-3.5 w-3.5 flex-shrink-0" />
                  <span className="truncate max-w-[200px]">{item}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default GenerationSection;
