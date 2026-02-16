-- ADICIONAR COLUNA ENDERECO SE NÃO EXISTIR
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='condominios' AND column_name='endereco') THEN
        ALTER TABLE condominios ADD COLUMN endereco TEXT;
    END IF;
END $$;

-- Garantir que o condomínio de teste exista para as ações que usam ID fixo
INSERT INTO condominios (id, nome, endereco)
VALUES ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Condomínio Padrão', 'Endereço não informado')
ON CONFLICT (id) DO NOTHING;
