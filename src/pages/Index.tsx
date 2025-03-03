
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Waves, Music, Bot, History, ChevronsUp } from "lucide-react";
import { toast } from "sonner";
import Header from "@/components/Header";
import TrainingSection from "@/components/TrainingSection";
import GenerationSection from "@/components/GenerationSection";
import HistoryPanel from "@/components/HistoryPanel";
import AudioWaveform from '@/components/AudioWaveform';
import { useIsMobile } from '@/hooks/use-mobile';
import { Link } from 'react-router-dom';

const Index = () => {
  const [activeTab, setActiveTab] = useState("generate");
  const [showScrollTop, setShowScrollTop] = useState(false);
  const isMobile = useIsMobile();

  // Handle scroll to top button visibility
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Smooth entrance animation
  useEffect(() => {
    document.body.classList.add('animate-fade-in');
    
    // Welcome toast
    const timer = setTimeout(() => {
      toast.info("Welcome to HarmonyAI", {
        description: "Try our new Bark AI model for advanced music generation",
      });
    }, 1000);

    return () => {
      clearTimeout(timer);
      document.body.classList.remove('animate-fade-in');
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container pt-24 pb-16">
        {/* Hero Section */}
        <section className="text-center max-w-3xl mx-auto mb-16 space-y-6 animate-slide-up">
          <div className="flex justify-center items-center mb-4">
            <div className="inline-flex p-3 rounded-full bg-primary/10 text-primary">
              <Waves className="h-8 w-8" />
            </div>
          </div>
          
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Train and Generate Music with AI
          </h1>
          
          <p className="text-xl text-muted-foreground">
            Upload audio samples, train custom models, and generate
            unique music compositions using Suno's Bark AI technology.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 pt-2">
            <Button 
              size="lg" 
              className="gap-2" 
              onClick={() => setActiveTab("generate")}
            >
              <Music className="h-4 w-4" />
              <span>Generate Music</span>
            </Button>
            <Link to="/model/bark">
              <Button 
                variant="default" 
                size="lg" 
                className="gap-2"
              >
                <Waves className="h-4 w-4" />
                <span>Try Bark AI</span>
              </Button>
            </Link>
            <Button 
              variant="outline" 
              size="lg" 
              className="gap-2" 
              onClick={() => setActiveTab("train")}
            >
              <Bot className="h-4 w-4" />
              <span>Train Models</span>
            </Button>
          </div>
          
          <div className="h-20 w-full mt-8 flex justify-center">
            <AudioWaveform animated={true} isPlaying={true} className="max-w-md" />
          </div>
        </section>
        
        <Separator className="my-8" />
        
        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="max-w-5xl mx-auto">
          <div className="flex justify-center mb-8">
            <TabsList className="grid grid-cols-2 md:w-[400px]">
              <TabsTrigger value="generate" className="flex gap-2 py-2">
                <Music className="h-4 w-4" />
                <span>Generate</span>
              </TabsTrigger>
              <TabsTrigger value="train" className="flex gap-2 py-2">
                <Bot className="h-4 w-4" />
                <span>Train</span>
              </TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="generate" className="animate-fade-in">
            <GenerationSection />
          </TabsContent>
          
          <TabsContent value="train" className="animate-fade-in">
            <TrainingSection />
          </TabsContent>
        </Tabs>
        
        {/* Bark AI Feature Highlight */}
        <section className="max-w-5xl mx-auto mt-16 bg-primary/5 rounded-lg p-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="space-y-4 max-w-md">
              <h2 className="text-2xl font-bold">Experience Suno's Bark AI</h2>
              <p className="text-muted-foreground">
                Our platform now features Suno's Bark AI model, delivering state-of-the-art
                audio generation capabilities. Create music, sound effects, and more with simple text prompts.
              </p>
              <Link to="/model/bark">
                <Button className="gap-2">
                  <Waves className="h-4 w-4" />
                  Try Bark AI Now
                </Button>
              </Link>
            </div>
            <div className="w-full max-w-sm h-48 flex items-center justify-center bg-primary/10 rounded-lg">
              <AudioWaveform animated={true} isPlaying={true} />
            </div>
          </div>
        </section>
        
        {/* History Section */}
        <section className="max-w-5xl mx-auto mt-12">
          <HistoryPanel />
        </section>
      </main>
      
      {/* Footer */}
      <footer className="bg-secondary/30 border-t border-border py-6">
        <div className="container flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <Waves className="h-5 w-5 text-primary" />
            <span className="font-medium">HarmonyAI</span>
          </div>
          
          <p className="text-sm text-muted-foreground text-center">
            A platform for training and testing AI music models featuring Suno's Bark AI
          </p>
          
          <div className="flex gap-4">
            <Button variant="ghost" size="sm" className="text-xs">Terms</Button>
            <Button variant="ghost" size="sm" className="text-xs">Privacy</Button>
            <Button variant="ghost" size="sm" className="text-xs">About</Button>
          </div>
        </div>
      </footer>
      
      {/* Scroll to top button */}
      {showScrollTop && (
        <Button
          className="fixed bottom-6 right-6 rounded-full h-10 w-10 p-0 shadow-lg"
          onClick={scrollToTop}
        >
          <ChevronsUp className="h-5 w-5" />
          <span className="sr-only">Scroll to top</span>
        </Button>
      )}
    </div>
  );
};

export default Index;
