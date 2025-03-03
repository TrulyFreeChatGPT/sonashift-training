
import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Upload, X, Check, Music } from "lucide-react";
import { toast } from "sonner";
import AudioWaveform from './AudioWaveform';

interface AudioFile {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
}

const AudioUploader = () => {
  const [files, setFiles] = useState<AudioFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{[key: string]: number}>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    processFiles(droppedFiles);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      processFiles(selectedFiles);
    }
  };

  const processFiles = (fileList: File[]) => {
    const audioFiles = fileList.filter(file => file.type.startsWith('audio/'));
    
    if (audioFiles.length === 0) {
      toast.error("Please upload audio files only");
      return;
    }
    
    const newFiles = audioFiles.map(file => {
      const id = `file-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      // Simulate upload progress
      simulateUpload(id);
      
      return {
        id,
        name: file.name,
        size: file.size,
        type: file.type,
        url: URL.createObjectURL(file)
      };
    });
    
    setFiles(prev => [...prev, ...newFiles]);
  };
  
  const simulateUpload = (fileId: string) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 10) + 5;
      
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        toast.success("File uploaded successfully");
      }
      
      setUploadProgress(prev => ({
        ...prev,
        [fileId]: progress
      }));
    }, 300);
  };
  
  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(file => file.id !== id));
    setUploadProgress(prev => {
      const newProgress = {...prev};
      delete newProgress[id];
      return newProgress;
    });
  };
  
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' bytes';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };

  return (
    <div className="w-full">
      <div 
        className={`
          border-2 border-dashed rounded-lg p-8 
          transition-all duration-200 ease-in-out
          ${isDragging ? 'border-primary bg-primary/5' : 'border-border/50 hover:border-border/80'} 
          ${files.length > 0 ? 'mb-6' : ''}
        `}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center justify-center py-4 text-center">
          <Upload 
            className={`h-12 w-12 mb-4 transition-colors ${
              isDragging ? 'text-primary' : 'text-muted-foreground'
            }`} 
          />
          <h3 className="text-lg font-medium mb-2">Drag audio files here</h3>
          <p className="text-muted-foreground text-sm mb-4">
            Support for WAV, MP3, AIFF, and FLAC files
          </p>
          <Button 
            onClick={() => fileInputRef.current?.click()}
            className="gap-2"
          >
            <Music className="h-4 w-4" />
            Browse Files
          </Button>
          <input 
            ref={fileInputRef}
            type="file" 
            accept="audio/*" 
            multiple
            className="hidden" 
            onChange={handleFileInput}
          />
        </div>
      </div>
      
      {files.length > 0 && (
        <div className="space-y-4 animate-fade-in">
          {files.map(file => (
            <div 
              key={file.id} 
              className="p-4 glass-morphism flex flex-col gap-3 transition-all duration-200 hover:border-border/80"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Music className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium truncate max-w-[200px] md:max-w-sm">
                      {file.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatFileSize(file.size)}
                    </p>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 w-8 p-0 rounded-full"
                  onClick={() => removeFile(file.id)}
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">Remove file</span>
                </Button>
              </div>
              
              {uploadProgress[file.id] < 100 ? (
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Uploading...</span>
                    <span>{uploadProgress[file.id]}%</span>
                  </div>
                  <Progress value={uploadProgress[file.id]} className="h-1" />
                </div>
              ) : (
                <div className="flex items-center gap-2 text-xs text-green-500">
                  <Check className="h-3 w-3" />
                  <span>Upload complete</span>
                </div>
              )}
              
              <AudioWaveform audioUrl={file.url} className="mt-2" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AudioUploader;
