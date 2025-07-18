import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, ArrowRight } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import Header from '@/components/Header';
import { LazyImage } from '@/components/LazyImage';
import { useToastNotifications } from '@/hooks/useToastNotifications';
import { supabase } from "@/integrations/supabase/client";

interface SubcategoryStats {
  subcategoria: string;
  count: number;
  sampleImage: string;
}

const SubcategoriaLista = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const categoria = searchParams.get('categoria') || '';

  const [subcategories, setSubcategories] = useState<SubcategoryStats[]>([]);
  const [loading, setLoading] = useState(true);
  
  const {
    showSuccess,
    showError
  } = useToastNotifications();

  useEffect(() => {
    fetchSubcategories();
  }, [categoria]);

  const fetchSubcategories = async () => {
    try {
      const { data, error } = await supabase
        .from('SHOPEE')
        .select('subcategoria, imagem1')
        .eq('categoria', categoria)
        .not('subcategoria', 'is', null);

      if (error) throw error;

      // Count products per subcategory and get sample image
      const subcategoryCount = (data || []).reduce((acc: Record<string, { count: number; image: string }>, item) => {
        const subcat = item.subcategoria;
        if (!acc[subcat]) {
          acc[subcat] = { count: 0, image: item.imagem1 || '' };
        }
        acc[subcat].count += 1;
        return acc;
      }, {});

      const subcategoryStats = Object.entries(subcategoryCount).map(([subcategoria, data]) => ({
        subcategoria,
        count: data.count,
        sampleImage: data.image
      }));

      setSubcategories(subcategoryStats);
      showSuccess("Subcategorias carregadas!");
    } catch (error) {
      console.error('Erro ao buscar subcategorias:', error);
      showError("Erro ao carregar subcategorias");
    } finally {
      setLoading(false);
    }
  };

  const handleSubcategoryClick = (subcategoria: string) => {
    navigate(`/categoria-lista?categoria=${encodeURIComponent(categoria)}&subcategoria=${encodeURIComponent(subcategoria)}&tipo=subcategoria`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-32 bg-gray-200 rounded-2xl"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-48 bg-gray-200 rounded-2xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Header da página */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4">
          <div className="flex items-center gap-2 sm:gap-4 mb-3">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate('/categorias')} 
              className="text-red-500 hover:text-red-600 p-1 sm:p-2"
            >
              <ArrowLeft className="w-4 h-4 sm:mr-2" />
              <span className="hidden sm:inline">Voltar</span>
            </Button>
            <div className="flex-1 min-w-0">
              <h1 className="text-lg sm:text-xl font-bold text-gray-900 truncate">
                Subcategorias de {categoria}
              </h1>
              <p className="text-xs sm:text-sm text-gray-600 truncate">
                Escolha uma subcategoria para ver os produtos
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Carrossel de Subcategorias */}
      <section className="px-4 md:px-6 py-8">
        <div className="max-w-7xl mx-auto">
          {subcategories.length === 0 ? (
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
            <Carousel className="w-full">
              <CarouselContent className="-ml-2 md:-ml-3">
                {subcategories.map((subcategory) => (
                  <CarouselItem 
                    key={subcategory.subcategoria} 
                    className="pl-2 md:pl-3 basis-full md:basis-1/2 lg:basis-1/3 xl:basis-1/4"
                  >
                    <Card 
                      className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105 bg-white border-0 shadow-lg group cursor-pointer h-full"
                      onClick={() => handleSubcategoryClick(subcategory.subcategoria)}
                    >
                      <div className="aspect-square relative overflow-hidden">
                        <LazyImage 
                          src={subcategory.sampleImage} 
                          alt={subcategory.subcategoria} 
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                        <div className="absolute bottom-4 left-4 right-4 text-white">
                          <h3 className="text-lg font-bold mb-1 line-clamp-2">
                            {subcategory.subcategoria}
                          </h3>
                          <p className="text-sm text-white/80">
                            {subcategory.count} produtos
                          </p>
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <Button 
                          className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold"
                        >
                          Ver Produtos
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </CardContent>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-2 md:left-4 bg-white/90 hover:bg-white border-orange-200" />
              <CarouselNext className="right-2 md:right-4 bg-white/90 hover:bg-white border-orange-200" />
            </Carousel>
          )}
        </div>
      </section>
    </div>
  );
};

export default SubcategoriaLista;
