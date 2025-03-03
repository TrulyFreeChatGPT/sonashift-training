
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
        description: "Your platform for training and testing music AI models",
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
            unique music compositions with advanced AI technology.
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
            A platform for training and testing AI music models
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
