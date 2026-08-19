-- ==============================================================================
-- SCHEMA SUPABASE: HISTÓRICO DE RELATÓRIOS DE ORGANIZAÇÃO E LIMPEZA
-- ==============================================================================
-- Execute este script no "SQL Editor" do seu painel Supabase

-- 1. Criar a Tabela de Histórico de Relatórios
CREATE TABLE IF NOT EXISTS public.relatorios_historico (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    obra_nome TEXT NOT NULL,
    semana_ref TEXT,
    engenheiro TEXT,
    coordenador TEXT,
    total_fotos INTEGER DEFAULT 0,
    tipo_arquivo TEXT DEFAULT 'xlsx', -- 'xlsx' ou 'pdf'
    arquivo_nome TEXT,
    status TEXT DEFAULT 'gerado'
);

-- 2. Habilitar Segurança por Linha (RLS)
ALTER TABLE public.relatorios_historico ENABLE ROW LEVEL SECURITY;

-- 3. Políticas de Acesso (Permitir que usuários autenticados leiam e insiram)
CREATE POLICY "Permitir leitura para usuarios autenticados" 
ON public.relatorios_historico 
FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Permitir insercao para usuarios autenticados" 
ON public.relatorios_historico 
FOR INSERT 
TO authenticated 
WITH CHECK (true);

-- 4. Criar Tabela de Configurações de Obras (Opcional - Para sincronizar obras entre todos os usuários)
CREATE TABLE IF NOT EXISTS public.obras_config (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
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

CREATE POLICY "Permitir insercao e atualizacao de obras para autenticados" 
ON public.obras_config 
FOR ALL 
TO authenticated 
USING (true);

-- 5. Inserir Obras Iniciais Padrão
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
