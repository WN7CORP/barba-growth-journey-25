
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
      console.log('Carregando favoritos do localStorage:', storedFavorites);
      if (storedFavorites) {
        const parsed = JSON.parse(storedFavorites);
        console.log('Favoritos parseados:', parsed);
        if (Array.isArray(parsed)) {
          setFavorites(parsed);
          console.log('Favoritos definidos no estado:', parsed);
        }
      }
    } catch (error) {
      console.error('Erro ao carregar favoritos:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);

  const toggleFavorite = useCallback((productId: number) => {
    console.log('Alternando favorito para produto ID:', productId);
    try {
      const isFavorite = favorites.includes(productId);
      let newFavorites: number[];
      
      if (isFavorite) {
        newFavorites = favorites.filter(id => id !== productId);
        console.log('Removendo dos favoritos:', productId);
        toast({
          title: "Removido dos favoritos",
          description: "Produto removido da sua lista de favoritos.",
        });
      } else {
        newFavorites = [...favorites, productId];
        console.log('Adicionando aos favoritos:', productId);
        toast({
          title: "Adicionado aos favoritos",
          description: "Produto adicionado à sua lista de favoritos.",
        });
      }
      
      console.log('Novos favoritos:', newFavorites);
      setFavorites(newFavorites);
      localStorage.setItem('shopee-favorites', JSON.stringify(newFavorites));
      console.log('Favoritos salvos no localStorage');
    } catch (error) {
      console.error('Erro ao alternar favorito:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar os favoritos. Tente novamente.",
        variant: "destructive",
      });
    }
  }, [favorites, toast]);

  const removeFavorite = useCallback((productId: number) => {
    console.log('Removendo favorito:', productId);
    try {
      const newFavorites = favorites.filter(id => id !== productId);
      console.log('Favoritos após remoção:', newFavorites);
      setFavorites(newFavorites);
      localStorage.setItem('shopee-favorites', JSON.stringify(newFavorites));
    } catch (error) {
      console.error('Erro ao remover favorito:', error);
    }
  }, [favorites]);

  const isFavorite = useCallback((productId: number) => {
    const result = favorites.includes(productId);
    console.log(`Produto ${productId} é favorito:`, result);
    return result;
  }, [favorites]);

  const clearAllFavorites = useCallback(() => {
    try {
      setFavorites([]);
      localStorage.setItem('shopee-favorites', JSON.stringify([]));
      console.log('Todos os favoritos limpos');
    } catch (error) {
      console.error('Erro ao limpar favoritos:', error);
    }
  }, []);

  console.log('Estado atual dos favoritos:', favorites);

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
