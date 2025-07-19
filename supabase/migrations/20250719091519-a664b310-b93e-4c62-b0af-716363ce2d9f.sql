
-- Create table to track product purchases
CREATE TABLE public.product_purchases (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id BIGINT NOT NULL,
  product_name TEXT NOT NULL,
  product_category TEXT,
  product_value TEXT,
  user_device_id TEXT,
  purchased_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add RLS policies
ALTER TABLE public.product_purchases ENABLE ROW LEVEL SECURITY;

-- Policy to allow anyone to insert purchase records (public tracking)
CREATE POLICY "Anyone can track purchases" 
  ON public.product_purchases 
  FOR INSERT 
  WITH CHECK (true);

-- Policy to allow reading purchase statistics (public data)
CREATE POLICY "Anyone can view purchase statistics" 
  ON public.product_purchases 
  FOR SELECT 
  USING (true);

-- Create function to get most purchased products
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

-- Create table to track product clicks for better analytics
CREATE TABLE public.product_clicks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id BIGINT NOT NULL,
  user_device_id TEXT,
  clicked_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add RLS policies for clicks
ALTER TABLE public.product_clicks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can track clicks" 
  ON public.product_clicks 
  FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Anyone can view click statistics" 
  ON public.product_clicks 
  FOR SELECT 
  USING (true);
