
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { X, ShoppingCart, Star, Info, Sparkles } from 'lucide-react';
import { ProductBreadcrumb } from '@/components/ProductBreadcrumb';
import { ShareButton } from '@/components/ShareButton';
import { FavoriteButton } from '@/components/FavoriteButton';
import { supabase } from "@/integrations/supabase/client";

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
      <DialogContent className="w-full max-w-full sm:max-w-2xl md:max-w-4xl lg:max-w-6xl h-full max-h-[100vh] sm:max-h-[95vh] overflow-hidden p-0 bg-white m-0 sm:m-2">
        {/* Header with breadcrumb - Mobile Optimized */}
        <div className="bg-gradient-to-r from-blue-800 to-purple-800 text-white">
          <div className="flex items-center justify-between p-3 md:p-4">
            <div className="flex-1 pr-3 md:pr-4 min-w-0">
              <h2 className="text-sm md:text-lg font-bold line-clamp-2 mb-1">
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
              className="text-white hover:bg-red-500/80 bg-red-500/60 border border-white/50 rounded-full w-8 h-8 md:w-10 md:h-10 p-0 flex-shrink-0"
            >
              <X className="w-4 h-4 md:w-5 md:h-5" />
            </Button>
          </div>
          <div className="px-3 md:px-4 pb-2">
            <ProductBreadcrumb categoria={product.categoria} produto={product.produto} />
          </div>
        </div>

        {/* Main Content - Mobile First Layout */}
        <div className="flex flex-col h-full overflow-y-auto">
          <div className="flex flex-col md:flex-row gap-4 md:gap-6 p-4 md:p-6">
            
            {/* Image Gallery - Full width on mobile, 1/3 on desktop */}
            <div className="w-full md:w-1/3 flex-shrink-0">
              <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg overflow-hidden shadow-inner">
                <Carousel className="w-full">
                  <CarouselContent>
                    {getProductImages().map((image, index) => (
                      <CarouselItem key={index}>
                        <div className="aspect-[3/4] sm:aspect-[2/3]">
                          <img
                            src={image}
                            alt={`${product.produto} - ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious className="left-2 bg-white/90 hover:bg-white shadow-lg w-8 h-8" />
                  <CarouselNext className="right-2 bg-white/90 hover:bg-white shadow-lg w-8 h-8" />
                </Carousel>
              </div>

              {/* Thumbnails */}
              <div className="flex gap-1 mt-2 overflow-x-auto pb-1">
                {getProductImages().map((image, index) => (
                  <div
                    key={index}
                    className="flex-shrink-0 w-12 h-16 rounded border-2 border-gray-200 overflow-hidden"
                  >
                    <img
                      src={image}
                      alt={`Miniatura ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Product Information - Full width on mobile, 2/3 on desktop */}
            <div className="w-full md:w-2/3 space-y-4 md:space-y-6">
              
              {/* Price and Actions */}
              <div className="bg-gradient-to-r from-red-50 to-pink-50 p-4 rounded-xl border border-red-100">
                <div className="text-sm text-gray-600 mb-1 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-600" />
                  💰 Oferta especial
                </div>
                <div className="text-xl md:text-2xl lg:text-3xl font-bold text-red-600 mb-4">
                  {formatPrice(product.valor)}
                </div>
                
                <div className="flex gap-2 md:gap-3 flex-wrap">
                  <FavoriteButton 
                    productId={product.id}
                    className="border-red-300 text-red-600 hover:bg-red-50 font-medium"
                  />
                  <ShareButton 
                    productName={product.produto}
                    productLink={product.link}
                  />
                  <Button
                    onClick={handleBuyClick}
                    className="flex-1 min-w-0 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold shadow-lg text-sm md:text-base px-4 py-2"
                  >
                    <ShoppingCart className="w-4 h-4 mr-2 flex-shrink-0" />
                    <span className="truncate">Comprar Agora</span>
                  </Button>
                </div>
              </div>

              {/* Content Tabs */}
              <Tabs defaultValue="description" className="w-full">
                <TabsList className="grid w-full grid-cols-1 bg-gray-100 p-1 rounded-xl">
                  <TabsTrigger value="description" className="text-sm font-medium rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">
                    <Info className="w-4 h-4 mr-2" />
                    Informações Detalhadas
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
              </Tabs>

              {/* Related Products */}
              {relatedProducts.length > 0 && (
                <div className="mt-6 md:mt-8">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-purple-600" />
                    Produtos Relacionados
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
                    {relatedProducts.map((relatedProduct) => (
                      <div key={relatedProduct.id} className="bg-white rounded-lg border border-gray-200 p-3 hover:shadow-md transition-shadow cursor-pointer">
                        <img 
                          src={relatedProduct.imagem1} 
                          alt={relatedProduct.produto}
                          className="w-full h-20 md:h-24 object-cover rounded mb-2"
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
        </div>
      </DialogContent>
    </Dialog>
  );
};
