-- SPRINT 2: Validação e Reforço de Segurança RLS (Row Level Security)
-- Objetivo: Garantir isolamento total (Tenant Isolation) multi-tenant por condominio_id

-- 1. Forçar a habilitação de RLS em todas as tabelas vitais
ALTER TABLE visitantes ENABLE ROW LEVEL SECURITY;
ALTER TABLE empresas ENABLE ROW LEVEL SECURITY;
ALTER TABLE registros ENABLE ROW LEVEL SECURITY;
ALTER TABLE tipos_visitantes ENABLE ROW LEVEL SECURITY;
ALTER TABLE condominios ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- 2. TABELA: VISITANTES
DROP POLICY IF EXISTS "Visitantes isolation policy" ON visitantes;
CREATE POLICY "Visitantes isolation policy" ON visitantes
FOR ALL TO authenticated
USING (
    condominio_id = (SELECT condominio_id FROM profiles WHERE id = auth.uid())
)
WITH CHECK (
    condominio_id = (SELECT condominio_id FROM profiles WHERE id = auth.uid())
);

-- 3. TABELA: EMPRESAS
DROP POLICY IF EXISTS "Empresas isolation policy" ON empresas;
CREATE POLICY "Empresas isolation policy" ON empresas
FOR ALL TO authenticated
USING (
    condominio_id = (SELECT condominio_id FROM profiles WHERE id = auth.uid())
)
WITH CHECK (
    condominio_id = (SELECT condominio_id FROM profiles WHERE id = auth.uid())
);

-- 4. TABELA: REGISTROS
DROP POLICY IF EXISTS "Registros isolation policy" ON registros;
CREATE POLICY "Registros isolation policy" ON registros
FOR ALL TO authenticated
USING (
    condominio_id = (SELECT condominio_id FROM profiles WHERE id = auth.uid())
)
WITH CHECK (
    condominio_id = (SELECT condominio_id FROM profiles WHERE id = auth.uid())
);

-- 5. TABELA: TIPOS_VISITANTES
-- Leitura: Podem ler os globais (condominio_id IS NULL) e os do seu próprio condomínio
DROP POLICY IF EXISTS "Tipos_visitantes select isolation policy" ON tipos_visitantes;
CREATE POLICY "Tipos_visitantes select isolation policy" ON tipos_visitantes
FOR SELECT TO authenticated
USING (
    condominio_id = (SELECT condominio_id FROM profiles WHERE id = auth.uid()) OR condominio_id IS NULL
);

-- Escrita (Insert/Update/Delete): Só podem alterar/criar pro seu próprio condomínio
DROP POLICY IF EXISTS "Tipos_visitantes write isolation policy" ON tipos_visitantes;
CREATE POLICY "Tipos_visitantes write isolation policy" ON tipos_visitantes
FOR INSERT TO authenticated
WITH CHECK (
    condominio_id = (SELECT condominio_id FROM profiles WHERE id = auth.uid())
);
DROP POLICY IF EXISTS "Tipos_visitantes modify isolation policy" ON tipos_visitantes;
CREATE POLICY "Tipos_visitantes modify isolation policy" ON tipos_visitantes
FOR UPDATE TO authenticated
USING (
    condominio_id = (SELECT condominio_id FROM profiles WHERE id = auth.uid())
) WITH CHECK (
    condominio_id = (SELECT condominio_id FROM profiles WHERE id = auth.uid())
);
DROP POLICY IF EXISTS "Tipos_visitantes delete isolation policy" ON tipos_visitantes;
CREATE POLICY "Tipos_visitantes delete isolation policy" ON tipos_visitantes
FOR DELETE TO authenticated
USING (
    condominio_id = (SELECT condominio_id FROM profiles WHERE id = auth.uid())
);

-- 6. TABELA: CONDOMINIOS
-- Restringir a leitura apenas ao próprio condomínio (ou se for admin geral)
DROP POLICY IF EXISTS "Todos podem ver condominios" ON condominios;
DROP POLICY IF EXISTS "Isolamento leitura de condominios" ON condominios;
CREATE POLICY "Isolamento leitura de condominios" ON condominios
FOR SELECT TO authenticated
USING (
    id = (SELECT condominio_id FROM profiles WHERE id = auth.uid())
    OR 
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
);
