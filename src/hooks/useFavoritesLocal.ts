
import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

export const useFavoritesLocal = () => {
  const [favorites, setFavorites] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Load favorites from localStorage with error handling
  const loadFavorites = useCallback(() => {
    try {
      const storedFavorites = localStorage.getItem('shopee-favorites');
      console.log('🔄 Carregando favoritos do localStorage:', storedFavorites);
      
      if (storedFavorites) {
        const parsed = JSON.parse(storedFavorites);
        console.log('📊 Favoritos parseados:', parsed);
        
        if (Array.isArray(parsed)) {
          // Validate that all items are numbers
          const validFavorites = parsed.filter(id => typeof id === 'number' && !isNaN(id));
          if (validFavorites.length !== parsed.length) {
            console.warn('⚠️ Alguns favoritos inválidos foram removidos');
          }
          setFavorites(validFavorites);
          console.log('✅ Favoritos definidos no estado:', validFavorites);
        } else {
          console.warn('⚠️ Formato de favoritos inválido, reiniciando');
          localStorage.setItem('shopee-favorites', JSON.stringify([]));
          setFavorites([]);
        }
      } else {
        console.log('💾 Nenhum favorito encontrado, iniciando com array vazio');
        setFavorites([]);
      }
    } catch (error) {
      console.error('❌ Erro ao carregar favoritos:', error);
      // Reset to empty array on error
      setFavorites([]);
      localStorage.setItem('shopee-favorites', JSON.stringify([]));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);

  const toggleFavorite = useCallback((productId: number) => {
    console.log('🔄 Alternando favorito para produto ID:', productId);
    
    // Validate input
    if (!productId || typeof productId !== 'number' || isNaN(productId)) {
      console.error('❌ ID de produto inválido:', productId);
      toast({
        title: "Erro",
        description: "ID de produto inválido.",
        variant: "destructive",
      });
      return;
    }

    try {
      const isFavorite = favorites.includes(productId);
      let newFavorites: number[];
      
      if (isFavorite) {
        newFavorites = favorites.filter(id => id !== productId);
        console.log('➖ Removendo dos favoritos:', productId);
        
        toast({
          title: "Removido dos favoritos",
          description: "Produto removido da sua lista de favoritos.",
        });
      } else {
        newFavorites = [...favorites, productId];
        console.log('➕ Adicionando aos favoritos:', productId);
        
        toast({
          title: "Adicionado aos favoritos",
          description: "Produto adicionado à sua lista de favoritos.",
        });
      }
      
      console.log('💾 Novos favoritos:', newFavorites);
      setFavorites(newFavorites);
      
      // Save to localStorage with error handling
      try {
        localStorage.setItem('shopee-favorites', JSON.stringify(newFavorites));
        console.log('✅ Favoritos salvos no localStorage');
      } catch (storageError) {
        console.error('❌ Erro ao salvar no localStorage:', storageError);
        toast({
          title: "Aviso",
          description: "Favorito atualizado, mas pode não persistir entre sessões.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('❌ Erro ao alternar favorito:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar os favoritos. Tente novamente.",
        variant: "destructive",
      });
    }
  }, [favorites, toast]);

  const removeFavorite = useCallback((productId: number) => {
    console.log('🗑️ Removendo favorito:', productId);
    
    if (!productId || typeof productId !== 'number' || isNaN(productId)) {
      console.error('❌ ID de produto inválido para remoção:', productId);
      return;
    }

    try {
      const newFavorites = favorites.filter(id => id !== productId);
      console.log('📊 Favoritos após remoção:', newFavorites);
      setFavorites(newFavorites);
      
      // Save to localStorage
      try {
        localStorage.setItem('shopee-favorites', JSON.stringify(newFavorites));
        console.log('✅ Favoritos atualizados no localStorage');
      } catch (storageError) {
        console.error('❌ Erro ao salvar remoção no localStorage:', storageError);
      }
    } catch (error) {
      console.error('❌ Erro ao remover favorito:', error);
    }
  }, [favorites]);

  const isFavorite = useCallback((productId: number) => {
    if (!productId || typeof productId !== 'number' || isNaN(productId)) {
      return false;
    }
    const result = favorites.includes(productId);
    console.log(`🔍 Produto ${productId} é favorito:`, result);
    return result;
  }, [favorites]);

  const clearAllFavorites = useCallback(() => {
    console.log('🧹 Limpando todos os favoritos');
    try {
      setFavorites([]);
      localStorage.setItem('shopee-favorites', JSON.stringify([]));
      console.log('✅ Todos os favoritos limpos');
      
      toast({
        title: "Favoritos limpos",
        description: "Todos os favoritos foram removidos.",
      });
    } catch (error) {
      console.error('❌ Erro ao limpar favoritos:', error);
      toast({
        title: "Erro",
        description: "Não foi possível limpar os favoritos.",
        variant: "destructive",
      });
    }
  }, [toast]);

  // Get favorites statistics
  const getFavoritesStats = useCallback(() => {
    return {
      total: favorites.length,
      isEmpty: favorites.length === 0,
      hasItems: favorites.length > 0
    };
  }, [favorites]);

  console.log('📊 Estado atual dos favoritos:', favorites);

  return {
    favorites,
    toggleFavorite,
    removeFavorite,
    isFavorite,
    clearAllFavorites,
    getFavoritesStats,
    favoritesCount: favorites.length,
    isLoading,
    // Helper methods
    hasFavorites: favorites.length > 0,
    isEmpty: favorites.length === 0
  };
};
