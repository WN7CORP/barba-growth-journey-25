
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { X, ShoppingCart, Heart, Star, Play, Info } from 'lucide-react';
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
        <DialogContent className="max-w-4xl w-[95vw] max-h-[90vh] overflow-hidden p-0 bg-white">
          {/* Header compacto */}
          <div className="bg-gradient-to-r from-blue-800 to-purple-800 text-white p-3 flex items-center justify-between">
            <div className="flex-1 min-w-0 pr-4">
              <h2 className="text-lg font-bold line-clamp-1">
                {product.produto}
              </h2>
              <div className="flex items-center gap-2 mt-1">
                <Badge className="bg-white/20 text-white border-white/30 text-xs">
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
              className="text-white hover:bg-red-500/80 bg-red-500/60 border border-white/50 rounded-full w-10 h-10 p-0 flex-shrink-0"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Layout principal - grid responsivo */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 p-4 overflow-y-auto max-h-[calc(90vh-80px)]">
            
            {/* Galeria compacta - 1/3 do espaço */}
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

              {/* Miniaturas compactas */}
              <div className="flex gap-1 mt-2 overflow-x-auto pb-1">
                {getProductImages().map((image, index) => (
                  <button
                    key={index}
                    className="flex-shrink-0 w-10 h-10 rounded border-2 border-gray-200 hover:border-purple-500 overflow-hidden"
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
            <div className="lg:col-span-2 space-y-4">
              
              {/* Preço e compra */}
              <div className="bg-gradient-to-r from-red-50 to-pink-50 p-4 rounded-xl border border-red-100">
                <div className="text-sm text-gray-600 mb-1">💰 Oferta especial</div>
                <div className="text-2xl font-bold text-red-600 mb-3">
                  Por menos de {formatPrice(product.valor)}
                </div>
                
                <div className="flex gap-3">
                  <Button
                    variant="outline" 
                    className="flex-1 border-red-300 text-red-600 hover:bg-red-50 font-medium"
                  >
                    <Heart className="w-4 h-4 mr-2" />
                    Favoritar
                  </Button>
                  <Button
                    onClick={handleBuyClick}
                    className="flex-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold shadow-lg"
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
