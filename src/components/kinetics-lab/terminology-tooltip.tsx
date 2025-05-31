'use client';

import type * as React from 'react';
import { useState } from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { explainTerm } from '@/ai/flows/terminology-assistance';
import { Loader2 } from 'lucide-react';

interface TerminologyTooltipProps {
  term: string;
  children: React.ReactNode;
  side?: 'top' | 'right' | 'bottom' | 'left';
}

export function TerminologyTooltip({ term, children, side = 'right' }: TerminologyTooltipProps) {
  const [explanation, setExplanation] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleOpenChange = async (open: boolean) => {
    setIsOpen(open);
    if (open && !explanation && !isLoading) {
      setIsLoading(true);
      try {
        const output = await explainTerm({ term });
        setExplanation(output.explanation);
      } catch (error) {
        console.error('Error fetching explanation:', error);
        setExplanation('Could not load explanation for this term.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <TooltipProvider delayDuration={300}>
      <Tooltip open={isOpen} onOpenChange={handleOpenChange}>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent side={side} className="max-w-xs bg-card text-card-foreground shadow-lg p-3 rounded-md border">
          {isLoading ? (
            <div className="flex items-center space-x-2">
              <Loader2 className="h-4 w-4 animate-spin text-primary" />
              <span>Loading explanation...</span>
            </div>
          ) : (
            <p className="text-sm">{explanation || 'Hover to see explanation.'}</p>
          )}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
