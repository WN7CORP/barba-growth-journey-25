
import React, { useState, useCallback } from 'react';
import { Search, Menu, Heart, ShoppingCart, User, Filter, X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { PriceFilter } from '@/components/PriceFilter';

interface HeaderProps {
  onSearch: (term: string) => void;
  onPriceFilter: (min: number, max: number) => void;
}

const Header: React.FC<HeaderProps> = ({ onSearch, onPriceFilter }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [cartCount] = useState(3); // Mock data
  const [favoriteCount] = useState(7); // Mock data

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value);
  }, [onSearch]);

  const clearSearch = useCallback(() => {
    setSearchTerm('');
    onSearch('');
  }, [onSearch]);

  const NavigationMenu = () => (
    <nav className="space-y-4">
      <div className="space-y-2">
        <h3 className="font-semibold text-lg text-foreground">Categorias</h3>
        <div className="space-y-1">
          {[
            'Direito Civil',
            'Direito Penal', 
            'Direito Constitucional',
            'Códigos e Vade Mecum',
            'Preparatórios para Concursos',
            'Doutrina e Comentários'
          ].map((category) => (
            <Button
              key={category}
              variant="ghost"
              className="w-full justify-start text-left font-normal"
            >
              {category}
            </Button>
          ))}
        </div>
      </div>
      
      <div className="space-y-2">
        <h3 className="font-semibold text-lg text-foreground">Conta</h3>
        <div className="space-y-1">
          <Button variant="ghost" className="w-full justify-start">
            <User className="w-4 h-4 mr-3" />
            Minha Conta
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            <Heart className="w-4 h-4 mr-3" />
            Favoritos
            {favoriteCount > 0 && (
              <Badge className="ml-auto bg-accent text-accent-foreground">
                {favoriteCount}
              </Badge>
            )}
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            <ShoppingCart className="w-4 h-4 mr-3" />
            Carrinho
            {cartCount > 0 && (
              <Badge className="ml-auto bg-primary text-primary-foreground">
                {cartCount}
              </Badge>
            )}
          </Button>
        </div>
      </div>
    </nav>
  );

  return (
    <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur-sm border-b border-border shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Menu Mobile */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="md:hidden touch-target">
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80">
              <SheetHeader>
                <SheetTitle className="text-left">Menu</SheetTitle>
              </SheetHeader>
              <div className="mt-6">
                <NavigationMenu />
              </div>
            </SheetContent>
          </Sheet>

          {/* Logo */}
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-gradient">
              Mundo do Direito
            </h1>
          </div>

          {/* Barra de busca - Desktop */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <div className={`relative flex items-center transition-all duration-200 ${
                isSearchFocused ? 'ring-2 ring-ring' : ''
              }`}>
                <Search className="absolute left-3 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar livros de direito..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                  className="pl-10 pr-10 border-0 bg-muted/50 focus:bg-background"
                />
                {searchTerm && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 w-8 h-8 p-0"
                    onClick={clearSearch}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Ações do usuário */}
          <div className="flex items-center gap-2">
            {/* Busca Mobile */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="md:hidden touch-target">
                  <Search className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="top" className="h-auto">
                <div className="space-y-4 py-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar livros de direito..."
                      value={searchTerm}
                      onChange={handleSearchChange}
                      className="pl-10 text-base"
                      autoFocus
                    />
                  </div>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => setShowFilters(true)}
                  >
                    <Filter className="w-4 h-4 mr-2" />
                    Filtros Avançados
                  </Button>
                </div>
              </SheetContent>
            </Sheet>

            {/* Filtros - Desktop */}
            <Button
              variant="outline"
              size="sm"
              className="hidden md:flex touch-target"
              onClick={() => setShowFilters(true)}
            >
              <Filter className="w-4 h-4 mr-2" />
              Filtros
            </Button>

            {/* Favoritos */}
            <Button variant="ghost" size="sm" className="relative touch-target">
              <Heart className="w-5 h-5" />
              {favoriteCount > 0 && (
                <Badge className="absolute -top-1 -right-1 w-5 h-5 text-xs bg-accent text-accent-foreground p-0 flex items-center justify-center">
                  {favoriteCount > 9 ? '9+' : favoriteCount}
                </Badge>
              )}
            </Button>

            {/* Carrinho */}
            <Button variant="ghost" size="sm" className="relative touch-target">
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <Badge className="absolute -top-1 -right-1 w-5 h-5 text-xs bg-primary text-primary-foreground p-0 flex items-center justify-center">
                  {cartCount > 9 ? '9+' : cartCount}
                </Badge>
              )}
            </Button>

            {/* Perfil - Desktop */}
            <Button variant="ghost" size="sm" className="hidden md:flex touch-target">
              <User className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Filtros Modal */}
      <Sheet open={showFilters} onOpenChange={setShowFilters}>
        <SheetContent side="bottom" className="h-auto">
          <SheetHeader>
            <SheetTitle>Filtros Avançados</SheetTitle>
          </SheetHeader>
          <div className="py-6">
            <PriceFilter onFilter={onPriceFilter} />
          </div>
        </SheetContent>
      </Sheet>
    </header>
  );
};

export default Header;
