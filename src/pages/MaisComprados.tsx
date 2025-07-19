
import React from 'react';
import { ArrowLeft, TrendingUp, Award, ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useMostPurchased } from '@/hooks/useMostPurchased';
import { usePurchaseTracker } from '@/hooks/usePurchaseTracker';

const MaisComprados = () => {
  const navigate = useNavigate();
  const { products, loading, error } = useMostPurchased(50);
  const { trackPurchase } = usePurchaseTracker();

  const handleBuyProduct = async (product: any) => {
    await trackPurchase({
      productId: product.product_id,
      productName: product.product_name,
      productCategory: product.product_category,
      productValue: product.product_value
    });
    
    // Simular abertura do link (substitua pela lógica real)
    console.log('Comprando produto:', product.product_name);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-400 via-red-500 to-pink-500 flex items-center justify-center">
        <div className="text-white text-xl">Carregando produtos mais comprados...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-400 via-red-500 to-pink-500 flex items-center justify-center">
        <div className="text-white text-xl">Erro ao carregar produtos</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-400 via-red-500 to-pink-500 pb-20">
      {/* Header */}
      <div className="bg-black/20 backdrop-blur-sm p-4">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/')}
            className="text-white hover:bg-white/20"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Voltar
          </Button>
          
          <div className="flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-white" />
            <h1 className="text-white font-bold text-xl">Mais Comprados</h1>
          </div>
          
          <div className="w-20" />
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Header da seção */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Award className="w-8 h-8 text-yellow-300" />
            <h2 className="text-3xl font-bold text-white">Top Produtos</h2>
          </div>
          <p className="text-white/80 text-lg">
            Os produtos mais escolhidos pelos nossos usuários
          </p>
        </div>

        {/* Lista de produtos */}
        <div className="space-y-4">
          {products.length > 0 ? (
            products.map((product, index) => (
              <div
                key={product.product_id}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 hover:bg-white/20 transition-all duration-300"
              >
                <div className="flex items-center gap-4">
                  {/* Ranking */}
                  <div className="flex-shrink-0">
                    {index < 3 ? (
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl font-bold ${
                        index === 0 ? 'bg-yellow-500 text-white' :
                        index === 1 ? 'bg-gray-300 text-gray-800' :
                        'bg-orange-400 text-white'
                      }`}>
                        {index + 1}
                      </div>
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-white font-bold">
                        {index + 1}
                      </div>
                    )}
                  </div>

                  {/* Informações do produto */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="text-white font-semibold text-lg mb-1 truncate">
                          {product.product_name}
                        </h3>
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                            {product.product_category}
                          </Badge>
                          {index < 10 && (
                            <Badge className="bg-red-500 text-white">
                              <TrendingUp className="w-3 h-3 mr-1" />
                              HOT
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-white/80 text-sm">
                          <div className="flex items-center gap-1">
                            <ShoppingBag className="w-4 h-4" />
                            <span>{product.purchase_count} compras</span>
                          </div>
                          <span>•</span>
                          <span>Última compra: {new Date(product.last_purchase).toLocaleDateString('pt-BR')}</span>
                        </div>
                      </div>

                      {/* Preço e botão */}
                      <div className="flex flex-col items-end gap-2">
                        <div className="text-2xl font-bold text-white">
                          {product.product_value}
                        </div>
                        <Button
                          onClick={() => handleBuyProduct(product)}
                          className="bg-green-500 hover:bg-green-600 text-white font-semibold px-6"
                        >
                          Comprar
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-16">
              <div className="w-32 h-32 bg-white/20 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <ShoppingBag className="w-16 h-16 text-white/50" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-4">
                Nenhuma compra registrada ainda
              </h2>
              <p className="text-white/80">
                Seja o primeiro a comprar e apareça no ranking!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MaisComprados;
