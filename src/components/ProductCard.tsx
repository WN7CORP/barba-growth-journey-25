
import React, { useState, memo, useCallback } from 'react';
import { Star, Play, Heart, ShoppingCart, Eye } from 'lucide-react';
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
  selectable?: boolean;
  selected?: boolean;
  onToggle?: (product: Product) => void;
  style?: React.CSSProperties;
}

const ProductCardComponent: React.FC<ProductCardProps> = ({
  product,
  showBadge = false,
  badgeText = "DESTAQUE",
  compact = false,
  selectable = false,
  selected = false,
  onToggle,
  style
}) => {
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [imageError, setImageError] = useState(false);

  const getProductImages = useCallback((product: Product) => {
    return [product.imagem1, product.imagem2, product.imagem3, product.imagem4, product.imagem5].filter(Boolean);
  }, []);

  const formatPrice = useCallback((price: string) => {
    // Remove formatações desnecessárias e mantém apenas o preço limpo
    const cleanPrice = price.replace(/[^\d,]/g, '');
    if (cleanPrice.includes(',')) {
      return `R$ ${cleanPrice}`;
    }
    return `R$ ${cleanPrice},00`;
  }, []);

  const handleCardClick = useCallback((e: React.MouseEvent) => {
    // Evitar abrir o modal se clicar em botões específicos
    if ((e.target as HTMLElement).closest('button') || 
        (e.target as HTMLElement).closest('[role="button"]') || 
        (e.target as HTMLElement).closest('.carousel-nav')) {
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

  const handleFavoriteClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  }, [isFavorite]);

  const images = getProductImages(product);

  return (
    <>
      <Card 
        id={`product-${product.id}`}
        style={style}
        className={`
          group overflow-hidden cursor-pointer transition-all duration-300 
          hover:shadow-lg hover:-translate-y-1 bg-card border-border
          ${selected ? 'ring-2 ring-primary shadow-premium' : ''}
          ${compact ? 'h-auto' : 'h-full'}
        `}
        onClick={handleCardClick}
      >
        <div className="relative overflow-hidden">
          {/* Carrossel de imagens */}
          <Carousel className="w-full">
            <CarouselContent>
              {images.map((image, index) => (
                <CarouselItem key={index}>
                  <div className={`relative overflow-hidden ${compact ? 'aspect-[3/4]' : 'aspect-[3/4]'}`}>
                    <LazyImage 
                      src={image} 
                      alt={`${product.produto} - Imagem ${index + 1}`}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      onError={() => setImageError(true)}
                    />
                    {imageError && (
                      <div className="absolute inset-0 bg-muted flex items-center justify-center">
                        <div className="text-muted-foreground text-sm">Imagem não disponível</div>
                      </div>
                    )}
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            {images.length > 1 && (
              <>
                <CarouselPrevious className="carousel-nav absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white border-0 shadow-md w-8 h-8 opacity-0 group-hover:opacity-100 transition-opacity" />
                <CarouselNext className="carousel-nav absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white border-0 shadow-md w-8 h-8 opacity-0 group-hover:opacity-100 transition-opacity" />
              </>
            )}
          </Carousel>
          
          {/* Badges e ícones sobrepostos */}
          <div className="absolute top-3 left-3 right-3 flex justify-between items-start">
            <div className="flex flex-col gap-2">
              {showBadge && (
                <Badge className="bg-accent text-accent-foreground font-semibold text-xs px-2 py-1 shadow-sm">
                  {badgeText}
                </Badge>
              )}
              {product.video && (
                <Badge className="bg-destructive text-destructive-foreground font-medium text-xs px-2 py-1 flex items-center gap-1 shadow-sm">
                  <Play className="w-3 h-3" />
                  Vídeo
                </Badge>
              )}
            </div>
            
            {/* Botão de favorito */}
            <Button
              size="sm"
              variant="ghost"
              className="w-8 h-8 p-0 bg-white/90 hover:bg-white shadow-sm opacity-0 group-hover:opacity-100 transition-all"
              onClick={handleFavoriteClick}
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-destructive text-destructive' : 'text-muted-foreground'}`} />
            </Button>
          </div>

          {/* Seleção para modo comparação */}
          {selectable && (
            <div className="absolute top-3 left-3">
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all shadow-sm ${
                selected 
                  ? 'bg-primary border-primary' 
                  : 'bg-white/90 border-muted-foreground/30'
              }`}>
                {selected && <div className="w-2 h-2 bg-white rounded-full"></div>}
              </div>
            </div>
          )}
        </div>

        <CardContent className={`p-4 space-y-3 ${compact ? 'p-3 space-y-2' : ''}`}>
          {/* Título do produto */}
          <h3 className={`font-semibold text-foreground line-clamp-2 leading-tight group-hover:text-primary transition-colors ${
            compact ? 'text-sm' : 'text-base'
          }`}>
            {product.produto}
          </h3>
          
          {/* Categoria */}
          {product.categoria && !compact && (
            <p className="text-sm text-muted-foreground font-medium">
              {product.categoria}
            </p>
          )}
          
          {/* Preço e avaliação */}
          <div className="flex items-center justify-between">
            <div className={`font-bold text-primary ${compact ? 'text-lg' : 'text-xl'}`}>
              {formatPrice(product.valor)}
            </div>
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-accent fill-current" />
              <span className="text-sm text-muted-foreground font-medium">4.8</span>
            </div>
          </div>
          
          {/* Botões de ação */}
          <div className="flex gap-2 pt-2">
            <Button 
              size={compact ? "sm" : "default"}
              className="flex-1 btn-primary touch-target"
              onClick={handleBuyClick}
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              Comprar
            </Button>
            <Button 
              size={compact ? "sm" : "default"}
              variant="outline"
              className="touch-target"
              onClick={(e) => {
                e.stopPropagation();
                setIsDetailModalOpen(true);
              }}
            >
              <Eye className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Modal de detalhes */}
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
