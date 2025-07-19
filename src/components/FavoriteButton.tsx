
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
        transition-all duration-300 hover:scale-105 group
        ${favorite 
          ? 'bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-200' 
          : 'bg-white/95 hover:bg-red-50 border-red-200 text-red-600 hover:border-red-300'
        }
        ${isAnimating ? 'animate-pulse scale-110' : ''}
        ${className}
      `}
    >
      <Heart 
        className={`
          w-4 h-4 transition-all duration-300 group-hover:scale-110
          ${favorite ? 'fill-current text-white' : 'text-red-500'}
          ${isAnimating ? 'animate-bounce' : ''}
          ${showText ? 'mr-2' : ''}
        `} 
      />
      {showText && (
        <span className="font-medium">
          {favorite ? 'Favoritado' : 'Favoritar'}
        </span>
      )}
    </Button>
  );
};
