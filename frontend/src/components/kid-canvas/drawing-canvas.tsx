

import type { FC } from 'react';
import React, { useRef, useEffect, useState, useImperativeHandle, forwardRef } from 'react';
import type { Tool } from '@/types/drawing';

interface DrawingCanvasProps {
  width: number;
  height: number;
  tool: Tool;
  color: string;
  brushSize: number;
  onDrawEnd?: (imageData: string) => void;
  currentTemplate?: string | null;
  clearCanvasFlag?: boolean;
  onCanvasCleared?: () => void;
}

export interface DrawingCanvasRef {
  exportCanvas: () => string;
  loadCanvasData: (dataUrl: string) => void;
  getInitialCanvasData: () => string | undefined;
}

// Helper to convert hex color to RGBA array
const hexToRgba = (hex: string): [number, number, number, number] => {
  let r = 0, g = 0, b = 0, a = 255;
  if (hex.length === 4) { // #RGB
    r = parseInt(hex[1] + hex[1], 16);
    g = parseInt(hex[2] + hex[2], 16);
    b = parseInt(hex[3] + hex[3], 16);
  } else if (hex.length === 7) { // #RRGGBB
    r = parseInt(hex[1] + hex[2], 16);
    g = parseInt(hex[3] + hex[4], 16);
    b = parseInt(hex[5] + hex[6], 16);
  }
  return [r, g, b, a];
};

const DrawingCanvas: FC<DrawingCanvasProps> = forwardRef<DrawingCanvasRef, DrawingCanvasProps>(({
  width,
  height,
  tool,
  color,
  brushSize,
  onDrawEnd,
  currentTemplate,
  clearCanvasFlag,
  onCanvasCleared,
}, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastPosition, setLastPosition] = useState<{ x: number; y: number } | null>(null);
  const [shapeStartPos, setShapeStartPos] = useState<{ x: number; y: number } | null>(null);
  const [previewSnapshot, setPreviewSnapshot] = useState<string | null>(null);
  const [initialCanvasState, setInitialCanvasState] = useState<string | undefined>(undefined);


  useImperativeHandle(ref, () => ({
    exportCanvas: () => canvasRef.current?.toDataURL('image/png') || '',
    loadCanvasData: (dataUrl: string) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      const img = new Image();
      img.onload = () => {
        ctx.clearRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height); // Ensure image covers full canvas
      };
      img.onerror = () => { // Handle cases where dataUrl might be invalid
        console.error("Failed to load image data for canvas");
        initializeCanvas(true); // Re-initialize to blank if load fails
      }
      img.src = dataUrl;
    },
    getInitialCanvasData: () => initialCanvasState,
  }));

  const initializeCanvas = (forceDrawEnd: boolean = false) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, width, height);
    const initialData = canvas.toDataURL();
    setInitialCanvasState(initialData);
    if (onDrawEnd && (forceDrawEnd || !initialCanvasState)) { // Call onDrawEnd only on first init or if forced
        onDrawEnd(initialData);
    }
  }

  useEffect(() => {
    initializeCanvas();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [width, height]); 

  useEffect(() => {
    if (clearCanvasFlag && canvasRef.current && onCanvasCleared) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, width, height);
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, width, height);
        const clearedData = canvas.toDataURL();
        if (onDrawEnd) onDrawEnd(clearedData);
      }
      onCanvasCleared();
    }
  }, [clearCanvasFlag, width, height, onCanvasCleared, onDrawEnd]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !currentTemplate) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const image = new Image();
    // For templates from placehold.co, crossOrigin is needed. For data URLs, it's not.
    if (currentTemplate.startsWith('http')) {
        image.crossOrigin = "anonymous";
    }
    
    image.src = currentTemplate;
    image.onload = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = '#FFFFFF'; // Ensure background is white before drawing template
      ctx.fillRect(0, 0, width, height);
      
      const canvasAspectRatio = width / height;
      const imageAspectRatio = image.width / image.height;
      let drawWidth = width;
      let drawHeight = height;

      if (imageAspectRatio > canvasAspectRatio) { // Image is wider than canvas ratio
        drawHeight = width / imageAspectRatio;
      } else { // Image is taller or same ratio
        drawWidth = height * imageAspectRatio;
      }
      const x = (width - drawWidth) / 2;
      const y = (height - drawHeight) / 2;
      
      ctx.drawImage(image, x, y, drawWidth, drawHeight);
      if (onDrawEnd) onDrawEnd(canvas.toDataURL());
    };
    image.onerror = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, width, height);
      ctx.fillStyle = '#AAAAAA';
      ctx.font = '16px PT Sans';
      ctx.textAlign = 'center';
      ctx.fillText('Oups ! Le modèle n\'a pas pu charger.', width / 2, height / 2);
      if (onDrawEnd) onDrawEnd(canvas.toDataURL());
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTemplate, width, height]); // Removed onDrawEnd from deps as it can cause loops

  const getMousePosition = (event: React.MouseEvent | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    
    let clientX, clientY;
    if ('touches' in event) {
      clientX = event.touches[0].clientX;
      clientY = event.touches[0].clientY;
    } else {
      clientX = event.clientX;
      clientY = event.clientY;
    }
    
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY,
    };
  };

  const floodFill = (startX: number, startY: number, fillColor: [number, number, number, number]) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;
    const startPos = (Math.floor(startY) * width + Math.floor(startX)) * 4;
    const startColor = [data[startPos], data[startPos + 1], data[startPos + 2], data[startPos + 3]];

    // If start color is same as fill color, do nothing
    if (
      startColor[0] === fillColor[0] &&
      startColor[1] === fillColor[1] &&
      startColor[2] === fillColor[2] &&
      startColor[3] === fillColor[3]
    ) {
      return;
    }

    const queue: [number, number][] = [[Math.floor(startX), Math.floor(startY)]];

    while (queue.length > 0) {
      const [x, y] = queue.shift()!;
      if (x < 0 || x >= width || y < 0 || y >= height) continue;

      const currentPos = (y * width + x) * 4;
      if (
        data[currentPos] === startColor[0] &&
        data[currentPos + 1] === startColor[1] &&
        data[currentPos + 2] === startColor[2] &&
        data[currentPos + 3] === startColor[3]
      ) {
        data[currentPos] = fillColor[0];
        data[currentPos + 1] = fillColor[1];
        data[currentPos + 2] = fillColor[2];
        data[currentPos + 3] = fillColor[3];

        queue.push([x + 1, y]);
        queue.push([x - 1, y]);
        queue.push([x, y + 1]);
        queue.push([x, y - 1]);
      }
    }
    ctx.putImageData(imageData, 0, 0);
    if (onDrawEnd) onDrawEnd(canvas.toDataURL());
  };


  const startDrawing = (event: React.MouseEvent | React.TouchEvent<HTMLCanvasElement>) => {
    const pos = getMousePosition(event);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (tool === 'fill') {
      const targetColorRgba = hexToRgba(color);
      floodFill(pos.x, pos.y, targetColorRgba);
      return; 
    }

    if (tool === 'pencil' || tool === 'eraser') {
      setIsDrawing(true);
      setLastPosition(pos);
      ctx.beginPath();
      ctx.moveTo(pos.x, pos.y);
    } else if (tool === 'rectangle' || tool === 'circle' || tool === 'line') {
      setIsDrawing(true);
      setShapeStartPos(pos);
      setPreviewSnapshot(canvas.toDataURL()); 
    }
  };

  const draw = (event: React.MouseEvent | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || tool === 'fill') return; // Do not draw if filling
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const currentPosition = getMousePosition(event);

    if (tool === 'pencil' || tool === 'eraser') {
      if (!lastPosition) return;
      ctx.strokeStyle = tool === 'eraser' ? '#FFFFFF' : color; 
      ctx.lineWidth = brushSize;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.globalCompositeOperation = tool === 'eraser' ? 'destination-out' : 'source-over';
      if(tool === 'eraser') ctx.strokeStyle = "rgba(255,255,255,1)"; 

      ctx.lineTo(currentPosition.x, currentPosition.y);
      ctx.stroke();
      setLastPosition(currentPosition);
    } else if ((tool === 'rectangle' || tool === 'circle' || tool === 'line') && shapeStartPos && previewSnapshot) {
      const img = new Image();
      img.onload = () => {
        ctx.clearRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0); 
        drawShapePreview(ctx, shapeStartPos, currentPosition); 
      }
      img.src = previewSnapshot;
    }
  };

  const drawShapePreview = (ctx: CanvasRenderingContext2D, start: {x:number, y:number}, end: {x:number, y:number}) => {
    ctx.strokeStyle = color;
    ctx.lineWidth = brushSize;
    ctx.fillStyle = color; 
    ctx.globalCompositeOperation = 'source-over';
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    if (tool === 'rectangle') {
      ctx.beginPath();
      ctx.rect(start.x, start.y, end.x - start.x, end.y - start.y);
      ctx.stroke();
    } else if (tool === 'circle') {
      const centerX = start.x + (end.x - start.x) / 2;
      const centerY = start.y + (end.y - start.y) / 2;
      const diameterRadius = Math.sqrt(Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2)) / 2;
      ctx.beginPath();
      ctx.arc(centerX, centerY, diameterRadius, 0, 2 * Math.PI);
      ctx.stroke();
    } else if (tool === 'line') {
      ctx.beginPath();
      ctx.moveTo(start.x, start.y);
      ctx.lineTo(end.x, end.y);
      ctx.stroke();
    }
  }


  const stopDrawing = (event?: React.MouseEvent | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || tool === 'fill') return; // Do not stop drawing if filling or not drawing
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    let finalPosition = lastPosition; 
    if(event && (tool === 'rectangle' || tool === 'circle' || tool === 'line')) { 
       finalPosition = getMousePosition(event as React.MouseEvent<HTMLCanvasElement>); // Ensure correct type for getMousePosition
    }

    if (tool === 'pencil' || tool === 'eraser') {
      ctx.closePath();
    } else if ((tool === 'rectangle' || tool === 'circle' || tool === 'line') && shapeStartPos && finalPosition && previewSnapshot) {
      // Final draw on the original canvas state (not the preview snapshot directly on current canvas)
      const img = new Image();
      img.onload = () => {
        ctx.clearRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0); // Restore snapshot
        drawShapePreview(ctx, shapeStartPos, finalPosition!); // Draw final shape
        if (onDrawEnd) onDrawEnd(canvas.toDataURL());
      }
      img.src = previewSnapshot; // The state before this shape started drawing
    }
    
    setIsDrawing(false);
    setLastPosition(null);
    setShapeStartPos(null);
    setPreviewSnapshot(null); 
    
    if ((tool === 'pencil' || tool === 'eraser') && onDrawEnd) {
      onDrawEnd(canvas.toDataURL());
    }
  };

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      onMouseDown={startDrawing}
      onMouseMove={draw}
      onMouseUp={stopDrawing}
      onMouseLeave={stopDrawing} 
      onTouchStart={startDrawing}
      onTouchMove={draw}
      onTouchEnd={stopDrawing}
      className="bg-white rounded-xl shadow-lg cursor-crosshair touch-none border-2 border-primary/20 "
      style={{ width: `${width}px`, height: `${height}px`, touchAction: 'none' }}
      aria-label="Canevas de dessin"
    />
  );
});

DrawingCanvas.displayName = 'DrawingCanvas';
export default DrawingCanvas;
