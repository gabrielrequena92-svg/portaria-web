-- ADICIONAR COLUNA PLACA_VEICULO NA TABELA VISITANTES
-- Esta coluna é necessária para o formulário de cadastro de visitantes
ALTER TABLE visitantes ADD COLUMN IF NOT EXISTS placa_veiculo TEXT;

-- Forçar atualização do cache do schema (Supabase às vezes demora para reconhecer)
NOTIFY pgrst, 'reload schema';
