
import { useState, useEffect } from 'react';
import { ArrowLeft, ShoppingBag, TrendingUp } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Header from '@/components/Header';
import { ProductGrid } from '@/components/ProductGrid';
import { useMostPurchased } from '@/hooks/useMostPurchased';
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from 'react-router-dom';

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

const MaisComprados = () => {
  const navigate = useNavigate();
  const { products: mostPurchased, loading: loadingStats } = useMostPurchased(50);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchProducts();
  }, [mostPurchased]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      
      if (mostPurchased.length === 0) {
        // Se não há estatísticas, buscar produtos aleatórios
        const { data, error } = await (supabase as any)
          .from('MUNDODODIREITO')
          .select('*')
          .limit(50);

        if (error) throw error;
        setProducts(data || []);
      } else {
        // Buscar produtos baseados nas estatísticas
        const productIds = mostPurchased.map(p => p.product_id);
        const { data, error } = await (supabase as any)
          .from('MUNDODODIREITO')
          .select('*')
          .in('id', productIds)
          .order('id');

        if (error) throw error;
        
        // Ordenar produtos pela quantidade de compras
        const sortedProducts = (data || []).sort((a: Product, b: Product) => {
          const aPurchases = mostPurchased.find(p => p.product_id === a.id)?.purchase_count || 0;
          const bPurchases = mostPurchased.find(p => p.product_id === b.id)?.purchase_count || 0;
          return bPurchases - aPurchases;
        });
        
        setProducts(sortedProducts);
      }
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const handlePriceFilter = (min: number, max: number) => {
    // Implementar filtro de preço se necessário
  };

  const filteredProducts = products.filter(product =>
    product.produto.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getPurchaseCount = (productId: number) => {
    return mostPurchased.find(p => p.product_id === productId)?.purchase_count || 0;
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
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-amber-500/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                <TrendingUp className="w-6 h-6 text-amber-300" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-white animate-slide-in-left">
                  📈 Mais Comprados
                </h1>
                <p className="text-white/80 animate-slide-in-right">
                  Os materiais jurídicos preferidos da comunidade
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        {!loadingStats && mostPurchased.length > 0 && (
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-8 animate-fade-in">
            <div className="flex items-center gap-3 mb-4">
              <ShoppingBag className="w-5 h-5 text-amber-300" />
              <h2 className="text-xl font-bold text-white">Estatísticas dos Últimos 30 Dias</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white/5 rounded-xl p-4">
                <div className="text-2xl font-bold text-amber-300">
                  {mostPurchased.reduce((acc, p) => acc + p.purchase_count, 0)}
                </div>
                <div className="text-white/70 text-sm">Total de Compras</div>
              </div>
              <div className="bg-white/5 rounded-xl p-4">
                <div className="text-2xl font-bold text-green-300">
                  {mostPurchased.length}
                </div>
                <div className="text-white/70 text-sm">Produtos Únicos Comprados</div>
              </div>
              <div className="bg-white/5 rounded-xl p-4">
                <div className="text-2xl font-bold text-blue-300">
                  {Math.max(...mostPurchased.map(p => p.purchase_count))}
                </div>
                <div className="text-white/70 text-sm">Maior Nº de Compras</div>
              </div>
            </div>
          </div>
        )}

        {/* Search Info */}
        {searchTerm && (
          <div className="mb-4">
            <Badge variant="secondary" className="bg-purple-500/20 text-purple-200 border-purple-400/30">
              Busca: {searchTerm} ({filteredProducts.length} resultados)
            </Badge>
          </div>
        )}

        {/* Products Grid */}
        <ProductGrid 
          products={filteredProducts.map(product => ({
            ...product,
            purchaseCount: getPurchaseCount(product.id)
          }))} 
          loading={loading}
          compact={false}
        />
        
        {/* Empty State */}
        {!loading && filteredProducts.length === 0 && (
          <div className="text-center py-16 animate-fade-in">
            <div className="w-32 h-32 bg-white/20 rounded-3xl flex items-center justify-center mx-auto mb-6 backdrop-blur-sm animate-pulse">
              <TrendingUp className="w-16 h-16 text-white/50" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">
              {searchTerm ? `Nenhum resultado para "${searchTerm}"` : 'Nenhum dado disponível ainda'}
            </h2>
            <p className="text-white/80 mb-6">
              {searchTerm 
                ? 'Tente buscar por outros termos' 
                : 'As estatísticas aparecerão conforme os produtos forem sendo comprados'
              }
            </p>
            {searchTerm && (
              <Button 
                onClick={() => setSearchTerm('')} 
                className="bg-white text-blue-900 hover:bg-gray-100 font-semibold transition-all duration-300 hover:scale-105"
              >
                Ver Todos os Produtos
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MaisComprados;
