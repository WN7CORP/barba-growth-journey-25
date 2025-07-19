
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendingUp } from 'lucide-react';
import { HeroSection } from '@/components/HeroSection';
import { CategoryCarousel } from '@/components/CategoryCarousel';
import { ProductGrid } from '@/components/ProductGrid';
import TabNavigation from '@/components/TabNavigation';
import { StatsBar } from '@/components/StatsBar';
import { Button } from "@/components/ui/button";
import { useFavorites } from '@/hooks/useFavorites';
import { useMostPurchased } from '@/hooks/useMostPurchased';

const Index = () => {
  const navigate = useNavigate();
  const { favorites, isLoading: favoritesLoading } = useFavorites();
  const { products: mostPurchasedProducts, loading: mostPurchasedLoading } = useMostPurchased(8);

  const handleViewAllFavorites = () => {
    navigate('/favoritos');
  };

  const handleViewAllMostPurchased = () => {
    navigate('/mais-comprados');
  };

  const handleProductClick = (productId: number) => {
    // Navegar para detalhes do produto se necessário
    console.log('Product clicked:', productId);
  };

  const mockRecentProducts = [
    {
      id: 1,
      produto: "Kit Completo de Estudo",
      valor: "R$ 299,99",
      imagem1: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400",
      imagem2: "",
      imagem3: "",
      imagem4: "",
      imagem5: "",
      link: "https://exemplo.com",
      categoria: "Educação"
    },
    {
      id: 2,
      produto: "Apostila Digital Premium",
      valor: "R$ 99,99",
      imagem1: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
      imagem2: "",
      imagem3: "",
      imagem4: "",
      imagem5: "",
      link: "https://exemplo.com",
      categoria: "Educação"
    }
  ];

  // Buscar produtos favoritos fictícios baseados nos IDs salvos
  const favoriteProducts = favorites.slice(0, 8).map(id => ({
    id,
    produto: `Produto Favorito ${id}`,
    valor: "R$ 199,99",
    imagem1: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
    imagem2: "",
    imagem3: "",
    imagem4: "",
    imagem5: "",
    link: "https://exemplo.com",
    categoria: "Favoritos"
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-400 via-red-500 to-pink-500">
      <HeroSection productsCount={mostPurchasedProducts.length + mockRecentProducts.length} />
      <CategoryCarousel products={mockRecentProducts} onProductClick={handleProductClick} />
      <div className="container mx-auto px-4 py-2">
        <StatsBar />
      </div>
      
      <div className="container mx-auto px-4 py-8 space-y-12">
        {/* Mais Comprados Section */}
        <section className="animate-fade-in">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-8 h-8 text-yellow-300" />
              <h2 className="text-3xl font-bold text-white">Mais Comprados</h2>
            </div>
            <Button 
              variant="outline" 
              onClick={handleViewAllMostPurchased}
              className="bg-white/20 border-white/30 text-white hover:bg-white/30 backdrop-blur-sm"
            >
              Ver todos
            </Button>
          </div>
          
          <ProductGrid 
            products={mostPurchasedProducts.map(p => ({
              id: p.product_id,
              produto: p.product_name,
              valor: p.product_value,
              categoria: p.product_category,
              imagem1: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400",
              imagem2: "",
              imagem3: "",
              imagem4: "",
              imagem5: "",
              link: "https://exemplo.com"
            }))}
            loading={mostPurchasedLoading}
            compact={true}
          />
        </section>

        {/* Mais Acessados Section */}
        <section className="animate-fade-in">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-white">Mais Acessados</h2>
            <Button 
              variant="outline" 
              onClick={() => navigate('/categoria-lista?categoria=Mais%20Acessados&tipo=categoria')}
              className="bg-white/20 border-white/30 text-white hover:bg-white/30 backdrop-blur-sm"
            >
              Ver todos
            </Button>
          </div>
          <ProductGrid products={mockRecentProducts} compact={true} />
        </section>

        {/* Favoritos Section */}
        {favoriteProducts.length > 0 && (
          <section className="animate-fade-in">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold text-white">Seus Favoritos</h2>
              <Button 
                variant="outline" 
                onClick={handleViewAllFavorites}
                className="bg-white/20 border-white/30 text-white hover:bg-white/30 backdrop-blur-sm"
              >
                Ver todos
              </Button>
            </div>
            <ProductGrid 
              products={favoriteProducts} 
              loading={favoritesLoading}
              compact={true}
            />
          </section>
        )}
      </div>
      
      <TabNavigation />
    </div>
  );
};

export default Index;
