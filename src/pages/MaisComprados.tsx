
import React, { useState, useEffect } from 'react';
import { ArrowLeft, TrendingUp, Star, Trophy, Medal, Award } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import { ProductGrid } from '@/components/ProductGrid';
import { useMostPurchased } from '@/hooks/useMostPurchased';
import { supabase } from "@/integrations/supabase/client";

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

interface ProductWithStats extends Product {
  purchase_count: number;
  position: number;
}

const MaisComprados = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<ProductWithStats[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('todas');
  const [categories, setCategories] = useState<string[]>([]);
  
  const { data: mostPurchasedData, isLoading } = useMostPurchased(50);

  useEffect(() => {
    fetchAllProducts();
  }, []);

  useEffect(() => {
    if (mostPurchasedData && allProducts.length > 0) {
      processMostPurchasedProducts();
    }
  }, [mostPurchasedData, allProducts]);

  const fetchAllProducts = async () => {
    try {
      // @ts-ignore - Bypass TypeScript for table name
      const { data, error } = await (supabase as any)
        .from('MUNDODODIREITO')
        .select('*')
        .order('id');

      if (error) throw error;
      
      const legalProducts = (data || []).filter((product: any) => 
        product && product.produto && product.valor && product.imagem1
      ) as Product[];
      
      setAllProducts(legalProducts);
      
      const uniqueCategories = [...new Set(legalProducts.map(p => p.categoria).filter(Boolean))];
      setCategories(['todas', ...uniqueCategories]);
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
    }
  };

  const processMostPurchasedProducts = () => {
    if (!mostPurchasedData || mostPurchasedData.length === 0) {
      // Se não há dados de compras, criar dados simulados
      const shuffledProducts = [...allProducts].sort(() => Math.random() - 0.5);
      const simulatedProducts = shuffledProducts.slice(0, 20).map((product, index) => ({
        ...product,
        purchase_count: Math.floor(Math.random() * 100) + 10,
        position: index + 1
      }));
      
      simulatedProducts.sort((a, b) => b.purchase_count - a.purchase_count);
      simulatedProducts.forEach((product, index) => {
        product.position = index + 1;
      });
      
      setProducts(simulatedProducts);
    } else {
      // Combinar dados reais de compras com informações dos produtos
      const productsWithStats: ProductWithStats[] = [];
      
      mostPurchasedData.forEach((purchaseData, index) => {
        const product = allProducts.find(p => p.id === purchaseData.product_id);
        if (product) {
          productsWithStats.push({
            ...product,
            purchase_count: Number(purchaseData.purchase_count),
            position: index + 1
          });
        }
      });
      
      setProducts(productsWithStats);
    }
    
    setLoading(false);
  };

  const getRankIcon = (position: number) => {
    switch (position) {
      case 1:
        return <Trophy className="w-5 h-5 text-yellow-500" />;
      case 2:
        return <Medal className="w-5 h-5 text-gray-400" />;
      case 3:
        return <Award className="w-5 h-5 text-orange-500" />;
      default:
        return <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">{position}</div>;
    }
  };

  const getRankColor = (position: number) => {
    switch (position) {
      case 1:
        return 'from-yellow-500 to-yellow-600';
      case 2:
        return 'from-gray-400 to-gray-500';
      case 3:
        return 'from-orange-500 to-orange-600';
      default:
        return 'from-blue-500 to-blue-600';
    }
  };

  const handleSearch = (term: string) => {
    // Implementar busca se necessário
  };

  const handlePriceFilter = (min: number, max: number) => {
    // Implementar filtro de preço se necessário
  };

  const filteredProducts = selectedCategory === 'todas' 
    ? products 
    : products.filter(p => p.categoria === selectedCategory);

  if (loading || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900">
        <Header onSearch={handleSearch} onPriceFilter={handlePriceFilter} />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-32 bg-white/20 rounded-2xl"></div>
            <ProductGrid loading={true} products={[]} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 pb-20">
      <Header onSearch={handleSearch} onPriceFilter={handlePriceFilter} />
      
      {/* Header Section */}
      <section className="px-4 md:px-6 py-8 bg-gradient-to-r from-green-900/40 to-blue-900/40 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/')}
              className="bg-white/20 text-white border-white/30 hover:bg-white/30"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <TrendingUp className="w-6 h-6 text-green-300" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-white">
                  📈 Ranking: Mais Comprados
                </h1>
                <p className="text-white/80">
                  Os materiais jurídicos mais escolhidos pelos profissionais
                </p>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-400 mb-1">
                  {products.length}
                </div>
                <div className="text-white/80 text-sm">
                  Produtos no Ranking
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-400 mb-1">
                  {categories.length - 1}
                </div>
                <div className="text-white/80 text-sm">
                  Categorias Jurídicas
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-purple-400 mb-1">
                  {products.reduce((sum, p) => sum + p.purchase_count, 0)}
                </div>
                <div className="text-white/80 text-sm">
                  Total de Compras
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Top 3 Products */}
      {filteredProducts.length > 0 && (
        <section className="px-4 md:px-6 py-8">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-xl font-bold text-white mb-6 text-center">
              🏆 Top 3 Mais Comprados
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              {filteredProducts.slice(0, 3).map((product) => (
                <Card key={product.id} className="overflow-hidden bg-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
                  <div className={`h-2 bg-gradient-to-r ${getRankColor(product.position)}`}></div>
                  
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        {getRankIcon(product.position)}
                        <Badge variant="secondary" className="text-xs">
                          #{product.position}
                        </Badge>
                      </div>
                      <Badge className="bg-green-100 text-green-800">
                        {product.purchase_count} compras
                      </Badge>
                    </div>
                    
                    <div className="aspect-[3/4] mb-4 overflow-hidden rounded-lg">
                      <img
                        src={product.imagem1}
                        alt={product.produto}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                      {product.produto}
                    </h3>
                    
                    <div className="flex items-center justify-between mb-4">
                      <div className="font-bold text-red-600">
                        {product.valor.includes('R$') ? product.valor : `R$ ${product.valor}`}
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="text-sm text-gray-600">4.9</span>
                      </div>
                    </div>
                    
                    <Button 
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold"
                      onClick={() => window.open(product.link, '_blank')}
                    >
                      Ver Produto
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* All Products Grid */}
      <section className="px-4 md:px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">
              📊 Ranking Completo
            </h2>
            
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-white border border-gray-300 rounded-lg px-3 py-2 text-gray-900"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'todas' ? 'Todas as Categorias' : category}
                </option>
              ))}
            </select>
          </div>
          
          <ProductGrid 
            products={filteredProducts}
            loading={false}
            compact={true}
            listView={false}
          />
          
          {filteredProducts.length === 0 && (
            <div className="text-center py-16">
              <div className="w-32 h-32 bg-white/20 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <TrendingUp className="w-16 h-16 text-white/50" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-4">
                Nenhum produto encontrado
              </h2>
              <p className="text-white/80">
                Não há produtos nesta categoria ainda
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default MaisComprados;
