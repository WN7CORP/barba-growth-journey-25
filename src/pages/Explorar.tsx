
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { ArrowLeft, Grid3X3, List } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { CategoryFilter } from '@/components/CategoryFilter';
import { ProductGrid } from '@/components/ProductGrid';
import { supabase } from "@/integrations/supabase/client";

interface Product {
  id: number;
  produto: string;
  valor: string;
  imagem1: string;
  imagem2?: string;
  imagem3?: string;
  imagem4?: string;
  imagem5?: string;
  link: string;
  categoria: string;
}

const Explorar = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('todas');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');

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
      
      // Shuffle products
      const shuffledProducts = shuffleArray(data || []);
      setProducts(shuffledProducts);
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

  const handleCategoryChange = useCallback((category: string) => {
    setSelectedCategory(category);
  }, []);

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
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-sm safe-top">
        <div className="flex items-center justify-between mobile-padding">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/')}
            className="text-white hover:bg-white/20 touch-target"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            <span className="hidden sm:inline">Voltar</span>
          </Button>

          <h1 className="text-white font-bold text-xl">Explorar</h1>

          <div className="flex gap-1 sm:gap-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className={`touch-target ${viewMode === 'grid' ? 'bg-orange-500 hover:bg-orange-600' : 'text-white hover:bg-white/20'}`}
            >
              <Grid3X3 className="w-4 h-4" />
              <span className="hidden sm:inline ml-1">Grade</span>
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
              className={`touch-target ${viewMode === 'list' ? 'bg-orange-500 hover:bg-orange-600' : 'text-white hover:bg-white/20'}`}
            >
              <List className="w-4 h-4" />
              <span className="hidden sm:inline ml-1">Lista</span>
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
      <div className="pt-32 safe-bottom">
        <div className="min-h-screen bg-gradient-to-br from-orange-400 via-red-500 to-pink-500 mobile-padding">
          <div className="container-responsive">
            <ProductGrid 
              products={filteredProducts} 
              compact={viewMode === 'grid'} 
              listView={viewMode === 'list'}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Explorar;
