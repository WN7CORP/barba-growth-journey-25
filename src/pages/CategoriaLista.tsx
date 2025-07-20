
import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Grid, List, SortAsc, DollarSign } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Header from '@/components/Header';
import { ProductGrid } from '@/components/ProductGrid';
import { supabase } from "@/integrations/supabase/client";
import { useMostPurchased } from '@/hooks/useMostPurchased';

interface Product {
  id: number;
  produto: string;
  valor: string;
  imagem1: string;
  imagem2?: string;
  imagem3?: string;
  imagem4?: string;
  imagem5?: string;
  categoria: string;
  descricao?: string;
  link: string;
}

const CategoriaLista = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const categoria = searchParams.get('categoria');
  const tipo = searchParams.get('tipo');
  const viewParam = searchParams.get('view');
  
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'nome' | 'preco'>('nome');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  // Default para lista compacta quando vem de categorias
  const [viewMode, setViewMode] = useState<'grid' | 'list'>(viewParam === 'grid' ? 'grid' : 'list');
  
  const { data: mostPurchased } = useMostPurchased(100);

  useEffect(() => {
    fetchProducts();
  }, [categoria, tipo]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      if (tipo === 'mais-vendidos' || tipo === 'mais-comprados') {
        // Get most purchased products
        if (mostPurchased && mostPurchased.length > 0) {
          const productIds = mostPurchased.map(p => p.product_id);
          
          const { data, error } = await supabase
            .from('MUNDODODIREITO')
            .select('*')
            .in('id', productIds);

          if (error) throw error;
          
          // Sort by purchase count
          const sortedProducts = (data || []).sort((a: Product, b: Product) => {
            const aPurchases = mostPurchased.find(p => p.product_id === a.id)?.purchase_count || 0;
            const bPurchases = mostPurchased.find(p => p.product_id === b.id)?.purchase_count || 0;
            return bPurchases - aPurchases;
          });
          
          setProducts(sortedProducts);
        } else {
          const { data, error } = await supabase
            .from('MUNDODODIREITO')
            .select('*')
            .limit(50);

          if (error) throw error;
          setProducts(data || []);
        }
      } else {
        // Regular category filtering - sempre usar MUNDODODIREITO
        let query = supabase.from('MUNDODODIREITO').select('*');
        
        if (categoria && categoria !== 'todas') {
          query = query.eq('categoria', categoria);
        }
        
        const { data, error } = await query.order('id');
        
        if (error) throw error;
        
        console.log('Produtos encontrados para categoria', categoria, ':', data?.length);
        console.log('Primeiros produtos:', data?.slice(0, 3));
        
        setProducts(data || []);
      }
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
    } finally {
      setLoading(false);
    }
  };

  const parsePrice = (priceString: string): number => {
    if (!priceString) return 0;
    const cleanPrice = priceString.replace(/[^\d,]/g, '').replace(',', '.');
    return parseFloat(cleanPrice) || 0;
  };

  const sortProducts = () => {
    const sorted = [...products].sort((a, b) => {
      if (sortBy === 'nome') {
        const comparison = a.produto.localeCompare(b.produto);
        return sortOrder === 'asc' ? comparison : -comparison;
      } else {
        const priceA = parsePrice(a.valor);
        const priceB = parsePrice(b.valor);
        const comparison = priceA - priceB;
        return sortOrder === 'asc' ? comparison : -comparison;
      }
    });
    setProducts(sorted);
  };

  useEffect(() => {
    if (products.length > 0) {
      sortProducts();
    }
  }, [sortBy, sortOrder]);

  const getPageTitle = () => {
    if (tipo === 'mais-vendidos' || tipo === 'mais-comprados') {
      return '📈 Materiais Mais Comprados';
    }
    
    if (categoria && categoria !== 'todas') {
      return `📚 ${categoria}`;
    }
    
    return '📚 Todos os Materiais Jurídicos';
  };

  const getPageDescription = () => {
    if (tipo === 'mais-vendidos' || tipo === 'mais-comprados') {
      return `Os ${products.length} materiais mais procurados pelos profissionais`;
    }
    
    if (categoria && categoria !== 'todas') {
      return `${products.length} materiais disponíveis em ${categoria}`;
    }
    
    return `${products.length} materiais jurídicos disponíveis`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 pb-20">
        <Header onSearch={() => {}} onPriceFilter={() => {}} />
        <div className="max-w-screen-xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-6 sm:py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-32 bg-white/20 rounded-2xl animate-shimmer"></div>
            <ProductGrid loading={true} products={[]} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 pb-20">
      <Header onSearch={() => {}} onPriceFilter={() => {}} />
      
      <div className="max-w-screen-xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header */}
        <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8 animate-fade-in">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate('/categorias')} 
            className="text-white hover:bg-white/20 rounded-xl transition-all duration-300 hover:scale-105 min-h-[44px] px-3"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Voltar</span>
          </Button>
          <div className="flex-1 min-w-0">
            <h1 className="text-xl sm:text-2xl md:text-4xl font-bold text-white animate-slide-in-left truncate">
              {getPageTitle()}
            </h1>
            <p className="text-white/80 animate-slide-in-right text-xs sm:text-sm md:text-lg mt-1">
              {getPageDescription()}
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between mb-4 sm:mb-6 gap-2 sm:gap-4 animate-fade-in">
          <div className="flex items-center gap-1 sm:gap-2">
            <Button
              size="sm"
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              onClick={() => setViewMode('grid')}
              className={`min-h-[44px] min-w-[44px] px-2 sm:px-3 ${viewMode === 'grid' 
                ? 'bg-white text-blue-900' 
                : 'bg-white/20 text-white border-white/30 hover:bg-white/30'
              }`}
            >
              <Grid className="w-4 h-4" />
              <span className="hidden sm:inline ml-1">Grade</span>
            </Button>
            <Button
              size="sm"
              variant={viewMode === 'list' ? 'default' : 'outline'}
              onClick={() => setViewMode('list')}
              className={`min-h-[44px] min-w-[44px] px-2 sm:px-3 ${viewMode === 'list' 
                ? 'bg-white text-blue-900' 
                : 'bg-white/20 text-white border-white/30 hover:bg-white/30'
              }`}
            >
              <List className="w-4 h-4" />
              <span className="hidden sm:inline ml-1">Lista</span>
            </Button>
          </div>
          
          <div className="flex gap-1 sm:gap-2">
            <Select value={sortBy} onValueChange={(value: 'nome' | 'preco') => setSortBy(value)}>
              <SelectTrigger className="bg-white text-gray-900 border-0 w-24 sm:w-32 min-h-[44px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white border-gray-300 z-50">
                <SelectItem value="nome">
                  <div className="flex items-center gap-2">
                    <SortAsc className="w-4 h-4" />
                    Nome
                  </div>
                </SelectItem>
                <SelectItem value="preco">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4" />
                    Preço
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="bg-white text-gray-900 border-0 hover:bg-gray-100 transition-all duration-300 hover:scale-105 min-h-[44px] min-w-[44px]"
            >
              {sortOrder === 'asc' ? '↑' : '↓'}
            </Button>
          </div>
        </div>

        {/* Products Grid/List */}
        <ProductGrid 
          products={products} 
          compact={viewMode === 'grid'} 
          listView={viewMode === 'list'}
        />

        {products.length === 0 && (
          <div className="text-center py-16 animate-fade-in px-4">
            <div className="w-32 h-32 bg-white/20 rounded-3xl flex items-center justify-center mx-auto mb-6 backdrop-blur-sm animate-pulse">
              <div className="w-16 h-16 text-white/50">📦</div>
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">
              Nenhum produto encontrado
            </h2>
            <p className="text-white/80 mb-6">
              Não há produtos disponíveis nesta categoria no momento
            </p>
            <Button onClick={() => navigate('/categorias')} className="bg-white text-blue-600 hover:bg-gray-100 font-semibold transition-all duration-300 hover:scale-105 min-h-[44px]">
              Explorar Outras Categorias
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoriaLista;
