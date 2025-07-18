
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Desafio90Dias {
  id: string;
  data_inicio: string;
  dia_atual: number;
  concluido: boolean;
}

interface DesafioFoto {
  id: string;
  dia: number;
  foto_url: string;
  observacoes?: string;
  created_at: string;
}

export const useDesafio90Dias = () => {
  const [desafio, setDesafio] = useState<Desafio90Dias | null>(null);
  const [fotos, setFotos] = useState<DesafioFoto[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDesafio = async () => {
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session.session) return;

      const { data, error } = await supabase
        .from('desafio_90_dias')
        .select('*')
        .eq('user_id', session.session.user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Erro ao buscar desafio:', error);
        return;
      }

      setDesafio(data);

      if (data) {
        const { data: fotosData } = await supabase
          .from('desafio_fotos')
          .select('*')
          .eq('desafio_id', data.id)
          .order('dia', { ascending: true });

        setFotos(fotosData || []);
      }
    } catch (error) {
      console.error('Erro ao buscar desafio:', error);
    } finally {
      setLoading(false);
    }
  };

  const iniciarDesafio = async () => {
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session.session) return;

      const { data, error } = await supabase
        .from('desafio_90_dias')
        .insert([
          {
            user_id: session.session.user.id,
            data_inicio: new Date().toISOString().split('T')[0],
            dia_atual: 1,
          }
        ])
        .select()
        .single();

      if (error) {
        console.error('Erro ao iniciar desafio:', error);
        return;
      }

      setDesafio(data);
    } catch (error) {
      console.error('Erro ao iniciar desafio:', error);
    }
  };

  const uploadFoto = async (file: File, dia: number, observacoes?: string) => {
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session.session || !desafio) return;

      const fileName = `${session.session.user.id}/${dia}_${Date.now()}.jpg`;
      
      const { error: uploadError } = await supabase.storage
        .from('desafio-fotos')
        .upload(fileName, file);

      if (uploadError) {
        console.error('Erro no upload:', uploadError);
        return;
      }

      const { data: urlData } = supabase.storage
        .from('desafio-fotos')
        .getPublicUrl(fileName);

      const { error: insertError } = await supabase
        .from('desafio_fotos')
        .insert([
          {
            desafio_id: desafio.id,
            dia,
            foto_url: urlData.publicUrl,
            observacoes,
          }
        ]);

      if (insertError) {
        console.error('Erro ao salvar foto:', insertError);
        return;
      }

      await fetchDesafio();
    } catch (error) {
      console.error('Erro ao fazer upload da foto:', error);
    }
  };

  const marcarAplicacao = async (dia: number, periodo: 'manha' | 'noite') => {
    try {
      if (!desafio) return;

      const { data: aplicacaoExistente } = await supabase
        .from('desafio_aplicacoes')
        .select('*')
        .eq('desafio_id', desafio.id)
        .eq('dia', dia)
        .single();

      if (aplicacaoExistente) {
        const { error } = await supabase
          .from('desafio_aplicacoes')
          .update({
            [`aplicado_${periodo}`]: true
          })
          .eq('id', aplicacaoExistente.id);

        if (error) console.error('Erro ao atualizar aplicação:', error);
      } else {
        const { error } = await supabase
          .from('desafio_aplicacoes')
          .insert([
            {
              desafio_id: desafio.id,
              dia,
              [`aplicado_${periodo}`]: true
            }
          ]);

        if (error) console.error('Erro ao registrar aplicação:', error);
      }

      // Atualizar dia atual se necessário
      if (dia > desafio.dia_atual) {
        await supabase
          .from('desafio_90_dias')
          .update({ dia_atual: dia })
          .eq('id', desafio.id);

        setDesafio(prev => prev ? { ...prev, dia_atual: dia } : null);
      }
    } catch (error) {
      console.error('Erro ao marcar aplicação:', error);
    }
  };

  useEffect(() => {
    fetchDesafio();
  }, []);

  return {
    desafio,
    fotos,
    loading,
    iniciarDesafio,
    uploadFoto,
    marcarAplicacao,
    refetch: fetchDesafio
  };
};
