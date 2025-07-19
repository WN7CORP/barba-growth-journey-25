
import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";

interface MostPurchasedProduct {
  product_id: number;
  product_name: string;
  product_category: string;
  product_value: string;
  purchase_count: number;
  last_purchase: string;
}

export const useMostPurchased = (limit: number = 20) => {
  return useQuery({
    queryKey: ['most-purchased', limit],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_most_purchased_products', {
        limit_count: limit
      });

      if (error) {
        console.error('Error fetching most purchased products:', error);
        throw error;
      }

      return data as MostPurchasedProduct[];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
