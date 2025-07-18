
import React, { useState, useEffect } from 'react';
import { Search, ShoppingBag, Play, Star, ArrowRight, BookOpen, Users, Clock, Award } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Header from '@/components/Header';
import { VideoFeed } from '@/components/VideoFeed';
import { CategoryCarousel } from '@/components/CategoryCarousel';
import { ProductCard } from '@/components/ProductCard';
import { ProductGrid } from '@/components/ProductGrid';
import { StatsBar } from '@/components/StatsBar';
import { HeroSection } from '@/components/HeroSection';
import { TabNavigation } from '@/components/TabNavigation';
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from 'react-router-dom';

interface Product {
  id: number;
  produto: string;
  valor: string;
  video: string;
  imagem1: string;
  imagem2: string;
  imagem3: string;
  imagem4: string;
  imagem5: string;
  link: string;
  categoria: string;
}

const Index = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      // @ts-ignore - Bypass TypeScript for table name
      const { data, error } = await (supabase as any)
        .from('MUNDODODIREITO')
        .select('*')
        .limit(20);

      if (error) throw error;
      
      // @ts-ignore - Bypass TypeScript for data casting
      setFeaturedProducts(data || []);
    } catch (error) {
      console.error('Erro ao buscar produtos em destaque:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProductClick = (productId: number) => {
    console.log('Product clicked:', productId);
  };

  const handleTabChange = (tab: string) => {
    console.log('Tab changed:', tab);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900">
      <Header onSearch={() => {}} onPriceFilter={() => {}} />
      
      {/* Hero Section */}
      <HeroSection productsCount={featuredProducts.length} />
      
      {/* Stats Bar */}
      <StatsBar />
      
      {/* Categories */}
      <CategoryCarousel products={featuredProducts} onProductClick={handleProductClick} />
      
      {/* Featured Products - Mais Procurados pelos Juristas */}
      <section className="px-4 md:px-6 py-8 bg-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="animate-fade-in">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                ⭐ Mais Procurados pelos Juristas
              </h2>
              <p className="text-white/80">
                Os materiais favoritos dos profissionais do direito
              </p>
            </div>
            <Button
              variant="ghost"
              className="text-white hover:bg-white/20 animate-fade-in"
              onClick={() => navigate('/categoria-lista?tipo=mais-vendidos')}
            >
              Ver todos
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-2 md:gap-3">
              {Array.from({ length: 16 }).map((_, index) => (
                <div key={index} className="h-48 bg-white/20 rounded-2xl animate-pulse"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-2 md:gap-3">
              {featuredProducts.slice(0, 16).map((product, index) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  showBadge={index < 3}
                  badgeText="TOP"
                  ultraCompact={true}
                  style={{ animationDelay: `${index * 0.05}s` }}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Video Feed - Only render if we have products */}
      {featuredProducts.length > 0 && featuredProducts[0] && (
        <VideoFeed 
          product={featuredProducts[0]} 
          isActive={true} 
          onBuy={() => console.log('Buy clicked')} 
        />
      )}
      
      {/* Tab Navigation */}
      <TabNavigation 
        showingAI={false} 
        onTabChange={handleTabChange} 
      />
    </div>
  );
};

export default Index;
