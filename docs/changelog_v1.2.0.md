# Changelog - Versão 1.2.0

**Data de Release**: 2026-02-26  
**Versão**: 1.2.0+2 (Sprint 2 Finalizada)

---

## ✨ Novidades

### Web Dashboard
*   **Trilha de Auditoria (Audit Logs):** Nova página para rastrear todas as alterações de dados no sistema (Quem, Quando, Onde e o Quê).
*   **Exportação Premium:** Adicionados botões para exportar relatórios em **PDF** (layout otimizado) e **CSV** (compatível com Excel).
*   **Segurança RLS (Multi-tenant):** Reforço total nas políticas de banco de dados para garantir isolamento de dados entre condomínios.
*   **Melhoria de Acesso:** Login de administrador agora é insensível a maiúsculas/minúsculas para evitar erros de entrada.

### Mobile App (Flutter)
*   **Sync Status Footer:** Rodapé interativo que mostra o estado da sincronização em tempo real (Pendente, Offline ou Atualizado).
*   **Busca por CPF:** Campo de pesquisa otimizado para CPF, limpando automaticamente após cada registro de sucesso.
*   **Navegação de Sync:** Botão de sincronismo movido para o topo direto (AppBar) para melhor UX.
*   **Gerenciamento de Erros de Rede:** Detecção explícita de falta de conexão com mensagem "Verifique conexão".

---

## 🔧 Correções

### Mobile
*   **Crash ao Lançar:** Adicionadas permissões nativas de `CAMERA` e `WRITE_EXTERNAL_STORAGE` no Manifesto, corrigindo crashes em dispositivos físicos.
*   **Versão Mínima:** Elevado `minSdkVersion` para 21 para compatibilidade com plugins modernos de scan.
*   **FAB Overlay:** Reposicionado o botão "Escanear QR" para não sobrepor a barra de status de sincronização.

### Web
*   **RLS Profiles:** Corrigida política que impedia usuários de lerem seu próprio perfil, o que causava o sumiço das abas administrativas.

---

## 🚀 Status do Projeto
*   **Backend:** 100% Operacional com RLS.
*   **Frontend:** Funcionalidades de Auditoria e Relatórios validadas.
*   **Mobile:** APK de Release estável gerado e disponível.

---
*Versão focada em Segurança, Rastreabilidade e Experiência do Usuário final.*
