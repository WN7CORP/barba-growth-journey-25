
import { useState } from 'react';
import { Check, Sparkles, Search } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AIQuestionnaire, QuestionnaireAnswers } from './AIQuestionnaire';

interface Product {
  id: number;
  produto: string;
  valor: string;
  categoria: string;
  imagem1: string;
}

interface ProductSelectorProps {
  products: Product[];
  selectedProducts: Product[];
  onProductToggle: (product: Product) => void;
  onAnalyze: () => void;
  onQuestionnaireChange: (answers: Record<string, string>) => void;
}

export const ProductSelector = ({ products, selectedProducts, onProductToggle, onAnalyze, onQuestionnaireChange }: ProductSelectorProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [questionnaireAnswers, setQuestionnaireAnswers] = useState<QuestionnaireAnswers | undefined>();
  const [activeTab, setActiveTab] = useState('questions');

  const isSelected = (productId: number) => {
    return selectedProducts.some(p => p.id === productId);
  };

  const handleProductClick = (product: Product) => {
    if (selectedProducts.length >= 5 && !isSelected(product.id)) {
      return; // Não permite selecionar mais de 5
    }
    onProductToggle(product);
  };

  const filteredProducts = products.filter(product =>
    product.produto.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleQuestionnaireChange = (answers: QuestionnaireAnswers) => {
    setQuestionnaireAnswers(answers);
    // Convert QuestionnaireAnswers to Record<string, string> format
    const answersRecord: Record<string, string> = {
      budget: answers.budget,
      category: answers.category,
      purpose: answers.purpose,
      priority: answers.priority,
      timeline: answers.timeline,
      customNeed: answers.customNeed
    };
    onQuestionnaireChange(answersRecord);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Sparkles className="w-8 h-8 text-purple-600 animate-pulse" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">
          Me Ajuda Escolher
        </h2>
        <p className="text-white/80 text-sm">
          Responda algumas perguntas e selecione produtos para uma análise personalizada
        </p>
      </div>

      {/* Contador e Botão */}
      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
        <div className="flex items-center justify-between">
          <div className="text-white">
            <span className="text-sm">Produtos selecionados:</span>
            <span className="ml-2 font-bold text-lg">{selectedProducts.length}/5</span>
          </div>
          <Button
            onClick={onAnalyze}
            disabled={selectedProducts.length === 0}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Analisar com IA
          </Button>
        </div>
        
        {selectedProducts.length >= 5 && (
          <p className="text-yellow-200 text-xs mt-2">
            Máximo de 5 produtos atingido
          </p>
        )}
      </div>

      {/* Tabs para Perguntas e Produtos */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-white/20 backdrop-blur-sm">
          <TabsTrigger value="questions" className="text-white data-[state=active]:bg-white data-[state=active]:text-purple-600">
            1. Suas Preferências
          </TabsTrigger>
          <TabsTrigger value="products" className="text-white data-[state=active]:bg-white data-[state=active]:text-purple-600">
            2. Escolher Produtos
          </TabsTrigger>
        </TabsList>

        <TabsContent value="questions" className="space-y-4">
          <AIQuestionnaire onAnswersChange={handleQuestionnaireChange} />
          <div className="text-center">
            <Button
              onClick={() => setActiveTab('products')}
              className="bg-white text-purple-600 hover:bg-gray-100"
            >
              Próximo: Escolher Produtos
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="products" className="space-y-4">
          {/* Barra de Pesquisa */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Pesquisar produtos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/90 border-white/30 text-gray-900 placeholder:text-gray-500"
              />
            </div>
            {searchTerm && (
              <p className="text-white/80 text-xs mt-2">
                {filteredProducts.length} produtos encontrados
              </p>
            )}
          </div>

          {/* Grid de Produtos */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {filteredProducts.slice(0, 30).map((product, index) => (
              <Card 
                key={product.id}
                className={`overflow-hidden cursor-pointer transition-all duration-300 hover:scale-105 border-2 ${
                  isSelected(product.id) 
                    ? 'border-purple-500 bg-purple-50 shadow-lg' 
                    : 'border-transparent bg-white hover:shadow-xl'
                }`}
                onClick={() => handleProductClick(product)}
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="relative">
                  <div className="aspect-square overflow-hidden">
                    <img 
                      src={product.imagem1} 
                      alt={product.produto} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                    />
                  </div>
                  
                  {/* Checkbox */}
                  <div className={`absolute top-2 right-2 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                    isSelected(product.id)
                      ? 'bg-purple-500 border-purple-500'
                      : 'bg-white/90 border-gray-300'
                  }`}>
                    {isSelected(product.id) && (
                      <Check className="w-4 h-4 text-white" />
                    )}
                  </div>

                  {/* Categoria Badge */}
                  {product.categoria && (
                    <div className="absolute bottom-1 left-1">
                      <Badge variant="secondary" className="text-xs bg-white/90 px-1 py-0">
                        {product.categoria}
                      </Badge>
                    </div>
                  )}
                </div>

                <CardContent className="p-2">
                  <h3 className="font-medium text-gray-900 mb-1 line-clamp-2 text-xs leading-tight">
                    {product.produto}
                  </h3>
                  <div className="text-xs font-bold text-red-500">
                    Menos de {product.valor}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-8">
              <p className="text-white/80">Nenhum produto encontrado para "{searchTerm}"</p>
              <Button
                onClick={() => setSearchTerm('')}
                variant="outline"
                size="sm"
                className="mt-2 bg-white/20 border-white/30 text-white hover:bg-white/30"
              >
                Limpar pesquisa
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Produtos Selecionados Preview */}
      {selectedProducts.length > 0 && (
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
          <h3 className="text-white font-semibold mb-3 text-sm">Produtos Selecionados:</h3>
          <div className="space-y-2">
            {selectedProducts.map((product) => (
              <div key={product.id} className="flex items-center gap-3 bg-white/20 rounded-lg p-2">
                <img 
                  src={product.imagem1} 
                  alt={product.produto}
                  className="w-8 h-8 rounded object-cover"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-white text-xs font-medium truncate">
                    {product.produto}
                  </p>
                  <p className="text-white/80 text-xs">
                    Menos de {product.valor}
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={(e) => {
                    e.stopPropagation();
                    onProductToggle(product);
                  }}
                  className="text-white hover:bg-white/20 p-1 h-auto"
                >
                  ✕
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
