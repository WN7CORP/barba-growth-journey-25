
import React, { memo } from 'react';
import { ProductCard } from '@/components/ProductCard';

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
}

interface ProductGridProps {
  products: Product[];
  loading?: boolean;
  compact?: boolean;
  listView?: boolean;
  selectable?: boolean;
  selectedProducts?: Product[];
  onProductToggle?: (product: Product) => void;
}

const ProductGridComponent: React.FC<ProductGridProps> = ({ 
  products, 
  loading = false, 
  compact = true,
  listView = false,
  selectable = false,
  selectedProducts = [],
  onProductToggle
}) => {
  if (loading) {
    return (
      <div className={listView 
        ? "space-y-3 px-2 sm:px-0" 
        : "container-responsive grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4"
      }>
        {Array.from({ length: listView ? 8 : 12 }).map((_, index) => (
          <div key={index} className={listView 
            ? "h-28 bg-white/20 rounded-lg animate-pulse mx-2 sm:mx-0" 
            : "h-72 bg-white/20 rounded-2xl animate-pulse"
          }></div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="container-responsive text-center py-16 animate-fade-in">
        <div className="w-32 h-32 bg-white/20 rounded-3xl flex items-center justify-center mx-auto mb-6 backdrop-blur-sm animate-pulse">
          <div className="w-16 h-16 text-white/50">📦</div>
        </div>
        <h2 className="text-2xl font-bold text-white mb-4">
          Nenhum produto encontrado
        </h2>
        <p className="text-white/80">
          Não há produtos disponíveis no momento
        </p>
      </div>
    );
  }

  if (listView) {
    return (
      <div className="space-y-3 px-2 sm:px-0">
        {products.map((product, index) => (
          <div
            key={product.id}
            className="bg-white/10 backdrop-blur-sm rounded-lg hover:bg-white/15 transition-all duration-300 animate-fade-in"
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            <ProductCard
              product={product}
              compact={false}
              listLayout={true}
              selectable={selectable}
              selected={selectedProducts.some(p => p.id === product.id)}
              onToggle={onProductToggle}
            />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={`container-responsive grid gap-3 md:gap-4 ${
      compact 
        ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6' 
        : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
    }`}>
      {products.map((product, index) => (
        <ProductCard
          key={product.id}
          product={product}
          compact={compact}
          selectable={selectable}
          selected={selectedProducts.some(p => p.id === product.id)}
          onToggle={onProductToggle}
          style={{ animationDelay: `${index * 0.05}s` }}
        />
      ))}
    </div>
  );
};

export const ProductGrid = memo(ProductGridComponent);
ProductGrid.displayName = 'ProductGrid';
