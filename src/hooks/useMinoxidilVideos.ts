
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface MinoxidilVideo {
  id: number;
  titulo: string;
  video: string;
  thumbnail: string;
  data: string;
  duracao: string;
}

export const useMinoxidilVideos = () => {
  return useQuery({
    queryKey: ['minoxidil-videos'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('MINOXIDIL VIDEOS')
        .select('*')
        .order('id', { ascending: false });

      if (error) {
        console.error('Erro ao buscar vídeos:', error);
        throw error;
      }

      return data as MinoxidilVideo[];
    },
  });
};
