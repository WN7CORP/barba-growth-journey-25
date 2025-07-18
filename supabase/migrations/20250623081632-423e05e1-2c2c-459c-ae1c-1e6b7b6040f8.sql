
-- Primeiro, vamos verificar se as tabelas já existem e criar apenas as que faltam
-- Verificar se app_users já existe
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'app_users') THEN
        CREATE TABLE public.app_users (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          device_id TEXT UNIQUE NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          last_seen TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          preferences JSONB DEFAULT '{}'::jsonb
        );
    END IF;
END
$$;

-- Verificar se product_views já existe
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'product_views') THEN
        CREATE TABLE public.product_views (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          user_id UUID REFERENCES public.app_users(id) ON DELETE CASCADE NOT NULL,
          product_id BIGINT NOT NULL,
          viewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
    END IF;
END
$$;

-- Habilitar RLS nas tabelas
ALTER TABLE public.app_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_favorites ENABLE ROW LEVEL SECURITY;

-- Habilitar RLS em product_views se existir
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'product_views') THEN
        ALTER TABLE public.product_views ENABLE ROW LEVEL SECURITY;
    END IF;
END
$$;

-- Remover e recriar políticas para app_users
DROP POLICY IF EXISTS "Users can view their own data" ON public.app_users;
DROP POLICY IF EXISTS "Users can create their own record" ON public.app_users;
DROP POLICY IF EXISTS "Users can update their own record" ON public.app_users;

CREATE POLICY "Users can view their own data" ON public.app_users
  FOR SELECT USING (true);

CREATE POLICY "Users can create their own record" ON public.app_users
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update their own record" ON public.app_users
  FOR UPDATE USING (true);

-- Remover e recriar políticas para user_favorites
DROP POLICY IF EXISTS "Users can view their own favorites" ON public.user_favorites;
DROP POLICY IF EXISTS "Users can create their own favorites" ON public.user_favorites;
DROP POLICY IF EXISTS "Users can delete their own favorites" ON public.user_favorites;

CREATE POLICY "Users can view their own favorites" ON public.user_favorites
  FOR SELECT USING (true);

CREATE POLICY "Users can create their own favorites" ON public.user_favorites
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can delete their own favorites" ON public.user_favorites
  FOR DELETE USING (true);

-- Políticas para product_views se a tabela existir
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'product_views') THEN
        DROP POLICY IF EXISTS "Users can view their own history" ON public.product_views;
        DROP POLICY IF EXISTS "Users can create their own views" ON public.product_views;
        
        CREATE POLICY "Users can view their own history" ON public.product_views
          FOR SELECT USING (true);
        
        CREATE POLICY "Users can create their own views" ON public.product_views
          FOR INSERT WITH CHECK (true);
    END IF;
END
$$;

-- Função para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para updated_at em app_users
DROP TRIGGER IF EXISTS update_app_users_updated_at ON public.app_users;
CREATE TRIGGER update_app_users_updated_at BEFORE UPDATE ON public.app_users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_user_favorites_user_id ON public.user_favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_app_users_device_id ON public.app_users(device_id);

-- Índices para product_views se a tabela existir
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'product_views') THEN
        CREATE INDEX IF NOT EXISTS idx_product_views_user_id ON public.product_views(user_id);
        CREATE INDEX IF NOT EXISTS idx_product_views_product_id ON public.product_views(product_id);
    END IF;
END
$$;
