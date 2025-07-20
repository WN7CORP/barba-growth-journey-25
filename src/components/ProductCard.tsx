
import React, { useState, memo, useCallback } from 'react';
import { Star, Scale, BookOpen, GraduationCap, ShoppingBag } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { ProductDetailModal } from '@/components/ProductDetailModal';
import { FavoriteButton } from '@/components/FavoriteButton';
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
        <div className="flex gap-3 p-3 bg-white rounded-xl hover:shadow-lg transition-all cursor-pointer border border-gray-100 hover:border-purple-200 min-h-[100px]" onClick={handleCardClick}>
          {/* Capa Melhorada */}
          <div className="w-20 h-24 flex-shrink-0 rounded-lg overflow-hidden shadow-sm">
            <LazyImage 
              src={product.imagem1} 
              alt={product.produto}
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Informações do Produto */}
          <div className="flex-1 min-w-0 flex flex-col justify-between">
            <div className="flex-1">
              <h3 className="font-bold text-gray-900 line-clamp-2 text-sm mb-2 leading-tight min-h-[2.5rem]">
                {product.produto}
              </h3>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="secondary" className="text-xs bg-blue-50 text-blue-700 border-blue-200 flex items-center gap-1">
                  <CategoryIcon className="w-3 h-3" />
                  <span className="truncate max-w-[80px]">{product.categoria}</span>
                </Badge>
                <div className="flex items-center gap-1">
                  <Star className="w-3 h-3 text-amber-500 fill-current" />
                  <span className="text-xs text-gray-600 font-medium">4.8</span>
                </div>
              </div>
            </div>
            
            {/* Preço e Ações */}
            <div className="flex items-center justify-between gap-2 mt-auto">
              <div className="font-bold text-green-600 text-base">
                {formatPrice(product.valor)}
              </div>
              <div className="flex items-center gap-1">
                <FavoriteButton 
                  productId={product.id} 
                  size="sm" 
                  showText={false}
                />
                <Button 
                  size="sm" 
                  onClick={handleVerMaisClick} 
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-3 py-1 text-xs min-h-[32px]"
                >
                  Ver
                </Button>
                <Button 
                  size="sm" 
                  onClick={handleBuyClick}
                  className="bg-green-600 hover:bg-green-700 text-white font-bold px-3 py-1 text-xs min-h-[32px]"
                >
                  <ShoppingBag className="w-3 h-3 mr-1" />
                  Comprar
                </Button>
              </div>
            </div>
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
          bg-white border-0 shadow-xl group animate-fade-in cursor-pointer
          ${selected ? 'ring-2 ring-purple-600 shadow-xl shadow-purple-200' : 'hover:shadow-purple-100'}
          ${compact ? 'min-h-[280px]' : 'min-h-[320px]'}
        `}
        onClick={handleCardClick}
      >
        <div className="relative">
          <Carousel className="w-full">
            <CarouselContent>
              {images.map((image, index) => (
                <CarouselItem key={index}>
                  <div className={`overflow-hidden ${compact ? 'aspect-[3/4] h-40' : 'aspect-[3/4] h-48'}`}>
                    <LazyImage 
                      src={image} 
                      alt={`${product.produto} - ${index + 1}`}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className={`carousel-nav left-1 bg-white/95 hover:bg-white shadow-lg ${compact ? 'w-5 h-5' : 'w-6 h-6'}`} />
            <CarouselNext className={`carousel-nav right-1 bg-white/95 hover:bg-white shadow-lg ${compact ? 'w-5 h-5' : 'w-6 h-6'}`} />
          </Carousel>
          
          {showBadge && (
            <div className={`absolute ${compact ? 'top-1 left-1' : 'top-2 left-2'}`}>
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
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all shadow-lg ${
                selected ? 'bg-purple-600 border-purple-600' : 'bg-white border-gray-300'
              }`}>
                {selected && <div className="w-2 h-2 bg-white rounded-full"></div>}
              </div>
            </div>
          )}

          {/* Favorite button - sempre presente no canto superior esquerdo se não houver badge ou seleção */}
          {!showBadge && !selectable && (
            <div className={`absolute ${compact ? 'top-1 left-1' : 'top-2 left-2'}`}>
              <FavoriteButton productId={product.id} showText={false} />
            </div>
          )}
        </div>

        <CardContent className={`${compact ? "p-3" : "p-4"} flex flex-col justify-between flex-1`}>
          <div className="flex-1">
            <h3 className={`font-semibold text-gray-900 mb-2 line-clamp-2 hover:text-purple-700 transition-colors leading-tight ${
              compact ? 'text-sm min-h-[2.5rem]' : 'text-base min-h-[3rem]'
            }`}>
              {product.produto}
            </h3>
            
            <div className="flex items-center justify-between mb-3">
              <div className={`font-bold text-green-600 ${compact ? 'text-sm' : 'text-lg'}`}>
                {formatPrice(product.valor)}
              </div>
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-amber-500 fill-current" />
                <span className="text-sm text-gray-600 font-medium">4.8</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-2 mt-auto">
            {/* Sempre mostrar botão de favoritar no conteúdo do card se houver badge ou seleção */}
            {(showBadge || selectable) && (
              <div className="flex gap-1 mb-2">
                <FavoriteButton productId={product.id} />
              </div>
            )}
            
            <Button 
              size="sm" 
              variant="outline"
              className={`w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border-0 min-h-[36px] ${
                compact ? 'py-2 text-sm' : 'py-3 text-base'
              }`}
              onClick={handleVerMaisClick}
            >
              <BookOpen className="w-4 h-4 mr-2" />
              Ver detalhes
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
