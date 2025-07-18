
import React, { memo } from 'react';
import { ProductCard } from '@/components/ProductCard';

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
}

interface ProductGridProps {
  products: Product[];
  loading?: boolean;
  compact?: boolean;
  selectable?: boolean;
  selectedProducts?: Product[];
  onProductToggle?: (product: Product) => void;
}

const ProductGridComponent: React.FC<ProductGridProps> = ({ 
  products, 
  loading = false, 
  compact = false,
  selectable = false,
  selectedProducts = [],
  onProductToggle
}) => {
  // Estados de loading
  if (loading) {
    return (
      <div className={`product-grid ${compact ? 'gap-3' : 'gap-4'}`}>
        {Array.from({ length: 12 }).map((_, index) => (
          <div key={index} className="space-y-3 fade-in" style={{ animationDelay: `${index * 50}ms` }}>
            <div className="skeleton aspect-[3/4] rounded-lg"></div>
            <div className="space-y-2">
              <div className="skeleton-title"></div>
              <div className="skeleton-text w-1/2"></div>
              <div className="skeleton h-10 w-full rounded-lg"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Estado vazio
  if (products.length === 0) {
    return (
      <div className="text-center py-16 fade-in">
        <div className="space-y-4 max-w-md mx-auto">
          <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto">
            <div className="text-4xl">📚</div>
          </div>
          <h3 className="text-xl font-semibold text-foreground">
            Nenhum produto encontrado
          </h3>
          <p className="text-muted-foreground">
            Não há produtos disponíveis no momento ou que correspondam aos filtros aplicados.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`
      ${compact 
        ? 'grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
        : 'product-grid'
      }
    `}>
      {products.map((product, index) => (
        <div
          key={product.id}
          className="fade-in"
          style={{ animationDelay: `${index * 50}ms` }}
        >
          <ProductCard
            product={product}
            compact={compact}
            selectable={selectable}
            selected={selectedProducts.some(p => p.id === product.id)}
            onToggle={onProductToggle}
          />
        </div>
      ))}
    </div>
  );
};

export const ProductGrid = memo(ProductGridComponent);
ProductGrid.displayName = 'ProductGrid';
