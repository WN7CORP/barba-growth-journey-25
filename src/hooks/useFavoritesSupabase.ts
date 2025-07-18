
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAppUser } from './useAppUser';
import { useToast } from '@/hooks/use-toast';

export const useFavoritesSupabase = () => {
  const [favorites, setFavorites] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAppUser();
  const { toast } = useToast();

  // Load favorites from Supabase
  const loadFavorites = useCallback(async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    try {
      // Use article_id as the column name based on the error message
      const { data, error } = await supabase
        .from('user_favorites')
        .select('article_id')
        .eq('user_id', user.id);

      if (error) {
        console.error('Error loading favorites:', error);
        // Fallback to localStorage
        const storedFavorites = localStorage.getItem('shopee-favorites');
        if (storedFavorites) {
          const parsed = JSON.parse(storedFavorites);
          if (Array.isArray(parsed)) {
            setFavorites(parsed);
          }
        }
      } else {
        const productIds = data.map(fav => Number(fav.article_id));
        setFavorites(productIds);
        // Sync with localStorage for offline access
        localStorage.setItem('shopee-favorites', JSON.stringify(productIds));
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);

  const toggleFavorite = useCallback(async (productId: number) => {
    if (!user) {
      toast({
        title: "Erro",
        description: "Não foi possível salvar o favorito. Tente novamente.",
        variant: "destructive",
      });
      return;
    }

    try {
      const isFavorite = favorites.includes(productId);
      
      if (isFavorite) {
        // Remove from favorites
        const { error } = await supabase
          .from('user_favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('article_id', productId.toString());

        if (error) throw error;

        const newFavorites = favorites.filter(id => id !== productId);
        setFavorites(newFavorites);
        localStorage.setItem('shopee-favorites', JSON.stringify(newFavorites));
        
        toast({
          title: "Removido dos favoritos",
          description: "Produto removido da sua lista de favoritos.",
        });
      } else {
        // Add to favorites
        const { error } = await supabase
          .from('user_favorites')
          .insert([{
            user_id: user.id,
            article_id: productId.toString()
          }]);

        if (error) throw error;

        const newFavorites = [...favorites, productId];
        setFavorites(newFavorites);
        localStorage.setItem('shopee-favorites', JSON.stringify(newFavorites));
        
        toast({
          title: "Adicionado aos favoritos",
          description: "Produto adicionado à sua lista de favoritos.",
        });
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar os favoritos. Tente novamente.",
        variant: "destructive",
      });
    }
  }, [user, favorites, toast]);

  const removeFavorite = useCallback(async (productId: number) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('user_favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('article_id', productId.toString());

      if (error) throw error;

      const newFavorites = favorites.filter(id => id !== productId);
      setFavorites(newFavorites);
      localStorage.setItem('shopee-favorites', JSON.stringify(newFavorites));
    } catch (error) {
      console.error('Error removing favorite:', error);
    }
  }, [user, favorites]);

  const isFavorite = useCallback((productId: number) => {
    return favorites.includes(productId);
  }, [favorites]);

  const clearAllFavorites = useCallback(async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('user_favorites')
        .delete()
        .eq('user_id', user.id);

      if (error) throw error;

      setFavorites([]);
      localStorage.setItem('shopee-favorites', JSON.stringify([]));
    } catch (error) {
      console.error('Error clearing favorites:', error);
    }
  }, [user]);

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
