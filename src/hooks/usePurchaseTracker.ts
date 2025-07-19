
import { supabase } from "@/integrations/supabase/client";
import { generateDeviceFingerprint } from "@/utils/deviceFingerprint";

interface TrackPurchaseParams {
  productId: number;
  productName: string;
  productCategory: string;
  productValue: string;
}

export const usePurchaseTracker = () => {
  const trackPurchase = async (params: TrackPurchaseParams) => {
    try {
      const deviceId = await generateDeviceFingerprint();
      
      await supabase
        .from('product_purchases')
        .insert({
          product_id: params.productId,
          product_name: params.productName,
          product_category: params.productCategory,
          product_value: params.productValue,
          user_device_id: deviceId
        });
      
      console.log('Compra rastreada:', params.productName);
    } catch (error) {
      console.error('Erro ao rastrear compra:', error);
    }
  };

  return { trackPurchase };
};
