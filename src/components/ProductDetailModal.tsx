
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { X, ShoppingCart, Heart, Star, Play, Lightbulb } from 'lucide-react';
import { ImageZoomModal } from '@/components/ImageZoomModal';
import { ProductVideoModal } from '@/components/ProductVideoModal';

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

  // Remove auto-play - video only plays when user clicks

  const getProductImages = () => {
    return [product.imagem1, product.imagem2, product.imagem3, product.imagem4, product.imagem5].filter(Boolean);
  };

  const formatPrice = (price: string) => {
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

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-6xl w-[95vw] max-h-[90vh] md:max-h-[85vh] overflow-hidden p-0 bg-white">
          {/* Header responsivo */}
          <div className="bg-gradient-to-r from-blue-800 to-purple-800 text-white p-2 md:p-3 flex items-center justify-between">
            <div className="flex-1 min-w-0 pr-2 md:pr-4">
              <h2 className="text-sm md:text-lg font-bold line-clamp-2 md:line-clamp-1">
                {product.produto}
              </h2>
              <div className="flex items-center gap-1 md:gap-2 mt-1">
                <Badge className="bg-white/20 text-white border-white/30 text-xs px-1 py-0">
                  {product.categoria}
                </Badge>
                <div className="flex items-center gap-1">
                  <Star className="w-3 h-3 text-yellow-300 fill-current" />
                  <span className="text-xs">4.8</span>
                </div>
              </div>
            </div>
            <Button
              onClick={onClose}
              variant="ghost" 
              size="sm"
              className="text-white hover:bg-red-500/80 bg-red-500/60 border border-white/50 rounded-full w-8 h-8 md:w-10 md:h-10 p-0 flex-shrink-0 transition-all duration-300 hover:scale-110"
            >
              <X className="w-4 h-4 md:w-5 md:h-5" />
            </Button>
          </div>

              {/* Layout responsivo otimizado para mobile */}
              <div className="flex flex-col lg:grid lg:grid-cols-2 gap-3 md:gap-6 p-3 md:p-6 overflow-y-auto max-h-[calc(90vh-60px)] md:max-h-[calc(85vh-80px)]">
                {/* Galeria - sempre no topo no mobile */}
                <div className="space-y-2 md:space-y-4">
                  <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg md:rounded-xl overflow-hidden shadow-inner" style={{ aspectRatio: '3/4' }}>
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
                                className="w-full h-full object-cover group-hover:scale-110 transition-all duration-500 filter group-hover:brightness-105"
                              />
                            </div>
                          </CarouselItem>
                        ))}
                      </CarouselContent>
                      <CarouselPrevious className="left-2 md:left-3 bg-white/90 hover:bg-white shadow-lg w-6 h-6 md:w-8 md:h-8" />
                      <CarouselNext className="right-2 md:right-3 bg-white/90 hover:bg-white shadow-lg w-6 h-6 md:w-8 md:h-8" />
                    </Carousel>
                  </div>

              {/* Miniaturas compactas */}
              <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                {getProductImages().map((image, index) => (
                  <button
                    key={index}
                    className="flex-shrink-0 w-12 h-12 md:w-16 md:h-16 rounded-md md:rounded-lg border-2 border-gray-200 hover:border-purple-500 overflow-hidden transition-all duration-300 hover:scale-110 hover:shadow-lg"
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

            {/* Informações - responsivo */}
            <div className="space-y-3 md:space-y-6">
              {/* Seção de preço mobile-friendly */}
              <div className="bg-gradient-to-r from-red-50 to-pink-50 p-3 md:p-4 rounded-lg md:rounded-xl border border-red-100">
                <div className="text-xs md:text-sm text-gray-600 mb-1">💰 Oferta especial</div>
                <div className="text-xl md:text-3xl font-bold text-red-600 mb-2">
                  Por menos de {formatPrice(product.valor)}
                </div>
                <div className="text-xs md:text-sm text-green-600 font-medium mb-3 md:mb-4 flex items-center gap-1">
                  <Lightbulb className="w-3 h-3 md:w-4 md:h-4" />
                  Frete grátis para todo o Brasil
                </div>
                
                {/* Botões mobile otimizados */}
                <div className="flex gap-2 md:gap-3">
                  <Button
                    variant="outline" 
                    className="flex-1 border-red-300 text-red-600 hover:bg-red-50 font-medium h-10 md:h-12 text-xs md:text-sm transition-all duration-300 hover:scale-105"
                  >
                    <Heart className="w-4 h-4 md:w-5 md:h-5 mr-1 md:mr-2" />
                    <span className="hidden sm:inline">Favoritar</span>
                    <span className="sm:hidden">♥</span>
                  </Button>
                  <Button
                    onClick={handleBuyClick}
                    className="flex-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold h-10 md:h-12 text-xs md:text-sm shadow-lg transition-all duration-300 hover:scale-105"
                  >
                    <ShoppingCart className="w-4 h-4 md:w-5 md:h-5 mr-1 md:mr-2" />
                    Comprar
                  </Button>
                </div>
              </div>

              {/* Tabs compactas para mobile */}
              <Tabs defaultValue="description" className="w-full">
                <TabsList className="grid w-full grid-cols-2 h-9 md:h-12 bg-gray-100 p-1 rounded-lg md:rounded-xl">
                  <TabsTrigger value="description" className="text-xs md:text-sm font-medium rounded-md md:rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">
                    📖 <span className="hidden sm:inline">Descrição</span><span className="sm:hidden">Info</span>
                  </TabsTrigger>
                  <TabsTrigger value="video" className="text-xs md:text-sm font-medium rounded-md md:rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">
                    🎥 Vídeo
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="description" className="mt-2 md:mt-4">
                  <Card className="border-0 shadow-lg">
                    <CardContent className="p-3 md:p-5">
                      <p className="text-sm md:text-base text-gray-700 leading-relaxed mb-3 md:mb-4 text-justify">
                        {getProductDescription()}
                      </p>
                      
                      <div className="bg-blue-50 p-3 md:p-4 rounded-lg border border-blue-200">
                        <h4 className="font-bold mb-2 md:mb-3 text-sm md:text-base text-blue-800 flex items-center gap-2">
                          <Star className="w-3 h-3 md:w-4 md:h-4" />
                          Características:
                        </h4>
                        <ul className="text-xs md:text-sm text-blue-700 space-y-1 md:space-y-2">
                          <li className="flex items-center gap-2">✅ Conteúdo atualizado</li>
                          <li className="flex items-center gap-2">✅ Linguagem técnica</li>
                          <li className="flex items-center gap-2">✅ Aplicação prática</li>
                          <li className="flex items-center gap-2">✅ Referência confiável</li>
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="video" className="mt-2 md:mt-4">
                  <Card className="border-0 shadow-lg">
                    <CardContent className="p-3 md:p-5">
                      <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-4">
                        <div className="w-8 h-8 md:w-10 md:h-10 bg-red-100 rounded-full flex items-center justify-center">
                          <Play className="w-4 h-4 md:w-5 md:h-5 text-red-600" />
                        </div>
                        <div>
                          <h3 className="font-bold text-sm md:text-base text-gray-900">Vídeo Demonstrativo</h3>
                          <p className="text-xs md:text-sm text-gray-600">Conheça mais sobre o produto</p>
                        </div>
                      </div>
                      
                      {product.video ? (
                        <div className="bg-gradient-to-br from-red-50 to-orange-50 p-3 md:p-4 rounded-lg md:rounded-xl border border-red-200">
                          <Button
                            onClick={() => setIsVideoOpen(true)}
                            className="w-full bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white font-bold py-3 md:py-4 rounded-lg md:rounded-xl shadow-lg transition-all duration-300 hover:scale-105 text-sm md:text-base"
                          >
                            <Play className="w-4 h-4 md:w-5 md:h-5 mr-2 md:mr-3" />
                            ▶️ Assistir Vídeo
                          </Button>
                          <p className="text-xs text-gray-600 text-center mt-2">
                            Duração: 2-5 min
                          </p>
                        </div>
                      ) : (
                        <div className="bg-gray-50 p-3 md:p-4 rounded-lg md:rounded-xl border border-gray-200 text-center">
                          <div className="w-10 h-10 md:w-12 md:h-12 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-2 md:mb-3">
                            <Play className="w-5 h-5 md:w-6 md:h-6 text-gray-400" />
                          </div>
                          <p className="text-gray-600 font-medium text-sm md:text-base">
                            Vídeo não disponível
                          </p>
                          <p className="text-xs md:text-sm text-gray-500 mt-1">
                            Verifique as imagens acima
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
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
