import { useState, useEffect } from 'react';
import { Heart, ShoppingCart, Play, Star, ArrowLeft, Grid, List, Trash2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import Header from '@/components/Header';
import { ProductVideoModal } from '@/components/ProductVideoModal';
import { ProductPhotosModal } from '@/components/ProductPhotosModal';
import { ProductDetailModal } from '@/components/ProductDetailModal';
import { ShareButton } from '@/components/ShareButton';
import { useFavorites } from '@/hooks/useFavorites';
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from 'react-router-dom';

// Interface unificada para produtos de diferentes tabelas
interface Product {
  id: number;
  produto: string;
  valor: string;
  video?: string;
  imagem1: string;
  imagem2?: string;
  imagem3?: string;
  imagem4?: string;
  imagem5?: string;
  imagem6?: string;
  imagem7?: string;
  link: string;
  categoria: string;
  subcategoria?: string;
  uso?: string;
  descricao?: string;
}

// Função para normalizar produtos de diferentes tabelas
const normalizeProduct = (product: any): Product => {
  return {
    id: product.id,
    produto: product.produto || '',
    valor: product.valor || '',
    video: product.video || '',
    imagem1: product.imagem1 || '',
    imagem2: product.imagem2 || '',
    imagem3: product.imagem3 || '',
    imagem4: product.imagem4 || '',
    imagem5: product.imagem5 || '',
    imagem6: product.imagem6 || '',
    imagem7: product.imagem7 || '',
    link: product.link || '',
    categoria: product.categoria || '',
    subcategoria: product.subcategoria || '',
    uso: product.uso || '',
    descricao: product.descricao || ''
  };
};

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
    console.log('🔍 Buscando produtos favoritos para IDs:', favorites);
    
    if (favorites.length === 0) {
      console.log('❌ Nenhum favorito encontrado');
      setProducts([]);
      setLoading(false);
      return;
    }

    try {
      let allProducts: any[] = [];

      // Buscar na tabela SHOPEE
      console.log('🔍 Buscando na tabela SHOPEE...');
      const { data: shopeeData, error: shopeeError } = await supabase
        .from('SHOPEE')
        .select('*')
        .in('id', favorites);

      if (shopeeError) {
        console.error('❌ Erro ao buscar na SHOPEE:', shopeeError);
      } else {
        console.log('✅ Encontrados na SHOPEE:', shopeeData?.length || 0, 'produtos');
        if (shopeeData) {
          allProducts = [...allProducts, ...shopeeData];
        }
      }

      // Se não encontrou todos, buscar na HARRY POTTER
      if (allProducts.length < favorites.length) {
        console.log('🔍 Buscando na tabela HARRY POTTER...');
        const { data: harryData, error: harryError } = await supabase
          .from('HARRY POTTER')
          .select('*')
          .in('id', favorites);

        if (harryError) {
          console.error('❌ Erro ao buscar na HARRY POTTER:', harryError);
        } else {
          console.log('✅ Encontrados na HARRY POTTER:', harryData?.length || 0, 'produtos');
          if (harryData) {
            allProducts = [...allProducts, ...harryData];
          }
        }
      }

      // Se ainda não encontrou todos, buscar na MUNDODODIREITO
      if (allProducts.length < favorites.length) {
        console.log('🔍 Buscando na tabela MUNDODODIREITO...');
        const { data: mundoData, error: mundoError } = await supabase
          .from('MUNDODODIREITO')
          .select('*')
          .in('id', favorites);

        if (mundoError) {
          console.error('❌ Erro ao buscar na MUNDODODIREITO:', mundoError);
        } else {
          console.log('✅ Encontrados na MUNDODODIREITO:', mundoData?.length || 0, 'produtos');
          if (mundoData) {
            allProducts = [...allProducts, ...mundoData];
          }
        }
      }

      console.log('📊 Total de produtos encontrados:', allProducts.length);
      console.log('📊 Favoritos esperados:', favorites.length);

      // Normalizar produtos para interface unificada
      const normalizedProducts = allProducts.map(normalizeProduct);
      console.log('✅ Produtos normalizados:', normalizedProducts.length);

      setProducts(normalizedProducts);

      // Log de debug para verificar IDs não encontrados
      const foundIds = normalizedProducts.map(p => p.id);
      const missingIds = favorites.filter(id => !foundIds.includes(id));
      if (missingIds.length > 0) {
        console.warn('⚠️ IDs favoritos não encontrados em nenhuma tabela:', missingIds);
      }

    } catch (error) {
      console.error('❌ Erro geral ao buscar produtos favoritos:', error);
    } finally {
      setLoading(false);
    }
  };

  const getProductImages = (product: Product) => {
    return [product.imagem1, product.imagem2, product.imagem3, product.imagem4, product.imagem5, product.imagem6, product.imagem7].filter(Boolean);
  };

  const formatPrice = (price: string) => {
    if (!price) return 'Consulte o preço';
    if (price.includes('R$')) {
      return price;
    }
    return `R$ ${price}`;
  };

  const handleRemoveFavorite = (productId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('❌ Removendo favorito:', productId);
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
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6" 
              : "space-y-4"
          }>
            {products.map((product, index) => (
              viewMode === 'grid' ? (
                // Grid View - Cards melhorados
                <Card 
                  key={product.id} 
                  className="overflow-hidden hover:shadow-2xl transition-all duration-500 hover:scale-105 bg-white border-0 shadow-xl group animate-fade-in cursor-pointer h-auto"
                  style={{ animationDelay: `${index * 0.1}s` }}
                  onClick={() => handleProductClick(product)}
                >
                  <div className="relative h-48">
                    <Carousel className="w-full h-full">
                      <CarouselContent>
                        {getProductImages(product).map((image, imgIndex) => (
                          <CarouselItem key={imgIndex}>
                            <div className="h-48 overflow-hidden bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-2">
                              <img
                                src={image}
                                alt={`${product.produto} - ${imgIndex + 1}`}
                                className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-110"
                                loading="lazy"
                              />
                            </div>
                          </CarouselItem>
                        ))}
                      </CarouselContent>
                      <CarouselPrevious className="left-1 bg-white/90 hover:bg-white w-6 h-6" />
                      <CarouselNext className="right-1 bg-white/90 hover:bg-white w-6 h-6" />
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
                        className="bg-red-500 hover:bg-red-600 text-white p-2 h-auto rounded-full transition-all duration-300 hover:scale-110 shadow-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <CardContent className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-3 line-clamp-2 leading-tight hover:text-red-600 transition-colors">
                      {product.produto}
                    </h3>
                    
                    {/* Área de Preço e Avaliação - Melhorada */}
                    <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-xl p-3 mb-3">
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-bold text-red-600 text-lg">
                          {formatPrice(product.valor)}
                        </div>
                        <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-lg">
                          <Star className="w-4 h-4 text-amber-500 fill-current" />
                          <span className="text-sm text-amber-700 font-semibold">4.8</span>
                        </div>
                      </div>
                      
                      {/* Badge de Oferta */}
                      <div className="bg-red-100 text-red-700 text-xs font-semibold px-2 py-1 rounded-md text-center">
                        ⚡ OFERTA LIMITADA
                      </div>
                    </div>
                    
                    <div className="flex gap-2 mb-3">
                      <ProductPhotosModal 
                        images={getProductImages(product)} 
                        productName={product.produto}
                        productPrice={formatPrice(product.valor)}
                        productLink={product.link}
                        videoUrl={product.video}
                        className="flex-1"
                      />
                      <ShareButton 
                        productName={product.produto}
                        productLink={product.link}
                        className="flex-1"
                      />
                    </div>
                    
                    <Button
                      className="w-full bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white font-bold py-2.5 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(product.link, '_blank');
                      }}
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Comprar Agora
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                // List View - Cards expandidos melhorados
                <Card 
                  key={product.id} 
                  className="overflow-hidden hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] bg-white border-0 shadow-xl group animate-fade-in cursor-pointer"
                  style={{ animationDelay: `${index * 0.1}s` }}
                  onClick={() => handleProductClick(product)}
                >
                  <div className="flex flex-col sm:flex-row">
                    <div className="relative w-full sm:w-64 h-48 flex-shrink-0">
                      <Carousel className="w-full h-full">
                        <CarouselContent>
                          {getProductImages(product).map((image, imgIndex) => (
                            <CarouselItem key={imgIndex}>
                              <div className="h-48 overflow-hidden bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-2">
                                <img
                                  src={image}
                                  alt={`${product.produto} - ${imgIndex + 1}`}
                                  className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-110"
                                  loading="lazy"
                                />
                              </div>
                            </CarouselItem>
                          ))}
                        </CarouselContent>
                        <CarouselPrevious className="left-2 bg-white/90 hover:bg-white w-7 h-7" />
                        <CarouselNext className="right-2 bg-white/90 hover:bg-white w-7 h-7" />
                      </Carousel>
                      
                      {product.video && (
                        <div className="absolute top-2 right-2">
                          <div className="bg-red-500 rounded-full p-1.5 animate-pulse shadow-lg">
                            <Play className="w-4 h-4 text-white" />
                          </div>
                        </div>
                      )}
                      
                      <div className="absolute top-2 left-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => handleRemoveFavorite(product.id, e)}
                          className="bg-red-500 hover:bg-red-600 text-white p-2 h-auto rounded-full transition-all duration-300 hover:scale-110 shadow-lg"
                        >
                          <Trash2 className="w-5 h-5" />
                        </Button>
                      </div>
                    </div>

                    <CardContent className="flex-1 p-6">
                      <div className="flex flex-col h-full">
                        <div className="flex-1">
                          <h3 className="font-bold text-gray-900 mb-3 line-clamp-2 text-xl hover:text-red-600 transition-colors">
                            {product.produto}
                          </h3>
                          
                          {product.categoria && (
                            <div className="mb-4">
                              <span className="inline-block bg-blue-100 text-blue-700 text-sm px-3 py-1 rounded-full font-medium">
                                {product.categoria}
                              </span>
                            </div>
                          )}
                          
                          {/* Área de Preço e Avaliação Expandida */}
                          <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-xl p-4 mb-4">
                            <div className="flex items-center justify-between mb-3">
                              <div className="font-bold text-red-600 text-2xl">
                                {formatPrice(product.valor)}
                              </div>
                              <div className="flex items-center gap-2 bg-amber-50 px-3 py-2 rounded-lg">
                                <Star className="w-5 h-5 text-amber-500 fill-current" />
                                <span className="text-base text-amber-700 font-semibold">4.8</span>
                                <span className="text-sm text-gray-500">(127 avaliações)</span>
                              </div>
                            </div>
                            
                            <div className="bg-red-100 text-red-700 text-sm font-semibold px-3 py-2 rounded-lg text-center">
                              ⚡ OFERTA LIMITADA - Apenas hoje!
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row gap-3">
                          <div className="flex gap-2">
                            <ProductPhotosModal 
                              images={getProductImages(product)} 
                              productName={product.produto} 
                              productPrice={formatPrice(product.valor)} 
                              productLink={product.link}
                              videoUrl={product.video}
                              className="bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200"
                            />
                            <ShareButton 
                              productName={product.produto}
                              productLink={product.link}
                              className="bg-purple-50 hover:bg-purple-100 text-purple-700 border-purple-200"
                            />
                          </div>
                          <Button 
                            className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white font-bold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 sm:w-auto w-full" 
                            onClick={(e) => {
                              e.stopPropagation();
                              window.open(product.link, '_blank');
                            }}
                          >
                            <ShoppingCart className="w-5 h-5 mr-2" />
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
          videoUrl={selectedVideoProduct.video || ''}
          productName={selectedVideoProduct.produto}
          productPrice={formatPrice(selectedVideoProduct.valor)}
          productLink={selectedVideoProduct.link}
        />
      )}
    </div>
  );
};

export default Favoritos;
