
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Product {
  id: number;
  produto: string;
  categoria?: string;
  valor: string;
}

export const usePurchaseTracker = () => {
  const { toast } = useToast();

  const trackPurchase = async (product: Product) => {
    try {
      // Generate a simple device ID based on browser fingerprint
      const deviceId = `${navigator.userAgent.slice(0, 20)}-${Date.now()}`;
      
      const { error } = await supabase
        .from('product_purchases')
        .insert({
          product_id: product.id,
          product_name: product.produto,
          product_category: product.categoria || 'Não categorizado',
          product_value: product.valor,
          user_device_id: deviceId
        });

      if (error) {
        console.error('Error tracking purchase:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error tracking purchase:', error);
      return false;
    }
  };

  const trackClick = async (productId: number) => {
    try {
      const deviceId = `${navigator.userAgent.slice(0, 20)}-${Date.now()}`;
      
      const { error } = await supabase
        .from('product_clicks')
        .insert({
          product_id: productId,
          device_id: deviceId
        });

      if (error) {
        console.error('Error tracking click:', error);
      }
    } catch (error) {
      console.error('Error tracking click:', error);
    }
  };

  return { trackPurchase, trackClick };
};
