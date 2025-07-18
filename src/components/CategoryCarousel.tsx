
import { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { LazyImage } from '@/components/LazyImage';

interface Product {
  id: number;
  produto: string;
  valor: string;
  imagem1: string;
  categoria: string;
}

interface CategoryCarouselProps {
  products: Product[];
  onProductClick: (productId: number) => void;
}

export const CategoryCarousel = ({ products, onProductClick }: CategoryCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [recentProducts, setRecentProducts] = useState<Product[]>([]);
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);

  useEffect(() => {
    // Pega os 8 produtos mais recentes
    const newest = [...products]
      .sort((a, b) => b.id - a.id)
      .slice(0, 8);
    setRecentProducts(newest);
  }, [products]);

  // Auto-scroll otimizado
  useEffect(() => {
    if (recentProducts.length === 0 || !isAutoScrolling) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        const maxIndex = Math.ceil(recentProducts.length / 2) - 1;
        return prev >= maxIndex ? 0 : prev + 1;
      });
    }, 4000);

    return () => clearInterval(interval);
  }, [recentProducts.length, isAutoScrolling]);

  const nextSlide = useCallback(() => {
    setIsAutoScrolling(false);
    const maxIndex = Math.ceil(recentProducts.length / 2) - 1;
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    // Reativar auto-scroll após 10 segundos
    setTimeout(() => setIsAutoScrolling(true), 10000);
  }, [recentProducts.length]);

  const prevSlide = useCallback(() => {
    setIsAutoScrolling(false);
    const maxIndex = Math.ceil(recentProducts.length / 2) - 1;
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
    // Reativar auto-scroll após 10 segundos
    setTimeout(() => setIsAutoScrolling(true), 10000);
  }, [recentProducts.length]);

  const handleProductClick = useCallback((productId: number) => {
    onProductClick(productId);
  }, [onProductClick]);

  if (recentProducts.length === 0) return null;

  return (
    <section className="px-4 py-4 animate-fade-in">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-white">
            ✨ Novidades
          </h2>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={prevSlide}
              className="text-white hover:bg-white/20 p-2 rounded-full transition-all duration-300"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={nextSlide}
              className="text-white hover:bg-white/20 p-2 rounded-full transition-all duration-300"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="relative overflow-hidden">
          <div 
            className="flex transition-transform duration-700 ease-in-out gap-3"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {recentProducts.map((product, index) => (
              <Card
                key={product.id}
                className="flex-shrink-0 w-1/2 md:w-1/4 lg:w-1/6 overflow-hidden cursor-pointer transition-all duration-500 hover:scale-105 hover:shadow-xl"
                onClick={() => handleProductClick(product.id)}
              >
                <div className="relative aspect-[4/3]">
                  <LazyImage
                    src={product.imagem1}
                    alt={product.produto}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  
                  {/* Badge NOVO para os 3 primeiros */}
                  {index < 3 && (
                    <div className="absolute top-2 left-2">
                      <div className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full animate-pulse">
                        NOVO
                      </div>
                    </div>
                  )}
                  
                  <div className="absolute bottom-2 left-2 right-2">
                    <h3 className="text-white text-sm font-semibold line-clamp-2 mb-1">
                      {product.produto}
                    </h3>
                    <div className="text-white/90 text-xs font-medium">
                      A partir de {product.valor}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Indicadores de slide otimizados */}
        <div className="flex justify-center mt-4 gap-2">
          {Array.from({ length: Math.ceil(recentProducts.length / 2) }).map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setCurrentIndex(index);
                setIsAutoScrolling(false);
                setTimeout(() => setIsAutoScrolling(true), 10000);
              }}
              className={`w-2 h-2 rounded-full transition-all duration-500 ${
                currentIndex === index ? 'bg-white w-6' : 'bg-white/50'
              }`}
              aria-label={`Ir para slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
