import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, ShoppingCart, Filter, Grid } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Header from '@/components/Header';
import { ProductDetailModal } from '@/components/ProductDetailModal';
import { ProductCard } from '@/components/ProductCard';
import { FavoriteButton } from '@/components/FavoriteButton';
import { OptimizedImage } from '@/components/OptimizedImage';
import { SubcategoryCard } from '@/components/SubcategoryCard';
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

interface SubcategoryGroup {
  subcategoria: string;
  products: Product[];
  sampleImage: string;
}

const CategoriaLista = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const categoria = searchParams.get('categoria') || '';
  const subcategoria = searchParams.get('subcategoria') || '';
  const tipo = searchParams.get('tipo') || 'categoria';

  const [products, setProducts] = useState<Product[]>([]);
  const [subcategoryGroups, setSubcategoryGroups] = useState<SubcategoryGroup[]>([]);
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
  }, [categoria, subcategoria, tipo]);

  useEffect(() => {
    if (tipo === 'categoria' && !subcategoria) {
      groupProductsBySubcategory();
    } else {
      applyFilters();
    }
  }, [products, sortBy, sortOrder, tipo, subcategoria]);

  const fetchProducts = async () => {
    try {
      // @ts-ignore - Bypass TypeScript for table name
      let query = (supabase as any).from('MUNDODODIREITO').select('*');
      
      if (tipo === 'categoria' && categoria && categoria !== 'todas') {
        query = query.eq('categoria', categoria);
      } else if (tipo === 'subcategoria' && categoria && subcategoria) {
        query = query.eq('categoria', categoria).eq('subcategoria', subcategoria);
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

  const groupProductsBySubcategory = () => {
    if (tipo !== 'categoria' || subcategoria) return;
    
    const grouped = products.reduce((acc: Record<string, Product[]>, product) => {
      const subcat = product.subcategoria || 'Outros';
      if (!acc[subcat]) {
        acc[subcat] = [];
      }
      acc[subcat].push(product);
      return acc;
    }, {});

    const groups = Object.entries(grouped).map(([subcategoria, products]) => ({
      subcategoria,
      products: products.sort((a, b) => {
        if (sortBy === 'nome') {
          const comparison = a.produto.localeCompare(b.produto);
          return sortOrder === 'asc' ? comparison : -comparison;
        } else {
          const priceA = parseFloat(a.valor.replace(/[^\d,]/g, '').replace(',', '.')) || 0;
          const priceB = parseFloat(b.valor.replace(/[^\d,]/g, '').replace(',', '.')) || 0;
          const comparison = priceA - priceB;
          return sortOrder === 'asc' ? comparison : -comparison;
        }
      }),
      sampleImage: products[0]?.imagem1 || ''
    }));

    setSubcategoryGroups(groups);
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

  const getProductImages = (product: Product) => {
    return [product.imagem1, product.imagem2, product.imagem3, product.imagem4, product.imagem5].filter(Boolean);
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
    if (tipo === 'subcategoria' && subcategoria) {
      return subcategoria;
    }
    return categoria ? `${categoria}` : 'Produtos';
  };

  const getSubtitle = () => {
    if (tipo === 'mais-vendidos') {
      return 'Os produtos favoritos dos nossos clientes';
    }
    if (tipo === 'subcategoria' && subcategoria) {
      return `Produtos em ${categoria} > ${subcategoria}`;
    }
    return `Explore todas as subcategorias de ${categoria}`;
  };

  const getBackPath = () => {
    if (tipo === 'subcategoria') {
      return `/categoria-lista?categoria=${encodeURIComponent(categoria)}&tipo=categoria`;
    }
    return '/categorias';
  };

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setIsDetailModalOpen(true);
  };

  const handleSubcategoryClick = (subcategoriaName: string) => {
    navigate(`/categoria-lista?categoria=${encodeURIComponent(categoria)}&subcategoria=${encodeURIComponent(subcategoriaName)}&tipo=subcategoria`);
  };

  const getCategoryGradient = (index: number) => {
    const gradients = [
      'from-pink-500 via-purple-500 to-red-500',
      'from-blue-500 via-cyan-500 to-purple-500',
      'from-green-500 via-emerald-500 to-teal-500',
      'from-yellow-500 via-orange-500 to-red-500',
      'from-purple-500 via-pink-500 to-rose-500',
      'from-indigo-500 via-blue-500 to-cyan-500',
      'from-red-500 via-orange-500 to-yellow-500',
      'from-teal-500 via-green-500 to-emerald-500',
      'from-rose-500 via-pink-500 to-purple-500',
      'from-amber-500 via-yellow-500 to-orange-500'
    ];
    return gradients[index % gradients.length];
  };

  const renderProductCard = (product: Product, index: number) => (
    <ProductCard 
      key={product.id} 
      product={product} 
      showBadge={tipo === 'mais-vendidos' && index < 3}
      badgeText={`TOP ${index + 1}`}
      compact={true}
    />
  );

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

              {/* Controles de visualização e filtros - apenas para lista de subcategoria */}
              {(tipo === 'subcategoria' || tipo === 'mais-vendidos') && (
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
              )}
            </div>
          </div>

          {/* Content */}
          <div className="container mx-auto py-4 sm:py-6 px-2 sm:px-4">
            {tipo === 'categoria' && !subcategoria ? (
              // Enhanced subcategories grid
              <div className="space-y-6">
                <div className="text-center">
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                    Subcategorias
                  </h2>
                  <p className="text-gray-600 mb-6">
                    Encontre exatamente o que procura em {subcategoryGroups.length} subcategorias
                  </p>
                </div>
                
                {subcategoryGroups.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gray-200 rounded-3xl flex items-center justify-center mx-auto mb-6">
                      <ShoppingCart className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400" />
                    </div>
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
                      Nenhuma subcategoria encontrada
                    </h2>
                    <p className="text-gray-600">
                      Esta categoria ainda não possui subcategorias
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
                    {subcategoryGroups.map((group, index) => (
                      <SubcategoryCard
                        key={group.subcategoria}
                        subcategoria={group.subcategoria}
                        productCount={group.products.length}
                        sampleImage={group.sampleImage}
                        gradient={getCategoryGradient(index)}
                        onClick={() => handleSubcategoryClick(group.subcategoria)}
                      />
                    ))}
                  </div>
                )}
              </div>
            ) : (
              // Show filtered products grid only
              <>
                {filteredProducts.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gray-200 rounded-3xl flex items-center justify-center mx-auto mb-6">
                      <ShoppingCart className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400" />
                    </div>
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
                      Nenhum produto encontrado
                    </h2>
                    <p className="text-gray-600">
                      Não há produtos disponíveis nesta {tipo === 'subcategoria' ? 'subcategoria' : 'categoria'}
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
                    {filteredProducts.map((product, index) => renderProductCard(product, index))}
                  </div>
                )}
              </>
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
