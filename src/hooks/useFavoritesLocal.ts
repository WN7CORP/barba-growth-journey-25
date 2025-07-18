
import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

export const useFavoritesLocal = () => {
  const [favorites, setFavorites] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Load favorites from localStorage
  const loadFavorites = useCallback(() => {
    try {
      const storedFavorites = localStorage.getItem('shopee-favorites');
      if (storedFavorites) {
        const parsed = JSON.parse(storedFavorites);
        if (Array.isArray(parsed)) {
          setFavorites(parsed);
        }
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);

  const toggleFavorite = useCallback((productId: number) => {
    try {
      const isFavorite = favorites.includes(productId);
      let newFavorites: number[];
      
      if (isFavorite) {
        newFavorites = favorites.filter(id => id !== productId);
        toast({
          title: "Removido dos favoritos",
          description: "Produto removido da sua lista de favoritos.",
        });
      } else {
        newFavorites = [...favorites, productId];
        toast({
          title: "Adicionado aos favoritos",
          description: "Produto adicionado à sua lista de favoritos.",
        });
      }
      
      setFavorites(newFavorites);
      localStorage.setItem('shopee-favorites', JSON.stringify(newFavorites));
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar os favoritos. Tente novamente.",
        variant: "destructive",
      });
    }
  }, [favorites, toast]);

  const removeFavorite = useCallback((productId: number) => {
    try {
      const newFavorites = favorites.filter(id => id !== productId);
      setFavorites(newFavorites);
      localStorage.setItem('shopee-favorites', JSON.stringify(newFavorites));
    } catch (error) {
      console.error('Error removing favorite:', error);
    }
  }, [favorites]);

  const isFavorite = useCallback((productId: number) => {
    return favorites.includes(productId);
  }, [favorites]);

  const clearAllFavorites = useCallback(() => {
    try {
      setFavorites([]);
      localStorage.setItem('shopee-favorites', JSON.stringify([]));
    } catch (error) {
      console.error('Error clearing favorites:', error);
    }
  }, []);

  return {
    favorites,
    toggleFavorite,
    removeFavorite,
    isFavorite,
    clearAllFavorites,
    favoritesCount: favorites.length,
    isLoading
  };
};
