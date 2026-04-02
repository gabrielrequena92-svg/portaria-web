-- ==============================================================================
-- FASE 1: CRIAÇÃO TEMPLATE "MÚLTIPLOS CONDOMÍNIOS / OBRAS"
-- Por favor, copie todo este arquivo e execute no painel 'SQL Editor' do seu Supabase.
-- ==============================================================================

-- 1. Criação da Tabela de Condomínios / Obras
CREATE TABLE IF NOT EXISTS condominios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome VARCHAR(255) NOT NULL,
    cnpj VARCHAR(20),
    endereco TEXT,
    logo_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    status VARCHAR(50) DEFAULT 'ativo'
);

-- 2. Inserção de uma "Obra Padrão" (Migração Segura)
-- Precisamos de pelo menos 1 obra para vincularmos todos os seus registros atuais sem perder nenhum dado.
INSERT INTO condominios (id, nome, cnpj, endereco)
VALUES ('00000000-0000-0000-0000-000000000001', 'Obra Matriz (Migração)', '00.000.000/0000-00', 'Sede Principal')
ON CONFLICT DO NOTHING;

-- 3. Adição da coluna condominio_id nas tabelas cruciais
ALTER TABLE empresas 
    ADD COLUMN IF NOT EXISTS condominio_id UUID REFERENCES condominios(id);

ALTER TABLE visitantes 
    ADD COLUMN IF NOT EXISTS condominio_id UUID REFERENCES condominios(id);

ALTER TABLE acessos 
    ADD COLUMN IF NOT EXISTS condominio_id UUID REFERENCES condominios(id);

-- 4. Atualizando registros existentes para pertencerem à Obra Padrão gerada
UPDATE empresas SET condominio_id = '00000000-0000-0000-0000-000000000001' WHERE condominio_id IS NULL;
UPDATE visitantes SET condominio_id = '00000000-0000-0000-0000-000000000001' WHERE condominio_id IS NULL;
UPDATE acessos SET condominio_id = '00000000-0000-0000-0000-000000000001' WHERE condominio_id IS NULL;

-- 5. Opcional, porém recomendado: Setar "NOT NULL" na coluna, agora que todos os registros possuem um ID referenciado.
ALTER TABLE empresas ALTER COLUMN condominio_id SET NOT NULL;
-- Dependendo do fluxo do seu negócio, visitantes e acessos também poderiam ter NOT NULL ativado.
-- Para evitar travamentos em testes parciais iniciais da refatoração, deixá-los como opcionais neste começo ajuda.
