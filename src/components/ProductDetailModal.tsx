
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { X, ShoppingCart, Star, Info, Sparkles, Zap } from 'lucide-react';
import { ProductBreadcrumb } from '@/components/ProductBreadcrumb';
import { ShareButton } from '@/components/ShareButton';
import { FavoriteButton } from '@/components/FavoriteButton';
import { supabase } from "@/integrations/supabase/client";

interface Product {
  id: number;
  produto: string;
  valor: string;
  imagem1: string;
  imagem2?: string;
  imagem3?: string;
  imagem4?: string;
  imagem5?: string;
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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-full sm:max-w-2xl md:max-w-3xl lg:max-w-4xl h-full max-h-[95vh] sm:max-h-[90vh] overflow-hidden p-0 bg-white m-0 sm:m-2">
        <DialogTitle className="sr-only">{product.produto}</DialogTitle>
        
        {/* Header Compacto e Responsivo */}
        <div className="bg-gradient-to-r from-blue-800 to-purple-800 text-white">
          <div className="flex items-center justify-between mobile-padding">
            <div className="flex-1 pr-3 min-w-0">
              <h2 className="mobile-text font-bold line-clamp-1 mb-1">
                {product.produto}
              </h2>
              <div className="flex items-center gap-2 flex-wrap">
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
              className="text-white hover:bg-red-500/80 bg-red-500/60 border border-white/50 rounded-full touch-target p-0 flex-shrink-0"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Conteúdo Principal Responsivo */}
        <div className="flex flex-col h-full overflow-y-auto">
          <div className="flex flex-col lg:flex-row gap-3 sm:gap-4 mobile-padding">
            
            {/* Galeria de Imagens Compacta */}
            <div className="w-full lg:w-2/5 flex-shrink-0">
              <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg overflow-hidden">
                <Carousel className="w-full">
                  <CarouselContent>
                    {getProductImages().map((image, index) => (
                      <CarouselItem key={index}>
                        <div className="aspect-[4/5] sm:aspect-[3/4]">
                          <img
                            src={image}
                            alt={`${product.produto} - ${index + 1}`}
                            className="w-full h-full object-contain p-2"
                          />
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious className="left-1 bg-white/90 hover:bg-white touch-target" />
                  <CarouselNext className="right-1 bg-white/90 hover:bg-white touch-target" />
                </Carousel>
              </div>
            </div>

            {/* Área de Compra Estratégica */}
            <div className="w-full lg:w-3/5 space-y-3">
              
              {/* Seção de Preço e Compra Otimizada */}
              <div className="bg-gradient-to-r from-red-50 to-orange-50 mobile-padding-large rounded-xl border-2 border-red-200 shadow-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="w-4 h-4 text-orange-500" />
                  <span className="text-sm font-bold text-orange-700">OFERTA LIMITADA</span>
                </div>
                
                <div className="mobile-heading-large text-red-600 mb-3">
                  {formatPrice(product.valor)}
                </div>
                
                {/* Botões de Ação Estratégicos */}
                <div className="space-y-2">
                  <Button
                    onClick={handleBuyClick}
                    className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold shadow-lg btn-responsive-large animate-pulse"
                  >
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    COMPRAR AGORA
                  </Button>
                  
                  <div className="flex gap-2">
                    <FavoriteButton 
                      productId={product.id}
                      size="default"
                      className="flex-1 border-red-300 text-red-600 hover:bg-red-50"
                    />
                    <ShareButton 
                      productName={product.produto}
                      productLink={product.link}
                    />
                  </div>
                </div>
                
                <div className="mt-3 p-2 bg-yellow-100 rounded-lg border border-yellow-300">
                  <p className="text-xs text-yellow-800 font-medium text-center">
                    ⚡ Apenas hoje! Não perca esta oportunidade
                  </p>
                </div>
              </div>

              {/* Conteúdo Compacto */}
              <div className="bg-white rounded-lg border mobile-padding">
                <h4 className="font-bold mb-2 mobile-text flex items-center gap-2">
                  <Info className="w-4 h-4 text-blue-600" />
                  Sobre o Material
                </h4>
                <p className="mobile-text text-gray-700 leading-relaxed mb-3 line-clamp-4">
                  {getProductDescription()}
                </p>
                
                <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                  <h5 className="font-bold mb-2 text-sm text-blue-800">Características:</h5>
                  <div className="grid grid-cols-2 gap-2 text-sm text-blue-700">
                    <div className="flex items-center gap-2">✅ Atualizado</div>
                    <div className="flex items-center gap-2">✅ Técnico</div>
                    <div className="flex items-center gap-2">✅ Prático</div>
                    <div className="flex items-center gap-2">✅ Confiável</div>
                  </div>
                </div>
              </div>

              {/* Produtos Relacionados Compactos */}
              {relatedProducts.length > 0 && (
                <div>
                  <h3 className="mobile-text font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-purple-600" />
                    Produtos Relacionados
                  </h3>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
                    {relatedProducts.map((relatedProduct) => (
                      <div key={relatedProduct.id} className="bg-white rounded-lg border p-2 hover:shadow-md transition-shadow cursor-pointer">
                        <img 
                          src={relatedProduct.imagem1} 
                          alt={relatedProduct.produto}
                          className="w-full h-16 sm:h-20 object-contain rounded mb-2"
                        />
                        <h4 className="text-xs font-medium text-gray-900 line-clamp-2 mb-1">
                          {relatedProduct.produto}
                        </h4>
                        <p className="text-xs font-bold text-red-600">
                          {formatPrice(relatedProduct.valor)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
