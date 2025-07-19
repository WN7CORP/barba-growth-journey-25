
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { ArrowLeft, Grid3X3, List, Play } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { VideoFeed } from '@/components/VideoFeed';
import { CategoryFilter } from '@/components/CategoryFilter';
import { ProductGrid } from '@/components/ProductGrid';
import { supabase } from "@/integrations/supabase/client";

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

const Explorar = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('todas');
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [viewMode, setViewMode] = useState<'video' | 'grid' | 'list'>('video');

  // Shuffle array function
  const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('SHOPEE')
        .select('*')
        .order('id');

      if (error) throw error;
      
      // Shuffle products and prioritize those with videos for the video feed
      const shuffledProducts = shuffleArray(data || []);
      const productsWithVideos = shuffledProducts.filter(p => p.video);
      const productsWithoutVideos = shuffledProducts.filter(p => !p.video);
      
      setProducts([...productsWithVideos, ...productsWithoutVideos]);
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
    } finally {
      setLoading(false);
    }
  };

  // Memoized filtered products
  const filteredProducts = useMemo(() => {
    if (selectedCategory === 'todas') {
      return products;
    }
    return products.filter(product => product.categoria === selectedCategory);
  }, [products, selectedCategory]);

  // Memoized categories and counts
  const { categories, productCounts } = useMemo(() => {
    const categoryMap = new Map<string, number>();
    products.forEach(product => {
      if (product.categoria) {
        categoryMap.set(product.categoria, (categoryMap.get(product.categoria) || 0) + 1);
      }
    });
    
    return {
      categories: Array.from(categoryMap.keys()).sort(),
      productCounts: Object.fromEntries(categoryMap)
    };
  }, [products]);

  // Products with videos for video feed
  const videoProducts = useMemo(() => {
    return filteredProducts.filter(product => product.video);
  }, [filteredProducts]);

  const handleBuyProduct = useCallback((product: Product) => {
    window.open(product.link, '_blank');
  }, []);

  const handleCategoryChange = useCallback((category: string) => {
    setSelectedCategory(category);
    setCurrentVideoIndex(0);
  }, []);

  // Handle scroll for video feed
  useEffect(() => {
    if (viewMode === 'video') {
      const handleScroll = (e: WheelEvent) => {
        e.preventDefault();
        if (e.deltaY > 0 && currentVideoIndex < videoProducts.length - 1) {
          setCurrentVideoIndex(prev => prev + 1);
        } else if (e.deltaY < 0 && currentVideoIndex > 0) {
          setCurrentVideoIndex(prev => prev - 1);
        }
      };

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'ArrowDown' && currentVideoIndex < videoProducts.length - 1) {
          setCurrentVideoIndex(prev => prev + 1);
        } else if (e.key === 'ArrowUp' && currentVideoIndex > 0) {
          setCurrentVideoIndex(prev => prev - 1);
        }
      };

      window.addEventListener('wheel', handleScroll, { passive: false });
      window.addEventListener('keydown', handleKeyDown);

      return () => {
        window.removeEventListener('wheel', handleScroll);
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [viewMode, currentVideoIndex, videoProducts.length]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Carregando produtos...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-sm">
        <div className="flex items-center justify-between p-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/')}
            className="text-white hover:bg-white/20"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Voltar
          </Button>

          <h1 className="text-white font-bold text-xl">Explorar</h1>

          <div className="flex gap-2">
            <Button
              variant={viewMode === 'video' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('video')}
              className={viewMode === 'video' ? 'bg-orange-500 hover:bg-orange-600' : 'text-white hover:bg-white/20'}
            >
              <Play className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className={viewMode === 'grid' ? 'bg-orange-500 hover:bg-orange-600' : 'text-white hover:bg-white/20'}
            >
              <Grid3X3 className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
              className={`md:hidden ${viewMode === 'list' ? 'bg-orange-500 hover:bg-orange-600' : 'text-white hover:bg-white/20'}`}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Category Filter */}
        <CategoryFilter
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={handleCategoryChange}
          productCounts={productCounts}
        />
      </div>

      {/* Content */}
      <div className="pt-32">
        {viewMode === 'video' ? (
          <div className="relative">
            {videoProducts.length > 0 ? (
              <div className="h-screen overflow-hidden">
                {videoProducts.map((product, index) => (
                  <div
                    key={product.id}
                    className={`absolute inset-0 transition-transform duration-500 ${
                      index === currentVideoIndex ? 'translate-y-0' : 
                      index < currentVideoIndex ? '-translate-y-full' : 'translate-y-full'
                    }`}
                  >
                    <VideoFeed
                      product={product}
                      isActive={index === currentVideoIndex}
                      onBuy={handleBuyProduct}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-screen flex items-center justify-center text-white">
                <div className="text-center">
                  <p className="text-xl mb-4">Nenhum vídeo encontrado nesta categoria</p>
                  <Button onClick={() => setViewMode('grid')} className="bg-orange-500 hover:bg-orange-600">
                    Ver em Grade
                  </Button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="min-h-screen bg-gradient-to-br from-orange-400 via-red-500 to-pink-500 p-4">
            <div className="max-w-7xl mx-auto">
              <ProductGrid 
                products={filteredProducts} 
                compact={viewMode === 'list'} 
              />
            </div>
          </div>
        )}
      </div>

      {/* Video Navigation Indicator */}
      {viewMode === 'video' && videoProducts.length > 0 && (
        <div className="fixed right-4 top-1/2 transform -translate-y-1/2 z-40">
          <div className="flex flex-col gap-2">
            {videoProducts.map((_, index) => (
              <div
                key={index}
                className={`w-1 h-8 rounded-full transition-all duration-300 ${
                  index === currentVideoIndex ? 'bg-orange-500' : 'bg-white/30'
                }`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Explorar;
