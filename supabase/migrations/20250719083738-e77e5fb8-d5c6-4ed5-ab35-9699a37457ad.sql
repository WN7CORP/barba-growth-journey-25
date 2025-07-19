
-- Criar tabela para rastrear compras de produtos
CREATE TABLE public.product_purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id BIGINT NOT NULL,
  user_device_id TEXT,
  purchased_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  product_category TEXT,
  product_name TEXT,
  product_value TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Adicionar RLS para permitir inserção pública (para tracking)
ALTER TABLE public.product_purchases ENABLE ROW LEVEL SECURITY;

-- Política para permitir inserção de qualquer pessoa (para tracking de compras)
CREATE POLICY "Anyone can track purchases" 
  ON public.product_purchases 
  FOR INSERT 
  WITH CHECK (true);

-- Política para permitir leitura de estatísticas
CREATE POLICY "Anyone can view purchase stats" 
  ON public.product_purchases 
  FOR SELECT 
  USING (true);

-- Criar função para obter produtos mais comprados
CREATE OR REPLACE FUNCTION public.get_most_purchased_products(limit_count INTEGER DEFAULT 20)
RETURNS TABLE(
  product_id BIGINT,
  product_name TEXT,
  product_category TEXT,
  product_value TEXT,
  purchase_count BIGINT,
  last_purchase TIMESTAMP WITH TIME ZONE
)
LANGUAGE SQL
STABLE
AS $$
  SELECT 
    pp.product_id,
    pp.product_name,
    pp.product_category,
    pp.product_value,
    COUNT(*) as purchase_count,
    MAX(pp.purchased_at) as last_purchase
  FROM public.product_purchases pp
  WHERE pp.purchased_at >= NOW() - INTERVAL '30 days'
  GROUP BY pp.product_id, pp.product_name, pp.product_category, pp.product_value
  ORDER BY COUNT(*) DESC, MAX(pp.purchased_at) DESC
  LIMIT limit_count;
$$;
