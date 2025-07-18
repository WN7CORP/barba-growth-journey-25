
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, Scale, Heart, Home, Search, BookOpen, Sparkles, Info, Star, Gavel, Grid3X3 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { PriceFilter } from '@/components/PriceFilter';
import { useFavorites } from '@/hooks/useFavorites';

interface HeaderProps {
  onSearch?: (searchTerm: string) => void;
  onPriceFilter?: (minPrice: number, maxPrice: number) => void;
}

const Header = ({ onSearch = () => {}, onPriceFilter = () => {} }: HeaderProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { favoritesCount } = useFavorites();

  const navItems = [
    { path: '/', label: 'Início', icon: Home },
    { path: '/categorias', label: 'Categorias', icon: Grid3X3 },
    { path: '/favoritos', label: 'Favoritos', icon: Heart },
    { path: '/novos', label: 'Lançamentos', icon: Sparkles },
    { path: '/explorar', label: 'Explorar', icon: Search },
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsOpen(false);
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    onSearch(value);
  };

  const handlePriceFilterChange = (minPrice: number, maxPrice: number) => {
    onPriceFilter(minPrice, maxPrice);
  };

  const handleClearFilter = () => {
    onPriceFilter(0, 1000); // Reset to default range
  };

  const handleEvaluateApp = () => {
    window.open('https://play.google.com/store/apps/details?id=br.com.app.gpu3121847.gpu5864a3ed792bc282cc5655927ef358d2', '_blank');
    setIsOpen(false);
  };

  return (
    <>
      {/* Desktop/Mobile Header */}
      <header className="bg-gradient-to-r from-blue-900 via-indigo-800 to-blue-800 text-white shadow-2xl sticky top-0 z-50 backdrop-blur-sm border-b-2 border-amber-500/30">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
              <div className="bg-amber-500/20 rounded-2xl p-3 backdrop-blur-sm border border-amber-500/30 shadow-lg">
                <Scale className="w-7 h-7 text-amber-300" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Mundo do Direito</h1>
                <p className="text-sm text-amber-200">Livraria Jurídica Especializada</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center space-x-2">
                {navItems.slice(1).map((item) => (
                  <Button
                    key={item.path}
                    variant="ghost"
                    size="sm"
                    className="text-white hover:bg-white/20 rounded-xl relative transition-all duration-300 hover:scale-105"
                    onClick={() => handleNavigation(item.path)}
                  >
                    <item.icon className="w-4 h-4 mr-2" />
                    {item.label}
                    {item.path === '/favoritos' && favoritesCount > 0 && (
                      <Badge className="ml-2 bg-red-500 text-white text-xs px-1 py-0">
                        {favoritesCount}
                      </Badge>
                    )}
                  </Button>
                ))}
              </div>

              {/* Mobile Menu */}
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="sm" className="md:hidden text-white hover:bg-white/20 p-2 rounded-xl">
                    <Menu className="w-6 h-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-80 bg-gradient-to-b from-blue-900 to-indigo-900 text-white border-0">
                  <div className="py-6">
                    <div className="flex items-center space-x-3 mb-8 px-2">
                      <div className="bg-amber-500/20 rounded-2xl p-3 border border-amber-500/30">
                        <Scale className="w-6 h-6 text-amber-300" />
                      </div>
                      <div>
                        <h2 className="text-lg font-bold">Mundo do Direito</h2>
                        <p className="text-sm text-amber-200">Sua Livraria Jurídica Online</p>
                      </div>
                    </div>
                    
                    {/* Price Filter - Only show on homepage */}
                    {location.pathname === '/' && (
                      <div className="mb-6 mx-2">
                        <PriceFilter
                          onFilter={handlePriceFilterChange}
                          onClear={handleClearFilter}
                        />
                      </div>
                    )}
                    
                    <nav className="space-y-2">
                      {navItems.map((item) => (
                        <button
                          key={item.path}
                          onClick={() => handleNavigation(item.path)}
                          className="flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 w-full text-left hover:bg-white/20 relative"
                        >
                          <item.icon className="w-5 h-5" />
                          <span className="font-medium">{item.label}</span>
                        </button>
                      ))}
                      
                      {/* Separator */}
                      <div className="border-t border-white/20 my-4 mx-4"></div>
                      
                      {/* About App */}
                      <Dialog>
                        <DialogTrigger asChild>
                          <button className="flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 w-full text-left hover:bg-white/20">
                            <Info className="w-5 h-5" />
                            <span className="font-medium">Sobre o app</span>
                          </button>
                        </DialogTrigger>
                        <DialogContent className="max-w-sm mx-4 bg-white/95 backdrop-blur-xl border-0 shadow-2xl max-h-[90vh] overflow-y-auto">
                          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/90 via-indigo-50/90 to-white/90 rounded-lg backdrop-blur-xl"></div>
                          <div className="relative z-10">
                            <DialogHeader className="space-y-3 text-center pb-4">
                              <div className="mx-auto w-12 h-12 bg-gradient-to-br from-blue-800 to-indigo-800 rounded-xl flex items-center justify-center shadow-lg">
                                <Scale className="w-6 h-6 text-amber-300" />
                              </div>
                              <DialogTitle className="text-xl font-bold bg-gradient-to-r from-blue-800 to-indigo-800 bg-clip-text text-transparent">
                                Mundo do Direito
                              </DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4 text-gray-700 text-sm">
                              <div className="text-center">
                                <p className="font-semibold text-gray-800 mb-2">
                                  Sua livraria jurídica especializada!
                                </p>
                                <p className="text-xs text-gray-600 leading-relaxed">
                                  Os melhores materiais jurídicos em um só lugar
                                </p>
                              </div>
                              
                              <div className="space-y-3">
                                <div className="flex items-start gap-2">
                                  <div className="w-1.5 h-1.5 bg-blue-800 rounded-full mt-1.5 flex-shrink-0"></div>
                                  <p className="text-xs leading-relaxed">
                                    Nossa plataforma reúne cuidadosamente os <span className="font-semibold text-blue-800">melhores livros e materiais jurídicos</span>, oferecendo acesso aos recursos mais essenciais para sua carreira no direito.
                                  </p>
                                </div>
                                
                                <div className="flex items-start gap-2">
                                  <div className="w-1.5 h-1.5 bg-indigo-800 rounded-full mt-1.5 flex-shrink-0"></div>
                                  <p className="text-xs leading-relaxed">
                                    Desde códigos, doutrinas e jurisprudência até materiais de estudo e acessórios profissionais, tudo selecionado para garantir <span className="font-semibold text-indigo-800">excelência e conhecimento</span>.
                                  </p>
                                </div>
                              </div>
                              
                              <div className="bg-gradient-to-r from-blue-100 via-indigo-100 to-blue-100 p-3 rounded-lg border border-blue-200/50 backdrop-blur-sm">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="text-base">⚖️</span>
                                  <p className="text-xs font-semibold text-blue-800">
                                    Fortaleça sua carreira jurídica
                                  </p>
                                </div>
                                <p className="text-xs text-blue-700">
                                  Encontre os melhores materiais em um só lugar!
                                </p>
                              </div>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                      
                      {/* Rate App */}
                      <button
                        onClick={handleEvaluateApp}
                        className="flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 w-full text-left hover:bg-white/20"
                      >
                        <Star className="w-5 h-5" />
                        <span className="font-medium">Avaliar App</span>
                      </button>
                    </nav>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>

          {/* Enhanced Search Bar - Always visible and prominent */}
          <div className="relative w-full max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 z-10" />
              <Input
                placeholder="Buscar livros jurídicos, códigos, doutrinas, materiais..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-12 pr-4 py-3 bg-white/95 backdrop-blur-sm border-2 border-amber-300/50 text-gray-900 placeholder:text-gray-500 focus:bg-white focus:border-amber-400 rounded-2xl shadow-lg text-base font-medium transition-all duration-300 hover:shadow-xl"
              />
              {searchTerm && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleSearch('')}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1 h-auto"
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
            <div className="text-center mt-2">
              <p className="text-xs text-amber-200 font-medium">
                📚 Encontre os melhores materiais jurídicos do Brasil
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Bottom Navigation for Mobile */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-gradient-to-r from-blue-900 to-indigo-800 border-t-2 border-amber-500/30 z-50 shadow-2xl backdrop-blur-sm">
        <div className="grid grid-cols-5 gap-1 px-2 py-3">
          {navItems.map((item) => (
            <button
              key={item.path}
              onClick={() => handleNavigation(item.path)}
              className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-all duration-300 relative ${
                location.pathname === item.path 
                  ? 'bg-amber-500/20 text-amber-300 scale-105' 
                  : 'text-white hover:bg-white/20'
              }`}
            >
              <item.icon className="w-5 h-5 mb-1" />
              <span className="text-xs font-medium truncate max-w-full">
                {item.path === '/categorias' ? 'Categorias' : 
                 item.path === '/favoritos' ? 'Favoritos' :
                 item.path === '/novos' ? 'Novos' : item.label}
              </span>
              {item.path === '/favoritos' && favoritesCount > 0 && (
                <Badge className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1 py-0 min-w-5 h-5 flex items-center justify-center rounded-full">
                  {favoritesCount}
                </Badge>
              )}
            </button>
          ))}
        </div>
      </div>
    </>
  );
};

export default Header;
