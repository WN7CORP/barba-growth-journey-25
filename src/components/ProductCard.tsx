import React, { useState, memo, useCallback } from 'react';
import { Star, Play, Scale, BookOpen, GraduationCap, ShoppingBag } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { ProductPhotosModal } from '@/components/ProductPhotosModal';
import { ProductDetailModal } from '@/components/ProductDetailModal';
import { FavoriteButton } from '@/components/FavoriteButton';
import { LazyImage } from '@/components/LazyImage';

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

interface ProductCardProps {
  product: Product;
  showBadge?: boolean;
  badgeText?: string;
  compact?: boolean;
  ultraCompact?: boolean;
  selectable?: boolean;
  selected?: boolean;
  onToggle?: (product: Product) => void;
  style?: React.CSSProperties;
}

const ProductCardComponent: React.FC<ProductCardProps> = ({
  product,
  showBadge = false,
  badgeText = "MAIS PROCURADO",
  compact = false,
  ultraCompact = false,
  selectable = false,
  selected = false,
  onToggle,
  style
}) => {
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const getProductImages = useCallback((product: Product) => {
    return [product.imagem1, product.imagem2, product.imagem3, product.imagem4, product.imagem5].filter(Boolean);
  }, []);

  const formatPrice = useCallback((price: string) => {
    if (price.includes('R$')) {
      return price;
    }
    return `R$ ${price}`;
  }, []);

  const getCategoryIcon = useCallback((category: string) => {
    if (category.includes('Livros') || category.includes('Códigos')) {
      return BookOpen;
    }
    if (category.includes('Estudo') || category.includes('Preparatórios')) {
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

  const images = getProductImages(product);
  const CategoryIcon = getCategoryIcon(product.categoria);

  return (
    <>
      <Card 
        id={`product-${product.id}`}
        style={style}
        className={`
          overflow-hidden hover:shadow-2xl transition-all duration-500 hover:scale-105 
          bg-white border-0 shadow-xl group animate-fade-in cursor-pointer
          ${selected ? 'ring-2 ring-purple-600 shadow-xl shadow-purple-200' : 'hover:shadow-purple-100'}
          ${ultraCompact ? 'h-48' : compact ? 'h-64' : ''}
        `}
        onClick={handleCardClick}
      >
        <div className="relative">
          <Carousel className="w-full">
            <CarouselContent>
              {images.map((image, index) => (
                <CarouselItem key={index}>
                  <div className={`overflow-hidden ${ultraCompact ? 'aspect-[4/3] h-24' : compact ? 'aspect-[3/4] h-32' : 'aspect-[3/4]'}`}>
                     <LazyImage 
                       src={image} 
                       alt={`${product.produto} - ${index + 1}`}
                       className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                     />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className={`carousel-nav left-1 bg-white/95 hover:bg-white shadow-lg ${ultraCompact || compact ? 'w-4 h-4' : 'w-6 h-6'}`} />
            <CarouselNext className={`carousel-nav right-1 bg-white/95 hover:bg-white shadow-lg ${ultraCompact || compact ? 'w-4 h-4' : 'w-6 h-6'}`} />
          </Carousel>
          
          {product.video && (
            <div className={`absolute ${ultraCompact || compact ? 'top-1 right-1' : 'top-2 right-2'}`}>
              <div className="bg-red-600/90 rounded-full p-1.5 shadow-lg animate-pulse">
                <Play className={`text-white ${ultraCompact ? 'w-2 h-2' : 'w-3 h-3'}`} />
              </div>
            </div>
          )}
          
          {showBadge && (
            <div className={`absolute ${ultraCompact || compact ? 'top-1 left-1' : 'top-2 left-2'}`}>
              <Badge className={`bg-gradient-to-r from-purple-600 to-purple-700 text-white font-bold animate-bounce shadow-lg ${ultraCompact ? 'text-[10px] px-1 py-0' : 'text-xs'}`}>
                {badgeText}
              </Badge>
            </div>
          )}

          {product.categoria && !showBadge && (compact || ultraCompact) && (
            <div className="absolute bottom-1 left-1">
              <Badge variant="secondary" className={`bg-white/95 flex items-center gap-1 shadow-md ${ultraCompact ? 'text-[10px] px-1 py-0' : 'text-xs px-1.5 py-0.5'}`}>
                <CategoryIcon className={`${ultraCompact ? 'w-2 h-2' : 'w-3 h-3'}`} />
                <span className={`truncate ${ultraCompact ? 'max-w-10' : 'max-w-16'}`}>{product.categoria.split(' ')[0]}</span>
              </Badge>
            </div>
          )}

          {selectable && (
            <div className="absolute top-2 left-2">
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all shadow-lg ${
                selected ? 'bg-purple-600 border-purple-600' : 'bg-white border-gray-300'
              }`}>
                {selected && <div className="w-2 h-2 bg-white rounded-full"></div>}
              </div>
            </div>
          )}

          {/* Favorite button - sempre presente no canto superior esquerdo se não houver badge ou seleção */}
          {!showBadge && !selectable && (
            <div className={`absolute ${ultraCompact || compact ? 'top-1 left-1' : 'top-2 left-2'}`}>
              <FavoriteButton productId={product.id} showText={false} />
            </div>
          )}
        </div>

        <CardContent className={ultraCompact ? "p-2" : compact ? "p-3" : "p-4"}>
          <h3 className={`font-semibold text-gray-900 mb-2 line-clamp-2 hover:text-purple-700 transition-colors leading-tight ${
            ultraCompact ? 'text-xs mb-1' : compact ? 'text-sm' : 'text-base'
          }`}>
            {product.produto}
          </h3>
          
          <div className="flex items-center justify-between mb-3">
            <div className={`font-bold text-red-600 ${ultraCompact ? 'text-xs' : compact ? 'text-sm' : 'text-lg'}`}>
              {formatPrice(product.valor)}
            </div>
            <div className="flex items-center gap-1">
              <Star className={`text-amber-500 fill-current ${ultraCompact ? 'w-3 h-3' : 'w-4 h-4'}`} />
              <span className={`text-gray-600 font-medium ${ultraCompact ? 'text-xs' : 'text-sm'}`}>4.9</span>
            </div>
          </div>
          
          <div className="space-y-2">
            {/* Sempre mostrar botão de favoritar no conteúdo do card se houver badge ou seleção */}
            {(showBadge || selectable) && (
              <div className="flex gap-1 mb-2">
                <FavoriteButton productId={product.id} />
              </div>
            )}
            
            <Button 
              size="sm" 
              variant="outline"
              className={`w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border-0 ${
                ultraCompact ? 'py-1 text-xs' : compact ? 'py-2 text-sm' : 'py-3 text-base'
              }`}
              onClick={handleCardClick}
            >
              <BookOpen className={`mr-2 ${ultraCompact ? 'w-3 h-3' : 'w-4 h-4'}`} />
              Ver mais
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
