
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Filter, DollarSign, X } from 'lucide-react';

interface PriceFilterProps {
  onFilter: (minPrice: number, maxPrice: number) => void;
  onClear: () => void;
  className?: string;
}

export const PriceFilter: React.FC<PriceFilterProps> = ({ 
  onFilter, 
  onClear, 
  className = "" 
}) => {
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [manualMin, setManualMin] = useState('');
  const [manualMax, setManualMax] = useState('');
  const [isActive, setIsActive] = useState(false);

  const handleSliderChange = (values: number[]) => {
    setPriceRange(values);
    setManualMin(values[0].toString());
    setManualMax(values[1].toString());
  };

  const handleManualChange = () => {
    const min = parseInt(manualMin) || 0;
    const max = parseInt(manualMax) || 1000;
    setPriceRange([min, max]);
  };

  const applyFilter = () => {
    onFilter(priceRange[0], priceRange[1]);
    setIsActive(true);
  };

  const clearFilter = () => {
    setPriceRange([0, 500]);
    setManualMin('');
    setManualMax('');
    setIsActive(false);
    onClear();
  };

  return (
    <Card className={`${className} bg-white/95 border-white/20 backdrop-blur-sm`}>
      <CardHeader className="pb-3">
        <CardTitle className="text-gray-900 text-sm flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Filtro por Preço
          </div>
          {isActive && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilter}
              className="h-6 w-6 p-0 hover:bg-red-100"
            >
              <X className="w-3 h-3 text-red-500" />
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Entrada manual de valores */}
        <div className="flex gap-2 items-center">
          <div className="flex-1">
            <label className="text-xs text-gray-600 block mb-1">Mín</label>
            <Input
              type="number"
              placeholder="0"
              value={manualMin}
              onChange={(e) => {
                setManualMin(e.target.value);
                handleManualChange();
              }}
              className="h-8 text-sm"
            />
          </div>
          <div className="text-gray-400 mt-5">-</div>
          <div className="flex-1">
            <label className="text-xs text-gray-600 block mb-1">Máx</label>
            <Input
              type="number"
              placeholder="500"
              value={manualMax}
              onChange={(e) => {
                setManualMax(e.target.value);
                handleManualChange();
              }}
              className="h-8 text-sm"
            />
          </div>
        </div>

        {/* Slider */}
        <div className="space-y-3">
          <div className="flex justify-between text-xs text-gray-600">
            <span>R$ {priceRange[0]}</span>
            <span>R$ {priceRange[1]}</span>
          </div>
          <Slider
            value={priceRange}
            onValueChange={handleSliderChange}
            max={1000}
            min={0}
            step={5}
            className="w-full"
          />
        </div>

        {/* Faixas de preço predefinidas */}
        <div className="grid grid-cols-2 gap-2">
          {[
            { label: 'Até R$ 50', min: 0, max: 50 },
            { label: 'R$ 50-100', min: 50, max: 100 },
            { label: 'R$ 100-200', min: 100, max: 200 },
            { label: 'Acima R$ 200', min: 200, max: 1000 }
          ].map((range) => (
            <Button
              key={range.label}
              variant="outline"
              size="sm"
              onClick={() => {
                setPriceRange([range.min, range.max]);
                setManualMin(range.min.toString());
                setManualMax(range.max.toString());
              }}
              className="text-xs h-8 hover:bg-blue-50 hover:border-blue-300"
            >
              {range.label}
            </Button>
          ))}
        </div>

        <Button
          onClick={applyFilter}
          size="sm"
          className={`w-full ${isActive ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'} text-white`}
        >
          <DollarSign className="w-4 h-4 mr-2" />
          {isActive ? 'Filtro Ativo' : 'Aplicar Filtro'}
        </Button>
      </CardContent>
    </Card>
  );
};
