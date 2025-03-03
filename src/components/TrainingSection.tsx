
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Waveform, Bot, FileAudio, BarChart3, Play, Pause, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import AudioUploader from './AudioUploader';

const TrainingSection = () => {
  const [isTraining, setIsTraining] = useState(false);
  const [progress, setProgress] = useState(0);
  const [epochs, setEpochs] = useState([10]);
  const [batchSize, setBatchSize] = useState([32]);
  const [learningRate, setLearningRate] = useState([0.001]);
  
  const startTraining = () => {
    if (isTraining) return;
    
    setIsTraining(true);
    setProgress(0);
    
    toast.success("Training started", {
      description: "Your AI model is now training on the uploaded audio samples."
    });
    
    // Simulate training process
    const interval = setInterval(() => {
      setProgress(prev => {
        const increment = Math.random() * 2 + 0.5;
        const newProgress = prev + increment;
        
        if (newProgress >= 100) {
          clearInterval(interval);
          setIsTraining(false);
          toast.success("Training completed", {
            description: "Your AI model has been successfully trained and is ready for generation."
          });
          return 100;
        }
        
        return newProgress;
      });
    }, 1000);
  };
  
  const stopTraining = () => {
    setIsTraining(false);
    toast.info("Training paused", {
      description: "You can resume training later from this point."
    });
  };

  return (
    <Tabs defaultValue="upload" className="w-full">
      <TabsList className="grid grid-cols-3 mb-6">
        <TabsTrigger value="upload" className="flex items-center gap-2 py-2">
          <FileAudio className="h-4 w-4" />
          <span>Data Upload</span>
        </TabsTrigger>
        <TabsTrigger value="parameters" className="flex items-center gap-2 py-2">
          <Bot className="h-4 w-4" />
          <span>Parameters</span>
        </TabsTrigger>
        <TabsTrigger value="training" className="flex items-center gap-2 py-2">
          <Waveform className="h-4 w-4" />
          <span>Training</span>
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="upload" className="animate-slide-up">
        <Card>
          <CardHeader>
            <CardTitle>Upload Training Data</CardTitle>
            <CardDescription>
              Upload audio files to train your AI model. The more quality samples you provide, the better your results will be.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AudioUploader />
          </CardContent>
          <CardFooter className="flex justify-between">
            <p className="text-sm text-muted-foreground">
              Supported formats: WAV, MP3, AIFF, FLAC
            </p>
            <Button onClick={() => document.querySelector('[data-value="parameters"]')?.click()}>
              Next Step
            </Button>
          </CardFooter>
        </Card>
      </TabsContent>
      
      <TabsContent value="parameters" className="animate-slide-up">
        <Card>
          <CardHeader>
            <CardTitle>Training Parameters</CardTitle>
            <CardDescription>
              Configure the parameters for your AI model training. These settings affect the quality and training time.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <div className="flex justify-between">
                <label className="text-sm font-medium">Epochs</label>
                <span className="text-sm text-muted-foreground">{epochs[0]}</span>
              </div>
              <Slider
                value={epochs}
                min={1}
                max={50}
                step={1}
                onValueChange={setEpochs}
              />
              <p className="text-xs text-muted-foreground">
                Number of complete passes through the training dataset. Higher values may improve quality but increase training time.
              </p>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <label className="text-sm font-medium">Batch Size</label>
                <span className="text-sm text-muted-foreground">{batchSize[0]}</span>
              </div>
              <Slider
                value={batchSize}
                min={8}
                max={128}
                step={8}
                onValueChange={setBatchSize}
              />
              <p className="text-xs text-muted-foreground">
                Number of samples processed before updating the model. Larger batches use more memory but may train faster.
              </p>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <label className="text-sm font-medium">Learning Rate</label>
                <span className="text-sm text-muted-foreground">{learningRate[0].toFixed(4)}</span>
              </div>
              <Slider
                value={learningRate}
                min={0.0001}
                max={0.01}
                step={0.0001}
                onValueChange={setLearningRate}
              />
              <p className="text-xs text-muted-foreground">
                Controls how quickly the model adapts to the problem. Too high may cause instability, too low may cause slow convergence.
              </p>
            </div>
            
            <div className="flex items-start gap-2 p-3 bg-yellow-500/10 border border-yellow-600/20 rounded-md text-yellow-200">
              <AlertTriangle className="h-5 w-5 flex-shrink-0 mt-0.5" />
              <p className="text-sm">
                Advanced parameters will affect both training time and result quality. If you're unsure, we recommend using the default values.
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => document.querySelector('[data-value="upload"]')?.click()}>
              Previous
            </Button>
            <Button onClick={() => document.querySelector('[data-value="training"]')?.click()}>
              Next Step
            </Button>
          </CardFooter>
        </Card>
      </TabsContent>
      
      <TabsContent value="training" className="animate-slide-up">
        <Card>
          <CardHeader>
            <CardTitle>Train Your AI Model</CardTitle>
            <CardDescription>
              Start training your AI model with the uploaded audio data and selected parameters.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Training Progress</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
              <p className="text-xs text-muted-foreground">
                {isTraining 
                  ? "Training in progress. This may take some time depending on your parameters and dataset size."
                  : progress === 100 
                    ? "Training completed successfully!" 
                    : "Click Start Training to begin the process."}
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-secondary/30 rounded-md">
                <div className="flex items-center gap-2 mb-1">
                  <BarChart3 className="h-4 w-4 text-primary" />
                  <h4 className="text-sm font-medium">Loss</h4>
                </div>
                <p className="text-2xl font-semibold">
                  {isTraining ? (0.5 - (progress / 100) * 0.3).toFixed(4) : "0.0000"}
                </p>
              </div>
              
              <div className="p-4 bg-secondary/30 rounded-md">
                <div className="flex items-center gap-2 mb-1">
                  <Bot className="h-4 w-4 text-primary" />
                  <h4 className="text-sm font-medium">Estimated Time</h4>
                </div>
                <p className="text-2xl font-semibold">
                  {isTraining 
                    ? `${Math.ceil((100 - progress) / 10)} min` 
                    : progress === 100 
                      ? "Complete" 
                      : "--:--"}
                </p>
              </div>
            </div>
            
            {/* Training visualization placeholder */}
            <div className="h-40 glass-morphism flex items-center justify-center">
              {isTraining ? (
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className="bg-primary/80 rounded-full mx-0.5 animate-pulse-gentle"
                        style={{
                          height: `${20 + Math.random() * 20}px`,
                          width: '4px',
                          animationDelay: `${i * 0.1}s`
                        }}
                      />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground">Model training visualization</p>
                </div>
              ) : (
                <p className="text-muted-foreground">Training visualization will appear here</p>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => document.querySelector('[data-value="parameters"]')?.click()}>
              Previous
            </Button>
            
            {isTraining ? (
              <Button variant="destructive" onClick={stopTraining} className="gap-2">
                <Pause className="h-4 w-4" />
                Stop Training
              </Button>
            ) : (
              <Button onClick={startTraining} className="gap-2" disabled={progress === 100}>
                <Play className="h-4 w-4" />
                {progress === 0 ? "Start Training" : progress === 100 ? "Training Complete" : "Resume Training"}
              </Button>
            )}
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default TrainingSection;
