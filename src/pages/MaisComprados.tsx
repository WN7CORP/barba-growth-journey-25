
import { useState, useEffect } from 'react';
import { ArrowLeft, TrendingUp, ShoppingBag, Star } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Header from '@/components/Header';
import { ProductDetailModal } from '@/components/ProductDetailModal';
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from 'react-router-dom';
import { useMostPurchased } from '@/hooks/useMostPurchased';
import { usePurchaseTracker } from '@/hooks/usePurchaseTracker';
import { OptimizedImage } from '@/components/OptimizedImage';

interface Product {
  id: number;
  produto: string;
  valor: string;
  imagem1: string;
  imagem2: string;
  imagem3: string;
  imagem4: string;
  imagem5: string;
  link: string;
  categoria: string;
  descricao?: string;
}

const MaisComprados = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const navigate = useNavigate();
  const { data: mostPurchased, isLoading: purchasedLoading } = useMostPurchased(50);
  const { trackPurchase, trackClick } = usePurchaseTracker();

  useEffect(() => {
    fetchMostPurchasedProducts();
  }, [mostPurchased]);

  const fetchMostPurchasedProducts = async () => {
    try {
      if (mostPurchased && mostPurchased.length > 0) {
        // Get products based on most purchased IDs
        const productIds = mostPurchased.map(p => p.product_id);
        
        // @ts-ignore - Bypass TypeScript for table name
        const { data, error } = await (supabase as any)
          .from('MUNDODODIREITO')
          .select('*')
          .in('id', productIds);

        if (error) throw error;
        
        // Sort products based on purchase count
        const sortedProducts = (data || []).sort((a: Product, b: Product) => {
          const aPurchases = mostPurchased.find(p => p.product_id === a.id)?.purchase_count || 0;
          const bPurchases = mostPurchased.find(p => p.product_id === b.id)?.purchase_count || 0;
          return bPurchases - aPurchases;
        });
        
        setProducts(sortedProducts);
      } else {
        // Fallback to random products if no purchase data
        // @ts-ignore - Bypass TypeScript for table name
        const { data, error } = await (supabase as any)
          .from('MUNDODODIREITO')
          .select('*')
          .limit(30);

        if (error) throw error;
        setProducts(data || []);
      }
    } catch (error) {
      console.error('Erro ao buscar produtos mais comprados:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: string | null) => {
    if (!price) return 'Preço não disponível';
    if (price.includes('R$')) return price;
    return `R$ ${price}`;
  };

  const handleProductClick = (product: Product) => {
    trackClick(product.id);
    setSelectedProduct(product);
    setIsDetailModalOpen(true);
  };

  const handlePurchaseClick = async (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    await trackPurchase(product);
    window.open(product.link, '_blank', 'noopener,noreferrer');
  };

  const getPurchaseCount = (productId: number) => {
    return mostPurchased?.find(p => p.product_id === productId)?.purchase_count || 0;
  };

  if (loading || purchasedLoading) {
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
            <h1 className="text-2xl md:text-4xl font-bold text-white animate-slide-in-left flex items-center gap-3">
              <TrendingUp className="w-6 h-6 md:w-8 md:h-8 text-green-400" />
              📈 Mais Comprados
            </h1>
            <p className="text-white/80 animate-slide-in-right text-sm md:text-lg">
              Os {products.length} materiais jurídicos mais procurados pelos profissionais
            </p>
          </div>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-16 animate-fade-in">
            <div className="w-32 h-32 bg-white/20 rounded-3xl flex items-center justify-center mx-auto mb-6 backdrop-blur-sm animate-pulse">
              <TrendingUp className="w-16 h-16 text-white/50" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">
              Ainda coletando dados de compras
            </h2>
            <p className="text-white/80 mb-6">
              Em breve você verá os materiais mais comprados aqui
            </p>
            <Button onClick={() => navigate('/')} className="bg-white text-blue-600 hover:bg-gray-100 font-semibold transition-all duration-300 hover:scale-105">
              Explorar Livraria
            </Button>
          </div>
        ) : (
          <div className="space-y-4 md:space-y-6">
            {products.map((product, index) => {
              const purchaseCount = getPurchaseCount(product.id);
              
              return (
                <div 
                  key={product.id} 
                  className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 md:p-6 hover:bg-white/15 transition-all duration-300 animate-fade-in cursor-pointer group hover:scale-[1.02] hover:shadow-2xl hover:shadow-blue-500/20" 
                  style={{ animationDelay: `${index * 0.1}s` }}
                  onClick={() => handleProductClick(product)}
                >
                  <div className="flex gap-4 md:gap-6">
                    {/* Ranking Badge */}
                    <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {index + 1}
                    </div>
                    
                    {/* Product Image */}
                    <div className="w-24 h-32 md:w-32 md:h-40 flex-shrink-0 rounded-xl overflow-hidden relative group-hover:scale-105 transition-transform duration-300">
                      <OptimizedImage 
                        src={product.imagem1} 
                        alt={product.produto} 
                        className="w-full h-full object-cover" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                    
                    <div className="flex-1 min-w-0 space-y-3 md:space-y-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2 flex-wrap">
                            <Badge className="bg-gradient-to-r from-green-600 to-blue-600 text-white font-bold text-xs animate-pulse">
                              MAIS COMPRADO
                            </Badge>
                            {purchaseCount > 0 && (
                              <Badge variant="secondary" className="text-xs bg-white/20 text-green-300 border-green-400/30">
                                {purchaseCount} compras
                              </Badge>
                            )}
                            <Badge variant="secondary" className="text-xs bg-white/20 text-purple-300 border-purple-400/30">
                              {product.categoria}
                            </Badge>
                          </div>
                          
                          <h3 className="text-white font-semibold text-base md:text-lg xl:text-xl line-clamp-2 mb-3 group-hover:text-purple-200 transition-colors">
                            {product.produto}
                          </h3>
                          
                          {/* Rating Simulation */}
                          <div className="flex items-center gap-2 mb-3">
                            <div className="flex items-center gap-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star 
                                  key={star} 
                                  className="w-3 h-3 md:w-4 md:h-4 text-yellow-400 fill-yellow-400" 
                                />
                              ))}
                            </div>
                            <span className="text-white/80 text-xs md:text-sm font-medium">
                              4.8 • {purchaseCount || Math.floor(Math.random() * 100) + 20} avaliações
                            </span>
                          </div>
                          
                          <div className="text-green-400 font-bold text-xl md:text-2xl mb-4 group-hover:text-green-300 transition-colors">
                            {formatPrice(product.valor)}
                          </div>
                        </div>
                      </div>
                      
                      {/* Action Button */}
                      <div className="flex items-center gap-2 md:gap-3">
                        <Button 
                          size="sm" 
                          onClick={(e) => handlePurchaseClick(product, e)}
                          className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white text-xs md:text-sm px-4 md:px-6 py-2 font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                        >
                          <ShoppingBag className="w-3 h-3 md:w-4 md:h-4 mr-2" />
                          Comprar Agora
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
    </div>
  );
};

export default MaisComprados;
