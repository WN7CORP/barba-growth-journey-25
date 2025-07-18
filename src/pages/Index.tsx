import { useState, useEffect, useMemo, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ArrowRight, ShoppingCart, SortAsc, DollarSign, Scale, Gavel, BookOpen, GraduationCap, Briefcase } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Header from '@/components/Header';
import { SearchPreview } from '@/components/SearchPreview';
import { CategoryCarousel } from '@/components/CategoryCarousel';
import { ProductSelector } from '@/components/ProductSelector';
import { AIAnalysisModal } from '@/components/AIAnalysisModal';
import { HeroSection } from '@/components/HeroSection';
import { TabNavigation } from '@/components/TabNavigation';
import { ProductCard } from '@/components/ProductCard';
import { ProductGrid } from '@/components/ProductGrid';
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
  const categoryFromUrl = searchParams.get('categoria');
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [currentFeaturedCategory, setCurrentFeaturedCategory] = useState<string>('');
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>(categoryFromUrl || 'todas');
  const [displayedProducts, setDisplayedProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'nome' | 'preco'>('nome');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [showingAI, setShowingAI] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
  const [showAnalysisModal, setShowAnalysisModal] = useState(false);
  const [questionnaireAnswers, setQuestionnaireAnswers] = useState<Record<string, string>>({});
  const [priceFilter, setPriceFilter] = useState<{ min: number; max: number }>({ min: 0, max: 1000 });
  const [legalCategories, setLegalCategories] = useState<string[]>([]);

  const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const parsePrice = (priceString: string): number => {
    const cleanPrice = priceString.replace(/[^\d,]/g, '').replace(',', '.');
    return parseFloat(cleanPrice) || 0;
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (categoryFromUrl) {
      setSelectedCategory(categoryFromUrl);
    }
  }, [categoryFromUrl]);

  useEffect(() => {
    filterProducts();
  }, [selectedCategory, filteredProducts, searchTerm, sortBy, sortOrder]);

  useEffect(() => {
    applyPriceFilter();
  }, [products, priceFilter]);

  useEffect(() => {
    if (legalCategories.length > 0 && products.length > 0 && !categoryFromUrl) {
      const interval = setInterval(() => {
        const randomCategory = legalCategories[Math.floor(Math.random() * legalCategories.length)];
        setCurrentFeaturedCategory(randomCategory);
        
        const categoryProducts = products.filter(p => p.categoria && legalCategories.includes(p.categoria));
        const shuffledProducts = shuffleArray(categoryProducts);
        setFeaturedProducts(shuffledProducts.slice(0, 8));
      }, 15000);

      return () => clearInterval(interval);
    }
  }, [legalCategories, products, categoryFromUrl]);

  const fetchProducts = async () => {
    try {
      // @ts-ignore - Bypass TypeScript for table name
      const { data, error } = await (supabase as any)
        .from('MUNDODODIREITO')
        .select('*')
        .order('id');

      if (error) throw error;
      
      console.log('Produtos recebidos da API:', data);
      
      // @ts-ignore - Bypass TypeScript for data casting
      const legalProducts = (data || []).filter((product: any) => 
        product && product.produto && product.valor && product.imagem1
      ) as Product[];
      
      let processedProducts = shuffleArray(legalProducts);
      
      setProducts(processedProducts);
      
      const initialFeatured = shuffleArray(processedProducts).slice(0, 8);
      setFeaturedProducts(initialFeatured);

      const uniqueCategories = [...new Set(legalProducts.map(p => p.categoria).filter(Boolean))];
      setCategories(['todas', ...uniqueCategories]);

      setLegalCategories(uniqueCategories);
      
      if (legalCategories.length > 0) {
        setCurrentFeaturedCategory('Destaques Jurídicos');
      }
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyPriceFilter = () => {
    const filtered = products.filter(product => {
      const price = parsePrice(product.valor);
      return price >= priceFilter.min && price <= priceFilter.max;
    });
    setFilteredProducts(filtered);
  };

  const filterProducts = () => {
    let filtered = filteredProducts;

    if (selectedCategory !== 'todas') {
      filtered = filtered.filter(product => product.categoria === selectedCategory);
    }

    if (searchTerm.trim()) {
      filtered = filtered.filter(product => 
        product.produto.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    filtered.sort((a, b) => {
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

    setDisplayedProducts(filtered);
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const handlePriceFilter = (min: number, max: number) => {
    setPriceFilter({ min, max });
  };

  const handleProductClick = (productId: number) => {
    const productElement = document.getElementById(`product-${productId}`);
    if (productElement) {
      productElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setSearchTerm('');
    }
  };

  const handleTabChange = (tab: 'featured' | 'ai') => {
    setShowingAI(tab === 'ai');
  };

  const handleProductToggle = (product: Product) => {
    setSelectedProducts(prev => {
      const isSelected = prev.some(p => p.id === product.id);
      if (isSelected) {
        return prev.filter(p => p.id !== product.id);
      } else {
        if (prev.length >= 5) {
          return prev;
        }
        return [...prev, product];
      }
    });
  };

  const handleAnalyze = () => {
    if (selectedProducts.length > 0) {
      setShowAnalysisModal(true);
    }
  };

  const analyzeProducts = async (products: Product[]): Promise<string> => {
    try {
      const { data, error } = await supabase.functions.invoke('analyze-products', {
        body: { 
          products,
          userPreferences: questionnaireAnswers
        }
      });

      if (error) {
        console.error('Error calling analyze-products function:', error);
        throw new Error(error.message || 'Erro ao analisar produtos');
      }

      return data.analysis || 'Análise não disponível';
    } catch (error) {
      console.error('Error in analyzeProducts:', error);
      throw error;
    }
  };

  const getCategoryIcon = (category: string) => {
    const iconMap: Record<string, React.ComponentType<any>> = {
      'Direito Penal': Scale,
      'Códigos': BookOpen,
      'Vade Mecum': BookOpen,
      'Direito Constitucional': Gavel,
      'Direito Civil': Briefcase,
      'Direito Processual': GraduationCap
    };
    return iconMap[category] || Scale;
  };

  const getCategoryProducts = (category: string, limit: number = 12) => {
    const categoryProducts = filteredProducts.filter(p => p.categoria === category);
    return shuffleArray(categoryProducts).slice(0, limit);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header onSearch={handleSearch} onPriceFilter={handlePriceFilter} />
        <div className="container-elegant py-12">
          <ProductGrid loading={true} products={[]} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header onSearch={handleSearch} onPriceFilter={handlePriceFilter} />
      
      {/* Search Preview */}
      {searchTerm && (
        <SearchPreview 
          searchTerm={searchTerm} 
          products={filteredProducts.filter(p => 
            p.produto.toLowerCase().includes(searchTerm.toLowerCase())
          ).slice(0, 5)} 
          onProductClick={handleProductClick}
        />
      )}

      {/* Category Carousel */}
      <CategoryCarousel 
        products={filteredProducts}
        onProductClick={handleProductClick}
      />
      
      {/* Quick Category Navigation */}
      <section className="border-b border-border bg-card/50">
        <div className="container-elegant py-4">
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            <Button
              size="sm"
              variant="outline"
              onClick={() => navigate('/categoria-lista?categoria=todas&tipo=categoria')}
              className="whitespace-nowrap bg-secondary hover:bg-secondary/80 border-border text-secondary-foreground"
            >
              <Scale className="w-4 h-4 mr-2" />
              Todas as Áreas
            </Button>
            {legalCategories.slice(0, 6).map(category => {
              const IconComponent = getCategoryIcon(category);
              return (
                <Button
                  key={category}
                  size="sm"
                  variant="outline"
                  onClick={() => navigate(`/categoria-lista?categoria=${encodeURIComponent(category)}&tipo=categoria`)}
                  className="whitespace-nowrap bg-secondary hover:bg-secondary/80 border-border text-secondary-foreground"
                >
                  <IconComponent className="w-4 h-4 mr-2" />
                  {category}
                </Button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Hero Section */}
      <HeroSection productsCount={filteredProducts.length} />

      {/* Category Product Sections */}
      {!showingAI && legalCategories.map((category, index) => {
        const categoryProducts = getCategoryProducts(category);
        const IconComponent = getCategoryIcon(category);
        
        if (categoryProducts.length === 0) return null;
        
        return (
          <section 
            key={category} 
            className="py-12 border-b border-border/50 last:border-b-0"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="container-elegant">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-accent/10 rounded-2xl flex items-center justify-center">
                    <IconComponent className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="text-display-sm font-display text-foreground">{category}</h3>
                    <p className="text-muted-foreground">{categoryProducts.length} livros disponíveis</p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  onClick={() => navigate(`/categoria-lista?categoria=${encodeURIComponent(category)}&tipo=categoria`)}
                  className="hover-gold"
                >
                  Ver Todos
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
              
              <Carousel className="w-full">
                <CarouselContent className="-ml-4">
                  {categoryProducts.map((product) => (
                    <CarouselItem 
                      key={product.id} 
                      className="pl-4 basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 xl:basis-1/6"
                    >
                      <ProductCard 
                        product={product} 
                        compact={true}
                      />
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="left-4 bg-card hover:bg-card/80 border-border shadow-card" />
                <CarouselNext className="right-4 bg-card hover:bg-card/80 border-border shadow-card" />
              </Carousel>
            </div>
          </section>
        );
      })}

      {/* Featured Products Section */}
      <section className="py-16 bg-gradient-to-br from-card to-secondary/30">
        <div className="container-elegant">
          <div className="text-center mb-12">
            <TabNavigation 
              showingAI={showingAI}
              onTabChange={handleTabChange}
            />
            
            {showingAI ? (
              <div className="max-w-2xl mx-auto space-y-4">
                <h2 className="text-display-md font-display text-foreground">
                  🤖 Consultor Jurídico IA
                </h2>
                <div className="text-muted-foreground space-y-2">
                  <p><strong>Selecione até 5 produtos</strong> e nossa <strong>IA especializada</strong> irá recomendar o melhor para sua carreira jurídica</p>
                  <p className="text-sm">✨ <em>Análise personalizada baseada em sua área de atuação</em></p>
                </div>
              </div>
            ) : (
              <div className="max-w-2xl mx-auto space-y-4">
                <h2 className="text-display-md font-display text-foreground">
                  📚 Mais Procurados pelos Juristas
                </h2>
                <p className="text-muted-foreground">
                  {currentFeaturedCategory && currentFeaturedCategory !== 'Destaques Jurídicos' 
                    ? `Os favoritos em ${currentFeaturedCategory}` 
                    : 'Os materiais mais utilizados pelos profissionais do direito'}
                </p>
              </div>
            )}
          </div>

          {showingAI ? (
            <>
              <div className="max-w-md mx-auto mb-8">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="bg-card border-border">
                    <SelectValue placeholder="Selecione uma área do direito" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    <SelectItem value="todas">Todas as Áreas</SelectItem>
                    {legalCategories.map(category => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <ProductSelector
                products={displayedProducts}
                selectedProducts={selectedProducts}
                onProductToggle={handleProductToggle}
                onAnalyze={handleAnalyze}
                onQuestionnaireChange={setQuestionnaireAnswers}
              />
            </>
          ) : (
            <>
              <Carousel className="w-full mb-8">
                <CarouselContent className="-ml-6">
                  {featuredProducts.map((product, index) => (
                    <CarouselItem 
                      key={product.id} 
                      className="pl-6 basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <ProductCard 
                        product={product} 
                        showBadge={true}
                        badgeText="DESTAQUE"
                        featured={true}
                        compact={false}
                      />
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="left-4 bg-card hover:bg-card/80 border-border shadow-card" />
                <CarouselNext className="right-4 bg-card hover:bg-card/80 border-border shadow-card" />
              </Carousel>
              
              <div className="text-center">
                <Button 
                  onClick={() => navigate('/categoria-lista?tipo=mais-vendidos')}
                  className="btn-accent shadow-lg hover:shadow-xl"
                >
                  Ver Mais Materiais Jurídicos
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Products Grid Section */}
      {!showingAI && (
        <section className="py-16">
          <div className="container-elegant">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-display-md font-display text-foreground mb-2">
                  Explorar Biblioteca Jurídica
                </h2>
                <p className="text-muted-foreground">
                  {searchTerm ? `Resultados para "${searchTerm}"` : 'Navegue por nossa coleção especializada em direito'}
                </p>
              </div>
              
              <div className="flex gap-2">
                <Select value={sortBy} onValueChange={(value: 'nome' | 'preco') => setSortBy(value)}>
                  <SelectTrigger className="bg-card border-border w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
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
                  className="hover-gold"
                >
                  {sortOrder === 'asc' ? '↑' : '↓'}
                </Button>
              </div>
            </div>

            <div className="max-w-md mx-auto mb-8">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="bg-card border-border">
                  <SelectValue placeholder="Selecione uma área do direito" />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  <SelectItem value="todas">Todas as Áreas do Direito</SelectItem>
                  {legalCategories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <ProductGrid products={displayedProducts.slice(0, 24)} compact={true} />

            {displayedProducts.length > 24 && (
              <div className="text-center mt-12">
                <Button 
                  onClick={() => navigate(`/categoria-lista?categoria=${selectedCategory}&tipo=categoria`)}
                  className="btn-accent shadow-lg hover:shadow-xl"
                >
                  Ver Todos os {displayedProducts.length} Materiais
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            )}
          </div>
        </section>
      )}

      {/* CTA Section */}
      {!showingAI && (
        <section className="py-20 premium-gradient text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="container-elegant relative z-10">
            <div className="max-w-3xl mx-auto text-center space-y-8">
              <div className="w-20 h-20 bg-gold/20 rounded-3xl flex items-center justify-center mx-auto">
                <Scale className="w-10 h-10 text-gold" />
              </div>
              <h2 className="text-display-lg font-display text-balance">
                Fortaleça sua Carreira Jurídica!
              </h2>
              <p className="text-lg text-white/90 max-w-2xl mx-auto leading-relaxed">
                Descubra os melhores materiais jurídicos com preços especiais para advogados, estudantes e operadores do direito
              </p>
              <Button 
                size="lg" 
                className="btn-gold text-lg py-6 px-8 shadow-2xl hover:shadow-3xl hover-lift" 
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              >
                Explorar Biblioteca Jurídica
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* AI Analysis Modal */}
      <AIAnalysisModal
        isOpen={showAnalysisModal}
        onClose={() => setShowAnalysisModal(false)}
        selectedProducts={selectedProducts}
        onAnalyze={analyzeProducts}
      />
    </div>
  );
};

export default Index;
