-- 1. GARANTIR QUE TODOS OS USUÁRIOS EXISTENTES TENHAM UM PERFIL
-- Vamos associá-los ao condomínio padrão se não tiverem um
INSERT INTO public.profiles (id, full_name, role, condominio_id)
SELECT 
    id, 
    raw_user_meta_data->>'full_name', 
    'admin', -- Assumindo admin para os primeiros usuários
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'
FROM auth.users
ON CONFLICT (id) DO UPDATE 
SET condominio_id = COALESCE(profiles.condominio_id, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11');

-- 2. TRIGGER PARA CRIAR PERFIL AUTOMATICAMENTE NO SIGNUP
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role, condominio_id)
  VALUES (
    NEW.id, 
    NEW.raw_user_meta_data->>'full_name', 
    'user', 
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11' -- Condomínio padrão inicial
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Remover se já existir
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
