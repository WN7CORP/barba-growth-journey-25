
import { useState, useEffect, useMemo, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ArrowRight, TrendingUp, Star, Filter, Grid3X3, List } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import Header from '@/components/Header';
import { ProductCard } from '@/components/ProductCard';
import { ProductGrid } from '@/components/ProductGrid';
import { HeroSection } from '@/components/HeroSection';
import { CategoryCarousel } from '@/components/CategoryCarousel';
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
  descricao?: string;
}

const Index = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  // Estados principais
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('todas');
  const [sortBy, setSortBy] = useState<'relevancia' | 'preco' | 'nome'>('relevancia');
  const [priceFilter, setPriceFilter] = useState<{ min: number; max: number }>({ min: 0, max: 1000 });
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  // Estados derivados
  const [categories, setCategories] = useState<string[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [trendingProducts, setTrendingProducts] = useState<Product[]>([]);

  // Função para buscar produtos
  const fetchProducts = async () => {
    try {
      setLoading(true);
      
      // @ts-ignore - Bypass TypeScript para nome da tabela
      const { data, error } = await (supabase as any)
        .from('MUNDODODIREITO')
        .select('*')
        .order('id');

      if (error) throw error;
      
      // @ts-ignore - Bypass TypeScript para casting de dados
      const validProducts = (data || []).filter((product: any) => 
        product && product.produto && product.valor && product.imagem1
      ) as Product[];
      
      // Randomizar produtos
      const shuffledProducts = shuffleArray(validProducts);
      setProducts(shuffledProducts);
      
      // Definir produtos em destaque (primeiros 8)
      setFeaturedProducts(shuffledProducts.slice(0, 8));
      
      // Definir produtos em alta (próximos 8)
      setTrendingProducts(shuffledProducts.slice(8, 16));
      
      // Extrair categorias únicas
      const uniqueCategories = [...new Set(shuffledProducts.map(p => p.categoria).filter(Boolean))];
      setCategories(['todas', ...uniqueCategories]);
      
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
    } finally {
      setLoading(false);
    }
  };

  // Função para embaralhar array
  const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Função para formatar preço
  const parsePrice = (priceString: string): number => {
    const cleanPrice = priceString.replace(/[^\d,]/g, '').replace(',', '.');
    return parseFloat(cleanPrice) || 0;
  };

  // Produtos filtrados
  const filteredProducts = useMemo(() => {
    let filtered = products;

    // Filtro por categoria
    if (selectedCategory !== 'todas') {
      filtered = filtered.filter(product => product.categoria === selectedCategory);
    }

    // Filtro por busca
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(product => 
        product.produto.toLowerCase().includes(searchLower) ||
        product.categoria?.toLowerCase().includes(searchLower)
      );
    }

    // Filtro por preço
    filtered = filtered.filter(product => {
      const price = parsePrice(product.valor);
      return price >= priceFilter.min && price <= priceFilter.max;
    });

    // Ordenação
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'preco':
          return parsePrice(a.valor) - parsePrice(b.valor);
        case 'nome':
          return a.produto.localeCompare(b.produto);
        default:
          return 0; // Manter ordem original para relevância
      }
    });

    return filtered;
  }, [products, selectedCategory, searchTerm, priceFilter, sortBy]);

  // Handlers
  const handleSearch = useCallback((term: string) => {
    setSearchTerm(term);
  }, []);

  const handlePriceFilter = useCallback((min: number, max: number) => {
    setPriceFilter({ min, max });
  }, []);

  // Effects
  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    const categoryFromUrl = searchParams.get('categoria');
    if (categoryFromUrl) {
      setSelectedCategory(categoryFromUrl);
    }
  }, [searchParams]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header onSearch={handleSearch} onPriceFilter={handlePriceFilter} />
        <div className="container mx-auto px-4 py-8">
          <div className="space-y-8">
            <div className="skeleton h-48 w-full rounded-lg"></div>
            <ProductGrid loading={true} products={[]} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header onSearch={handleSearch} onPriceFilter={handlePriceFilter} />
      
      {/* Hero Section Redesenhado */}
      <section className="bg-gradient-to-br from-primary/5 via-accent/5 to-primary/10 py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-6 max-w-4xl mx-auto">
            <div className="space-y-3">
              <Badge className="bg-accent/10 text-accent border-accent/20 font-medium">
                ⚖️ Biblioteca Jurídica Premium
              </Badge>
              <h1 className="text-3xl md:text-5xl font-bold text-foreground leading-tight">
                Os Melhores <span className="text-gradient">Livros de Direito</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Encontre códigos, doutrinas e materiais jurídicos com os melhores preços do mercado
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Star className="w-4 h-4 text-accent fill-current" />
                <span className="font-medium">4.9/5</span>
                <span>• Mais de 10.000 produtos</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <TrendingUp className="w-4 h-4 text-success" />
                <span>Entrega rápida em todo Brasil</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categorias em Destaque */}
      <CategoryCarousel products={products} onProductClick={() => {}} />

      {/* Seção Principal de Produtos */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {/* Cabeçalho da seção */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                {searchTerm ? `Resultados para "${searchTerm}"` : 'Catálogo Completo'}
              </h2>
              <p className="text-muted-foreground mt-1">
                {filteredProducts.length} produtos encontrados
              </p>
            </div>

            {/* Controles de visualização e filtros */}
            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
              {/* Seletor de categoria */}
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Todas as categorias" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">Todas as categorias</SelectItem>
                  {categories.filter(cat => cat !== 'todas').map(category => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Ordenação */}
              <Select value={sortBy} onValueChange={(value: 'relevancia' | 'preco' | 'nome') => setSortBy(value)}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="relevancia">Relevância</SelectItem>
                  <SelectItem value="preco">Menor preço</SelectItem>
                  <SelectItem value="nome">A-Z</SelectItem>
                </SelectContent>
              </Select>

              {/* Modo de visualização */}
              <div className="flex border border-border rounded-lg p-1">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="px-3"
                >
                  <Grid3X3 className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="px-3"
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Grid de produtos */}
          {filteredProducts.length > 0 ? (
            <ProductGrid 
              products={filteredProducts.slice(0, 24)} 
              compact={viewMode === 'list'}
            />
          ) : (
            <div className="text-center py-16">
              <div className="space-y-4">
                <div className="text-4xl">📚</div>
                <h3 className="text-xl font-semibold text-foreground">
                  Nenhum produto encontrado
                </h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Tente ajustar os filtros ou fazer uma nova busca
                </p>
                <Button 
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('todas');
                    setPriceFilter({ min: 0, max: 1000 });
                  }}
                  className="mt-4"
                >
                  Limpar Filtros
                </Button>
              </div>
            </div>
          )}

          {/* Botão "Ver Mais" */}
          {filteredProducts.length > 24 && (
            <div className="text-center mt-8">
              <Button 
                variant="outline"
                onClick={() => navigate(`/categoria-lista?categoria=${selectedCategory}`)}
                className="px-8"
              >
                Ver mais produtos
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Seções de Destaque */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="featured" className="w-full">
            <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto mb-8">
              <TabsTrigger value="featured" className="flex items-center gap-2">
                <Star className="w-4 h-4" />
                Destaques
              </TabsTrigger>
              <TabsTrigger value="trending" className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Em Alta
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="featured" className="space-y-6">
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold text-foreground">
                  Produtos em Destaque
                </h2>
                <p className="text-muted-foreground">
                  Os livros mais recomendados pelos profissionais
                </p>
              </div>
              <ProductGrid products={featuredProducts} compact={false} />
            </TabsContent>
            
            <TabsContent value="trending" className="space-y-6">
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold text-foreground">
                  Produtos em Alta
                </h2>
                <p className="text-muted-foreground">
                  Os mais procurados este mês
                </p>
              </div>
              <ProductGrid products={trendingProducts} compact={false} />
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-16 bg-gradient-to-r from-primary to-accent text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold">
              Construa sua Biblioteca Jurídica
            </h2>
            <p className="text-xl opacity-90">
              Milhares de advogados já escolheram nossos produtos. 
              Junte-se a eles e acelere sua carreira.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button 
                size="lg"
                variant="secondary"
                className="bg-white text-primary hover:bg-white/90 font-semibold"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              >
                Explorar Catálogo
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
