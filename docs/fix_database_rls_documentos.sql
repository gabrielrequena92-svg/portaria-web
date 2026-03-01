-- Políticas RLS para a tabela documentos

-- 1. Leitura: Usuário só pode ler documentos do próprio condomínio
CREATE POLICY "Leitura de documentos do mesmo condomínio"
ON documentos FOR SELECT TO authenticated
USING (
    condominio_id IN (
        SELECT condominio_id FROM profiles WHERE id = auth.uid()
    )
);

-- 2. Inserção: Usuário só pode inserir documentos no próprio condomínio
CREATE POLICY "Inserção de documentos no mesmo condomínio"
ON documentos FOR INSERT TO authenticated
WITH CHECK (
    condominio_id IN (
        SELECT condominio_id FROM profiles WHERE id = auth.uid()
    )
);

-- 3. Atualização: Usuário só pode atualizar documentos do próprio condomínio
CREATE POLICY "Atualização de documentos do mesmo condomínio"
ON documentos FOR UPDATE TO authenticated
USING (
    condominio_id IN (
        SELECT condominio_id FROM profiles WHERE id = auth.uid()
    )
)
WITH CHECK (
    condominio_id IN (
        SELECT condominio_id FROM profiles WHERE id = auth.uid()
    )
);

-- 4. Exclusão: Usuário só pode remover documentos do próprio condomínio
CREATE POLICY "Exclusão de documentos do mesmo condomínio"
ON documentos FOR DELETE TO authenticated
USING (
    condominio_id IN (
        SELECT condominio_id FROM profiles WHERE id = auth.uid()
    )
);
