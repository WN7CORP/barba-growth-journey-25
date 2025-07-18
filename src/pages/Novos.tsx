
import { useState, useEffect } from 'react';
import { ArrowLeft, Star, ShoppingBag, Play, Sparkles, Grid, List } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import Header from '@/components/Header';
import { ProductVideoModal } from '@/components/ProductVideoModal';
import { ProductPhotosModal } from '@/components/ProductPhotosModal';
import { ProductDetailModal } from '@/components/ProductDetailModal';
import { ProductCard } from '@/components/ProductCard';
import { FavoriteButton } from '@/components/FavoriteButton';
import { LazyImage } from '@/components/LazyImage';
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
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
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

  const getProductImages = (product: Product) => {
    return [product.imagem1, product.imagem2, product.imagem3, product.imagem4, product.imagem5].filter(Boolean);
  };

  const formatPrice = (price: string) => {
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
          
          {/* View Mode Toggle */}
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
              className="p-2 bg-white/20 border-white/30 hover:bg-white/30 text-white"
            >
              <List className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="p-2 bg-white/20 border-white/30 hover:bg-white/30 text-white"
            >
              <Grid className="w-4 h-4" />
            </Button>
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
          <div className={viewMode === 'grid' ? 
            "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4" : 
            "space-y-2 sm:space-y-3"
          }>
            {products.map((product, index) => (
              viewMode === 'grid' ? (
                // Grid View - usando ProductCard
                <div key={product.id}>
                  <ProductCard 
                    product={product} 
                    showBadge={true}
                    badgeText="LANÇAMENTO"
                    compact={true}
                  />
                </div>
              ) : (
                // List View
                <Card 
                  key={product.id} 
                  className="overflow-hidden hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] bg-white border-0 shadow-xl group animate-fade-in cursor-pointer"
                  style={{ animationDelay: `${index * 0.1}s` }}
                  onClick={() => handleProductClick(product)}
                >
                  <div className="flex flex-col md:flex-row">
                    <div className="relative w-full md:w-48 h-48 flex-shrink-0">
                      <Carousel className="w-full h-full">
                        <CarouselContent>
                          {getProductImages(product).map((image, imgIndex) => (
                            <CarouselItem key={imgIndex}>
                              <div className="h-48 overflow-hidden">
                                <LazyImage
                                  src={image}
                                  alt={`${product.produto} - ${imgIndex + 1}`}
                                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                              </div>
                            </CarouselItem>
                          ))}
                        </CarouselContent>
                        <CarouselPrevious className="left-2 bg-white/95 hover:bg-white w-6 h-6 shadow-lg" />
                        <CarouselNext className="right-2 bg-white/95 hover:bg-white w-6 h-6 shadow-lg" />
                      </Carousel>
                      
                      {product.video && (
                        <div className="absolute top-2 right-2">
                          <div className="bg-red-600 rounded-full p-1.5 animate-pulse shadow-lg">
                            <Play className="w-3 h-3 text-white" />
                          </div>
                        </div>
                      )}
                      
                      <div className="absolute top-2 left-2">
                        <Badge className="bg-gradient-to-r from-purple-600 to-purple-700 text-white font-bold text-xs animate-bounce shadow-lg">
                          LANÇAMENTO
                        </Badge>
                      </div>

                      {/* Favorite button sempre presente */}
                      <div className="absolute bottom-2 left-2">
                        <FavoriteButton productId={product.id} size="sm" />
                      </div>
                    </div>

                    <CardContent className="flex-1 p-4 md:p-6">
                      <div className="flex flex-col h-full">
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 text-lg hover:text-purple-700 transition-colors">
                              {product.produto}
                            </h3>
                            <div className="flex items-center gap-1 ml-4">
                              <Star className="w-4 h-4 text-amber-500 fill-current animate-pulse" />
                              <span className="text-sm text-gray-600 font-medium">4.9</span>
                            </div>
                          </div>
                          
                          {product.categoria && (
                            <Badge variant="secondary" className="mb-3 animate-fade-in bg-purple-100 text-purple-800">
                              {product.categoria}
                            </Badge>
                          )}
                          
                          <div className="text-xl font-bold text-purple-700 mb-4">
                            A partir de {formatPrice(product.valor)}
                          </div>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row gap-2">
                          <div className="flex gap-2 flex-1">
                            <FavoriteButton productId={product.id} />
                            <ProductPhotosModal 
                              images={getProductImages(product)} 
                              productName={product.produto} 
                              productPrice={formatPrice(product.valor)} 
                              productLink={product.link}
                              videoUrl={product.video}
                            />
                          </div>
                          <Button 
                            className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-bold hover:scale-105 transition-all duration-300 sm:w-auto w-full shadow-lg hover:shadow-xl" 
                            onClick={(e) => {
                              e.stopPropagation();
                              window.open(product.link, '_blank');
                            }}
                          >
                            <ShoppingBag className="w-4 h-4 mr-2" />
                            Comprar
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </div>
                </Card>
              )
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
