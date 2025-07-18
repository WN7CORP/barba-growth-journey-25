
-- Criar tabela para o desafio 90 dias
CREATE TABLE public.desafio_90_dias (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  data_inicio DATE NOT NULL DEFAULT CURRENT_DATE,
  dia_atual INTEGER DEFAULT 1,
  concluido BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar tabela para as fotos do progresso
CREATE TABLE public.desafio_fotos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  desafio_id UUID REFERENCES public.desafio_90_dias(id) ON DELETE CASCADE NOT NULL,
  dia INTEGER NOT NULL,
  foto_url TEXT NOT NULL,
  observacoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar tabela para aplicações diárias
CREATE TABLE public.desafio_aplicacoes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  desafio_id UUID REFERENCES public.desafio_90_dias(id) ON DELETE CASCADE NOT NULL,
  dia INTEGER NOT NULL,
  aplicado_manha BOOLEAN DEFAULT FALSE,
  aplicado_noite BOOLEAN DEFAULT FALSE,
  data_aplicacao DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS
ALTER TABLE public.desafio_90_dias ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.desafio_fotos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.desafio_aplicacoes ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para desafio_90_dias
CREATE POLICY "Users can view their own challenge" ON public.desafio_90_dias
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own challenge" ON public.desafio_90_dias
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own challenge" ON public.desafio_90_dias
  FOR UPDATE USING (auth.uid() = user_id);

-- Políticas RLS para desafio_fotos
CREATE POLICY "Users can view their own photos" ON public.desafio_fotos
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM public.desafio_90_dias d 
    WHERE d.id = desafio_fotos.desafio_id AND d.user_id = auth.uid()
  ));

CREATE POLICY "Users can create their own photos" ON public.desafio_fotos
  FOR INSERT WITH CHECK (EXISTS (
    SELECT 1 FROM public.desafio_90_dias d 
    WHERE d.id = desafio_fotos.desafio_id AND d.user_id = auth.uid()
  ));

-- Políticas RLS para desafio_aplicacoes
CREATE POLICY "Users can view their own applications" ON public.desafio_aplicacoes
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM public.desafio_90_dias d 
    WHERE d.id = desafio_aplicacoes.desafio_id AND d.user_id = auth.uid()
  ));

CREATE POLICY "Users can create their own applications" ON public.desafio_aplicacoes
  FOR INSERT WITH CHECK (EXISTS (
    SELECT 1 FROM public.desafio_90_dias d 
    WHERE d.id = desafio_aplicacoes.desafio_id AND d.user_id = auth.uid()
  ));

CREATE POLICY "Users can update their own applications" ON public.desafio_aplicacoes
  FOR UPDATE USING (EXISTS (
    SELECT 1 FROM public.desafio_90_dias d 
    WHERE d.id = desafio_aplicacoes.desafio_id AND d.user_id = auth.uid()
  ));

-- Criar bucket para fotos do desafio
INSERT INTO storage.buckets (id, name, public) VALUES ('desafio-fotos', 'desafio-fotos', true);

-- Política de storage para upload de fotos
CREATE POLICY "Users can upload their own photos" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'desafio-fotos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Public read access to photos" ON storage.objects
  FOR SELECT USING (bucket_id = 'desafio-fotos');

-- Função para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para atualizar updated_at
CREATE TRIGGER update_desafio_90_dias_updated_at BEFORE UPDATE ON public.desafio_90_dias
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
