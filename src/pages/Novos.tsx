
import { useState, useEffect } from 'react';
import { ArrowLeft, Star, ShoppingBag, Play, Sparkles } from 'lucide-react';
import { Button } from "@/components/ui/button";
import Header from '@/components/Header';
import { ProductDetailModal } from '@/components/ProductDetailModal';
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from 'react-router-dom';
import { OptimizedImage } from '@/components/OptimizedImage';
import { FavoriteButton } from '@/components/FavoriteButton';

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
    if (!price) {
      return 'Preço não disponível';
    }
    
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
          // Display products in list format
          <div className="space-y-4">
            {products.map((product, index) => (
              <div key={product.id} className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 hover:bg-white/20 transition-all duration-300 animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="flex gap-4">
                  <div className="w-20 h-28 flex-shrink-0 rounded-lg overflow-hidden">
                    <OptimizedImage 
                      src={product.imagem1} 
                      alt={product.produto}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-white font-semibold text-sm md:text-base line-clamp-2 mb-2">
                          {product.produto}
                        </h3>
                        
                        <div className="flex items-center gap-2 mb-2">
                          <span className="px-2 py-1 bg-purple-500/20 text-purple-300 text-xs rounded-full">
                            LANÇAMENTO
                          </span>
                          <span className="text-white/60 text-xs">
                            {product.categoria}
                          </span>
                        </div>
                        
                        <div className="text-amber-400 font-bold text-lg mb-3">
                          {formatPrice(product.valor)}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <FavoriteButton productId={product.id} />
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleProductClick(product)}
                        className="bg-white/20 text-white hover:bg-white/30 text-xs px-3 py-1 h-auto"
                      >
                        Ver mais
                      </Button>
                      
                      {product.video && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="bg-red-500/20 text-red-300 border-red-400/30 hover:bg-red-500/30 text-xs px-3 py-1 h-auto"
                        >
                          <Play className="w-3 h-3 mr-1" />
                          Vídeo
                        </Button>
                      )}
                      
                      <Button
                        size="sm"
                        asChild
                        className="bg-green-500 hover:bg-green-600 text-white text-xs px-3 py-1 h-auto"
                      >
                        <a href={product.link} target="_blank" rel="noopener noreferrer">
                          <ShoppingBag className="w-3 h-3 mr-1" />
                          Comprar
                        </a>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Product Detail Modal */}
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
