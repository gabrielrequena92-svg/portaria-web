-- DIAGNÓSTICO E CORREÇÃO DEFINITIVA DE RLS PARA PROFILES
-- Execute isto para verificar e corrigir o acesso

-- 1. Desabilitar RLS temporariamente para garantir que não é um bloqueio de leitura
-- Se as abas voltarem após isso, o problema é 100% no RLS.
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;

-- 2. Garantir que o valor da role seja 'admin' minúsculo
-- Rodar isto para o seu usuário (ou para todos os admins)
UPDATE public.profiles SET role = 'admin' WHERE role ILIKE 'admin';

-- 3. Recriar a política de forma mais abrangente (e reabilitar RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Usuários podem ver o próprio perfil" ON public.profiles;
CREATE POLICY "Usuários podem ver o próprio perfil" ON public.profiles
FOR SELECT TO authenticated
USING ( id = auth.uid() );

-- Permitir que o sistema (service_role) e triggers funcionem sem restrições
-- (Isso já é padrão, mas não custa reforçar no seu entendimento)

-- 4. VERIFICAÇÃO (Rode isto no SQL Editor)
-- SELECT role FROM public.profiles WHERE id = auth.uid();
