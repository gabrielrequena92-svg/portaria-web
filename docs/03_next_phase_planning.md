# Planejamento Técnico: Fase 2 - Multi-Tenant & DDS

Este documento registra as decisões tomadas durante a fase de planejamento para a próxima grande atualização do sistema.

## 1. Arquitetura Multi-Tenant (Soft Isolation)

Conforme decidido, o isolamento dos dados será feito de forma lógica dentro do mesmo banco de dados, utilizando a coluna `condominio_id`.

- **Vínculo por Login:** Cada perfil de usuário (`profiles`) terá um `condominio_id`.
- **Super Admin:** O usuário master (Gabriel) terá permissão global e um **Context Switcher** no header do dashboard para alternar entre as obras/condomínios.
- **Filtragem Global:** Todas as buscas ao Supabase utilizarão `.eq('condominio_id', active_condominio_id)`.

## 2. Gestão de Condomínios e Logins

A gestão será centralizada no Painel Web para o Super Admin:
- **Upload de Logo:** Cada condomínio terá sua logomarca para personalizar os relatórios PDF em modo white-label.
- **Vínculo Automatizado:** Novos usuários criados pelo Super Admin serão vinculados automaticamente ao condomínio selecionado.

## 3. Relatório DDS (Lista de Presença)

Baseado no modelo da Zopone Engenharia:
- **Layout Pautado:** Tabela com campos vazios para Matrícula, Função e Assinatura (preenchimento manual no canteiro).
- **Identificação da Empresa:** Nome da empresa contratante inserido no campo "Escopo do Treinamento".
- **Inteligência de Conformidade:** Marcação visual `(Pend. Docs)` ao lado do nome do visitante caso existam pendências detectadas pelo motor de auditoria.

## 4. Próximos Passos (Execução)

1.  Elevar o usuário atual para `super_admin` via SQL.
2.  Implementar o Seletor de Obras no Header.
3.  Desenvolver o módulo "Obra" e o gerador de PDF DDS.
