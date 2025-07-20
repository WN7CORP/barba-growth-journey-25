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
    return <div className={listView ? "space-y-3 content-container" : "grid-responsive-cards content-container"}>
        {Array.from({
        length: listView ? 8 : 12
      }).map((_, index) => <div key={index} className={listView ? "h-32 sm:h-36 bg-white/20 rounded-xl animate-pulse" : "h-80 bg-white/20 rounded-2xl animate-pulse"}></div>)}
      </div>;
  }
  if (products.length === 0) {
    return <div className="text-center py-16 animate-fade-in content-container">
        <div className="w-24 h-24 sm:w-32 sm:h-32 bg-white/20 rounded-3xl flex items-center justify-center mx-auto mb-6 backdrop-blur-sm animate-pulse">
          <div className="text-4xl sm:text-6xl">📦</div>
        </div>
        <h2 className="mobile-heading-large text-white mb-4">
          Nenhum produto encontrado
        </h2>
        <p className="text-white/80 mobile-text-large">
          Não há produtos disponíveis no momento
        </p>
      </div>;
  }
  if (listView) {
    return <div className="space-y-3 content-container mx-0 px-0">
        {products.map((product, index) => <div key={product.id} className="animate-fade-in" style={{
        animationDelay: `${index * 0.05}s`
      }}>
            <ProductCard product={product} compact={false} listLayout={true} selectable={selectable} selected={selectedProducts.some(p => p.id === product.id)} onToggle={onProductToggle} />
          </div>)}
      </div>;
  }
  return <div className="grid-responsive-cards content-container">
      {products.map((product, index) => <ProductCard key={product.id} product={product} compact={compact} selectable={selectable} selected={selectedProducts.some(p => p.id === product.id)} onToggle={onProductToggle} style={{
      animationDelay: `${index * 0.05}s`
    }} />)}
    </div>;
};
export const ProductGrid = memo(ProductGridComponent);
ProductGrid.displayName = 'ProductGrid';