
import React from 'react';
import { Card } from "@/components/ui/card";
import { OptimizedImage } from './OptimizedImage';

interface SubcategoryCardProps {
  subcategoria: string;
  productCount: number;
  sampleImage: string;
  gradient: string;
  onClick: () => void;
}

export const SubcategoryCard: React.FC<SubcategoryCardProps> = ({
  subcategoria,
  productCount,
  sampleImage,
  gradient,
  onClick
}) => {
  return (
    <Card 
      className="overflow-hidden hover:shadow-2xl transition-all duration-500 hover:scale-105 bg-white border-0 shadow-lg group cursor-pointer transform hover:-translate-y-2"
      onClick={onClick}
    >
      <div className="aspect-square relative overflow-hidden">
        <OptimizedImage 
          src={sampleImage} 
          alt={subcategoria} 
          className="w-full h-full transition-transform duration-700 group-hover:scale-125" 
        />
        
        {/* Gradient overlay with animation */}
        <div className={`absolute inset-0 bg-gradient-to-t ${gradient} opacity-70 group-hover:opacity-85 transition-opacity duration-500`} />
        
        {/* Animated background pattern */}
        <div className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity duration-500">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,_white_0%,_transparent_50%)] animate-pulse" />
        </div>
        
        {/* Content with enhanced animations */}
        <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
          <div className="space-y-2">
            <h3 className="text-base sm:text-lg font-bold line-clamp-2 leading-tight transform opacity-90 group-hover:opacity-100 transition-all duration-300">
              {subcategoria}
            </h3>
            <div className="flex items-center justify-between">
              <p className="text-sm text-white/90 font-medium">
                {productCount} {productCount === 1 ? 'produto' : 'produtos'}
              </p>
              <div className="w-6 h-6 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center transform scale-0 group-hover:scale-100 transition-transform duration-300 delay-150">
                <span className="text-xs">→</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Shine effect on hover */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
      </div>
    </Card>
  );
};
