-- CORREÇÃO DE POLÍTICAS: CONDOMÍNIOS
-- Este script garante que portadores do papel 'admin' possam criar e editar o condomínio.

-- 1. Habilitar RLS se ainda não estiver
ALTER TABLE IF EXISTS condominios ENABLE ROW LEVEL SECURITY;

-- 2. Remover políticas antigas para evitar duplicidade
DROP POLICY IF EXISTS "Admins podem tudo em condominios" ON condominios;

-- 3. Criar política de acesso total para admins
-- Nota: Esta política assume que o usuário tem um perfil na tabela 'profiles' com role = 'admin'
CREATE POLICY "Admins podem tudo em condominios" 
ON condominios 
FOR ALL 
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE profiles.id = auth.uid() 
        AND profiles.role = 'admin'
    )
);

-- 4. Permitir que todos os autenticados leiam os dados do condomínio
DROP POLICY IF EXISTS "Todos podem ver condominios" ON condominios;
CREATE POLICY "Todos podem ver condominios" 
ON condominios 
FOR SELECT 
TO authenticated
USING (true);
