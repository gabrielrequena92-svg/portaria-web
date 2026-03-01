-- FIX SPRINT 2: RLS para a tabela de Profiles
-- Resolve o problema de sumiço das abas de Configurações e Auditoria

-- 1. Garantir que o usuário consiga ler seu próprio perfil (essencial para o sidebar e outras políticas)
DROP POLICY IF EXISTS "Usuários podem ver o próprio perfil" ON profiles;
CREATE POLICY "Usuários podem ver o próprio perfil" ON profiles
FOR SELECT TO authenticated
USING ( id = auth.uid() );

-- 2. Permitir que o usuário atualize seus próprios dados (opcional, mas recomendado)
DROP POLICY IF EXISTS "Usuários podem atualizar o próprio perfil" ON profiles;
CREATE POLICY "Usuários podem atualizar o próprio perfil" ON profiles
FOR UPDATE TO authenticated
USING ( id = auth.uid() )
WITH CHECK ( id = auth.uid() );

-- 3. (OPCIONAL) Permitir que Admins do mesmo condomínio vejam outros perfis
-- Isso pode ser útil se você quiser listar usuários no futuro.
-- DROP POLICY IF EXISTS "Admins podem ver perfis do mesmo condominio" ON profiles;
-- CREATE POLICY "Admins podem ver perfis do mesmo condominio" ON profiles
-- FOR SELECT TO authenticated
-- USING (
--     condominio_id = (SELECT condominio_id FROM profiles WHERE id = auth.uid())
--     AND 
--     (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
-- );
