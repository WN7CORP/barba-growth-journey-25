
import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, Filter } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Header from '@/components/Header';
import { ProductGrid } from '@/components/ProductGrid';
import { PriceFilter } from '@/components/PriceFilter';
import { supabase } from "@/integrations/supabase/client";
import { useToastNotifications } from '@/hooks/useToastNotifications';

interface Product {
  id: number;
  produto: string;
  valor: string;
  imagem1: string;
  imagem2: string;
  imagem3: string;
  imagem4: string;
  imagem5: string;
  link: string;
  categoria: string;
  descricao?: string;
}

const CategoriaLista = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [showPriceFilter, setShowPriceFilter] = useState(false);
  const { showError } = useToastNotifications();

  const categoria = searchParams.get('categoria') || '';
  const tipo = searchParams.get('tipo') || '';

  useEffect(() => {
    if (categoria) {
      fetchProducts();
    }
  }, [categoria]);

  useEffect(() => {
    filterProducts();
  }, [products, searchTerm, priceRange]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await (supabase as any)
        .from('MUNDODODIREITO')
        .select('*')
        .eq('categoria', categoria)
        .order('id', { ascending: false });

      if (error) throw error;
      
      setProducts(data || []);
      
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
      showError('Erro ao carregar produtos');
    } finally {
      setLoading(false);
    }
  };

  const filterProducts = () => {
    let filtered = [...products];

    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.produto.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    filtered = filtered.filter(product => {
      const price = parseFloat(product.valor?.replace(/[R$\s]/g, '') || '0');
      return price >= priceRange[0] && price <= priceRange[1];
    });

    setFilteredProducts(filtered);
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const handlePriceFilter = (minPrice: number, maxPrice: number) => {
    setPriceRange([minPrice, maxPrice]);
  };

  const handlePriceFilterClear = () => {
    setPriceRange([0, 1000]);
  };

  const getCategoryTitle = () => {
    if (tipo === 'categoria') {
      return `📚 ${categoria}`;
    } else if (tipo === 'subcategoria') {
      return `📖 ${categoria}`;
    }
    return categoria;
  };

  const getCategoryDescription = () => {
    const count = filteredProducts.length;
    if (tipo === 'categoria') {
      return `${count} materiais encontrados nesta categoria`;
    } else if (tipo === 'subcategoria') {
      return `${count} itens encontrados nesta subcategoria`;
    }
    return `${count} produtos encontrados`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 pb-20">
      <Header onSearch={handleSearch} onPriceFilter={handlePriceFilter} />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8 animate-fade-in">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate(-1)} 
            className="text-white hover:bg-white/20 rounded-xl transition-all duration-300 hover:scale-105"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl md:text-4xl font-bold text-white animate-slide-in-left">
              {getCategoryTitle()}
            </h1>
            <p className="text-white/80 animate-slide-in-right">
              {getCategoryDescription()}
            </p>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-8 animate-fade-in">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-5 h-5" />
              <Input
                placeholder="Buscar produtos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/20 border-white/30 text-white placeholder-white/60 focus:border-purple-400"
              />
            </div>
            <Button
              variant="outline"
              onClick={() => setShowPriceFilter(!showPriceFilter)}
              className="bg-white/20 border-white/30 text-white hover:bg-white/30"
            >
              <Filter className="w-4 h-4 mr-2" />
              Filtros
            </Button>
          </div>

          {showPriceFilter && (
            <div className="mt-4 animate-fade-in">
              <PriceFilter
                onFilter={handlePriceFilter}
                onClear={handlePriceFilterClear}
              />
            </div>
          )}

          {/* Active Filters */}
          {(searchTerm || priceRange[0] > 0 || priceRange[1] < 1000) && (
            <div className="flex flex-wrap gap-2 mt-4">
              {searchTerm && (
                <Badge 
                  variant="secondary" 
                  className="bg-purple-500/20 text-purple-200 border-purple-400/30"
                >
                  Busca: {searchTerm}
                </Badge>
              )}
              {(priceRange[0] > 0 || priceRange[1] < 1000) && (
                <Badge 
                  variant="secondary" 
                  className="bg-green-500/20 text-green-200 border-green-400/30"
                >
                  Preço: R$ {priceRange[0]} - R$ {priceRange[1]}
                </Badge>
              )}
            </div>
          )}
        </div>

        {/* Products Grid - forced to list view */}
        <ProductGrid 
          products={filteredProducts} 
          loading={loading}
          compact={false}
        />
        
        {/* Custom empty state when no products found */}
        {!loading && filteredProducts.length === 0 && (
          <div className="text-center py-16 animate-fade-in">
            <div className="w-32 h-32 bg-white/20 rounded-3xl flex items-center justify-center mx-auto mb-6 backdrop-blur-sm animate-pulse">
              <div className="w-16 h-16 text-white/50">📦</div>
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">
              Nenhum produto encontrado{searchTerm ? ` para "${searchTerm}"` : ''}
            </h2>
            <p className="text-white/80">
              Tente ajustar os filtros ou buscar por outros termos
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoriaLista;
