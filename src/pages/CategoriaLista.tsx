
import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, ShoppingCart, Filter, Grid } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Header from '@/components/Header';
import { ProductDetailModal } from '@/components/ProductDetailModal';
import { FavoriteButton } from '@/components/FavoriteButton';
import { OptimizedImage } from '@/components/OptimizedImage';
import { ProductPhotosModal } from '@/components/ProductPhotosModal';
import { DesktopSidebar } from '@/components/DesktopSidebar';
import { useToastNotifications } from '@/hooks/useToastNotifications';
import { supabase } from "@/integrations/supabase/client";

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
  subcategoria?: string;
  descricao?: string;
}

const CategoriaLista = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const categoria = searchParams.get('categoria') || '';
  const tipo = searchParams.get('tipo') || 'categoria';

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'nome' | 'preco'>('nome');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  
  const {
    showSuccess,
    showError
  } = useToastNotifications();

  useEffect(() => {
    fetchProducts();
  }, [categoria, tipo]);

  useEffect(() => {
    applyFilters();
  }, [products, sortBy, sortOrder]);

  const fetchProducts = async () => {
    try {
      // @ts-ignore - Bypass TypeScript for table name
      let query = (supabase as any).from('MUNDODODIREITO').select('*');
      
      if (categoria && categoria !== 'todas') {
        query = query.eq('categoria', categoria);
      } else if (tipo === 'mais-vendidos') {
        query = query.order('id');
      }
      
      const { data, error } = await query;
      
      if (error) throw error;

      let filteredData = data || [];
      
      if (tipo === 'mais-vendidos') {
        filteredData = filteredData.slice(0, 20);
      }
      
      // @ts-ignore - Bypass TypeScript for data casting
      setProducts(filteredData || []);
      showSuccess("Produtos carregados!");
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
      showError("Erro ao carregar produtos");
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...products];
    
    filtered.sort((a, b) => {
      if (sortBy === 'nome') {
        const comparison = a.produto.localeCompare(b.produto);
        return sortOrder === 'asc' ? comparison : -comparison;
      } else {
        const priceA = parseFloat(a.valor.replace(/[^\d,]/g, '').replace(',', '.')) || 0;
        const priceB = parseFloat(b.valor.replace(/[^\d,]/g, '').replace(',', '.')) || 0;
        const comparison = priceA - priceB;
        return sortOrder === 'asc' ? comparison : -comparison;
      }
    });

    setFilteredProducts(filtered);
  };

  const formatPrice = (price: string) => {
    if (!price) return 'Preço não disponível';
    if (price.includes('R$')) {
      return price;
    }
    return `R$ ${price}`;
  };

  const getTitle = () => {
    if (tipo === 'mais-vendidos') {
      return 'Mais Vendidos';
    }
    return categoria ? `${categoria}` : 'Produtos';
  };

  const getSubtitle = () => {
    if (tipo === 'mais-vendidos') {
      return 'Os produtos favoritos dos nossos clientes';
    }
    return `Explore todos os produtos de ${categoria}`;
  };

  const getBackPath = () => {
    return '/categorias';
  };

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setIsDetailModalOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex">
          <div className="flex-1 container mx-auto px-4 py-8">
            <div className="animate-pulse space-y-4">
              {Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className="h-24 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
          <div className="hidden lg:block">
            <DesktopSidebar />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="flex">
        {/* Main Content */}
        <div className="flex-1">
          {/* Header da página */}
          <div className="bg-white border-b sticky top-0 z-10">
            <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4">
              <div className="flex items-center gap-2 sm:gap-4 mb-3">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => navigate(getBackPath())} 
                  className="text-red-500 hover:text-red-600 p-1 sm:p-2"
                >
                  <ArrowLeft className="w-4 h-4 sm:mr-2" />
                  <span className="hidden sm:inline">Voltar</span>
                </Button>
                <div className="flex-1 min-w-0">
                  <h1 className="text-lg sm:text-xl font-bold text-gray-900 truncate">{getTitle()}</h1>
                  <p className="text-xs sm:text-sm text-gray-600 truncate">{getSubtitle()}</p>
                </div>
              </div>

              {/* Controles de visualização e filtros */}
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Button
                    variant="default"
                    size="sm"
                    className="p-2"
                  >
                    <Grid className="w-4 h-4" />
                  </Button>
                </div>

                <div className="flex items-center gap-2">
                  <Select value={sortBy} onValueChange={(value: 'nome' | 'preco') => setSortBy(value)}>
                    <SelectTrigger className="w-24 sm:w-32 text-xs sm:text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="nome">Nome</SelectItem>
                      <SelectItem value="preco">Preço</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                    className="px-2 sm:px-3"
                  >
                    {sortOrder === 'asc' ? '↑' : '↓'}
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Content - Lista de produtos */}
          <div className="container mx-auto py-4 sm:py-6 px-2 sm:px-4">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gray-200 rounded-3xl flex items-center justify-center mx-auto mb-6">
                  <ShoppingCart className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400" />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
                  Nenhum produto encontrado
                </h2>
                <p className="text-gray-600">
                  Não há produtos disponíveis nesta categoria
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredProducts.map((product, index) => (
                  <div key={product.id} className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-300">
                    <div className="flex gap-4">
                      <div className="w-20 h-28 flex-shrink-0 rounded-lg overflow-hidden">
                        <OptimizedImage 
                          src={product.imagem1} 
                          alt={product.produto}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <h3 className="text-gray-900 font-semibold text-sm md:text-base line-clamp-2 mb-2">
                              {product.produto}
                            </h3>
                            
                            <div className="flex items-center gap-2 mb-2">
                              {tipo === 'mais-vendidos' && index < 3 && (
                                <span className="px-2 py-1 bg-red-100 text-red-600 text-xs rounded-full font-medium">
                                  TOP {index + 1}
                                </span>
                              )}
                              <span className="text-gray-500 text-xs">
                                {product.categoria}
                              </span>
                            </div>
                            
                            <div className="text-red-600 font-bold text-lg mb-3">
                              {formatPrice(product.valor)}
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <FavoriteButton productId={product.id} />
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleProductClick(product)}
                            className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1 h-auto"
                          >
                            Ver mais
                          </Button>
                          
                          <Button
                            size="sm"
                            asChild
                            className="bg-green-600 hover:bg-green-700 text-white text-xs px-3 py-1 h-auto"
                          >
                            <a href={product.link} target="_blank" rel="noopener noreferrer">
                              Comprar
                            </a>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Desktop Sidebar - only show on large screens */}
        <div className="hidden lg:block">
          <DesktopSidebar />
        </div>
      </div>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <ProductDetailModal 
          isOpen={isDetailModalOpen} 
          onClose={() => setIsDetailModalOpen(false)} 
          product={selectedProduct} 
        />
      )}
    </div>
  );
};

export default CategoriaLista;
