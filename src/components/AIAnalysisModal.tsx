
import { useState, useRef, useEffect } from 'react';
import { X, Sparkles, Clock, CheckCircle, ArrowUp, ArrowDown } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

interface Product {
  id: number;
  produto: string;
  valor: string;
  categoria: string;
}

interface AIAnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedProducts: Product[];
  onAnalyze: (products: Product[]) => Promise<string>;
}

export const AIAnalysisModal = ({ isOpen, onClose, selectedProducts, onAnalyze }: AIAnalysisModalProps) => {
  const [analysis, setAnalysis] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [analyzed, setAnalyzed] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleAnalyze = async () => {
    if (selectedProducts.length === 0) return;
    
    setLoading(true);
    try {
      const result = await onAnalyze(selectedProducts);
      setAnalysis(result);
      setAnalyzed(true);
    } catch (error) {
      console.error('Erro na análise:', error);
      setAnalysis('Ops! Ocorreu um erro ao analisar os produtos. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setAnalysis('');
    setAnalyzed(false);
    setScrollPosition(0);
    onClose();
  };

  const formatAnalysis = (text: string) => {
    const lines = text.split('\n');
    
    return lines.map((line, index) => {
      const trimmedLine = line.trim();
      
      // Linha vazia
      if (trimmedLine === '') {
        return <br key={index} />;
      }
      
      // Títulos principais com **TEXTO** isolado
      if (trimmedLine.match(/^\*\*[^*]+\*\*$/)) {
        const cleanTitle = trimmedLine.replace(/^\*\*|\*\*$/g, '');
        return (
          <h2 key={index} className="font-bold text-gray-800 mt-6 mb-3 text-lg border-b border-gray-200 pb-2">
            {cleanTitle}
          </h2>
        );
      }
      
      // Títulos com números como "1. **PRODUTO A**"
      if (trimmedLine.match(/^\d+\.\s*\*\*[^*]+\*\*$/)) {
        const cleanTitle = trimmedLine.replace(/\*\*/g, '');
        return (
          <h3 key={index} className="font-bold text-gray-800 mt-4 mb-2 text-base bg-gray-50 p-2 rounded">
            {cleanTitle}
          </h3>
        );
      }
      
      // Seções especiais como "RESUMO:", "PRODUTO 1:", etc
      if (trimmedLine.match(/^(RESUMO|PRODUTO \d+|ANÁLISE|CONCLUSÃO|RECOMENDAÇÃO).*:$/i)) {
        return (
          <h3 key={index} className="font-bold text-purple-700 mt-4 mb-2 text-base bg-purple-50 p-2 rounded border-l-4 border-purple-500">
            {trimmedLine}
          </h3>
        );
      }
      
      // Itens com hífen (lista)
      if (trimmedLine.startsWith('- ')) {
        const cleanItem = trimmedLine.substring(2);
        return (
          <div key={index} className="flex items-start gap-2 ml-4 mb-2">
            <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
            <p className="text-gray-700 text-sm leading-relaxed">{processInlineFormatting(cleanItem)}</p>
          </div>
        );
      }
      
      // Texto com formatação inline (negrito no meio do texto)
      return (
        <p key={index} className="text-gray-600 mb-2 text-sm leading-relaxed">
          {processInlineFormatting(trimmedLine)}
        </p>
      );
    });
  };

  const processInlineFormatting = (text: string) => {
    // Remove asteriscos isolados ou mal formados
    let cleanText = text.replace(/\*(?!\*)/g, ''); // Remove * isolados
    cleanText = cleanText.replace(/\*{3,}/g, '**'); // Converte *** ou mais em **
    
    // Processa negrito **texto**
    const parts = cleanText.split(/(\*\*[^*]+\*\*)/);
    
    return parts.map((part, partIndex) => {
      if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
        const boldText = part.slice(2, -2);
        return <strong key={partIndex} className="font-semibold text-gray-800">{boldText}</strong>;
      }
      return part;
    });
  };

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
      const scrollPercentage = scrollHeight > clientHeight 
        ? (scrollTop / (scrollHeight - clientHeight)) * 100 
        : 0;
      setScrollPosition(Math.min(scrollPercentage, 100));
    }
  };

  const scrollToTop = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const scrollToBottom = () => {
    if (scrollContainerRef.current) {
      const { scrollHeight } = scrollContainerRef.current;
      scrollContainerRef.current.scrollTo({ top: scrollHeight, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.addEventListener('scroll', handleScroll);
      return () => {
        if (scrollContainerRef.current) {
          scrollContainerRef.current.removeEventListener('scroll', handleScroll);
        }
      };
    }
  }, [analyzed]);

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] bg-white border-0 p-0 overflow-hidden">
        <DialogTitle className="sr-only">
          Análise IA - Me Ajuda Escolher
        </DialogTitle>
        <DialogDescription className="sr-only">
          Análise inteligente dos produtos selecionados para ajudar na sua decisão de compra
        </DialogDescription>
        
        <div className="flex flex-col h-full max-h-[90vh]">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-4 text-white relative flex-shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 rounded-full p-2">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold">IA - Me Ajuda Escolher</h2>
                  <p className="text-sm text-purple-100">
                    Análise inteligente de produtos selecionados
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClose}
                className="text-white hover:bg-white/20 border-2 border-white/30 hover:border-white/50 transition-all duration-300 hover:scale-110 rounded-full p-2 bg-white/10"
              >
                <X className="w-6 h-6" />
              </Button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-hidden relative">
            {!analyzed ? (
              <div className="p-6 h-full overflow-auto">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Sparkles className="w-8 h-8 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    Produtos Selecionados para Análise
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Nossa IA irá analisar e comparar os produtos para te ajudar a escolher
                  </p>
                </div>

                {/* Produtos Selecionados */}
                <div className="space-y-3 mb-6">
                  {selectedProducts.map((product, index) => (
                    <div key={product.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-800 text-sm line-clamp-1">
                          {product.produto}
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-red-500 font-bold text-xs">
                            Menos de {product.valor}
                          </span>
                          {product.categoria && (
                            <Badge variant="secondary" className="text-xs">
                              {product.categoria}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Botão Analisar */}
                <Button
                  onClick={handleAnalyze}
                  disabled={loading || selectedProducts.length === 0}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-3"
                >
                  {loading ? (
                    <>
                      <Clock className="w-4 h-4 mr-2 animate-spin" />
                      Analisando produtos...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Analisar com IA
                    </>
                  )}
                </Button>

                {selectedProducts.length === 0 && (
                  <p className="text-center text-gray-500 text-sm mt-4">
                    Selecione produtos na página inicial para começar a análise
                  </p>
                )}
              </div>
            ) : (
              <div className="h-full flex flex-col">
                <div className="flex items-center justify-between gap-2 p-4 pb-2 border-b flex-shrink-0">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <h3 className="font-bold text-gray-800">Análise Completa</h3>
                    <Badge className="bg-green-100 text-green-700">
                      {selectedProducts.length} produtos analisados
                    </Badge>
                  </div>
                  
                  {/* Scroll Controls */}
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={scrollToTop}
                      className="p-1 h-8 w-8"
                      title="Ir para o topo"
                    >
                      <ArrowUp className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={scrollToBottom}
                      className="p-1 h-8 w-8"
                      title="Ir para o final"
                    >
                      <ArrowDown className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                
                {/* Scroll Progress Bar */}
                <div className="w-full bg-gray-200 h-1 flex-shrink-0">
                  <div 
                    className="bg-purple-500 h-1 transition-all duration-300"
                    style={{ width: `${scrollPosition}%` }}
                  />
                </div>
                
                <div 
                  ref={scrollContainerRef}
                  className="flex-1 p-4 overflow-y-auto"
                  style={{ maxHeight: 'calc(90vh - 200px)' }}
                >
                  <div className="prose prose-sm max-w-none">
                    {formatAnalysis(analysis)}
                  </div>
                </div>

                <div className="p-4 pt-2 border-t flex-shrink-0 bg-gray-50">
                  <div className="flex gap-3">
                    <Button
                      onClick={() => {
                        setAnalyzed(false);
                        setAnalysis('');
                        setScrollPosition(0);
                      }}
                      variant="outline"
                      size="sm"
                    >
                      Nova Análise
                    </Button>
                    <Button 
                      onClick={handleClose} 
                      size="sm"
                      className="bg-purple-500 hover:bg-purple-600"
                    >
                      Fechar
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
