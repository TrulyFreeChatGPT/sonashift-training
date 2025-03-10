
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { Wand2, PlayCircle, PauseCircle, Download, Save } from "lucide-react";
import { generateMusicWithBark, loadBarkModel, audioBufferToBlob } from '@/utils/barkModel';
import AudioPlayer from '@/components/AudioPlayer';
import Header from '@/components/Header';
import { type ProgressCallback } from '@huggingface/transformers';

const ModelPage = () => {
  const { id } = useParams<{ id: string }>();
  const [prompt, setPrompt] = useState("");
  const [generatedAudio, setGeneratedAudio] = useState<AudioBuffer | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isModelReady, setIsModelReady] = useState(false);
  const [progress, setProgress] = useState(0);
  const [temperature, setTemperature] = useState(0.7);
  const [lengthPenalty, setLengthPenalty] = useState(1.0);

  // Load model when component mounts
  useEffect(() => {
    const initModel = async () => {
      try {
        setIsModelReady(false);
        toast.info("Loading Bark AI model...");
        
        const progressCallback: ProgressCallback = (progressInfo) => {
          // Check if progressInfo has a progress property before using it
          if (progressInfo && typeof progressInfo === 'object' && 'progress' in progressInfo) {
            const progressValue = progressInfo.progress;
            setProgress(progressValue * 100);
          }
        };
        
        await loadBarkModel(progressCallback);
        setIsModelReady(true);
        toast.success("Bark AI model loaded successfully!");
      } catch (error) {
        console.error("Failed to load model:", error);
        toast.error("Failed to load Bark AI model. Please try refreshing the page.");
      }
    };

    initModel();
  }, []);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.warning("Please enter a prompt first");
      return;
    }

    try {
      setIsGenerating(true);
      setProgress(0);
      toast.info("Generating music from your prompt...");

      const progressCallback: ProgressCallback = (progressInfo) => {
        // Check if progressInfo has a progress property before using it
        if (progressInfo && typeof progressInfo === 'object' && 'progress' in progressInfo) {
          const progressValue = progressInfo.progress;
          setProgress(progressValue * 100);
        }
      };

      const result = await generateMusicWithBark(
        { 
          prompt: prompt.trim(),
          temperature,
          lengthPenalty
        },
        progressCallback
      );

      if (result?.audio) {
        setGeneratedAudio(result.audio);
        
        // Convert to blob and create URL
        const blob = await audioBufferToBlob(result.audio);
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        
        toast.success("Music generation complete!");
      }
    } catch (error) {
      console.error("Generation failed:", error);
      toast.error("Failed to generate music. Please try a different prompt or settings.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (audioUrl) {
      const a = document.createElement("a");
      a.href = audioUrl;
      a.download = `harmony-ai-${new Date().toISOString().slice(0, 10)}.wav`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      toast.success("Audio downloaded successfully");
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container pt-24 pb-16">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wand2 className="h-5 w-5 text-primary" />
                {id ? `Custom Model: ${id}` : 'Bark AI Music Generator'}
              </CardTitle>
              <CardDescription>
                Generate music and audio using the Suno Bark AI model
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {!isModelReady && (
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Loading Bark AI model...</p>
                  <Progress value={progress} className="h-2" />
                </div>
              )}
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Your Prompt</label>
                <Textarea
                  placeholder="Describe the music you want to generate..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  disabled={isGenerating || !isModelReady}
                  className="min-h-[120px]"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <label className="text-sm font-medium">Temperature</label>
                    <span className="text-sm text-muted-foreground">{temperature.toFixed(2)}</span>
                  </div>
                  <Slider
                    value={[temperature]}
                    min={0.1}
                    max={1.5}
                    step={0.01}
                    onValueChange={(value) => setTemperature(value[0])}
                    disabled={isGenerating || !isModelReady}
                  />
                  <p className="text-xs text-muted-foreground">
                    Controls randomness: lower values are more deterministic, higher values more creative
                  </p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <label className="text-sm font-medium">Length Penalty</label>
                    <span className="text-sm text-muted-foreground">{lengthPenalty.toFixed(2)}</span>
                  </div>
                  <Slider
                    value={[lengthPenalty]}
                    min={0.5}
                    max={2.0}
                    step={0.05}
                    onValueChange={(value) => setLengthPenalty(value[0])}
                    disabled={isGenerating || !isModelReady}
                  />
                  <p className="text-xs text-muted-foreground">
                    Controls generation length: higher values favor shorter outputs
                  </p>
                </div>
              </div>
              
              {isGenerating && (
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Generating music...</p>
                  <Progress value={progress} className="h-2" />
                </div>
              )}
              
              {audioUrl && (
                <div className="p-4 border rounded-lg bg-secondary/20">
                  <AudioPlayer audioUrl={audioUrl} />
                </div>
              )}
            </CardContent>
            
            <CardFooter className="flex justify-between">
              <Button 
                variant="outline" 
                onClick={handleDownload} 
                disabled={!audioUrl || isGenerating}
                className="gap-2"
              >
                <Download className="h-4 w-4" />
                Download
              </Button>
              
              <Button 
                onClick={handleGenerate} 
                disabled={isGenerating || !isModelReady || !prompt.trim()}
                className="gap-2"
              >
                {isGenerating ? (
                  <>
                    <PauseCircle className="h-4 w-4 animate-pulse" />
                    Generating...
                  </>
                ) : (
                  <>
                    <PlayCircle className="h-4 w-4" />
                    Generate Music
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default ModelPage;
