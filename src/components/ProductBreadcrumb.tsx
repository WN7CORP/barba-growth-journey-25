
import React from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface BreadcrumbProps {
  categoria: string;
  produto: string;
}

export const ProductBreadcrumb: React.FC<BreadcrumbProps> = ({ categoria, produto }) => {
  const navigate = useNavigate();

  return (
    <nav className="flex items-center gap-2 text-sm text-white/70 mb-4 px-4">
      <button 
        onClick={() => navigate('/')}
        className="flex items-center gap-1 hover:text-white transition-colors"
      >
        <Home className="w-4 h-4" />
        Início
      </button>
      <ChevronRight className="w-3 h-3" />
      <span className="hover:text-white transition-colors cursor-pointer">
        {categoria}
      </span>
      <ChevronRight className="w-3 h-3" />
      <span className="text-white font-medium truncate max-w-48">
        {produto}
      </span>
    </nav>
  );
};
