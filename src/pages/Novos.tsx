
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Calendar, Star, Sparkles } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import { ProductGrid } from '@/components/ProductGrid';
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

const Novos = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('todas');
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      // @ts-ignore - Bypass TypeScript for table name
      const { data, error } = await (supabase as any)
        .from('MUNDODODIREITO')
        .select('*')
        .order('id', { ascending: false }); // Ordenar por ID decrescente para pegar os mais recentes

      if (error) throw error;
      
      const legalProducts = (data || []).filter((product: any) => 
        product && product.produto && product.valor && product.imagem1
      ) as Product[];
      
      // Simular "novos produtos" pegando uma amostra aleatória
      const shuffledProducts = [...legalProducts].sort(() => Math.random() - 0.5);
      const newProducts = shuffledProducts.slice(0, 30); // Pegar 30 produtos "novos"
      
      setProducts(newProducts);
      
      const uniqueCategories = [...new Set(legalProducts.map(p => p.categoria).filter(Boolean))];
      setCategories(['todas', ...uniqueCategories]);
    } catch (error) {
      console.error('Erro ao buscar produtos novos:', error);
    } finally {
      setLoading(false);
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

  if (loading) {
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
      <section className="px-4 md:px-6 py-8 bg-gradient-to-r from-purple-900/40 to-blue-900/40 backdrop-blur-sm">
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
              <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <Sparkles className="w-6 h-6 text-purple-300" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-white">
                  ✨ Novidades Jurídicas
                </h1>
                <p className="text-white/80">
                  Os materiais mais recentes para sua biblioteca
                </p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold text-purple-400 mb-2">
                  {products.length}
                </div>
                <div className="text-white/80">
                  Novos Materiais
                </div>
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-400 mb-2">
                  {categories.length - 1}
                </div>
                <div className="text-white/80">
                  Áreas do Direito
                </div>
              </div>
              <div>
                <div className="text-3xl font-bold text-green-400 mb-2">
                  100%
                </div>
                <div className="text-white/80">
                  Conteúdo Atualizado
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="px-4 md:px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-white" />
              <h2 className="text-xl font-bold text-white">
                Lançamentos Recentes
              </h2>
            </div>
            
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-white border border-gray-300 rounded-lg px-3 py-2 text-gray-900"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'todas' ? 'Todas as Áreas' : category}
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
                <Sparkles className="w-16 h-16 text-white/50" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-4">
                Nenhum produto encontrado
              </h2>
              <p className="text-white/80">
                Não há novos produtos nesta categoria
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="px-4 md:px-6 py-12 bg-gradient-to-r from-purple-800/50 to-blue-800/50 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto text-center">
          <div className="w-16 h-16 bg-purple-500/20 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <Star className="w-8 h-8 text-purple-300" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Sempre em Atualização!
          </h2>
          <p className="text-white/80 text-lg mb-6 max-w-2xl mx-auto">
            Nossa biblioteca é constantemente atualizada com os materiais mais recentes 
            e relevantes para sua carreira jurídica.
          </p>
          <Button 
            size="lg"
            onClick={() => navigate('/')}
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-8 py-3 text-lg"
          >
            Explorar Mais Materiais
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Novos;
