
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Scale, Heart, Home, Search, BookOpen, Sparkles, HelpCircle, Grid3X3, X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useFavorites } from '@/hooks/useFavorites';

interface HeaderProps {
  onSearch?: (searchTerm: string) => void;
  onPriceFilter?: (minPrice: number, maxPrice: number) => void;
}

const Header = ({ onSearch = () => {}, onPriceFilter = () => {} }: HeaderProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { favoritesCount } = useFavorites();

  const navItems = [
    { path: '/', label: 'Início', icon: Home },
    { path: '/categorias', label: 'Categorias', icon: Grid3X3 },
    { path: '/favoritos', label: 'Favoritos', icon: Heart },
    { path: '/novos', label: 'Lançamentos', icon: Sparkles },
    { path: '/suporte', label: 'Suporte', icon: HelpCircle },
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    onSearch(value);
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
                 item.path === '/novos' ? 'Novos' : 
                 item.path === '/suporte' ? 'Suporte' : item.label}
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
