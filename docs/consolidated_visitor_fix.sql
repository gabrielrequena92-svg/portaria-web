-- ==========================================================
-- 🛠️ Conserto da Infraestrutura de Visitantes
-- Este script restaura as views de conformidade e a RPC do Mobile
-- ==========================================================

-- 1. View para Status de Conformidade de Documentos
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

-- 2. View de Resumo por Entidade (Empresa/Visitante)
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
    MIN(status_vencimento) as status_geral
FROM status_prioridade
GROUP BY parent_id, parent_type;

-- 3. RPC para o Mobile App buscar os visitantes com o status real calculado
DROP FUNCTION IF EXISTS get_visitantes_mobile_sync(uuid);

CREATE OR REPLACE FUNCTION get_visitantes_mobile_sync(p_condominio_id UUID)
RETURNS TABLE (
    id UUID,
    condominio_id UUID,
    empresa_id UUID,
    tipo_visitante_id UUID,
    nome TEXT,
    cpf TEXT,
    foto_url TEXT,
    situacao TEXT,
    created_at TIMESTAMP WITH TIME ZONE,
    status TEXT
) AS $$
BEGIN
    RETURN QUERY
    WITH doc_faltantes_empresa AS (
        -- Conta quantos docs obrigatórios cada empresa NÃO enviou
        SELECT e_e.id as dfe_empresa_id, count(*) as dfe_total
        FROM documento_tipos dt_e
        CROSS JOIN empresas e_e
        LEFT JOIN documentos d_e ON d_e.tipo_id = dt_e.id AND d_e.parent_id = e_e.id
        WHERE e_e.condominio_id = p_condominio_id
          AND dt_e.obrigatorio = true 
          AND d_e.id IS NULL
          AND (
              dt_e.entidade_alvo = 'TODOS' OR 
              dt_e.entidade_alvo = e_e.tipo_empresa OR 
              (e_e.tipo_empresa != 'MEI' AND dt_e.entidade_alvo = 'GERAL') OR 
              (e_e.tipo_empresa = 'MEI' AND dt_e.entidade_alvo = 'MEI')
          )
        GROUP BY e_e.id
    ),
    doc_faltantes_visitante AS (
        -- Conta quantos docs obrigatórios o visitante NÃO enviou
        SELECT v_v.id as dfv_visitante_id, count(*) as dfv_total
        FROM documento_tipos dt_v
        JOIN visitantes v_v ON v_v.condominio_id = p_condominio_id
        JOIN empresas e_v ON v_v.empresa_id = e_v.id
        LEFT JOIN documentos d_v ON d_v.tipo_id = dt_v.id AND d_v.parent_id = v_v.id
        WHERE dt_v.obrigatorio = true 
          AND d_v.id IS NULL
          AND (
              dt_v.entidade_alvo = 'VISITANTE' OR 
              dt_v.entidade_alvo = 'TODOS' OR 
              (e_v.tipo_empresa != 'MEI' AND dt_v.entidade_alvo = 'VISITANTE_GERAL') OR 
              (e_v.tipo_empresa = 'MEI' AND dt_v.entidade_alvo = 'VISITANTE_MEI')
          )
        GROUP BY v_v.id
    )
    SELECT 
        v.id::UUID,
        v.condominio_id::UUID,
        v.empresa_id::UUID,
        v.tipo_visitante_id::UUID,
        v.nome::TEXT,
        v.cpf::TEXT,
        v.foto_url::TEXT,
        COALESCE(v.situacao, 'FORA')::TEXT as situacao,
        v.created_at::TIMESTAMP WITH TIME ZONE,
        CASE 
            WHEN v.status = 'bloqueado' THEN 'bloqueado'
            WHEN e.status IN ('bloqueada', 'inativa') THEN 'bloqueado_empresa'
            -- Busca pendência de doc na empresa
            WHEN (SELECT dfe.dfe_total FROM doc_faltantes_empresa dfe WHERE dfe.dfe_empresa_id = v.empresa_id LIMIT 1) > 0 THEN 'bloqueado_docs_empresa'
            -- Se algum doc enviado da empresa estiver vencido
            WHEN COALESCE(e_doc.status_geral, 'valido') IN ('vencido', 'pendente') THEN 'bloqueado_docs_empresa'
            -- Busca pendência de doc no visitante
            WHEN (SELECT dfv.dfv_total FROM doc_faltantes_visitante dfv WHERE dfv.dfv_visitante_id = v.id LIMIT 1) > 0 THEN 'bloqueado_docs_visitante'
            -- Se algum doc enviado do visitante estiver vencido
            WHEN COALESCE(v_doc.status_geral, 'valido') IN ('vencido', 'pendente') THEN 'bloqueado_docs_visitante'
            ELSE v.status
        END::TEXT as status
    FROM visitantes v
    LEFT JOIN empresas e ON v.empresa_id = e.id
    LEFT JOIN v_entidade_conformidade_resumo e_doc ON e_doc.parent_id = e.id AND e_doc.parent_type = 'empresa'
    LEFT JOIN v_entidade_conformidade_resumo v_doc ON v_doc.parent_id = v.id AND v_doc.parent_type = 'visitante'
    WHERE v.condominio_id = p_condominio_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
