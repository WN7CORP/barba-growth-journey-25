
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const geminiApiKey = 'AIzaSyBW9q3wYmx-cvCv5RLz3ex9SCVB5KcftaE';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { products } = await req.json();
    
    if (!products || products.length === 0) {
      throw new Error('Nenhum produto foi selecionado para análise');
    }

    if (products.length > 5) {
      throw new Error('Máximo de 5 produtos por análise');
    }

    // Criar prompt estruturado para o Gemini
    const productList = products.map((product: any, index: number) => 
      `${index + 1}. **${product.produto}** - ${product.valor}\n   Categoria: ${product.categoria || 'Não especificada'}`
    ).join('\n\n');

    const prompt = `
Você é um assistente especialista em produtos e compras online. Analise os seguintes produtos da Shopee e forneça uma análise detalhada:

PRODUTOS PARA ANÁLISE:
${productList}

Por favor, forneça uma análise estruturada contendo:

1. **RESUMO DE CADA PRODUTO**
   - Características principais
   - Possíveis usos e aplicações
   - Público-alvo ideal

2. **ANÁLISE COMPARATIVA**
   - Pontos fortes e fracos de cada produto
   - Diferenças de preço e custo-benefício
   - Qual produto se destaca em que aspecto

3. **RECOMENDAÇÕES POR PERFIL**
   - Para quem tem orçamento limitado
   - Para quem busca qualidade premium
   - Para uso específico ou geral

4. **PARECER FINAL**
   - Sua recomendação principal
   - Justificativa da escolha
   - Dicas importantes para a compra

Seja objetivo, prático e útil. Use linguagem clara e amigável, como se fosse um amigo experiente dando conselhos.
    `;

    console.log('Enviando requisição para Gemini API...');

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt
              }
            ]
          }
        ]
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Erro na resposta da Gemini API:', errorText);
      throw new Error(`Erro na API Gemini: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Resposta recebida da Gemini API');

    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
      throw new Error('Resposta inválida da API Gemini');
    }

    const analysis = data.candidates[0].content.parts[0].text;

    return new Response(JSON.stringify({ 
      analysis,
      productsAnalyzed: products.length,
      timestamp: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Erro na função analyze-products:', error);
    return new Response(JSON.stringify({ 
      error: error.message || 'Erro interno do servidor',
      details: 'Tente novamente em alguns segundos'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
