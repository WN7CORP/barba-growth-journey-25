
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface MostPurchasedProduct {
  product_id: number;
  product_name: string;
  product_category: string;
  product_value: string;
  purchase_count: number;
  last_purchase: string;
}

export const useMostPurchased = (limit: number = 20) => {
  const [products, setProducts] = useState<MostPurchasedProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMostPurchased();
  }, [limit]);

  const fetchMostPurchased = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.rpc('get_most_purchased_products', {
        limit_count: limit
      });

      if (error) throw error;
      setProducts(data || []);
    } catch (err) {
      console.error('Erro ao buscar produtos mais comprados:', err);
      setError('Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  return { products, loading, error, refetch: fetchMostPurchased };
};
