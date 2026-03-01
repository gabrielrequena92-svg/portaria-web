-- 🛠️ Infraestrutura de Gestão de Documentos

-- 1. Extensão para UUID (se não existir)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Atualizar tabela de Empresas para distinguir MEI de ME/Geral
ALTER TABLE empresas ADD COLUMN IF NOT EXISTS tipo_empresa TEXT DEFAULT 'GERAL' CHECK (tipo_empresa IN ('MEI', 'GERAL'));

-- 3. Tabela de Definição de Tipos de Documentos
CREATE TABLE IF NOT EXISTS documento_tipos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT UNIQUE NOT NULL,
    nome TEXT NOT NULL,
    obrigatorio BOOLEAN DEFAULT true,
    bloqueia_acesso BOOLEAN DEFAULT true,
    entidade_alvo TEXT NOT NULL CHECK (entidade_alvo IN ('MEI', 'GERAL', 'VISITANTE', 'TODOS')),
    vencimento_tipo TEXT DEFAULT 'NENHUM' CHECK (vencimento_tipo IN ('NENHUM', 'ANUAL', 'BIENAL', 'CUSTOM')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Inserir Tipos de Documentos definidos pelo Usuário
INSERT INTO documento_tipos (slug, nome, obrigatorio, entidade_alvo, vencimento_tipo) VALUES 
-- MEI
('ccmei', 'CCMEI', true, 'MEI', 'NENHUM'),
('rg_cpf_titular', 'RG/CPF do Titular', true, 'MEI', 'NENHUM'),
('cartao_cnpj_mei', 'Cartão CNPJ (MEI)', true, 'MEI', 'NENHUM'),
-- ME / GERAL
('cartao_cnpj_geral', 'Cartão CNPJ', true, 'GERAL', 'NENHUM'),
('contrato_social', 'Contrato Social', false, 'GERAL', 'NENHUM'),
('pcmso', 'PCMSO', true, 'GERAL', 'ANUAL'),
('pgr', 'PGR', true, 'GERAL', 'ANUAL'),
-- VISITANTES (PRESTADORES)
('rg_cpf_visitante', 'RG/CPF', true, 'VISITANTE', 'NENHUM'),
('aso', 'ASO', true, 'VISITANTE', 'ANUAL'),
('vacinacao', 'Carteira de Vacinação', true, 'VISITANTE', 'NENHUM'),
('ctps', 'CTPS', true, 'VISITANTE', 'NENHUM'),
('ficha_registro', 'Ficha de Registro', true, 'VISITANTE', 'NENHUM'),
('ordem_servico', 'Ordem de Serviço', true, 'VISITANTE', 'NENHUM'),
('cnh', 'CNH', false, 'VISITANTE', 'ANUAL'),
('integracao', 'Integração', true, 'VISITANTE', 'NENHUM'),
('nr06', 'NR06', true, 'VISITANTE', 'BIENAL'),
('nr10', 'NR10', false, 'VISITANTE', 'BIENAL'),
('nr11', 'NR11', false, 'VISITANTE', 'BIENAL'),
('nr12', 'NR12', false, 'VISITANTE', 'BIENAL'),
('nr18', 'NR18', true, 'VISITANTE', 'BIENAL'),
('nr33', 'NR33', false, 'VISITANTE', 'BIENAL'),
('nr35', 'NR35', false, 'VISITANTE', 'BIENAL')
ON CONFLICT (slug) DO UPDATE SET 
    nome = EXCLUDED.nome,
    obrigatorio = EXCLUDED.obrigatorio,
    entidade_alvo = EXCLUDED.entidade_alvo,
    vencimento_tipo = EXCLUDED.vencimento_tipo;

-- 5. Tabela de Documentos (Uploads)
CREATE TABLE IF NOT EXISTS documentos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    condominio_id UUID REFERENCES condominios(id),
    parent_id UUID NOT NULL, -- ID da empresa ou visitante
    parent_type TEXT NOT NULL CHECK (parent_type IN ('empresa', 'visitante')),
    tipo_id UUID REFERENCES documento_tipos(id),
    arquivo_url TEXT NOT NULL,
    data_vencimento DATE,
    status_verificacao TEXT DEFAULT 'valido' CHECK (status_verificacao IN ('valido', 'vencido', 'pendente')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS
ALTER TABLE documentos ENABLE ROW LEVEL SECURITY;

-- 6. View para Status de Conformidade (Facilitar Alertas de 10 dias e Bloqueio)
/* 
NOTA: A policy de RLS deve considerar o condominio_id. 
Recomendado usar a lógica comum de profiles que já existe no projeto.
*/

CREATE OR REPLACE VIEW v_conformidade_documentos AS
SELECT 
    d.id,
    d.condominio_id,
    d.parent_id,
    d.parent_type,
    dt.nome as documento_nome,
    dt.obrigatorio,
    dt.bloqueia_acesso,
    d.data_vencimento,
    d.arquivo_url,
    CASE 
        WHEN d.data_vencimento IS NULL THEN 'valido'
        WHEN d.data_vencimento < CURRENT_DATE THEN 'vencido'
        WHEN d.data_vencimento <= (CURRENT_DATE + INTERVAL '10 days') THEN 'alerta'
        ELSE 'valido'
    END as status_vencimento
FROM documentos d
JOIN documento_tipos dt ON d.tipo_id = dt.id;

-- 7. View de Resumo por Entidade (Empresa/Visitante) para as listagens
CREATE OR REPLACE VIEW v_entidade_conformidade_resumo AS
WITH status_prioridade AS (
    SELECT 
        parent_id,
        parent_type,
        status_vencimento,
        obrigatorio,
        CASE 
            WHEN status_vencimento = 'vencido' AND obrigatorio = true THEN 1
            WHEN status_vencimento = 'vencido' AND obrigatorio = false THEN 2
            WHEN status_vencimento = 'alerta' AND obrigatorio = true THEN 3
            WHEN status_vencimento = 'alerta' AND obrigatorio = false THEN 4
            ELSE 5
        END as prioridade
    FROM v_conformidade_documentos
)
SELECT 
    parent_id,
    parent_type,
    MIN(status_vencimento) as status_geral -- Simplificado para o MVP
FROM status_prioridade
GROUP BY parent_id, parent_type;
