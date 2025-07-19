
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, FolderOpen, Heart, Sparkles, TrendingUp } from 'lucide-react';

const TabNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const tabs = [
    { path: '/', icon: Home, label: 'Início' },
    { path: '/categorias', icon: FolderOpen, label: 'Categorias' },
    { path: '/favoritos', icon: Heart, label: 'Favoritos' },
    { path: '/novos', icon: Sparkles, label: 'Novos' },
    { path: '/mais-comprados', icon: TrendingUp, label: 'Mais Comprados' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black/80 backdrop-blur-lg border-t border-white/20 z-50">
      <div className="flex items-center justify-around py-2 px-4 max-w-md mx-auto">
        {tabs.map(({ path, icon: Icon, label }) => {
          const active = isActive(path);
          
          return (
            <button
              key={path}
              onClick={() => navigate(path)}
              className={`flex flex-col items-center justify-center py-2 px-3 rounded-xl transition-all duration-300 ${
                active 
                  ? 'text-orange-400 bg-orange-400/20 scale-110' 
                  : 'text-gray-400 hover:text-white hover:bg-white/10'
              }`}
            >
              <Icon className={`w-6 h-6 mb-1 ${active ? 'animate-pulse' : ''}`} />
              <span className="text-xs font-medium">{label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default TabNavigation;
