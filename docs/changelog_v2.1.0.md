# Changelog - Versão 2.1.0

**Data de Release**: 2026-03-01  
**Versão**: 2.1.0 (Gestão de Documentos & Conformidade)

---

## ✨ Novas Funcionalidades

### Web Admin (Next.js)

*   **Sistema de Gestão de Documentos**: Nova aba "Documentação" nos diálogos de Empresa e Visitante.
    *   Upload de PDF, PNG e JPG vinculado ao registro.
    *   Visualização e exclusão de documentos com um clique.
    *   Exibição da data de validade com badge de status: `VÁLIDO`, `VENCE EM BREVE` (10 dias), `VENCIDO`.
*   **22 Tipos de Documentos Configurados** com regras por entidade:
    *   **MEI**: CCMEI, RG/CPF do Titular, Cartão CNPJ.
    *   **ME/LTDA/Geral**: Cartão CNPJ, Contrato Social, PCMSO, PGR.
    *   **Visitantes/Prestadores**: RG/CPF, ASO, Carteira de Vacinação, CTPS, Ficha de Registro, Ordem de Serviço, CNH, Integração, NR06, NR10, NR11, NR12, NR18, NR33, NR35.
*   **Conformidade nas Listagens**: Nova coluna "Documentação" nas telas de Empresas e Visitantes com badges de status em tempo real.

## 🎨 Melhorias de UI/UX

*   **Layout Padronizado**: Aba de Documentação usa coluna única, consistente com a aba "Dados Básicos".
*   **Scroll Vertical**: Lista de documentos (especialmente Visitantes com 15+ itens) usa scroll independente.
*   **Visual Premium**: Cards de documentos com bordas pontilhadas, sombras, efeitos hover e botões em verde esmeralda.

## 🗃️ Backend / Banco de Dados

*   Novas tabelas: `documento_tipos` e `documentos`.
*   Novas views: `v_conformidade_documentos` e `v_entidade_conformidade_resumo`.
*   Nova coluna `tipo_empresa` (`MEI` / `GERAL`) na tabela `empresas`.
*   Script de infraestrutura: `docs/documentos_infra.sql`.

---

## 🐛 Bug Conhecido (Pendente)

*   **Upload falha com erro de Storage**: O upload de arquivos retorna "Erro ao fazer upload para o storage". Causa provável: **políticas de RLS no bucket `documentos` do Supabase Storage não configuradas**. Correção necessária no Supabase Dashboard (Storage → Policies).

    ```sql
    -- Executar no SQL Editor do Supabase:
    CREATE POLICY "Upload permitido" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'documentos');
    CREATE POLICY "Leitura permitida" ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'documentos');
    CREATE POLICY "Exclusão permitida" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'documentos');
    ```

---
*Versão focada em Conformidade Documental e Gestão de Documentos.*
