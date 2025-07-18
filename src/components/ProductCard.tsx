
import React, { useState, memo, useCallback } from 'react';
import { Star, Play, BookOpen, Heart, ShoppingBag, Eye } from 'lucide-react';
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
  featured?: boolean;
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
  featured = false,
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
    // Extract only the numeric value and format it properly
    const numericPrice = price.replace(/[^\d,]/g, '').replace(',', '.');
    const formatted = parseFloat(numericPrice).toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
    return formatted;
  }, []);

  const handleCardClick = useCallback((e: React.MouseEvent) => {
    // Prevent modal opening when clicking interactive elements
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

  const handleViewMore = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDetailModalOpen(true);
  }, []);

  const handleBuyClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(product.link, '_blank');
  }, [product.link]);

  const images = getProductImages(product);
  const cardClasses = `
    group relative overflow-hidden transition-all duration-500 cursor-pointer
    ${featured ? 'card-featured' : 'card-elegant'}
    ${compact ? 'h-auto' : 'h-full'}
    ${selected ? 'ring-2 ring-gold shadow-gold/20 shadow-lg' : ''}
    hover:scale-[1.02] hover:shadow-hover
  `;

  return (
    <>
      <Card 
        id={`product-${product.id}`}
        style={style}
        className={cardClasses}
        onClick={handleCardClick}
      >
        {/* Image Container */}
        <div className="relative">
          <Carousel className="w-full">
            <CarouselContent>
              {images.map((image, index) => (
                <CarouselItem key={index}>
                  <div className={`overflow-hidden ${compact ? 'aspect-[3/4]' : 'aspect-[3/4.2]'}`}>
                    <LazyImage 
                      src={image} 
                      alt={`${product.produto} - Imagem ${index + 1}`}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="carousel-nav left-2 bg-white/90 hover:bg-white shadow-card border-0 w-7 h-7 opacity-0 group-hover:opacity-100 transition-opacity" />
            <CarouselNext className="carousel-nav right-2 bg-white/90 hover:bg-white shadow-card border-0 w-7 h-7 opacity-0 group-hover:opacity-100 transition-opacity" />
          </Carousel>
          
          {/* Badges and Icons Overlay */}
          <div className="absolute inset-0 pointer-events-none">
            {/* Video indicator */}
            {product.video && (
              <div className="absolute top-3 right-3 pointer-events-auto">
                <div className="bg-red-500/90 backdrop-blur-sm rounded-full p-1.5 shadow-lg">
                  <Play className="w-3 h-3 text-white" fill="currentColor" />
                </div>
              </div>
            )}
            
            {/* Feature badge */}
            {showBadge && (
              <div className="absolute top-3 left-3">
                <Badge className="bg-gold text-primary font-semibold text-xs px-2 py-1 shadow-lg border-0">
                  ✨ {badgeText}
                </Badge>
              </div>
            )}

            {/* Selection indicator */}
            {selectable && (
              <div className="absolute top-3 left-3 pointer-events-auto">
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all shadow-lg ${
                  selected ? 'bg-gold border-gold' : 'bg-white/90 border-muted-foreground/30'
                }`}>
                  {selected && <div className="w-2 h-2 bg-primary rounded-full"></div>}
                </div>
              </div>
            )}

            {/* Favorite button */}
            {!showBadge && !selectable && (
              <div className="absolute top-3 left-3 pointer-events-auto opacity-0 group-hover:opacity-100 transition-opacity">
                <FavoriteButton productId={product.id} showText={false} />
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <CardContent className={`p-4 ${compact ? 'space-y-3' : 'space-y-4'}`}>
          {/* Title */}
          <h3 className={`font-semibold text-foreground line-clamp-2 hover:text-accent transition-colors leading-tight ${
            compact ? 'text-sm' : 'text-base'
          }`}>
            {product.produto}
          </h3>
          
          {/* Category */}
          {product.categoria && !compact && (
            <div className="text-xs text-muted-foreground font-medium">
              {product.categoria}
            </div>
          )}
          
          {/* Price and Rating Row */}
          <div className="flex items-center justify-between">
            <div className={`font-bold text-accent ${compact ? 'text-base' : 'text-lg'}`}>
              {formatPrice(product.valor)}
            </div>
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-gold fill-current" />
              <span className="text-sm text-muted-foreground font-medium">4.8</span>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="space-y-2">
            {/* Favorite button for badge/selectable modes */}
            {(showBadge || selectable) && (
              <div className="flex justify-start">
                <FavoriteButton productId={product.id} />
              </div>
            )}
            
            {/* Primary Actions */}
            <div className={`flex gap-2 ${compact ? 'flex-col' : 'flex-row'}`}>
              <Button 
                size="sm" 
                variant="outline"
                className="flex-1 bg-secondary hover:bg-secondary/80 text-secondary-foreground border-border hover:border-muted-foreground/30 transition-all duration-200 hover:scale-[1.02]"
                onClick={handleViewMore}
              >
                <Eye className="w-4 h-4 mr-2" />
                Ver Detalhes
              </Button>
              
              {!compact && (
                <Button 
                  size="sm"
                  className="flex-1 btn-accent shadow-md hover:shadow-lg transition-all duration-200 hover:scale-[1.02]"
                  onClick={handleBuyClick}
                >
                  <ShoppingBag className="w-4 h-4 mr-2" />
                  Comprar
                </Button>
              )}
            </div>
            
            {/* Compact mode buy button */}
            {compact && (
              <Button 
                size="sm"
                className="w-full btn-accent shadow-md hover:shadow-lg transition-all duration-200 hover:scale-[1.02]"
                onClick={handleBuyClick}
              >
                <ShoppingBag className="w-4 h-4 mr-2" />
                Comprar Agora
              </Button>
            )}
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
