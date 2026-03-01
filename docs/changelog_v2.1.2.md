# Changelog v2.1.2 - Reestruturação Visual e Motor de Conformidade (01/03/2026)

## ✨ Novas Funcionalidades e Melhorias Visuais

### Landing Page & Onboarding
- **Tema Light Premium**: Transição completa do visual da Landing Page para um tema claro (slate-50 a white) com destaques em cores vibrantes e gradientes sutis, focado em alta conversão e estética SaaS moderna.
- **Efeito de Partículas Interativas**: Implementação de sistema magnético em Canvas HTML5 (`<ParticlesBackground />`). As partículas agora acompanham e reagem fluidamente aos movimentos do mouse em primeiro plano, adicionando um efeito "Wow" de constelação tecnológica.
- **Mockups Realistas**: Adicionados prints processados via CSS e imagens reais mostrando a intersecção do funcionamento do Dashboard Web responsivo e o App Mobile rodando nativamente no celular, simulando o "Funcionamento Offline".
- **Nova Página de Captura de Leads (/cadastro)**: Redirecionamento 100% de botões de conversão gratuitos (CTAs) para o novo funil validado com Zod.
- **Schema Leads**: Nova tabela isolada via Script SQL inserida no Supabase com *Row Level Security (RLS)* público para captação segura e unificada de formulários do `/cadastro`.

## 🛠️ Correções de Interface Ativa (Dashboard)

### Motor Oficial de Regras de Conformidade
- **Substituição da View SQL Falha**: As Views (`v_entidade_conformidade_resumo`) nativas apresentavam falhas ao validar a ausência de documentos obrigatórios (retornando falso-positivo "Em dia"). Elas foram substituídas pelo novo utilitário TypeScript `calcularStatusConformidade` rodando diretamente in-memory nos servidores do Next.js via fetching otimizado.
- **Novos Status Dinâmicos Implementados (Empresas e Visitantes)**:
  - 🟡 **Doc. Pendente**: A entidade ainda não enviou todos os documentos definidos como "obrigatórios".
  - 🔴 **Vencido**: Algum documento atingiu a data final de validade.
  - 🔴 **Bloqueado p/ Acesso**: *Herança de bloqueio* de entidades pai, onde visitantes atrelados automaticamente perdem a aptidão se a empresa gestora deles for desativada/bloqueada pelo administrador.
  
### Correção Polimórfica (Query Optimization)
- Resolvido Erro 500 fatal do ORM do Supabase (`Could not find a relationship between 'empresas' and 'documentos'`). 
- As APIs de `visitantes/page.tsx` e `empresas/page.tsx` foram modularizadas para consumir uma lista primária da malha local, extraindo os IDs e só então efetuando o match polimórfico (`parent_type`) e calculando o conformidade internamente por nó da árvore.

## 🚀 DevOps & Deploy
Trilhas de Deploy enviadas para a pipeline Vercel e perfeitamente sincronizadas ao braço origin/master no repositório GitHub (`gabrielrequena92-svg/portaria-web`).
