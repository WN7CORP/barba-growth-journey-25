
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

  // Categorias carregadas dinamicamente da base de dados
  const [legalCategories, setLegalCategories] = useState<string[]>([]);

  // Function to shuffle array - sempre randomizar
  const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Parse price from string to number
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

  // Apply price filter whenever priceFilter changes
  useEffect(() => {
    applyPriceFilter();
  }, [products, priceFilter]);

  // Auto-rotate featured products by category every 15 seconds - only when not viewing specific category
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
      
      // SEMPRE randomizar produtos a cada carregamento
      let processedProducts = shuffleArray(legalProducts);
      
      setProducts(processedProducts);
      
      // Set initial featured products (first 8 randomizados)
      const initialFeatured = shuffleArray(processedProducts).slice(0, 8);
      setFeaturedProducts(initialFeatured);

      // Buscar categorias reais da base de dados
      const uniqueCategories = [...new Set(legalProducts.map(p => p.categoria).filter(Boolean))];
      setCategories(['todas', ...uniqueCategories]);

      setLegalCategories(uniqueCategories);
      
      // Set initial featured category
      if (legalCategories.length > 0) {
        setCurrentFeaturedCategory('Destaques Jurídicos');
      }
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
    } finally {
      setLoading(false);
    }
  };

  const mapToLegalCategory = (originalCategory: string): string => {
    const categoryMap: Record<string, string> = {
      'Beleza e Cuidados Pessoais': 'Vestimentas Jurídicas',
      'Casa e Decoração': 'Acessórios Profissionais',
      'Diversão e Familia': 'Cursos e Preparatórios',
      'Estilo e Moda': 'Vestimentas Jurídicas',
      'Tecnologia e Acessórios': 'Materiais de Estudo'
    };

    // Se contém palavras relacionadas a livros/estudos
    if (originalCategory.toLowerCase().includes('book') || 
        originalCategory.toLowerCase().includes('livro') ||
        originalCategory.toLowerCase().includes('estudo')) {
      return 'Livros de Direito';
    }

    return categoryMap[originalCategory] || 'Livros de Direito';
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

    // Aplicar ordenação
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
      setSearchTerm(''); // Clear search to hide preview
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
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 pb-20">
        <Header onSearch={handleSearch} onPriceFilter={handlePriceFilter} />
        <div className="container mx-auto px-4 py-8">
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

      {/* Novidades Carousel */}
      <CategoryCarousel 
        products={filteredProducts}
        onProductClick={handleProductClick}
      />
      
      {/* Category Quick Access Buttons */}
      <section className="px-4 py-2 animate-fade-in">
        <div className="max-w-7xl mx-auto">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            <Button
              size="sm"
              variant="outline"
              onClick={() => navigate('/categoria-lista?categoria=todas&tipo=categoria')}
              className="whitespace-nowrap transition-all duration-300 hover:scale-105 bg-white/20 text-white border-white/30 hover:bg-white/30 flex items-center gap-2"
            >
              <Scale className="w-4 h-4" />
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
                  className="whitespace-nowrap transition-all duration-300 hover:scale-105 bg-white/20 text-white border-white/30 hover:bg-white/30 flex items-center gap-2"
                >
                  <IconComponent className="w-4 h-4" />
                  {category}
                </Button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Hero Section */}
      <HeroSection productsCount={filteredProducts.length} />

      {/* Category Product Carousels - show all categories when not in AI mode */}
      {!showingAI && legalCategories.map((category, index) => {
        const categoryProducts = getCategoryProducts(category);
        const IconComponent = getCategoryIcon(category);
        
        if (categoryProducts.length === 0) return null;
        
        return (
          <section key={category} className="px-4 md:px-6 py-4 animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
            <div className="max-w-7xl mx-auto">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-purple-500/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                    <IconComponent className="w-4 h-4 text-purple-300" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">{category}</h3>
                    <p className="text-xs text-white/70">{categoryProducts.length} produtos disponíveis</p>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => navigate(`/categoria-lista?categoria=${encodeURIComponent(category)}&tipo=categoria`)}
                  className="bg-white/20 text-white border-white/30 hover:bg-white/30 text-xs px-3 py-1 h-auto"
                >
                  Ver Todos
                  <ArrowRight className="w-3 h-3 ml-1" />
                </Button>
              </div>
              
              <Carousel className="w-full">
                <CarouselContent className="-ml-2 md:-ml-3">
                  {categoryProducts.map((product) => (
                    <CarouselItem 
                      key={product.id} 
                      className="pl-2 md:pl-3 basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/6"
                    >
                      <ProductCard 
                        product={product} 
                        compact={true}
                      />
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="left-2 md:left-4 bg-white/90 hover:bg-white border-purple-200 w-6 h-6" />
                <CarouselNext className="right-2 md:right-4 bg-white/90 hover:bg-white border-purple-200 w-6 h-6" />
              </Carousel>
            </div>
          </section>
        );
      })}

      {/* Featured Products Carousel with Toggle - CARDS MENORES */}
      <section className="px-4 md:px-6 py-8 md:py-12 bg-white/10 backdrop-blur-sm animate-fade-in">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <TabNavigation 
              showingAI={showingAI}
              onTabChange={handleTabChange}
            />
            
            {showingAI ? (
              <div className="prose prose-invert max-w-none">
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-3 animate-slide-in-left">
                  ⚖️ Consultor Jurídico IA
                </h2>
                <div className="text-base text-white/90 animate-slide-in-right space-y-2">
                  <p><strong>Selecione até 5 produtos</strong> e nossa <strong>IA especializada</strong> irá recomendar o melhor para sua carreira jurídica</p>
                  <p className="text-sm">✨ <em>Análise personalizada baseada em sua área de atuação</em></p>
                </div>
              </div>
            ) : (
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-3 animate-slide-in-left">
                  📚 Mais Procurados pelos Juristas
                </h2>
                <p className="text-base text-white/80 animate-slide-in-right">
                  {currentFeaturedCategory && currentFeaturedCategory !== 'Destaques Jurídicos' 
                    ? `Os favoritos em ${currentFeaturedCategory}` 
                    : 'Os materiais mais utilizados pelos profissionais do direito'}
                </p>
              </div>
            )}
          </div>

          {showingAI ? (
            <>
              <div className="max-w-md mx-auto mb-6 animate-scale-in">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="bg-white border-gray-300 text-gray-900">
                    <SelectValue placeholder="Selecione uma área do direito" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-gray-300 z-50">
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
              {/* CAROUSEL COM CARDS COMPACTOS - ALTERAÇÃO PRINCIPAL */}
              <Carousel className="w-full animate-scale-in mb-6">
                <CarouselContent className="-ml-2 md:-ml-3">
                  {featuredProducts.map((product, index) => (
                    <CarouselItem 
                      key={product.id} 
                      className="pl-2 md:pl-3 basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5 animate-fade-in"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <ProductCard 
                        product={product} 
                        showBadge={true}
                        badgeText="MAIS PROCURADO"
                        compact={true}
                      />
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="left-2 md:left-4 bg-white/90 hover:bg-white border-amber-200" />
                <CarouselNext className="right-2 md:right-4 bg-white/90 hover:bg-white border-amber-200" />
              </Carousel>
              
              <div className="text-center animate-fade-in">
                <Button 
                  onClick={() => navigate('/categoria-lista?tipo=mais-vendidos')}
                  className="bg-white text-blue-900 hover:bg-gray-100 font-semibold transition-all duration-300 hover:scale-105"
                >
                  Ver Mais Materiais Jurídicos
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Category Filter and Products Grid - only show when not in AI mode */}
      {!showingAI && (
        <section className="px-4 md:px-6 py-8 md:py-12 animate-fade-in">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <div className="text-center flex-1">
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-3 animate-slide-in-left">
                  Explorar Biblioteca Jurídica
                </h2>
                <p className="text-base text-white/80 mb-4 animate-slide-in-right">
                  {searchTerm ? `Resultados para "${searchTerm}"` : 'Navegue por nossa coleção especializada em direito'}
                </p>
              </div>
              
              <div className="flex gap-2 animate-slide-in-right">
                <Select value={sortBy} onValueChange={(value: 'nome' | 'preco') => setSortBy(value)}>
                  <SelectTrigger className="bg-white text-gray-900 border-0 w-32">
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
                  className="bg-white text-gray-900 border-0 hover:bg-gray-100 transition-all duration-300 hover:scale-105"
                >
                  {sortOrder === 'asc' ? '↑' : '↓'}
                </Button>
              </div>
            </div>

            <div className="max-w-md mx-auto mb-6 animate-scale-in">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="bg-white border-gray-300 text-gray-900">
                  <SelectValue placeholder="Selecione uma área do direito" />
                </SelectTrigger>
                <SelectContent className="bg-white border-gray-300 z-50">
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

            {displayedProducts.length === 0 && (
              <div className="text-center py-16 animate-fade-in">
                <div className="w-32 h-32 bg-white/20 rounded-3xl flex items-center justify-center mx-auto mb-6 backdrop-blur-sm animate-pulse">
                  <Scale className="w-16 h-16 text-white/50" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-4">
                  Nenhum material encontrado
                </h2>
                <p className="text-white/80 mb-6">
                  {searchTerm ? `Não encontramos materiais para "${searchTerm}"` : 'Não há materiais nesta categoria'}
                </p>
                {searchTerm && (
                  <Button 
                    onClick={() => setSearchTerm('')} 
                    className="bg-white text-blue-900 hover:bg-gray-100 font-semibold transition-all duration-300 hover:scale-105"
                  >
                    Ver Todos os Materiais
                  </Button>
                )}
              </div>
            )}

            {displayedProducts.length > 24 && (
              <div className="text-center mt-8 animate-fade-in">
                <Button 
                  onClick={() => navigate(`/categoria-lista?categoria=${selectedCategory}&tipo=categoria`)}
                  className="bg-white text-blue-900 hover:bg-gray-100 font-semibold transition-all duration-300 hover:scale-105"
                >
                  Ver Todos os {displayedProducts.length} Materiais
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            )}
          </div>
        </section>
      )}

      {/* CTA Section - only show when not in AI mode */}
      {!showingAI && (
        <section className="px-4 md:px-6 py-12 md:py-16 bg-gradient-to-r from-blue-800 via-indigo-800 to-blue-900 relative overflow-hidden animate-fade-in">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <div className="space-y-6">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-amber-500/20 rounded-3xl flex items-center justify-center mx-auto animate-bounce">
                <Scale className="w-8 h-8 md:w-10 md:h-10 text-amber-300 animate-pulse" />
              </div>
              <h2 className="text-2xl md:text-4xl font-bold mb-4 text-white animate-slide-in-left">
                Fortaleça sua Carreira Jurídica!
              </h2>
              <p className="text-white/90 text-base md:text-lg max-w-2xl mx-auto leading-relaxed animate-slide-in-right">
                Descubra os melhores materiais jurídicos com preços especiais para advogados, estudantes e operadores do direito
              </p>
              <Button 
                size="lg" 
                className="bg-amber-500 text-blue-900 hover:bg-amber-400 py-4 px-8 font-bold text-lg shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105" 
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
