
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, ArrowRight, Grid3X3 } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Header from '@/components/Header';
import { supabase } from "@/integrations/supabase/client";

interface CategoryStats {
  categoria: string;
  count: number;
}

const Categorias = () => {
  const [categories, setCategories] = useState<CategoryStats[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      // @ts-ignore - Bypass TypeScript for table name
      const { data, error } = await (supabase as any)
        .from('MUNDODODIREITO')
        .select('categoria')
        .not('categoria', 'is', null);

      if (error) throw error;

      // Count products per category
      const categoryCount = (data || []).reduce((acc: Record<string, number>, item) => {
        const cat = item.categoria;
        acc[cat] = (acc[cat] || 0) + 1;
        return acc;
      }, {});

      const categoryStats = Object.entries(categoryCount).map(([categoria, count]) => ({
        categoria,
        count: count as number
      })).sort((a, b) => b.count - a.count);

      setCategories(categoryStats);
    } catch (error) {
      console.error('Erro ao buscar categorias:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryClick = (category: string) => {
    navigate(`/categoria-lista?categoria=${encodeURIComponent(category)}&tipo=categoria`);
  };

  const getCategoryIcon = (category: string) => {
    return BookOpen;
  };

  const getCategoryGradient = (index: number) => {
    const gradients = [
      'from-purple-600 to-purple-700', 
      'from-blue-600 to-blue-700', 
      'from-indigo-600 to-indigo-700', 
      'from-violet-600 to-violet-700', 
      'from-purple-700 to-indigo-700',
      'from-blue-700 to-purple-700'
    ];
    return gradients[index % gradients.length];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 pb-20">
        <Header />
        <div className="container-responsive py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-32 bg-white/20 rounded-2xl"></div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="h-48 bg-white/20 rounded-2xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 pb-20">
      <Header />
      
      {/* Hero Section */}
      <section className="container-responsive py-8 md:py-16">
        <div className="text-center space-y-6 mb-12">
          <div className="w-20 h-20 md:w-24 md:h-24 bg-white/20 rounded-3xl flex items-center justify-center mx-auto mb-6 animate-bounce-gentle shadow-2xl backdrop-blur-sm">
            <Grid3X3 className="w-10 h-10 md:w-12 md:h-12 text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold text-white mb-4 leading-tight">
            Áreas do <span className="text-amber-300">Direito</span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed mobile-text">
            📚 Explore nossa livraria especializada por área jurídica
          </p>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="container-responsive py-0">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4">
          {categories.map((category, index) => {
            const IconComponent = getCategoryIcon(category.categoria);
            return (
              <Card 
                key={category.categoria} 
                className="overflow-hidden hover:shadow-2xl transition-all duration-500 hover:scale-105 bg-white border-0 shadow-xl group cursor-pointer animate-fade-in hover:-translate-y-2"
                style={{ animationDelay: `${index * 0.1}s` }}
                onClick={() => handleCategoryClick(category.categoria)}
              >
                <div className={`bg-gradient-to-br ${getCategoryGradient(index)} p-3 sm:p-4 md:p-6 text-white relative overflow-hidden`}>
                  <div className="absolute -top-4 -right-4 w-12 sm:w-16 md:w-24 h-12 sm:h-16 md:h-24 bg-white/20 rounded-full transition-transform duration-500 group-hover:scale-110"></div>
                  <div className="absolute -bottom-4 -left-4 w-8 sm:w-12 md:w-16 h-8 sm:h-12 md:h-16 bg-white/10 rounded-full transition-transform duration-500 group-hover:scale-125"></div>
                  
                  <div className="relative z-10">
                    <div className="mb-2 sm:mb-3 md:mb-4 transform transition-transform duration-300 group-hover:scale-110">
                      <IconComponent className="w-6 h-6 sm:w-8 sm:h-8 md:w-12 md:h-12 text-white drop-shadow-lg" />
                    </div>
                    <h3 className="text-xs sm:text-sm md:text-xl font-bold mb-1 md:mb-2 line-clamp-2">
                      {category.categoria}
                    </h3>
                    <p className="text-white/80 text-xs md:text-sm font-medium">
                      {category.count} materiais disponíveis
                    </p>
                  </div>
                </div>
                
                <CardContent className="p-2 sm:p-3 md:p-6">
                  <Button 
                    className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-bold transition-all duration-300 hover:scale-105 text-xs md:text-sm py-2 md:py-3 shadow-lg hover:shadow-xl touch-target"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCategoryClick(category.categoria);
                    }}
                  >
                    Explorar Materiais
                    <ArrowRight className="w-3 h-3 md:w-4 md:h-4 ml-1 md:ml-2 transition-transform duration-300 group-hover:translate-x-1" />
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default Categorias;
