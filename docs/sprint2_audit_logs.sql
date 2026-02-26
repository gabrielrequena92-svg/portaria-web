-- SPRINT 2: LOGS DE AUDITORIA (Audit Trail)
-- Objetivo: Rastrear TODAS as alterações (INSERT, UPDATE, DELETE) feitas nas tabelas principais
-- para descobrir "quem fez o quê, quando e onde".

-- 1. Criação da Tabela de Logs de Auditoria
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    condominio_id UUID REFERENCES condominios(id),
    user_id UUID REFERENCES auth.users(id), -- O usuário/admin que fez a alteração
    action TEXT NOT NULL CHECK (action IN ('INSERT', 'UPDATE', 'DELETE')),
    table_name TEXT NOT NULL,
    record_id TEXT NOT NULL, -- UUID em texto para ser flexível
    old_data JSONB, -- Como estava o registro ANTES (Null se for INSERT)
    new_data JSONB, -- Como ficou o registro DEPOIS (Null se for DELETE)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS na tabela de auditoria (Somente Admins podem ver a auditoria inteira, e usuários normais não deveriam acessar isso livremente)
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Política de Leitura (Select): Apenas administradores do próprio condomínio podem ver os logs
DROP POLICY IF EXISTS "Admins podem ver logs do seu condominio" ON audit_logs;
CREATE POLICY "Admins podem ver logs do seu condominio" ON audit_logs
FOR SELECT TO authenticated
USING (
    condominio_id = (SELECT condominio_id FROM profiles WHERE id = auth.uid())
    AND 
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
);

-- Política de Escrita (Insert): Apenas a nossa função do PostgreSQL tem permissão real para inserir de forma atômica
-- O front-end JAMAIS insere no audit_log diretamente por segurança.


-- 2. Função Base para o Trigger (Executada automaticamente em cada modificação de tabela)
CREATE OR REPLACE FUNCTION process_audit_log()
RETURNS TRIGGER AS $$
DECLARE
    current_user_id UUID;
    v_condominio_id UUID;
BEGIN
    -- Captura o ID do usuário diretamente do token JWT enviado via PostgREST (Supabase)
    current_user_id := auth.uid();
    
    -- Se não houver UID (ex: operação via service_role ou internal postgres), usa NULL 
    -- ou a gente aborta pra evitar log órfão em regras estritas.

    IF TG_OP = 'INSERT' THEN
        -- No caso de Condominios, condominio_id é o próprio ID (NEW.id). Se a tabela não tiver condominio_id e não for a de condominios, precisará de tratamento custom.
        -- Como as tabelas vitais têm condominio_id, pegamos de NEW.condominio_id.
        BEGIN
            -- Tratamento dinâmico para pegar condominio_id
            EXECUTE 'SELECT $1.condominio_id' INTO v_condominio_id USING NEW;
        EXCEPTION WHEN OTHERS THEN
            v_condominio_id := NULL;
        END;

        INSERT INTO audit_logs (condominio_id, user_id, action, table_name, record_id, new_data)
        VALUES (v_condominio_id, current_user_id, TG_OP, TG_TABLE_NAME::TEXT, NEW.id::TEXT, row_to_json(NEW)::JSONB);
        RETURN NEW;
    
    ELSIF TG_OP = 'UPDATE' THEN
        BEGIN
            EXECUTE 'SELECT $1.condominio_id' INTO v_condominio_id USING NEW;
        EXCEPTION WHEN OTHERS THEN
            v_condominio_id := NULL;
        END;
        
        -- Só registra no log de auditoria se houver uma mudança real (ignora UPDATE sem alteração)
        IF row_to_json(OLD)::JSONB != row_to_json(NEW)::JSONB THEN
            INSERT INTO audit_logs (condominio_id, user_id, action, table_name, record_id, old_data, new_data)
            VALUES (v_condominio_id, current_user_id, TG_OP, TG_TABLE_NAME::TEXT, NEW.id::TEXT, row_to_json(OLD)::JSONB, row_to_json(NEW)::JSONB);
        END IF;
        RETURN NEW;
    
    ELSIF TG_OP = 'DELETE' THEN
        BEGIN
            EXECUTE 'SELECT $1.condominio_id' INTO v_condominio_id USING OLD;
        EXCEPTION WHEN OTHERS THEN
            v_condominio_id := NULL;
        END;
        
        INSERT INTO audit_logs (condominio_id, user_id, action, table_name, record_id, old_data)
        VALUES (v_condominio_id, current_user_id, TG_OP, TG_TABLE_NAME::TEXT, OLD.id::TEXT, row_to_json(OLD)::JSONB);
        RETURN OLD;
    END IF;
    
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Aplicação do Trigger nas Tabelas Vitais
-- Visitantes
DROP TRIGGER IF EXISTS audit_visitantes_trigger ON visitantes;
CREATE TRIGGER audit_visitantes_trigger
AFTER INSERT OR UPDATE OR DELETE ON visitantes
FOR EACH ROW EXECUTE FUNCTION process_audit_log();

-- Empresas
DROP TRIGGER IF EXISTS audit_empresas_trigger ON empresas;
CREATE TRIGGER audit_empresas_trigger
AFTER INSERT OR UPDATE OR DELETE ON empresas
FOR EACH ROW EXECUTE FUNCTION process_audit_log();

-- Registros (Nossos históricos de entrada/saída)
DROP TRIGGER IF EXISTS audit_registros_trigger ON registros;
CREATE TRIGGER audit_registros_trigger
AFTER INSERT OR UPDATE OR DELETE ON registros
FOR EACH ROW EXECUTE FUNCTION process_audit_log();

-- Tipos de Visitantes (Categorias)
DROP TRIGGER IF EXISTS audit_tipos_trigger ON tipos_visitantes;
CREATE TRIGGER audit_tipos_trigger
AFTER INSERT OR UPDATE OR DELETE ON tipos_visitantes
FOR EACH ROW EXECUTE FUNCTION process_audit_log();
