
import { useState, useEffect } from 'react';
import { ArrowLeft, Star, ShoppingBag, Play, Sparkles } from 'lucide-react';
import { Button } from "@/components/ui/button";
import Header from '@/components/Header';
import { ProductDetailModal } from '@/components/ProductDetailModal';
import { ProductCard } from '@/components/ProductCard';
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
  descricao?: string;
}

const Novos = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchNewestProducts();
  }, []);

  const fetchNewestProducts = async () => {
    try {
      // @ts-ignore - Bypass TypeScript for table name  
      const { data, error } = await (supabase as any)
        .from('MUNDODODIREITO')
        .select('*')
        .order('id', { ascending: false })
        .limit(50);

      if (error) throw error;
      // @ts-ignore - Bypass TypeScript for data casting
      setProducts(data || []);
    } catch (error) {
      console.error('Erro ao buscar produtos novos:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: string | null) => {
    // Handle null or undefined price
    if (!price) {
      return 'Preço não disponível';
    }
    
    // Handle string price
    if (price.includes('R$')) {
      return price;
    }
    return `R$ ${price}`;
  };

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setIsDetailModalOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 pb-20">
        <Header onSearch={() => {}} onPriceFilter={() => {}} />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-32 bg-white/20 rounded-2xl animate-shimmer"></div>
            <div className="space-y-3">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="h-24 bg-white/20 rounded-2xl animate-shimmer"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 pb-20">
      <Header onSearch={() => {}} onPriceFilter={() => {}} />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-6 animate-fade-in">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/')}
            className="text-white hover:bg-white/20 rounded-xl transition-all duration-300 hover:scale-105"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl md:text-3xl font-bold text-white animate-slide-in-left">
              📚 Lançamentos Jurídicos
            </h1>
            <p className="text-white/80 animate-slide-in-right">
              Os {products.length} livros e materiais mais recentes da nossa livraria
            </p>
          </div>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-16 animate-fade-in">
            <div className="w-32 h-32 bg-white/20 rounded-3xl flex items-center justify-center mx-auto mb-6 backdrop-blur-sm animate-pulse">
              <Sparkles className="w-16 h-16 text-white/50" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">
              Nenhum lançamento ainda
            </h2>
            <p className="text-white/80 mb-6">
              Novos materiais jurídicos serão exibidos aqui em breve
            </p>
            <Button
              onClick={() => navigate('/')}
              className="bg-white text-blue-600 hover:bg-gray-100 font-semibold transition-all duration-300 hover:scale-105"
            >
              Explorar Livraria
            </Button>
          </div>
        ) : (
          // Always show products in column format (grid)
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
            {products.map((product, index) => (
              <div key={product.id}>
                <ProductCard 
                  product={product} 
                  showBadge={true}
                  badgeText="LANÇAMENTO"
                  compact={true}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Product Detail Modal with Tips */}
      {selectedProduct && (
        <ProductDetailModal 
          isOpen={isDetailModalOpen} 
          onClose={() => setIsDetailModalOpen(false)} 
          product={selectedProduct} 
        />
      )}
    </div>
  );
};

export default Novos;
