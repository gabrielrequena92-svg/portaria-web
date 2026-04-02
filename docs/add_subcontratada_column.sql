-- Script para adicionar o vínculo de subcontratação entre Prestador(MEI) e Empresa Titular(ME) no visitante
ALTER TABLE visitantes
ADD COLUMN subcontratada_empresa_id UUID REFERENCES empresas(id) ON DELETE SET NULL;

-- Atualizar algum índice se for necessário para uso intensivo (Opcional, porém recomendado para filtros)
CREATE INDEX idx_visitantes_subcontratada_empresa ON visitantes (subcontratada_empresa_id);
