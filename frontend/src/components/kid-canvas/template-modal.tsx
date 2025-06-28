'use client';


import type { FC } from 'react';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

export interface SavedDrawing {
  id: string;
  name: string;
  previewUrl: string; // Could be a smaller data URI for preview if optimized, or same as dataUrl
  dataUrl: string;    // Full data URI for loading onto canvas
  isUserSaved?: boolean;
  dataAiHint: string;
}

const predefinedTemplates: Omit<SavedDrawing, 'dataUrl' | 'isUserSaved'>[] = [
  { id: 'house', name: 'Jolie Maison', previewUrl: 'https://placehold.co/200x150.png', dataAiHint: 'cartoon house' },
  { id: 'monster', name: 'Monstre Rigolo', previewUrl: 'https://placehold.co/200x150.png', dataAiHint: 'friendly monster' },
  { id: 'cat', name: 'Chat Mignon', previewUrl: 'https://placehold.co/200x150.png', dataAiHint: 'cute cat' },
  { id: 'landscape', name: 'Beau Paysage', previewUrl: 'https://placehold.co/200x150.png', dataAiHint: 'sunny landscape' },
  { id: 'car', name: 'Super Voiture', previewUrl: 'https://placehold.co/200x150.png', dataAiHint: 'cool car' },
  { id: 'cupcake', name: 'Cupcake Délicieux', previewUrl: 'https://placehold.co/200x150.png', dataAiHint: 'yummy cupcake' },
  { id: 'dinosaur', name: 'Dinosaure Aventureux', previewUrl: 'https://placehold.co/200x150.png', dataAiHint: 'cartoon dinosaur' },
  { id: 'robot', name: 'Robot Futuriste', previewUrl: 'https://placehold.co/200x150.png', dataAiHint: 'cute robot' },
  { id: 'unicorn', name: 'Licorne Magique', previewUrl: 'https://placehold.co/200x150.png', dataAiHint: 'magical unicorn' },
  { id: 'space', name: 'Voyage Spatial', previewUrl: 'https://placehold.co/200x150.png', dataAiHint: 'space rocket' },
];

interface TemplateModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSelectTemplate: (templateUrl: string, isUserDrawing?: boolean) => void;
  userSavedDrawings: SavedDrawing[];
}

const TemplateModal: FC<TemplateModalProps> = ({
  isOpen,
  onOpenChange,
  onSelectTemplate,
  userSavedDrawings,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] bg-background/95 backdrop-blur-md p-6 rounded-xl shadow-2xl border-2 border-primary/50">
        <DialogHeader>
          <DialogTitle className="text-3xl font-headline text-primary">Choisis un dessin !</DialogTitle>
          <DialogDescription className="text-lg text-foreground/80 mt-2">
            Clique sur une image pour commencer à colorier ou continuer ton dessin !
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[400px] my-4 pr-3">
          {userSavedDrawings && userSavedDrawings.length > 0 && (
            <>
              <h3 className="text-xl font-headline text-primary/80 my-3">Mes Dessins Sauvegardés</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-4">
                {userSavedDrawings.map((template) => (
                  <button
                    key={template.id}
                    onClick={() => {
                      onSelectTemplate(template.dataUrl, true);
                      onOpenChange(false);
                    }}
                    className="group p-2.5 border-2 border-border hover:border-primary rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 bg-card hover:shadow-lg hover:scale-105 transform active:scale-95"
                    aria-label={`Choisir mon dessin : ${template.name}`}
                  >
                    <div className="aspect-[4/3] relative w-full rounded-md overflow-hidden bg-muted mb-2 shadow-sm group-hover:shadow-md transition-shadow">
                       <img
                        src={template.previewUrl} // Use previewUrl which is the same as dataUrl for user saved
                        alt={template.name}
                        width={200}
                        height={150}
                        data-ai-hint={template.dataAiHint || 'user drawing'}
                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300 ease-in-out"
                      />
                    </div>
                    <p className="text-xs font-medium text-center text-foreground group-hover:text-primary transition-colors truncate">{template.name}</p>
                  </button>
                ))}
              </div>
              <Separator className="my-4 border-primary/30"/>
            </>
          )}

          <h3 className="text-xl font-headline text-primary/80 my-3">Modèles à Colorier</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {predefinedTemplates.map((template) => (
              <button
                key={template.id}
                onClick={() => {
                  // For predefined templates, we use a placeholder that will be scaled.
                  // The actual loading logic in DrawingCanvas will handle fetching the full-size image.
                  onSelectTemplate(template.previewUrl.replace('200x150', '800x600'), false); 
                  onOpenChange(false);
                }}
                className="group p-2.5 border-2 border-border hover:border-primary rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 bg-card hover:shadow-lg hover:scale-105 transform active:scale-95"
                aria-label={`Choisir le modèle : ${template.name}`}
              >
                <div className="aspect-[4/3] relative w-full rounded-md overflow-hidden bg-muted mb-2 shadow-sm group-hover:shadow-md transition-shadow">
                   <img
                    src={template.previewUrl}
                    alt={template.name}
                    width={200}
                    height={150}
                    data-ai-hint={template.dataAiHint}
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300 ease-in-out"
                  />
                </div>
                <p className="text-sm font-medium text-center text-foreground group-hover:text-primary transition-colors">{template.name}</p>
              </button>
            ))}
          </div>
        </ScrollArea>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} className="text-lg py-3 px-6 rounded-lg hover:bg-accent hover:text-accent-foreground animate-boing hover:animate-none">
            Fermer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TemplateModal;
