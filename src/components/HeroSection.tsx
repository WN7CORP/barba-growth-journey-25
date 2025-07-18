
import React from 'react';
import { Scale, TrendingUp, Star, BookOpen } from 'lucide-react';

interface HeroSectionProps {
  productsCount: number;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ productsCount }) => {
  return (
    <section className="px-4 md:px-6 py-6 md:py-12 animate-fade-in">
      <div className="max-w-7xl mx-auto">
        <div className="text-center space-y-4 md:space-y-6 mb-8">
          <div className="animate-fade-in-scale">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-amber-500/20 rounded-3xl flex items-center justify-center mx-auto mb-4 animate-bounce shadow-2xl backdrop-blur-sm border border-amber-500/30">
              <Scale className="w-8 h-8 md:w-10 md:h-10 text-amber-300 animate-pulse" />
            </div>
            <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white mb-3 leading-tight animate-slide-in-left">
              Mundo do <span className="text-amber-300 animate-pulse">Direito</span>
            </h1>
            <p className="text-base md:text-lg text-white/90 mb-6 max-w-2xl mx-auto leading-relaxed animate-slide-in-right">
              Sua livraria jurídica especializada! Descubra os melhores livros, códigos e materiais para sua carreira no direito.
            </p>
          </div>
          
          <div className="grid grid-cols-3 gap-3 max-w-xl mx-auto animate-scale-in">
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 text-center hover:bg-white/30 transition-all duration-300 hover:scale-105 border border-white/10">
              <div className="text-lg font-bold text-white flex items-center justify-center gap-1">
                <BookOpen className="w-4 h-4 animate-pulse" />
                {productsCount}+
              </div>
              <div className="text-xs text-white/80">Materiais</div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 text-center hover:bg-white/30 transition-all duration-300 hover:scale-105 border border-white/10">
              <div className="text-lg font-bold text-white flex items-center justify-center gap-1">
                <Star className="w-4 h-4 text-amber-300 animate-spin-slow" />
                4.9
              </div>
              <div className="text-xs text-white/80">Avaliação</div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 text-center hover:bg-white/30 transition-all duration-300 hover:scale-105 border border-white/10">
              <div className="text-lg font-bold text-white flex items-center justify-center gap-1">
                <Scale className="w-4 h-4 text-amber-300 animate-bounce" />
                100%
              </div>
              <div className="text-xs text-white/80">Jurídico</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
