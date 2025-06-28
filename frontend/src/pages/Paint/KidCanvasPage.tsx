

import React, { useState, useRef, useEffect, useCallback } from 'react';
import DrawingCanvas from '@/components/kid-canvas/drawing-canvas';
import Toolbar from '@/components/kid-canvas/toolbar';
import TemplateModal from '@/components/kid-canvas/template-modal';
import type { Tool } from '@/types/drawing';
import type { SavedDrawing } from '@/components/kid-canvas/template-modal'; // Import SavedDrawing
import { Button } from '@/components/ui/button';
import { Maximize, Minimize } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

const MAX_SAVED_DRAWINGS = 12;
const LOCAL_STORAGE_KEY = 'kidCanvasSavedDrawings';

const KidCanvasPage: React.FC = () => {
  const [selectedTool, setSelectedTool] = useState<Tool>('pencil');
  const [color, setColor] = useState<string>('#000000'); // Default black
  const [brushSize, setBrushSize] = useState<number>(5);
  const [currentTemplate, setCurrentTemplate] = useState<string | null>(null);
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState<boolean>(false);
  const [userSavedDrawings, setUserSavedDrawings] = useState<SavedDrawing[]>([]);
  
  const [undoStack, setUndoStack] = useState<string[]>([]);
  const [redoStack, setRedoStack] = useState<string[]>([]);

  const [clearCanvasFlag, setClearCanvasFlag] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement & { exportCanvas: () => string; loadCanvasData: (dataUrl: string) => void; getInitialCanvasData: () => string | undefined }>(null);
  const { toast } = useToast();

  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 600 });
  const [isFullScreen, setIsFullScreen] = useState(false);
  const mainContainerRef = useRef<HTMLDivElement>(null);


  const updateCanvasSize = useCallback(() => {
    if (isFullScreen && document.fullscreenElement) {
        setCanvasSize({ width: window.innerWidth - 200, height: window.innerHeight - 40 }); 
    } else if (mainContainerRef.current) {
        const container = mainContainerRef.current.querySelector('#canvas-container') as HTMLDivElement;
        if(container) {
            const availableWidth = container.offsetWidth - 20; 
            const availableHeight = container.offsetHeight - 20; 
            let newWidth = Math.min(availableWidth, availableHeight * (4/3));
            let newHeight = newWidth * (3/4);

            if (newHeight > availableHeight) {
                newHeight = availableHeight;
                newWidth = newHeight * (4/3);
            }
            setCanvasSize({ width: Math.max(320, Math.floor(newWidth)), height: Math.max(240, Math.floor(newHeight)) });
        } else {
             setCanvasSize({ width: 800, height: 600 }); 
        }
    }
  }, [isFullScreen]);

  useEffect(() => {
    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);
    return () => window.removeEventListener('resize', updateCanvasSize);
  }, [updateCanvasSize]);
  
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
      updateCanvasSize();
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, [updateCanvasSize]);

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      mainContainerRef.current?.requestFullscreen().catch(err => {
        toast({ title: "Oops!", description: `Le mode plein écran n'a pas pu s'activer: ${err.message}`, variant: "destructive" });
      });
    } else {
      document.exitFullscreen();
    }
  };

  const handleDrawEnd = useCallback((imageData: string) => {
    setUndoStack((prev) => [...prev.slice(Math.max(0, prev.length - 19)), imageData]);
    setRedoStack([]); 
  }, []);

  const handleUndo = () => {
    if (undoStack.length > 1) { 
      const newStack = [...undoStack];
      const currentState = newStack.pop(); 
      const prevState = newStack[newStack.length - 1];
      if (prevState && canvasRef.current) {
        canvasRef.current.loadCanvasData(prevState);
      }
      setUndoStack(newStack);
      if (currentState) {
        setRedoStack((prev) => [currentState, ...prev.slice(0, 19)]);
      }
    } else {
       toast({ title: "Kid Canvas", description: "Plus rien à annuler, l'artiste !", variant: "default" });
    }
  };

  const handleRedo = () => {
    if (redoStack.length > 0) {
      const nextState = redoStack[0];
      if (nextState && canvasRef.current) {
        canvasRef.current.loadCanvasData(nextState);
        setUndoStack((prev) => [...prev, nextState]);
        setRedoStack((prev) => prev.slice(1));
      }
    } else {
      toast({ title: "Kid Canvas", description: "Plus rien à refaire, l'artiste !", variant: "default" });
    }
  };

  const handleClearCanvas = () => {
    setClearCanvasFlag(true);
  };

  const handleCanvasCleared = useCallback(() => {
    setClearCanvasFlag(false);
    setRedoStack([]);
  }, []);
  
  const handleSave = () => {
    if (canvasRef.current) {
      const imageURL = canvasRef.current.exportCanvas();
      
      // Save to localStorage
      try {
        const savedDrawingsRaw = localStorage.getItem(LOCAL_STORAGE_KEY);
        let savedDrawings: SavedDrawing[] = savedDrawingsRaw ? JSON.parse(savedDrawingsRaw) : [];
        
        const newDrawing: SavedDrawing = {
          id: `user-${Date.now()}`,
          name: `Mon Dessin ${new Date().toLocaleDateString()}`,
          previewUrl: imageURL, // For smaller preview if needed, or use full
          dataUrl: imageURL,    // Full data for loading
          isUserSaved: true,
          dataAiHint: 'user drawing'
        };

        savedDrawings = [newDrawing, ...savedDrawings].slice(0, MAX_SAVED_DRAWINGS);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(savedDrawings));
        setUserSavedDrawings(savedDrawings); // Update state to reflect in modal
        toast({ title: "Bien Enregistré !", description: "Ton dessin est aussi gardé dans tes modèles.", variant: "default" });
      } catch (error) {
        console.error("Failed to save drawing to localStorage:", error);
        toast({ title: "Oups !", description: "Impossible de sauvegarder le dessin localement.", variant: "destructive" });
      }

      // Trigger download
      const link = document.createElement('a');
      link.href = imageURL;
      link.download = `kid-canvas-${new Date().toISOString()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast({ title: "Super Sauvegarde !", description: "Ton chef-d'œuvre est téléchargé ! Bravo !", variant: "default" });
    }
  };

  useEffect(() => {
    // Load user saved drawings on component mount
    try {
      const rawData = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (rawData) {
        setUserSavedDrawings(JSON.parse(rawData));
      }
    } catch (error) {
      console.error("Failed to load drawings from localStorage:", error);
      setUserSavedDrawings([]);
    }
  }, []);

  const handleSelectTemplate = (templateUrl: string, isUserDrawing: boolean = false) => {
     // For user drawings, templateUrl is the dataUrl. For predefined, it's a URL to fetch.
    setCurrentTemplate(templateUrl);
    setIsTemplateModalOpen(false);
  };
  
  const handleToolChange = (tool: Tool) => {
    setSelectedTool(tool);
  };

  const handleOpenTemplateModal = () => {
    // Refresh saved drawings from localStorage when opening modal
    try {
        const rawData = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (rawData) {
            setUserSavedDrawings(JSON.parse(rawData));
        }
    } catch (error) {
        console.error("Failed to load drawings from localStorage:", error);
        setUserSavedDrawings([]);
    }
    setIsTemplateModalOpen(true);
  }

  return (
    <>
      

      <main ref={mainContainerRef} className="flex flex-col md:flex-row h-screen w-screen bg-background overflow-hidden p-2 md:p-4 gap-4 relative">
        <Toolbar
          currentTool={selectedTool}
          onToolChange={handleToolChange}
          currentColor={color}
          onColorChange={setColor}
          currentBrushSize={brushSize}
          onBrushSizeChange={setBrushSize}
          onUndo={handleUndo}
          onRedo={handleRedo}
          onClear={handleClearCanvas}
          onSave={handleSave}
          onSelectTemplate={handleOpenTemplateModal}
          canUndo={undoStack.length > 1}
          canRedo={redoStack.length > 0}
        />
        
        <div id="canvas-container" className="flex-grow flex items-center justify-center bg-[#151C21] rounded-xl p-0 md:p-4 relative overflow-hidden shadow-inner">
           <DrawingCanvas
            ref={canvasRef}
            width={canvasSize.width}
            height={canvasSize.height}
            tool={selectedTool}
            color={color}
            brushSize={brushSize}
            onDrawEnd={handleDrawEnd}
            currentTemplate={currentTemplate}
            clearCanvasFlag={clearCanvasFlag}
            onCanvasCleared={handleCanvasCleared}
          />
        </div>
        
        <Button 
          onClick={toggleFullScreen} 
          variant="outline" 
          size="icon" 
          className="absolute top-2 right-2 md:top-6 md:right-6 bg-card/70 hover:bg-card text-foreground rounded-full animate-boing hover:animate-none"
          title={isFullScreen ? "Quitter Plein Écran" : "Plein Écran Magique !"}
        >
          {isFullScreen ? <Minimize size={24} /> : <Maximize size={24} />}
        </Button>

        <TemplateModal
          isOpen={isTemplateModalOpen}
          onOpenChange={setIsTemplateModalOpen}
          onSelectTemplate={handleSelectTemplate}
          userSavedDrawings={userSavedDrawings}
        />
        
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 md:hidden">
            <h1 className="text-3xl font-headline font-bold text-primary opacity-70">Kid Canvas</h1>
        </div>

      </main>
    </>
  );
};

export default KidCanvasPage;