
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { X, ShoppingCart, Heart, Star, Play, Info, Sparkles } from 'lucide-react';
import { ImageZoomModal } from '@/components/ImageZoomModal';
import { ProductVideoModal } from '@/components/ProductVideoModal';
import { ProductBreadcrumb } from '@/components/ProductBreadcrumb';
import { ShareButton } from '@/components/ShareButton';
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
  descricao?: string;
}

interface ProductDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  isOpen,
  onClose,
  product
}) => {
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);

  useEffect(() => {
    if (isOpen && product.categoria) {
      fetchRelatedProducts();
    }
  }, [isOpen, product.categoria]);

  const fetchRelatedProducts = async () => {
    try {
      // @ts-ignore - Bypass TypeScript for table name
      const { data } = await (supabase as any)
        .from('MUNDODODIREITO')
        .select('*')
        .eq('categoria', product.categoria)
        .neq('id', product.id)
        .limit(4);
      
      setRelatedProducts(data || []);
    } catch (error) {
      console.error('Error fetching related products:', error);
    }
  };

  const getProductImages = () => {
    return [product.imagem1, product.imagem2, product.imagem3, product.imagem4, product.imagem5].filter(Boolean);
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

  const getProductDescription = () => {
    if (product.descricao) {
      return product.descricao;
    }
    const category = product.categoria || 'Material Jurídico';
    return `${product.produto} é um ${category.toLowerCase()} essencial para profissionais do direito. Oferece conteúdo atualizado e de alta qualidade, desenvolvido por especialistas renomados. Ideal para estudo, consulta e aplicação prática no exercício da advocacia.`;
  };

  const handleImageClick = (index: number) => {
    setSelectedImageIndex(index);
    setIsZoomOpen(true);
  };

  const handleBuyClick = () => {
    window.open(product.link, '_blank');
  };

  // Simulate rating
  const getSimulatedRating = (productId: number) => {
    const ratings = [4.2, 4.5, 4.8, 4.3, 4.7, 4.1, 4.9, 4.4, 4.6, 4.0];
    return ratings[productId % ratings.length];
  };

  const rating = getSimulatedRating(product.id);

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-6xl w-[95vw] max-h-[90vh] overflow-hidden p-0 bg-white">
          {/* Header with breadcrumb */}
          <div className="bg-gradient-to-r from-blue-800 to-purple-800 text-white">
            <div className="flex items-center justify-between p-3">
              <div className="flex-1 pr-4">
                <h2 className="text-lg font-bold line-clamp-1 mb-1">
                  {product.produto}
                </h2>
                <div className="flex items-center gap-2">
                  <Badge className="bg-white/20 text-white border-white/30 text-xs">
                    {product.categoria}
                  </Badge>
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 text-yellow-300 fill-current" />
                    <span className="text-xs">{rating.toFixed(1)}</span>
                  </div>
                </div>
              </div>
              <Button
                onClick={onClose}
                variant="ghost" 
                size="sm"
                className="text-white hover:bg-red-500/80 bg-red-500/60 border border-white/50 rounded-full w-10 h-10 p-0 flex-shrink-0"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
            <ProductBreadcrumb categoria={product.categoria} produto={product.produto} />
          </div>

          {/* Layout principal */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
            
            {/* Galeria - 1/3 do espaço */}
            <div className="lg:col-span-1">
              <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg overflow-hidden shadow-inner" style={{ aspectRatio: '2/3' }}>
                <Carousel className="w-full h-full">
                  <CarouselContent>
                    {getProductImages().map((image, index) => (
                      <CarouselItem key={index}>
                        <div 
                          className="h-full cursor-pointer group"
                          onClick={() => handleImageClick(index)}
                        >
                          <img
                            src={image}
                            alt={`${product.produto} - ${index + 1}`}
                            className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300"
                          />
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious className="left-2 bg-white/90 hover:bg-white shadow-lg w-6 h-6" />
                  <CarouselNext className="right-2 bg-white/90 hover:bg-white shadow-lg w-6 h-6" />
                </Carousel>
              </div>

              {/* Miniaturas */}
              <div className="flex gap-1 mt-2 overflow-x-auto pb-1">
                {getProductImages().map((image, index) => (
                  <button
                    key={index}
                    className="flex-shrink-0 w-12 h-16 rounded border-2 border-gray-200 hover:border-purple-500 overflow-hidden"
                    onClick={() => handleImageClick(index)}
                  >
                    <img
                      src={image}
                      alt={`Miniatura ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Informações - 2/3 do espaço */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Preço e ações */}
              <div className="bg-gradient-to-r from-red-50 to-pink-50 p-4 rounded-xl border border-red-100">
                <div className="text-sm text-gray-600 mb-1 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-600" />
                  💰 Oferta especial
                </div>
                <div className="text-3xl font-bold text-red-600 mb-4">
                  {formatPrice(product.valor)}
                </div>
                
                <div className="flex gap-3 flex-wrap">
                  <Button
                    variant="outline" 
                    className="border-red-300 text-red-600 hover:bg-red-50 font-medium"
                  >
                    <Heart className="w-4 h-4 mr-2" />
                    Favoritar
                  </Button>
                  <ShareButton 
                    productName={product.produto}
                    productLink={product.link}
                  />
                  <Button
                    onClick={handleBuyClick}
                    className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold shadow-lg"
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Comprar Agora
                  </Button>
                </div>
              </div>

              {/* Tabs de conteúdo */}
              <Tabs defaultValue="description" className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-gray-100 p-1 rounded-xl">
                  <TabsTrigger value="description" className="text-sm font-medium rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">
                    <Info className="w-4 h-4 mr-2" />
                    Informações
                  </TabsTrigger>
                  <TabsTrigger value="video" className="text-sm font-medium rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">
                    <Play className="w-4 h-4 mr-2" />
                    Vídeo
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="description" className="mt-4">
                  <Card className="border-0 shadow-sm">
                    <CardContent className="p-4">
                      <p className="text-sm text-gray-700 leading-relaxed mb-4 text-justify">
                        {getProductDescription()}
                      </p>
                      
                      <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                        <h4 className="font-bold mb-2 text-sm text-blue-800 flex items-center gap-2">
                          <Star className="w-4 h-4" />
                          Características:
                        </h4>
                        <ul className="text-sm text-blue-700 space-y-1">
                          <li className="flex items-center gap-2">✅ Conteúdo atualizado</li>
                          <li className="flex items-center gap-2">✅ Linguagem técnica</li>
                          <li className="flex items-center gap-2">✅ Aplicação prática</li>
                          <li className="flex items-center gap-2">✅ Referência confiável</li>
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="video" className="mt-4">
                  <Card className="border-0 shadow-sm">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                          <Play className="w-5 h-5 text-red-600" />
                        </div>
                        <div>
                          <h3 className="font-bold text-base text-gray-900">Vídeo Demonstrativo</h3>
                          <p className="text-sm text-gray-600">Conheça mais sobre o produto</p>
                        </div>
                      </div>
                      
                      {product.video ? (
                        <div className="bg-gradient-to-br from-red-50 to-orange-50 p-4 rounded-xl border border-red-200">
                          <Button
                            onClick={() => setIsVideoOpen(true)}
                            className="w-full bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white font-bold py-3 rounded-xl shadow-lg"
                          >
                            <Play className="w-5 h-5 mr-3" />
                            ▶️ Assistir Vídeo
                          </Button>
                          <p className="text-xs text-gray-600 text-center mt-2">
                            Duração: 2-5 min
                          </p>
                        </div>
                      ) : (
                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 text-center">
                          <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-3">
                            <Play className="w-6 h-6 text-gray-400" />
                          </div>
                          <p className="text-gray-600 font-medium">
                            Vídeo não disponível
                          </p>
                          <p className="text-sm text-gray-500 mt-1">
                            Verifique as imagens acima
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>

              {/* Related Products */}
              {relatedProducts.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-purple-600" />
                    Produtos Relacionados
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {relatedProducts.map((relatedProduct) => (
                      <div key={relatedProduct.id} className="bg-white rounded-lg border border-gray-200 p-3 hover:shadow-md transition-shadow cursor-pointer">
                        <img 
                          src={relatedProduct.imagem1} 
                          alt={relatedProduct.produto}
                          className="w-full h-24 object-cover rounded mb-2"
                        />
                        <h4 className="text-xs font-medium text-gray-900 line-clamp-2 mb-1">
                          {relatedProduct.produto}
                        </h4>
                        <p className="text-sm font-bold text-red-600">
                          {formatPrice(relatedProduct.valor)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <ImageZoomModal
        isOpen={isZoomOpen}
        onClose={() => setIsZoomOpen(false)}
        images={getProductImages()}
        currentIndex={selectedImageIndex}
        productName={product.produto}
      />

      {product.video && (
        <ProductVideoModal
          isOpen={isVideoOpen}
          onClose={() => setIsVideoOpen(false)}
          videoUrl={product.video}
          productName={product.produto}
          productPrice={formatPrice(product.valor)}
          productLink={product.link}
          productImages={getProductImages()}
        />
      )}
    </>
  );
};
