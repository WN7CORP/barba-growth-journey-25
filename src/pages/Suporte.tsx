
import React from 'react';
import { ArrowLeft, HelpCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const Suporte = () => {
  const navigate = useNavigate();

  const faqData = [
    {
      id: "1",
      question: "Por onde são feitas as compras? Quem entrega os produtos?",
      answer: "As compras são feitas diretamente pelo Mercado Livre. A entrega também é feita com toda a segurança e agilidade pela própria logística do Mercado Livre."
    },
    {
      id: "2", 
      question: "Onde coloco o cupom de desconto na primeira compra?",
      answer: "Na hora de finalizar sua compra no Mercado Livre, você verá a opção de inserir um cupom. Coloque o cupom de primeira compra e garanta 10% de desconto automaticamente."
    },
    {
      id: "3",
      question: "Todos os códigos e leis dos livros estão atualizados?",
      answer: "Sim! Todos os nossos materiais estão atualizados conforme a legislação vigente de 2025, com edições novas e revisadas."
    },
    {
      id: "4",
      question: "Os livros são físicos ou digitais?",
      answer: "Todos os livros vendidos são físicos, enviados com embalagem segura para todo o Brasil."
    },
    {
      id: "5",
      question: "Posso ter mais de um desconto?",
      answer: "A cada novo mês, o cupom de desconto para primeira compra é resetado. Isso significa que você pode ganhar 10% de desconto novamente em uma nova compra feita em um mês diferente."
    },
    {
      id: "6",
      question: "Qual o prazo de entrega?",
      answer: "O prazo pode variar conforme a sua região, mas você poderá acompanhar todo o processo de envio diretamente pela sua conta no Mercado Livre. Em geral, as entregas são rápidas e confiáveis."
    },
    {
      id: "7",
      question: "Como saber se meu pedido foi confirmado?",
      answer: "Assim que a compra for finalizada no Mercado Livre, você receberá uma confirmação por e-mail e poderá acompanhar o status do pedido pelo aplicativo ou site."
    },
    {
      id: "8",
      question: "Posso trocar ou devolver?",
      answer: "Sim! As trocas e devoluções seguem a política do próprio Mercado Livre. Você pode fazer a solicitação em até 7 dias após o recebimento do produto."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-800 to-blue-800 text-white shadow-2xl">
        <div className="px-4 py-6">
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/')}
              className="text-white hover:bg-white/20 rounded-xl"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Voltar
            </Button>
            
            <div className="flex items-center space-x-3">
              <div className="bg-amber-500/20 rounded-2xl p-3 backdrop-blur-sm border border-amber-500/30 shadow-lg">
                <HelpCircle className="w-6 h-6 text-amber-300" />
              </div>
              <h1 className="text-2xl font-bold">Suporte</h1>
            </div>
            
            <div className="w-20"></div> {/* Spacer for centering */}
          </div>
          
          <div className="text-center">
            <p className="text-amber-200 font-medium">
              🤝 Estamos aqui para ajudar você
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Intro */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Perguntas Frequentes
            </h2>
            <p className="text-gray-600">
              Encontre respostas para as dúvidas mais comuns sobre nossos produtos e serviços
            </p>
          </div>

          {/* FAQ Accordion */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <Accordion type="single" collapsible className="w-full">
              {faqData.map((faq, index) => (
                <AccordionItem key={faq.id} value={faq.id} className="border-b border-gray-100 last:border-b-0">
                  <AccordionTrigger className="px-6 py-4 text-left hover:bg-blue-50/50 transition-colors duration-200">
                    <div className="flex items-start space-x-4">
                      <div className="bg-blue-100 text-blue-800 rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm flex-shrink-0 mt-1">
                        {index + 1}
                      </div>
                      <span className="font-medium text-gray-800 pr-4">
                        {faq.question}
                      </span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-4">
                    <div className="ml-12 text-gray-600 leading-relaxed">
                      {faq.answer}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          {/* Contact Info */}
          <div className="mt-8 text-center">
            <div className="bg-gradient-to-r from-blue-100 to-indigo-100 rounded-2xl p-6 border border-blue-200">
              <h3 className="text-lg font-bold text-blue-800 mb-2">
                Ainda tem dúvidas?
              </h3>
              <p className="text-blue-700">
                Nossa equipe está sempre pronta para ajudar você a encontrar os melhores materiais jurídicos!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Suporte;
