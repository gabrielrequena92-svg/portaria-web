-- 1. Criar o bucket 'documentos' caso ainda não exista
INSERT INTO storage.buckets (id, name, public)
VALUES ('documentos', 'documentos', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Permitir INSERT (upload) para usuários autenticados
CREATE POLICY "Upload permitido" 
ON storage.objects FOR INSERT TO authenticated 
WITH CHECK (bucket_id = 'documentos');

-- 3. Permitir SELECT (leitura) para usuários autenticados e navegação pública
CREATE POLICY "Leitura permitida" 
ON storage.objects FOR SELECT TO public
USING (bucket_id = 'documentos');

-- 4. Permitir DELETE para usuários autenticados
CREATE POLICY "Exclusão permitida" 
ON storage.objects FOR DELETE TO authenticated 
USING (bucket_id = 'documentos');
