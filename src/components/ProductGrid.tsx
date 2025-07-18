
import React, { memo } from 'react';
import { BookOpen } from 'lucide-react';
import { ProductCard } from '@/components/ProductCard';
import { ProductSkeleton } from '@/components/ProductSkeleton';

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
  featured?: boolean;
  selectable?: boolean;
  selectedProducts?: Product[];
  onProductToggle?: (product: Product) => void;
}

const ProductGridComponent: React.FC<ProductGridProps> = ({ 
  products, 
  loading = false, 
  compact = true,
  featured = false,
  selectable = false,
  selectedProducts = [],
  onProductToggle
}) => {
  if (loading) {
    return (
      <div className={compact ? 'grid-books' : 'grid-books-large'}>
        {Array.from({ length: compact ? 12 : 8 }).map((_, index) => (
          <div key={index} className="animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
            <ProductSkeleton compact={compact} />
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-20 animate-fade-in-up">
        <div className="w-24 h-24 bg-muted rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-card">
          <BookOpen className="w-12 h-12 text-muted-foreground" />
        </div>
        <h2 className="text-display-sm text-foreground mb-4 font-display">
          Nenhum livro encontrado
        </h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          Não há produtos disponíveis no momento. Tente ajustar seus filtros ou volte mais tarde.
        </p>
      </div>
    );
  }

  return (
    <div className={compact ? 'grid-books' : 'grid-books-large'}>
      {products.map((product, index) => (
        <div 
          key={product.id} 
          className="animate-fade-in-up"
          style={{ animationDelay: `${index * 0.05}s` }}
        >
          <ProductCard
            product={product}
            compact={compact}
            featured={featured}
            selectable={selectable}
            selected={selectedProducts?.some(p => p.id === product.id)}
            onToggle={onProductToggle}
          />
        </div>
      ))}
    </div>
  );
};

export const ProductGrid = memo(ProductGridComponent);
ProductGrid.displayName = 'ProductGrid';
