
import { Heart } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useFavorites } from '@/hooks/useFavorites';
import { useState } from 'react';

interface FavoriteButtonProps {
  productId: number;
  size?: 'sm' | 'default';
  showText?: boolean;
  className?: string;
}

export const FavoriteButton = ({
  productId,
  size = 'sm',
  showText = true,
  className = ''
}: FavoriteButtonProps) => {
  const {
    isFavorite,
    toggleFavorite
  } = useFavorites();
  const [isAnimating, setIsAnimating] = useState(false);
  
  const favorite = isFavorite(productId);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setIsAnimating(true);
    toggleFavorite(productId);

    // Reset animation after a short delay
    setTimeout(() => setIsAnimating(false), 600);
  };

  return (
    <Button
      variant={favorite ? "default" : "outline"}
      size={size}
      onClick={handleClick}
      className={`
        ${favorite 
          ? 'bg-red-500 hover:bg-red-600 text-white border-red-500' 
          : 'bg-white/90 hover:bg-red-50 text-red-500 border-red-200 hover:border-red-300'
        }
        ${isAnimating ? 'animate-bounce' : ''}
        transition-all duration-300 hover:scale-105 shadow-md hover:shadow-lg
        ${size === 'sm' ? 'min-h-[44px] min-w-[44px]' : 'min-h-[48px] min-w-[48px]'}
        ${className}
      `}
    >
      <Heart 
        className={`${size === 'sm' ? 'w-4 h-4' : 'w-5 h-5'} ${favorite ? 'fill-current' : ''} ${showText ? 'mr-2' : ''}`} 
      />
      {showText && (
        <span className="text-xs font-medium">
          {favorite ? 'Favoritado' : 'Favoritar'}
        </span>
      )}
    </Button>
  );
};
