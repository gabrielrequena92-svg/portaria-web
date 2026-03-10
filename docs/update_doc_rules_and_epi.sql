-- 1. Adicionar o novo tipo de documento "Ficha de EPI"
INSERT INTO documento_tipos (slug, nome, obrigatorio, entidade_alvo, vencimento_tipo) 
VALUES ('ficha_epi', 'Ficha de EPI', true, 'VISITANTE', 'NENHUM')
ON CONFLICT (slug) DO NOTHING;

-- 2. Adicionar flag de obrigatoriedade por categoria de visitante
ALTER TABLE tipos_visitantes ADD COLUMN IF NOT EXISTS exige_documentacao BOOLEAN DEFAULT false;

-- 3. Ativar apenas para Prestadores de Serviço (conforme solicitado pelo usuário)
UPDATE tipos_visitantes SET exige_documentacao = true WHERE nome = 'Prestador de Serviço';
UPDATE tipos_visitantes SET exige_documentacao = false WHERE nome != 'Prestador de Serviço';

-- 4. Garantir que categorias como 'Entregas' existam com a flag correta
INSERT INTO tipos_visitantes (nome, exige_documentacao) 
VALUES ('Entregas', false) 
ON CONFLICT DO NOTHING;
