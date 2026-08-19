-- ==============================================================================
-- SCHEMA SUPABASE: HISTÓRICO DE RELATÓRIOS DE ORGANIZAÇÃO E CONFIGURAÇÃO DE OBRAS
-- ==============================================================================
-- Execute este script no "SQL Editor" do seu painel Supabase

-- 1. Criar a Tabela de Configurações de Obras
CREATE TABLE IF NOT EXISTS public.obras_config (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    nome TEXT UNIQUE NOT NULL,
    codigo TEXT,
    endereco TEXT,
    engenheiro TEXT,
    coordenador TEXT,
    logo_url TEXT,
    locais TEXT[] DEFAULT ARRAY[]::TEXT[]
);

ALTER TABLE public.obras_config ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Permitir leitura de obras para autenticados" 
ON public.obras_config 
FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Permitir gerenciamento de obras para autenticados" 
ON public.obras_config 
FOR ALL 
TO authenticated 
USING (true)
WITH CHECK (true);

-- 2. Criar a Tabela de Histórico de Relatórios
CREATE TABLE IF NOT EXISTS public.relatorios_historico (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    obra_nome TEXT NOT NULL,
    semana_ref TEXT,
    engenheiro TEXT,
    coordenador TEXT,
    total_fotos INTEGER DEFAULT 0,
    tipo_arquivo TEXT DEFAULT 'xlsx', -- 'xlsx'
    arquivo_nome TEXT,
    arquivo_url TEXT, -- URL pública ou caminho no Supabase Storage
    status TEXT DEFAULT 'gerado'
);

-- Garantir que a coluna arquivo_url exista caso a tabela já tenha sido criada antes
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'relatorios_historico' 
        AND column_name = 'arquivo_url'
    ) THEN
        ALTER TABLE public.relatorios_historico ADD COLUMN arquivo_url TEXT;
    END IF;
END $$;

ALTER TABLE public.relatorios_historico ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Permitir leitura de historico para autenticados" 
ON public.relatorios_historico 
FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Permitir insercao de historico para autenticados" 
ON public.relatorios_historico 
FOR ALL 
TO authenticated 
USING (true)
WITH CHECK (true);

-- 3. Inserir Obras Iniciais Padrão (caso ainda não existam)
INSERT INTO public.obras_config (nome, codigo, endereco, engenheiro, coordenador, locais)
VALUES 
(
    '3Z FAZENDA DA MATA', 
    'L3.0002/18', 
    'Rua Antônio Garcia, 8-48 - Bauru/SP', 
    'Jacqueline Correia', 
    'Guilherme Quadros', 
    ARRAY['ADMINISTRATIVO', 'ALMOXARIFADO', 'ENTRADA CANTEIRO', 'CANTEIRO GERAL', 'ARMAÇÃO', 'CARPINTARIA', 'QUÍMICOS', 'SALA MESTRES', 'CIMENTO', 'MÁQUINAS', 'MADEIRA', 'FERRAMENTAS MANUAIS', 'AÇO', 'TUBOS']
),
(
    '5Z CIDADE DAS ÁRVORES', 
    'L5.0041/20', 
    'Av. das Nações Unidas - Bauru/SP', 
    'VINICIUS PERAL', 
    'GUILHERME QUADROS', 
    ARRAY['ADMINISTRATIVO', 'ALMOXARIFADO - EXTERNO', 'ALMOXARIFADO - PRATELEIRA A', 'ALMOXARIFADO - PRATELEIRA B', 'ALMOXARIFADO - PRATELEIRA C', 'ARMAÇÃO', 'BANHEIROS', 'CANTEIRO GERAL', 'CARPINTARIA', 'CIMENTO', 'ENTRADA CANTEIRO', 'FERRAMENTAS MANUAIS', 'MADEIRA', 'MÁQUINAS', 'QUÍMICOS', 'SALA MESTRES', 'TUBOS']
)
ON CONFLICT (nome) DO NOTHING;
