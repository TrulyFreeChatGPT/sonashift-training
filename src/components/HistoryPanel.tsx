
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, Trash2, Music, Bot, Download } from "lucide-react";
import { toast } from "sonner";
import AudioWaveform from './AudioWaveform';

interface HistoryItem {
  id: string;
  type: 'generation' | 'training';
  title: string;
  timestamp: string;
  description: string;
}

const HistoryPanel: React.FC = () => {
  const [history, setHistory] = React.useState<HistoryItem[]>([
    {
      id: '1',
      type: 'generation',
      title: 'Piano melody with strings',
      timestamp: '2 hours ago',
      description: 'A calm piano melody with soft strings in the background, in the style of Debussy'
    },
    {
      id: '2',
      type: 'training',
      title: 'Jazz model training',
      timestamp: '1 day ago',
      description: 'Model trained on 25 jazz compositions with piano and saxophone samples'
    },
    {
      id: '3',
      type: 'generation',
      title: 'Electronic beat',
      timestamp: '2 days ago',
      description: 'Upbeat electronic music with synthesizer and drum machine, 120 BPM'
    }
  ]);
  
  const deleteItem = (id: string) => {
    setHistory(prev => prev.filter(item => item.id !== id));
    toast.success("Item removed from history");
  };
  
  const downloadItem = (id: string) => {
    toast.success("Download started");
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>History</CardTitle>
            <CardDescription>
              Your recent training sessions and generated music.
            </CardDescription>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-foreground"
            onClick={() => {
              setHistory([]);
              toast.success("History cleared");
            }}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Clear All
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="all" className="text-xs">All</TabsTrigger>
            <TabsTrigger value="generation" className="text-xs">Generation</TabsTrigger>
            <TabsTrigger value="training" className="text-xs">Training</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all">
            {history.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No history items yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {history.map((item) => (
                  <HistoryListItem 
                    key={item.id} 
                    item={item} 
                    onDelete={deleteItem} 
                    onDownload={downloadItem} 
                  />
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="generation">
            {history.filter(item => item.type === 'generation').length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Music className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No generation history</p>
              </div>
            ) : (
              <div className="space-y-4">
                {history
                  .filter(item => item.type === 'generation')
                  .map((item) => (
                    <HistoryListItem 
                      key={item.id} 
                      item={item} 
                      onDelete={deleteItem} 
                      onDownload={downloadItem} 
                    />
                  ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="training">
            {history.filter(item => item.type === 'training').length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Bot className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No training history</p>
              </div>
            ) : (
              <div className="space-y-4">
                {history
                  .filter(item => item.type === 'training')
                  .map((item) => (
                    <HistoryListItem 
                      key={item.id} 
                      item={item} 
                      onDelete={deleteItem} 
                      onDownload={downloadItem} 
                    />
                  ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

interface HistoryListItemProps {
  item: HistoryItem;
  onDelete: (id: string) => void;
  onDownload: (id: string) => void;
}

const HistoryListItem: React.FC<HistoryListItemProps> = ({ item, onDelete, onDownload }) => {
  return (
    <div className="glass-morphism p-4 hover:border-border/80 transition-all duration-200">
      <div className="flex justify-between items-start mb-3">
        <div>
          <div className="flex items-center gap-2">
            {item.type === 'generation' ? (
              <Music className="h-4 w-4 text-primary" />
            ) : (
              <Bot className="h-4 w-4 text-primary" />
            )}
            <h3 className="font-medium text-sm">{item.title}</h3>
          </div>
          <p className="text-xs text-muted-foreground mt-1">{item.timestamp}</p>
        </div>
        <div className="flex gap-1">
          {item.type === 'generation' && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8"
              onClick={() => onDownload(item.id)}
            >
              <Download className="h-4 w-4" />
              <span className="sr-only">Download</span>
            </Button>
          )}
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8"
            onClick={() => onDelete(item.id)}
          >
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Delete</span>
          </Button>
        </div>
      </div>
      
      <p className="text-xs mb-3 text-muted-foreground">
        {item.description}
      </p>
      
      {item.type === 'generation' && (
        <AudioWaveform animated={false} className="h-12" />
      )}
    </div>
  );
};

export default HistoryPanel;
