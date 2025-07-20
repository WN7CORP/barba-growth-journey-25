
import React, { useState, memo, useCallback } from 'react';
import { Star, Scale, BookOpen, GraduationCap, ShoppingBag, Eye } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { ProductDetailModal } from '@/components/ProductDetailModal';
import { LazyImage } from '@/components/LazyImage';

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

interface ProductCardProps {
  product: Product;
  showBadge?: boolean;
  badgeText?: string;
  compact?: boolean;
  selectable?: boolean;
  selected?: boolean;
  onToggle?: (product: Product) => void;
  style?: React.CSSProperties;
  listLayout?: boolean;
}

const ProductCardComponent: React.FC<ProductCardProps> = ({
  product,
  showBadge = false,
  badgeText = "MAIS PROCURADO",
  compact = false,
  selectable = false,
  selected = false,
  onToggle,
  style,
  listLayout = false
}) => {
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const getProductImages = useCallback((product: Product) => {
    return [product.imagem1, product.imagem2, product.imagem3, product.imagem4, product.imagem5].filter(Boolean);
  }, []);

  const formatPrice = useCallback((price: string) => {
    if (!price) return 'Consulte o preço';
    if (price.includes('R$')) {
      return price;
    }
    return `R$ ${price}`;
  }, []);

  const getCategoryIcon = useCallback((category: string) => {
    if (!category) return Scale;
    if (category.includes('Livros') || category.includes('Códigos') || category.includes('Vade')) {
      return BookOpen;
    }
    if (category.includes('Estudo') || category.includes('Preparatórios') || category.includes('Iniciante')) {
      return GraduationCap;
    }
    return Scale;
  }, []);

  const handleCardClick = useCallback((e: React.MouseEvent) => {
    // Evitar abrir o modal se clicar em botões específicos
    if ((e.target as HTMLElement).closest('button') || (e.target as HTMLElement).closest('[role="button"]') || (e.target as HTMLElement).closest('.carousel-nav')) {
      return;
    }
    if (selectable && onToggle) {
      onToggle(product);
    } else {
      setIsDetailModalOpen(true);
    }
  }, [selectable, onToggle, product]);

  const handleBuyClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(product.link, '_blank');
  }, [product.link]);

  const handleVerMaisClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDetailModalOpen(true);
  }, []);

  const images = getProductImages(product);
  const CategoryIcon = getCategoryIcon(product.categoria);

  if (listLayout) {
    return (
      <>
        <div className="list-item-professional">
          {/* Imagem do Produto - Otimizada */}
          <div className="product-image-container">
            <LazyImage 
              src={product.imagem1} 
              alt={product.produto} 
              className="w-full h-full object-contain rounded-lg" 
            />
          </div>
          
          {/* Conteúdo Principal - Layout Profissional */}
          <div className="product-content-main">
            {/* Categoria Badge */}
            <div className="mb-2">
              <Badge variant="secondary" className="category-badge">
                <CategoryIcon className="w-3 h-3 mr-1" />
                <span className="text-xs font-medium truncate">{product.categoria}</span>
              </Badge>
            </div>
            
            {/* Título do Produto */}
            <h3 className="product-title-professional">
              {product.produto}
            </h3>
            
            {/* Preço e Avaliação */}
            <div className="product-info-row">
              <div className="product-price-professional">
                {formatPrice(product.valor)}
              </div>
              <div className="product-rating">
                <Star className="w-4 h-4 text-amber-500 fill-current" />
                <span className="text-sm font-semibold text-gray-700">4.8</span>
              </div>
            </div>
          </div>
          
          {/* Área dos Botões - Redesenhada */}
          <div className="product-buttons-area">
            <Button 
              onClick={handleVerMaisClick} 
              className="btn-ver-detalhes"
            >
              <Eye className="w-4 h-4 mr-2" />
              <span className="font-semibold">Ver Detalhes</span>
            </Button>
            <Button 
              onClick={handleBuyClick} 
              className="btn-comprar"
            >
              <ShoppingBag className="w-4 h-4 mr-2" />
              <span className="font-bold">Comprar</span>
            </Button>
          </div>
        </div>
        <ProductDetailModal 
          isOpen={isDetailModalOpen} 
          onClose={() => setIsDetailModalOpen(false)} 
          product={product} 
        />
      </>
    );
  }

  return (
    <>
      <Card 
        id={`product-${product.id}`} 
        style={style} 
        className={`
          overflow-hidden hover:shadow-2xl transition-all duration-500 hover:scale-105 
          bg-white/95 backdrop-blur-sm border-0 shadow-xl group animate-fade-in cursor-pointer 
          h-[22rem] flex flex-col
          ${selected ? 'ring-2 ring-purple-600 shadow-xl shadow-purple-200' : 'hover:shadow-purple-100'}
        `} 
        onClick={handleCardClick}
      >
        {/* Área da Imagem - Altura Fixa */}
        <div className="relative h-48 flex-shrink-0">
          <Carousel className="w-full h-full">
            <CarouselContent>
              {images.map((image, index) => (
                <CarouselItem key={index}>
                  <div className="h-48 overflow-hidden bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-2">
                    <LazyImage 
                      src={image} 
                      alt={`${product.produto} - ${index + 1}`} 
                      className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-110" 
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="carousel-nav left-1 bg-white/95 hover:bg-white shadow-lg w-6 h-6" />
            <CarouselNext className="carousel-nav right-1 bg-white/95 hover:bg-white shadow-lg w-6 h-6" />
          </Carousel>
          
          {showBadge && (
            <div className="absolute top-2 left-2">
              <Badge className="bg-gradient-to-r from-purple-600 to-purple-700 text-white font-bold text-xs animate-bounce shadow-lg">
                {badgeText}
              </Badge>
            </div>
          )}

          {product.categoria && !showBadge && compact && (
            <div className="absolute bottom-1 left-1">
              <Badge variant="secondary" className="text-xs bg-white/95 px-1.5 py-0.5 flex items-center gap-1 shadow-md">
                <CategoryIcon className="w-3 h-3" />
                <span className="truncate max-w-16">{product.categoria.split(' ')[0]}</span>
              </Badge>
            </div>
          )}

          {selectable && (
            <div className="absolute top-2 left-2">
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all shadow-lg ${selected ? 'bg-purple-600 border-purple-600' : 'bg-white border-gray-300'}`}>
                {selected && <div className="w-2 h-2 bg-white rounded-full"></div>}
              </div>
            </div>
          )}
        </div>

        {/* Conteúdo - Altura Flexível com Altura Mínima */}
        <CardContent className="p-4 flex flex-col justify-between flex-1 min-h-[160px]">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 mb-3 line-clamp-2 hover:text-purple-700 transition-colors leading-tight mobile-text min-h-[2.5rem] prevent-overflow">
              {product.produto}
            </h3>
            
            <div className="flex items-center justify-between mb-4">
              <div className="font-bold text-green-600 text-lg sm:text-xl prevent-overflow">
                {formatPrice(product.valor)}
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <Star className="w-4 h-4 text-amber-500 fill-current" />
                <span className="text-sm text-gray-600 font-medium">4.8</span>
              </div>
            </div>
          </div>
          
          {/* Botões - Área Fixa no Final */}
          <div className="mt-auto mb-2">            
            <Button 
              size="sm" 
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border-0 btn-responsive min-h-[40px]" 
              onClick={handleVerMaisClick}
            >
              <BookOpen className="w-4 h-4 mr-2 flex-shrink-0" />
              <span className="truncate">Ver detalhes</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      <ProductDetailModal 
        isOpen={isDetailModalOpen} 
        onClose={() => setIsDetailModalOpen(false)} 
        product={product} 
      />
    </>
  );
};

export const ProductCard = memo(ProductCardComponent);
ProductCard.displayName = 'ProductCard';
