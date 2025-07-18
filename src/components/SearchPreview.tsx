
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Product {
  id: number;
  produto: string;
  valor: string;
  imagem1: string;
  categoria: string;
}

interface SearchPreviewProps {
  searchTerm: string;
  products: Product[];
  onProductClick: (productId: number) => void;
}

export const SearchPreview = ({ searchTerm, products, onProductClick }: SearchPreviewProps) => {
  if (!searchTerm || products.length === 0) return null;

  const formatPrice = (price: string) => {
    if (price.includes('R$')) {
      return price;
    }
    return `R$ ${price}`;
  };

  return (
    <div className="px-4 py-2 animate-fade-in">
      <div className="max-w-7xl mx-auto">
        <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-lg">
          <CardContent className="p-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">
              Resultados para "{searchTerm}" ({products.length} encontrados)
            </h3>
            <div className="space-y-2">
              {products.map((product) => (
                <div 
                  key={product.id} 
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer animate-slide-in-right"
                  style={{ animationDelay: `${products.indexOf(product) * 0.1}s` }}
                  onClick={() => onProductClick(product.id)}
                >
                  <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                    <img
                      src={product.imagem1}
                      alt={product.produto}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-gray-900 line-clamp-1 hover:text-red-600 transition-colors">
                      {product.produto}
                    </h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm font-semibold text-red-500">
                        {formatPrice(product.valor)}
                      </span>
                      {product.categoria && (
                        <Badge variant="secondary" className="text-xs">
                          {product.categoria}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
