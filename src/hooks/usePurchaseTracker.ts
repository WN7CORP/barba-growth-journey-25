
import { supabase } from '@/integrations/supabase/client';
import { getStoredDeviceId } from '@/utils/deviceFingerprint';

interface Product {
  id: number;
  produto: string;
  categoria: string;
  valor: string;
}

export const usePurchaseTracker = () => {
  const trackPurchase = async (product: Product) => {
    try {
      const deviceId = getStoredDeviceId();
      
      const { error } = await supabase
        .from('product_purchases')
        .insert({
          product_id: product.id,
          user_device_id: deviceId,
          product_category: product.categoria,
          product_name: product.produto,
          product_value: product.valor
        });

      if (error) {
        console.error('Erro ao rastrear compra:', error);
      } else {
        console.log('Compra rastreada com sucesso');
      }
    } catch (error) {
      console.error('Erro ao rastrear compra:', error);
    }
  };

  return { trackPurchase };
};
