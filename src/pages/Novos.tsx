
import { useState, useEffect } from 'react';
import { ArrowLeft, Star, ShoppingBag, Play, Sparkles, Video, Eye } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Header from '@/components/Header';
import { ProductDetailModal } from '@/components/ProductDetailModal';
import { ProductVideoModal } from '@/components/ProductVideoModal';
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
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchNewestProducts();
  }, []);

  const fetchNewestProducts = async () => {
    try {
      // @ts-ignore - Bypass TypeScript for table name  
      const {
        data,
        error
      } = await (supabase as any).from('MUNDODODIREITO').select('*').order('id', {
        ascending: false
      }).limit(50);

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

  const handleVideoClick = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedProduct(product);
    setIsVideoModalOpen(true);
  };

  const getProductImages = (product: Product) => {
    return [product.imagem1, product.imagem2, product.imagem3, product.imagem4, product.imagem5].filter(Boolean);
  };

  // Simulate rating (in a real app, this would come from database)
  const getSimulatedRating = (productId: number) => {
    const ratings = [4.2, 4.5, 4.8, 4.3, 4.7, 4.1, 4.9, 4.4, 4.6, 4.0];
    return ratings[productId % ratings.length];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 pb-20">
        <Header onSearch={() => {}} onPriceFilter={() => {}} />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-32 bg-white/20 rounded-2xl animate-shimmer"></div>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="h-32 bg-white/20 rounded-2xl animate-shimmer"></div>
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
        <div className="flex items-center gap-4 mb-8 animate-fade-in">
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
            <h1 className="text-3xl md:text-4xl font-bold text-white animate-slide-in-left flex items-center gap-3">
              <Sparkles className="w-8 h-8 text-yellow-400" />
              📚 Lançamentos Jurídicos
            </h1>
            <p className="text-white/80 animate-slide-in-right text-lg">
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
            <Button onClick={() => navigate('/')} className="bg-white text-blue-600 hover:bg-gray-100 font-semibold transition-all duration-300 hover:scale-105">
              Explorar Livraria
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {products.map((product, index) => {
              const rating = getSimulatedRating(product.id);
              const hasVideo = product.video && product.video.trim() !== '';
              
              return (
                <div 
                  key={product.id} 
                  className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/15 transition-all duration-300 animate-fade-in cursor-pointer group hover:scale-[1.02] hover:shadow-2xl hover:shadow-blue-500/20" 
                  style={{ animationDelay: `${index * 0.1}s` }}
                  onClick={() => handleProductClick(product)}
                >
                  <div className="flex gap-6">
                    {/* Enhanced Thumbnail */}
                    <div className="w-32 h-40 flex-shrink-0 rounded-xl overflow-hidden relative group-hover:scale-105 transition-transform duration-300">
                      <OptimizedImage 
                        src={product.imagem1} 
                        alt={product.produto} 
                        className="w-full h-full object-cover" 
                      />
                      {hasVideo && (
                        <div className="absolute top-2 right-2">
                          <div className="bg-red-600/90 rounded-full p-1.5 shadow-lg animate-pulse">
                            <Video className="w-4 h-4 text-white" />
                          </div>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                    
                    <div className="flex-1 min-w-0 space-y-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-xs animate-pulse">
                              LANÇAMENTO
                            </Badge>
                            <Badge variant="secondary" className="text-xs bg-white/20 text-purple-300 border-purple-400/30">
                              {product.categoria}
                            </Badge>
                          </div>
                          
                          <h3 className="text-white font-semibold text-lg md:text-xl line-clamp-2 mb-3 group-hover:text-purple-200 transition-colors">
                            {product.produto}
                          </h3>
                          
                          {/* Rating */}
                          <div className="flex items-center gap-2 mb-3">
                            <div className="flex items-center gap-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star 
                                  key={star} 
                                  className={`w-4 h-4 ${
                                    star <= Math.floor(rating) 
                                      ? 'text-yellow-400 fill-yellow-400' 
                                      : star <= rating 
                                        ? 'text-yellow-400 fill-yellow-400/50' 
                                        : 'text-white/30'
                                  }`} 
                                />
                              ))}
                            </div>
                            <span className="text-white/80 text-sm font-medium">
                              {rating.toFixed(1)} • {Math.floor(Math.random() * 150) + 10} avaliações
                            </span>
                          </div>
                          
                          <div className="text-amber-400 font-bold text-2xl mb-4 group-hover:text-amber-300 transition-colors">
                            {formatPrice(product.valor)}
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <FavoriteButton productId={product.id} />
                          <div className="flex items-center gap-1 text-white/60 text-sm">
                            <Eye className="w-4 h-4" />
                            <span>{Math.floor(Math.random() * 500) + 50}</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Action Buttons */}
                      <div className="flex items-center gap-3 flex-wrap">
                        <Button 
                          size="sm" 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleProductClick(product);
                          }}
                          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-sm px-4 py-2 font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                        >
                          Ver detalhes
                        </Button>
                        
                        {hasVideo && (
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={(e) => handleVideoClick(product, e)}
                            className="bg-red-500/20 border-red-400/50 text-red-300 hover:bg-red-500/30 text-sm px-4 py-2 font-semibold transition-all duration-300 hover:scale-105"
                          >
                            <Play className="w-4 h-4 mr-2" />
                            Assistir vídeo
                          </Button>
                        )}
                        
                        <Button 
                          size="sm" 
                          asChild 
                          className="bg-green-500 hover:bg-green-600 text-white text-sm px-4 py-2 font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                        >
                          <a href={product.link} target="_blank" rel="noopener noreferrer">
                            <ShoppingBag className="w-4 h-4 mr-2" />
                            Comprar agora
                          </a>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
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

      {/* Video Modal */}
      {selectedProduct && hasVideo && (
        <ProductVideoModal
          isOpen={isVideoModalOpen}
          onClose={() => setIsVideoModalOpen(false)}
          videoUrl={selectedProduct.video}
          productName={selectedProduct.produto}
          productPrice={formatPrice(selectedProduct.valor)}
          productLink={selectedProduct.link}
          productImages={getProductImages(selectedProduct)}
        />
      )}
    </div>
  );
};

export default Novos;
