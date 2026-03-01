-- Criar tabela de Leads para novos negócios
CREATE TABLE IF NOT EXISTS leads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nome TEXT NOT NULL,
    email TEXT NOT NULL,
    telefone TEXT NOT NULL,
    descricao_local TEXT NOT NULL,
    status TEXT DEFAULT 'NOVO' CHECK (status IN ('NOVO', 'EM_CONTATO', 'CONVERTIDO', 'DESCARTADO')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS e permitir INSERT anônimo (pois é um formulário público na Landing Page)
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Leads podem ser submetidos publicamente" 
ON leads FOR INSERT TO anon, public 
WITH CHECK (true);

-- Apenas autenticados podem ler os leads (você administrador)
CREATE POLICY "Leitura de leads por autenticados" 
ON leads FOR SELECT TO authenticated 
USING (true);
