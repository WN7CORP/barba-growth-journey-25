
import { useState, useEffect } from 'react';
import { Heart, ShoppingCart, Play, Star, ArrowLeft, Grid, List } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import Header from '@/components/Header';
import { ProductVideoModal } from '@/components/ProductVideoModal';
import { ProductPhotosModal } from '@/components/ProductPhotosModal';
import { ProductDetailModal } from '@/components/ProductDetailModal';
import { useFavorites } from '@/hooks/useFavorites';
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

const Favoritos = () => {
  const { favorites, removeFavorite } = useFavorites();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVideoProduct, setSelectedVideoProduct] = useState<Product | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const navigate = useNavigate();

  useEffect(() => {
    fetchFavoriteProducts();
  }, [favorites]);

  const fetchFavoriteProducts = async () => {
    if (favorites.length === 0) {
      setProducts([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('SHOPEE')
        .select('*')
        .in('id', favorites);

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Erro ao buscar produtos favoritos:', error);
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

  const handleRemoveFavorite = (productId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    removeFavorite(productId);
  };

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setIsDetailModalOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-400 via-red-500 to-pink-500 pb-20">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-32 bg-white/20 rounded-2xl"></div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="h-64 bg-white/20 rounded-2xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-400 via-red-500 to-pink-500 pb-20">
      <Header />
      
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
            <h1 className="text-2xl md:text-3xl font-bold text-white animate-slide-in-left">
              💖 Meus Favoritos
            </h1>
            <p className="text-white/80 animate-slide-in-right">
              {products.length} {products.length === 1 ? 'produto favoritado' : 'produtos favoritados'}
            </p>
          </div>
          
          {/* View Mode Toggle - Only show when there are products */}
          {products.length > 0 && (
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="p-2 bg-white/20 border-white/30 hover:bg-white/30 text-white"
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="p-2 bg-white/20 border-white/30 hover:bg-white/30 text-white"
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>

        {products.length === 0 ? (
          <div className="text-center py-16 animate-fade-in">
            <div className="w-32 h-32 bg-white/20 rounded-3xl flex items-center justify-center mx-auto mb-6 backdrop-blur-sm animate-pulse">
              <Heart className="w-16 h-16 text-white/50" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">
              Nenhum favorito ainda
            </h2>
            <p className="text-white/80 mb-6">
              Adicione produtos aos seus favoritos para vê-los aqui
            </p>
            <Button
              onClick={() => navigate('/')}
              className="bg-white text-red-600 hover:bg-gray-100 font-semibold transition-all duration-300 hover:scale-105"
            >
              Explorar Produtos
            </Button>
          </div>
        ) : (
          <div className={
            viewMode === 'grid' 
              ? "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4" 
              : "space-y-3"
          }>
            {products.map((product, index) => (
              viewMode === 'grid' ? (
                // Grid View - Compact cards
                <Card 
                  key={product.id} 
                  className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105 bg-white border-0 shadow-lg group animate-fade-in cursor-pointer"
                  style={{ animationDelay: `${index * 0.1}s` }}
                  onClick={() => handleProductClick(product)}
                >
                  <div className="relative">
                    <Carousel className="w-full">
                      <CarouselContent>
                        {getProductImages(product).map((image, imgIndex) => (
                          <CarouselItem key={imgIndex}>
                            <div className="aspect-square overflow-hidden">
                              <img
                                src={image}
                                alt={`${product.produto} - ${imgIndex + 1}`}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                loading="lazy"
                              />
                            </div>
                          </CarouselItem>
                        ))}
                      </CarouselContent>
                      <CarouselPrevious className="left-1 bg-white/90 hover:bg-white w-5 h-5" />
                      <CarouselNext className="right-1 bg-white/90 hover:bg-white w-5 h-5" />
                    </Carousel>
                    
                    {product.video && (
                      <div className="absolute top-2 right-2">
                        <div className="bg-red-500 rounded-full p-1 animate-pulse">
                          <Play className="w-3 h-3 text-white" />
                        </div>
                      </div>
                    )}
                    
                    <div className="absolute top-2 left-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => handleRemoveFavorite(product.id, e)}
                        className="bg-red-500 hover:bg-red-600 text-white p-1 h-auto rounded-full transition-all duration-300 hover:scale-110"
                      >
                        <Heart className="w-4 h-4 fill-current" />
                      </Button>
                    </div>
                  </div>

                  <CardContent className="p-3">
                    <h3 className="font-medium text-gray-900 mb-2 line-clamp-2 text-sm leading-tight hover:text-red-600 transition-colors">
                      {product.produto}
                    </h3>
                    
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-bold text-red-500 text-sm">
                        Menos de {formatPrice(product.valor)}
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-yellow-400 fill-current" />
                        <span className="text-xs text-gray-600">4.8</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <ProductPhotosModal 
                        images={getProductImages(product)} 
                        productName={product.produto}
                        productPrice={formatPrice(product.valor)}
                        productLink={product.link}
                        videoUrl={product.video}
                      />
                      <Button
                        size="sm"
                        className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold text-xs py-1 hover:scale-105 transition-all duration-300"
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(product.link, '_blank');
                        }}
                      >
                        <ShoppingCart className="w-3 h-3 mr-1" />
                        Comprar Agora
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                // List View - Expanded cards
                <Card 
                  key={product.id} 
                  className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-[1.02] bg-white border-0 shadow-lg group animate-fade-in cursor-pointer"
                  style={{ animationDelay: `${index * 0.1}s` }}
                  onClick={() => handleProductClick(product)}
                >
                  <div className="flex flex-col sm:flex-row">
                    <div className="relative w-full sm:w-48 h-48 flex-shrink-0">
                      <Carousel className="w-full h-full">
                        <CarouselContent>
                          {getProductImages(product).map((image, imgIndex) => (
                            <CarouselItem key={imgIndex}>
                              <div className="h-48 overflow-hidden">
                                <img
                                  src={image}
                                  alt={`${product.produto} - ${imgIndex + 1}`}
                                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                  loading="lazy"
                                />
                              </div>
                            </CarouselItem>
                          ))}
                        </CarouselContent>
                        <CarouselPrevious className="left-2 bg-white/90 hover:bg-white w-6 h-6" />
                        <CarouselNext className="right-2 bg-white/90 hover:bg-white w-6 h-6" />
                      </Carousel>
                      
                      {product.video && (
                        <div className="absolute top-2 right-2">
                          <div className="bg-red-500 rounded-full p-1 animate-pulse">
                            <Play className="w-3 h-3 text-white" />
                          </div>
                        </div>
                      )}
                      
                      <div className="absolute top-2 left-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => handleRemoveFavorite(product.id, e)}
                          className="bg-red-500 hover:bg-red-600 text-white p-1 h-auto rounded-full transition-all duration-300 hover:scale-110"
                        >
                          <Heart className="w-4 h-4 fill-current" />
                        </Button>
                      </div>
                    </div>

                    <CardContent className="flex-1 p-4 sm:p-6">
                      <div className="flex flex-col h-full">
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 text-lg hover:text-red-600 transition-colors">
                              {product.produto}
                            </h3>
                            <div className="flex items-center gap-1 ml-4">
                              <Star className="w-4 h-4 text-yellow-400 fill-current" />
                              <span className="text-sm text-gray-600">4.8</span>
                            </div>
                          </div>
                          
                          {product.categoria && (
                            <div className="mb-3">
                              <span className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">
                                {product.categoria}
                              </span>
                            </div>
                          )}
                          
                          <div className="text-xl font-bold text-red-500 mb-4">
                            A partir de {formatPrice(product.valor)}
                          </div>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row gap-2">
                          <ProductPhotosModal 
                            images={getProductImages(product)} 
                            productName={product.produto} 
                            productPrice={formatPrice(product.valor)} 
                            productLink={product.link}
                            videoUrl={product.video}
                          />
                          <Button 
                            className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold hover:scale-105 transition-all duration-300 sm:w-auto w-full" 
                            onClick={(e) => {
                              e.stopPropagation();
                              window.open(product.link, '_blank');
                            }}
                          >
                            <ShoppingCart className="w-4 h-4 mr-2" />
                            Comprar na Shopee
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

      {/* Product Detail Modal */}
      {selectedProduct && (
        <ProductDetailModal 
          isOpen={isDetailModalOpen} 
          onClose={() => setIsDetailModalOpen(false)} 
          product={selectedProduct} 
        />
      )}

      {selectedVideoProduct && (
        <ProductVideoModal
          isOpen={!!selectedVideoProduct}
          onClose={() => setSelectedVideoProduct(null)}
          videoUrl={selectedVideoProduct.video}
          productName={selectedVideoProduct.produto}
          productPrice={formatPrice(selectedVideoProduct.valor)}
          productLink={selectedVideoProduct.link}
        />
      )}
    </div>
  );
};

export default Favoritos;
