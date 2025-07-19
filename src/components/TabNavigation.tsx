
import React from 'react';
import { Button } from "@/components/ui/button";
import { Brain } from 'lucide-react';

interface TabNavigationProps {
  showingAI: boolean;
  onTabChange: (tab: 'featured' | 'ai') => void;
}

export const TabNavigation: React.FC<TabNavigationProps> = ({
  showingAI,
  onTabChange
}) => {
  return (
    <div className="flex items-center justify-center gap-4 mb-4">
      <Button
        variant={!showingAI ? 'default' : 'outline'}
        onClick={() => onTabChange('featured')}
        className={`${!showingAI ? 'bg-white text-red-600' : 'bg-white/20 text-white border-white/30'}`}
      >
        🔥 Mais Vendidos
      </Button>
      <Button
        variant={showingAI ? 'default' : 'outline'}
        onClick={() => onTabChange('ai')}
        className={`${showingAI ? 'bg-white text-red-600' : 'bg-white/20 text-white border-white/30'} flex items-center gap-2`}
      >
        <Brain className="w-4 h-4" />
        Me Ajuda Escolher
      </Button>
    </div>
  );
};
