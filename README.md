# Sistema de Controle de Visitantes (SaaS)

Sistema completo de controle de acesso para condomínios e empresas, composto por aplicativo móvel (Offline-First) e painel administrativo web.

## 🔥 Novas Funcionalidades (Recentes)

- **Gestão de Empresas Contratantes:** Agora é possível vincular visitantes a uma empresa principal (ME) e uma subcontratada (MEI) simultaneamente.
- **Relatório de Pendências:** Nova aba em Auditoria que agrupa inconformidades documentais por empresa, facilitando a cobrança via WhatsApp.
- **Filtros Inteligentes:** As telas de Visitantes e Empresas agora carregam por padrão apenas os registros "Ativos", otimizando o dia a dia da portaria.
- **Interface Premium:** Melhorias visuais em tooltips e badges para uma navegação mais fluida.

## 🚀 Próxima Atualização (Em Planejamento)

- **Arquitetura Multi-Tenant (Obras):** Isolamento total de dados baseado no login do usuário.
- **Perfil Super Admin:** Gestão centralizada de todas as obras e logins através de um seletor global.
- **Lista de Presença DDS:** Gerador de PDF pautado (Estilo Zopone) com inteligência de conformidade documental automática.

## Estrutura do Projeto

Este repositório opera como um monorepo lógico:

- `apps/mobile`: Aplicativo Flutter (Android/iOS).
- `apps/web`: Painel Administrativo em Next.js.
- `docs/`: Documentação de arquitetura e manuais.

## Requisitos

- Node.js 18+
- Flutter 3.x+
- Conta no Supabase

## Configuração

Consulte os documentos em `docs/` para detalhes de arquitetura e setup.
