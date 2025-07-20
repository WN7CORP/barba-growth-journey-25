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
  return;
};