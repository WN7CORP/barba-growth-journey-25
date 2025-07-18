import { useState } from 'react';
import { ShoppingCart, Star, Shield, Truck, CreditCard, Package, Award, Users, Tag } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from '@/components/Header';

const Loja = () => {
  const [quantity, setQuantity] = useState(1);
  const [selectedPackage, setSelectedPackage] = useState('1-unidade');

  const packages = [
    {
      id: '1-unidade',
      name: '1 Frasco',
      price: 89.90,
      originalPrice: 120.00,
      description: 'Ideal para experimentar',
      savings: 0,
      popular: false
    },
    {
      id: '3-unidades',
      name: '3 Frascos',
      price: 239.90,
      originalPrice: 360.00,
      description: 'Melhor custo-benefício',
      savings: 120.10,
      popular: true
    },
    {
      id: '6-unidades',
      name: '6 Frascos',
      price: 449.90,
      originalPrice: 720.00,
      description: 'Máxima economia',
      savings: 270.10,
      popular: false
    }
  ];

  const selectedPkg = packages.find(pkg => pkg.id === selectedPackage);

  const features = [
    "Minoxidil Kirkland Original 5%",
    "Fórmula aprovada pela FDA",
    "60ml por frasco (1 mês)",
    "Aplicador conta-gotas incluso",
    "Certificado de autenticidade",
    "Garantia de 30 dias"
  ];

  const testimonials = [
    {
      name: "Carlos Mendes",
      rating: 5,
      comment: "Produto original, chegou rápido. Em 2 meses já vejo diferença na barba!",
      days: "Usando há 60 dias"
    },
    {
      name: "Rafael Costa",
      rating: 5,
      comment: "Kirkland original mesmo! Qualidade excepcional, recomendo.",
      days: "Usando há 90 dias"
    },
    {
      name: "Bruno Silva",
      rating: 5,
      comment: "Melhor preço que encontrei. Produto chegou lacrado e dentro da validade.",
      days: "Usando há 45 dias"
    }
  ];

  const handlePurchase = () => {
    window.open('https://lista.mercadolivre.com.br/minoxidil-kirkland', '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Cupom Banner */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-4 rounded-2xl text-center shadow-xl animate-bounce-gentle">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Tag className="w-6 h-6" />
              <span className="text-2xl font-bold">BARBA10</span>
            </div>
            <p className="text-lg">Use este cupom e ganhe 10% de desconto!</p>
            <p className="text-sm opacity-90">Válido apenas no Mercado Livre</p>
          </div>
        </div>

        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Minoxidil Kirkland Original</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            O minoxidil mais confiável do mercado, direto do fornecedor oficial
          </p>
          <div className="flex items-center justify-center gap-2 mt-4 bg-yellow-100 px-4 py-2 rounded-full inline-flex">
            <img 
              src="https://http2.mlstatic.com/frontend-assets/ml-web-navigation/ui-navigation/6.6.92/mercadolibre/logo_large_25years@2x.png" 
              alt="Mercado Livre" 
              className="h-6"
            />
            <span className="text-sm font-medium text-gray-700">Vendido via Mercado Livre</span>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square bg-white rounded-lg shadow-lg overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=500&h=500&fit=crop"
                alt="Minoxidil Kirkland"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="grid grid-cols-4 gap-2">
              {[1,2,3,4].map((i) => (
                <div key={i} className="aspect-square bg-white rounded border-2 border-gray-200 overflow-hidden">
                  <img 
                    src={`https://images.unsplash.com/photo-158256212481${i}-c09040d0a901?w=100&h=100&fit=crop`}
                    alt={`Produto ${i}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="flex items-center">
                  {[1,2,3,4,5].map((star) => (
                    <Star key={star} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <span className="text-gray-600">(2.547 avaliações)</span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Minoxidil Kirkland Signature 5%
              </h1>
              <p className="text-gray-600">
                Solução tópica original para crescimento de barba e cabelo
              </p>
            </div>

            {/* Package Selection */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Escolha seu pacote:</h3>
              <div className="grid gap-3">
                {packages.map((pkg) => (
                  <div 
                    key={pkg.id}
                    className={`relative border-2 rounded-lg p-4 cursor-pointer transition-all ${
                      selectedPackage === pkg.id 
                        ? 'border-green-500 bg-green-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedPackage(pkg.id)}
                  >
                    {pkg.popular && (
                      <Badge className="absolute -top-2 left-4 bg-orange-500">
                        Mais Popular
                      </Badge>
                    )}
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-semibold">{pkg.name}</div>
                        <div className="text-sm text-gray-600">{pkg.description}</div>
                        {pkg.savings > 0 && (
                          <div className="text-sm text-green-600 font-medium">
                            Economize R$ {pkg.savings.toFixed(2)}
                          </div>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-green-600">
                          R$ {pkg.price.toFixed(2)}
                        </div>
                        <div className="text-sm text-gray-500 line-through">
                          R$ {pkg.originalPrice.toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Purchase Section */}
            <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg border-2 border-green-200">
              <div className="flex items-center justify-between mb-4">
                <span className="text-lg font-semibold">Total:</span>
                <div className="text-right">
                  <div className="text-3xl font-bold text-green-600">
                    R$ {selectedPkg?.price.toFixed(2)}
                  </div>
                  <div className="text-sm text-gray-500">
                    ou 12x de R$ {((selectedPkg?.price || 0) / 12).toFixed(2)}
                  </div>
                </div>
              </div>
              
              <Button 
                onClick={handlePurchase}
                className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white text-lg py-4 mb-4 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                Comprar no Mercado Livre
              </Button>
              
              <div className="flex items-center justify-center gap-4 text-sm text-gray-600 mb-4">
                <div className="flex items-center gap-1">
                  <Shield className="w-4 h-4" />
                  Compra Segura
                </div>
                <div className="flex items-center gap-1">
                  <Truck className="w-4 h-4" />
                  Frete Grátis
                </div>
                <div className="flex items-center gap-1">
                  <CreditCard className="w-4 h-4" />
                  12x sem juros
                </div>
              </div>

              <div className="text-center">
                <p className="text-sm text-gray-600 mb-2">Lembre-se de usar o cupom:</p>
                <div className="bg-green-600 text-white px-4 py-2 rounded-lg font-bold inline-block">
                  BARBA10
                </div>
              </div>
            </div>

            {/* Guarantees */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
                <Award className="w-6 h-6 text-green-600" />
                <div>
                  <div className="font-semibold text-green-800">100% Original</div>
                  <div className="text-sm text-green-600">Certificado FDA</div>
                </div>
              </div>
              <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
                <Package className="w-6 h-6 text-blue-600" />
                <div>
                  <div className="font-semibold text-blue-800">Entrega Rápida</div>
                  <div className="text-sm text-blue-600">5-7 dias úteis</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details */}
        <div className="mt-16">
          <Tabs defaultValue="detalhes" className="space-y-8">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="detalhes">Detalhes</TabsTrigger>
              <TabsTrigger value="uso">Como Usar</TabsTrigger>
              <TabsTrigger value="avaliacoes">Avaliações</TabsTrigger>
              <TabsTrigger value="faq">FAQ</TabsTrigger>
            </TabsList>

            <TabsContent value="detalhes">
              <Card>
                <CardHeader>
                  <CardTitle>Características do Produto</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="font-semibold mb-4">O que você recebe:</h3>
                      <ul className="space-y-2">
                        {features.map((feature, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-4">Especificações:</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Concentração:</span>
                          <span className="font-medium">5% Minoxidil</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Volume:</span>
                          <span className="font-medium">60ml por frasco</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Duração:</span>
                          <span className="font-medium">30 dias por frasco</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Fabricante:</span>
                          <span className="font-medium">Kirkland Signature</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Aprovação:</span>
                          <span className="font-medium">FDA</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="uso">
              <Card>
                <CardHeader>
                  <CardTitle>Como Usar o Minoxidil</CardTitle>
                  <CardDescription>
                    Siga essas instruções para obter os melhores resultados
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="font-semibold mb-4">Aplicação:</h3>
                      <ol className="space-y-3">
                        <li className="flex gap-3">
                          <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold">1</span>
                          <span>Lave e seque bem o rosto</span>
                        </li>
                        <li className="flex gap-3">
                          <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold">2</span>
                          <span>Aplique 1ml na área da barba</span>
                        </li>
                        <li className="flex gap-3">
                          <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold">3</span>
                          <span>Massageie suavemente</span>
                        </li>
                        <li className="flex gap-3">
                          <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold">4</span>
                          <span>Deixe secar por 4 horas</span>
                        </li>
                      </ol>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-4">Frequência:</h3>
                      <div className="space-y-3">
                        <div className="p-3 bg-green-50 rounded-lg">
                          <div className="font-medium text-green-800">2x por dia</div>
                          <div className="text-sm text-green-600">Manhã e noite</div>
                        </div>
                        <div className="p-3 bg-orange-50 rounded-lg">
                          <div className="font-medium text-orange-800">Consistência</div>
                          <div className="text-sm text-orange-600">Use todos os dias para melhores resultados</div>
                        </div>
                        <div className="p-3 bg-blue-50 rounded-lg">
                          <div className="font-medium text-blue-800">Paciência</div>
                          <div className="text-sm text-blue-600">Resultados aparecem em 2-4 meses</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="avaliacoes">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-6 h-6" />
                    Avaliações dos Clientes
                  </CardTitle>
                  <CardDescription>
                    Veja o que nossos clientes estão dizendo
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {testimonials.map((testimonial, index) => (
                      <div key={index} className="border-b pb-6 last:border-b-0">
                        <div className="flex items-center justify-between mb-2">
                          <div className="font-semibold">{testimonial.name}</div>
                          <div className="flex items-center">
                            {[1,2,3,4,5].map((star) => (
                              <Star key={star} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            ))}
                          </div>
                        </div>
                        <p className="text-gray-700 mb-2">"{testimonial.comment}"</p>
                        <div className="text-sm text-gray-500">{testimonial.days}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="faq">
              <Card>
                <CardHeader>
                  <CardTitle>Perguntas Frequentes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {[
                      {
                        q: "O produto é original?",
                        a: "Sim, trabalhamos apenas com Kirkland original importado diretamente do fabricante."
                      },
                      {
                        q: "Em quanto tempo verei resultados?",
                        a: "Os primeiros resultados aparecem entre 2-4 meses de uso consistente."
                      },
                      {
                        q: "Posso usar em outras áreas?",
                        a: "O minoxidil pode ser usado em qualquer área com pelos, incluindo cabelo e sobrancelhas."
                      },
                      {
                        q: "Tem efeitos colaterais?",
                        a: "Raramente causa efeitos colaterais. Pode ocorrer ressecamento ou irritação leve no início."
                      },
                      {
                        q: "Como uso o cupom BARBA10?",
                        a: "No Mercado Livre, adicione o produto ao carrinho e digite 'BARBA10' no campo de cupom para ganhar 10% de desconto."
                      }
                    ].map((faq, index) => (
                      <div key={index} className="border-b pb-4 last:border-b-0">
                        <h3 className="font-semibold text-gray-900 mb-2">{faq.q}</h3>
                        <p className="text-gray-600">{faq.a}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Loja;
