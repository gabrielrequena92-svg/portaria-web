# Changelog - Versão 2.0.1

**Data de Release**: 2026-03-01  
**Versão**: 2.0.1+3 (Correção de Status na Busca)

---

## 🔧 Correções

### Mobile (Flutter)
*   **Correção de Status de Presença na Busca**: Resolvido o problema de reaproveitamento de estado de widgets no Flutter. Agora, ao buscar por CPF parcial, o card do visitante reflete corretamente se ele está ou não "No Local", habilitando os botões de Entrada/Saída adequados.
*   **Ciclo de Vida do Widget**: Implementada atualização reativa no `VisitanteCard` para garantir que dados assíncronos de registro sejam recarregados sempre que o ID do visitante mudar.

## 📝 Documentação
*   **Troubleshooting**: Adicionada seção explicativa sobre o erro de "Status Incorreto na Busca" e sua respectiva solução técnica.
*   **Padronização**: Todo o projeto e documentação administrativa agora seguem oficialmente o **Português (Brasil)**.

---
*Versão focada em Integridade de Dados e UX de Busca.*
