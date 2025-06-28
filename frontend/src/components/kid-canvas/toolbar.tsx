

import React from 'react';
import type { FC } from 'react';
import {
  Pencil, Eraser, Circle, Square, Minus, Palette, Undo2, Trash2, Save, Image as ImageIcon, Redo2, PaintBucket
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";
import type { Tool } from '@/types/drawing';

interface ToolbarProps {
  currentTool: Tool;
  onToolChange: (tool: Tool) => void;
  currentColor: string;
  onColorChange: (color: string) => void;
  currentBrushSize: number;
  onBrushSizeChange: (size: number) => void;
  onUndo: () => void;
  onRedo: () => void;
  onClear: () => void;
  onSave: () => void;
  onSelectTemplate: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

const colors = [
  '#FF0000', '#FF7F00', '#FFFF00', '#00FF00', '#0000FF', '#4B0082', '#8B00FF', // Rainbow + Purple
  '#000000', '#FFFFFF', '#808080', '#FFC0CB', '#A52A2A', '#00FFFF', '#FF00FF', // Black, White, Grey, Pink, Brown, Cyan, Magenta
];


const Toolbar: FC<ToolbarProps> = ({
  currentTool,
  onToolChange,
  currentColor,
  onColorChange,
  currentBrushSize,
  onBrushSizeChange,
  onUndo,
  onRedo,
  onClear,
  onSave,
  onSelectTemplate,
  canUndo,
  canRedo,
}) => {

  const ToolButton: FC<{ tool: Tool; label: string; icon: React.ReactNode }> = ({ tool, label, icon }) => (
    <Button
      variant={currentTool === tool ? 'default' : 'outline'}
      size="lg"
      onClick={() => onToolChange(tool)}
      className={`flex flex-col items-center justify-center h-20 w-20 p-2 rounded-lg transition-all transform hover:scale-105 active:scale-95 group hover:animate-boing ${currentTool === tool ? 'bg-primary text-primary-foreground shadow-md ring-2 ring-primary-foreground ring-offset-2 ring-offset-background' : 'bg-card hover:bg-accent hover:text-accent-foreground'}`}
      aria-label={label}
      title={label}
    >
      {React.cloneElement(icon as React.ReactElement, { size: 32, className: "mb-1 group-hover:animate-boing" })}
      <span className="text-xs ">{label}</span>
    </Button>
  );

  const ActionButton: FC<{ onClick: () => void; label: string; icon: React.ReactNode; disabled?: boolean; variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | null | undefined; extraClasses?: string }> = 
  ({ onClick, label, icon, disabled = false, variant = "outline", extraClasses = "" }) => (
    <Button
      variant={variant}
      size="lg"
      onClick={onClick}
      disabled={disabled}
      className={`flex flex-col items-center justify-center h-20 w-20 p-2 rounded-lg transition-all transform hover:scale-105 active:scale-95 group hover:animate-boing disabled:opacity-50 disabled:transform-none disabled:hover:animate-none ${disabled ? '' : 'hover:bg-accent hover:text-accent-foreground'} ${extraClasses}`}
      aria-label={label}
      title={label}
    >
      {React.cloneElement(icon as React.ReactElement, { size: 32, className: "mb-1 group-hover:animate-boing" })}
      <span className="text-xs">{label}</span>
    </Button>
  );


  return (
    <div className="bg-[#151C21] backdrop-blur-sm p-3 md:p-4 rounded-xl shadow-xl flex flex-col items-center space-y-3 sticky top-4 max-h-[calc(100vh-2rem)] overflow-y-auto">
      <h2 className="text-2xl font-headline font-bold  mb-2 text-white">Outils Magiques</h2>
      
      <ToolButton tool="pencil" label="Crayon" icon={<Pencil />} />
      <ToolButton tool="eraser" label="Gomme" icon={<Eraser />} />
      <ToolButton tool="fill" label="Remplir" icon={<PaintBucket />} />
      
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="lg" className="flex flex-col items-center justify-center h-20 w-20 p-2 rounded-lg transition-all transform hover:scale-105 active:scale-95 hover:bg-accent hover:text-accent-foreground group hover:animate-boing">
            <Palette size={32} className="mb-1 group-hover:animate-boing" />
            <span className="text-xs">Couleurs</span>
            <div className="mt-1 w-5 h-5 rounded-full border border-gray-300 shadow-inner" style={{ backgroundColor: currentColor }} />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-2 bg-card rounded-lg shadow-lg border-2 border-primary/50">
          <div className="grid grid-cols-4 gap-2">
            {colors.map((color) => (
              <Button
                key={color}
                variant="outline"
                size="icon"
                className={`w-10 h-10 rounded-md border-2 transition-transform hover:scale-110 active:scale-95 transform hover:animate-boing ${currentColor === color ? 'ring-2 ring-primary ring-offset-2 ring-offset-background' : 'border-gray-300'}`}
                style={{ backgroundColor: color }}
                onClick={() => onColorChange(color)}
                aria-label={`Couleur ${color}`}
              />
            ))}
             <input
                type="color"
                value={currentColor}
                onChange={(e) => onColorChange(e.target.value)}
                className="w-10 h-10 rounded-md border-2 border-gray-300 cursor-pointer p-0 appearance-none bg-transparent [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:border-none [&::-webkit-color-swatch]:rounded-md transform hover:scale-110 active:scale-95 hover:animate-boing"
                title="Couleur Personnalisée"
              />
          </div>
        </PopoverContent>
      </Popover>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="lg" className="flex flex-col items-center justify-center h-20 w-20 p-2 rounded-lg transition-all transform hover:scale-105 active:scale-95 hover:bg-accent hover:text-accent-foreground group hover:animate-boing">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-paintbrush mb-1 group-hover:animate-boing"><path d="M18.2 3a2 2 0 0 0-2.8 0L9 9.4l-4.2 4.2a2 2 0 0 0 0 2.8L9 20.8a2 2 0 0 0 2.8 0L16 17l4.2-4.2a2 2 0 0 0 0-2.8Z"/><path d="m21 5-2.8 2.8"/><path d="M12.2 11.2 11 10"/></svg>
            <span className="text-xs">Taille</span>
            <span className="mt-1 text-sm font-bold">{currentBrushSize}px</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-48 p-4 bg-card rounded-lg shadow-lg border-2 border-primary/50">
          <Slider
            defaultValue={[currentBrushSize]}
            min={1}
            max={50}
            step={1}
            onValueChange={(value) => onBrushSizeChange(value[0])}
            aria-label="Taille du Pinceau"
          />
          <div className="text-center mt-2 text-sm text-foreground">{currentBrushSize}px</div>
        </PopoverContent>
      </Popover>

      <h3 className="text-xl font-headline font-semibold text-white pt-3">Formes</h3>
      <ToolButton tool="rectangle" label="Rectangle" icon={<Square />} />
      <ToolButton tool="circle" label="Cercle" icon={<Circle />} />
      <ToolButton tool="line" label="Ligne" icon={<Minus />} />


      <h3 className="text-xl font-headline font-semibold text-primary pt-3">Actions</h3>
      <ActionButton onClick={onUndo} label="Annuler" icon={<Undo2 />} disabled={!canUndo} />
      <ActionButton onClick={onRedo} label="Refaire" icon={<Redo2 />} disabled={!canRedo} />

      <ActionButton 
        onClick={onClear} 
        label="Effacer Tout" 
        icon={<Trash2 />} 
        variant="destructive" 
        extraClasses="bg-destructive/80 hover:bg-destructive text-destructive-foreground"
      />
      <ActionButton 
        onClick={onSave} 
        label="Sauver" 
        icon={<Save />} 
        variant="default" 
        extraClasses="bg-green-500 hover:bg-green-600 text-white"
      />
      <ActionButton onClick={onSelectTemplate} label="Modèles" icon={<ImageIcon />} />
    </div>
  );
};

export default Toolbar;
