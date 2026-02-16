-- 1. Criação da Tabela de Tipos de Visitantes
CREATE TABLE IF NOT EXISTS tipos_visitantes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nome TEXT NOT NULL,
    condominio_id UUID REFERENCES condominios(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Inserir tipos padrão
INSERT INTO tipos_visitantes (nome) VALUES 
('Visitante'),
('Prestador de Serviço'),
('Fornecedor')
ON CONFLICT DO NOTHING;

-- 2. Atualização da Tabela de Visitantes
ALTER TABLE visitantes ADD COLUMN IF NOT EXISTS tipo_visitante_id UUID REFERENCES tipos_visitantes(id);

-- 3. Atualização da Tabela de Registros (Veículos)
ALTER TABLE registros ADD COLUMN IF NOT EXISTS placa_veiculo TEXT;
ALTER TABLE registros ADD COLUMN IF NOT EXISTS foto_veiculo_url TEXT;

-- 4. Criação da Tabela de Perfis (RBAC)
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    role TEXT DEFAULT 'user' CHECK (role IN ('admin', 'user')),
    condominio_id UUID REFERENCES condominios(id),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS em profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile" 
ON profiles FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Admins can view and edit all profiles" 
ON profiles FOR ALL 
USING (
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE id = auth.uid() AND role = 'admin'
    )
);

-- 5. Trigger para Validação de Ciclo (Prevenção de Duplicidade)
CREATE OR REPLACE FUNCTION check_visitor_cycle()
RETURNS TRIGGER AS $$
DECLARE
    last_type TEXT;
BEGIN
    -- Busca o último tipo de registro do visitante
    SELECT tipo INTO last_type
    FROM registros
    WHERE visitante_id = NEW.visitante_id
    ORDER BY data_registro DESC
    LIMIT 1;

    -- Se o novo registro é 'entrada' e o último também foi 'entrada'
    IF NEW.tipo = 'entrada' AND last_type = 'entrada' THEN
        RAISE EXCEPTION 'Visitante já possui uma entrada ativa sem saída correspondente.';
    END IF;

    -- Se o novo registro é 'saida' e o último não foi 'entrada'
    IF NEW.tipo = 'saida' AND (last_type IS NULL OR last_type = 'saida') THEN
        RAISE EXCEPTION 'Visitante não possui uma entrada ativa para registrar saída.';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_check_visitor_cycle
BEFORE INSERT ON registros
FOR EACH ROW
EXECUTE FUNCTION check_visitor_cycle();
