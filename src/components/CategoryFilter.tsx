
import React, { memo } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  productCounts: Record<string, number>;
}

const CategoryFilterComponent: React.FC<CategoryFilterProps> = ({
  categories,
  selectedCategory,
  onCategoryChange,
  productCounts
}) => {
  return (
    <div className="bg-black/80 backdrop-blur-sm">
      <ScrollArea className="w-full">
        <div className="flex gap-2 p-4 overflow-x-auto">
          <Button
            variant={selectedCategory === 'todas' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onCategoryChange('todas')}
            className={`whitespace-nowrap transition-all duration-300 ${
              selectedCategory === 'todas' 
                ? 'bg-orange-500 text-white hover:bg-orange-600' 
                : 'bg-white/20 text-white border-white/30 hover:bg-white/30'
            }`}
          >
            Todas
            <Badge variant="secondary" className="ml-2 bg-white/20 text-white">
              {Object.values(productCounts).reduce((sum, count) => sum + count, 0)}
            </Badge>
          </Button>
          
          {categories.map(category => (
            <Button
              key={category}
              variant={selectedCategory === category ? 'default' : 'outline'}
              size="sm"
              onClick={() => onCategoryChange(category)}
              className={`whitespace-nowrap transition-all duration-300 ${
                selectedCategory === category 
                  ? 'bg-orange-500 text-white hover:bg-orange-600' 
                  : 'bg-white/20 text-white border-white/30 hover:bg-white/30'
              }`}
            >
              {category}
              <Badge variant="secondary" className="ml-2 bg-white/20 text-white">
                {productCounts[category] || 0}
              </Badge>
            </Button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export const CategoryFilter = memo(CategoryFilterComponent);
CategoryFilter.displayName = 'CategoryFilter';
