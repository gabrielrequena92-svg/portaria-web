# Changelog - Versão 1.1.0

**Data de Release**: 2026-02-16  
**Versão**: 1.1.0+2

---

## ✨ Novidades

### Web Dashboard

#### Categorias de Visitantes
- ✅ Nova coluna "Categoria" na lista de visitantes
- ✅ JOIN com tabela `tipos_visitantes` na query
- ✅ Indicador visual (bolinha roxa) para categorias
- ✅ Fallback "Sem categoria" para visitantes sem tipo

**Arquivos Modificados**:
- `apps/web/app/dashboard/visitantes/page.tsx`
- `apps/web/components/features/visitantes/visitor-list.tsx`

### Mobile App

#### Exibição de Categorias
- ✅ Categorias exibidas em todos os cards de visitantes
- ✅ Resolução automática de nome a partir do ID
- ✅ Sincronização com tipos de visitantes do backend

**Arquivos Modificados**:
- `apps/mobile/lib/presentation/features/visitors/widgets/visitante_card.dart`
- `apps/mobile/lib/presentation/features/visitors/screens/home_screen.dart`

---

## 🔧 Correções

### Build e Deploy

#### Dependências Web
- ✅ Instalada dependência faltante `@radix-ui/react-tabs`
- ✅ Build de produção Next.js bem-sucedido
- ✅ Deploy no Vercel concluído

#### Versioning
- ✅ Mobile: `1.0.0+1` → `1.1.0+2`
- ✅ APK release gerado (77 MB)

---

## 🐛 Problemas Conhecidos

### Mobile - Crash ao Registrar Saída ❌

**Descrição**: Aplicativo crashando (tela preta) ao tentar registrar SAÍDA de visitante.

**Status**: Não resolvido

**Workaround**: Nenhum disponível no momento

**Impacto**: Alto - Funcionalidade crítica indisponível

**Detalhes**: Ver `docs/mobile_crash_investigation.md`

### Mobile - Sincronização com Web ⚠️

**Descrição**: Registros de entrada não aparecem no dashboard Web

**Status**: Investigação necessária

**Causa Provável**: Auto-sync temporariamente desabilitado para debug

**Impacto**: Médio - Dados ficam apenas no dispositivo local

---

## 🚀 Deploy

### Web
- **Status**: ✅ Deployed
- **Plataforma**: Vercel
- **Branch**: master
- **Commit**: fb04d11
- **URL**: [Verificar no dashboard do Vercel]

### Mobile
- **Status**: ✅ APK Gerado
- **Localização**: `apps/mobile/build/app/outputs/flutter-apk/app-release.apk`
- **Tamanho**: 77 MB
- **Distribuição**: Pendente

---

## 📋 Checklist de Validação

### Web
- [x] Build de produção bem-sucedido
- [x] Deploy no Vercel concluído
- [x] Categorias exibidas corretamente
- [ ] Testes em produção realizados
- [ ] Validação de relatórios com dados de veículos

### Mobile
- [x] APK release gerado
- [x] Categorias exibidas nos cards
- [x] Entrada de visitante funciona
- [ ] Saída de visitante funciona (BLOQUEADO - crash)
- [ ] Sincronização com Web funciona
- [ ] Fluxo de veículos implementado

---

## 🔄 Mudanças Revertidas

### Fluxo de Veículos (Componente Complexo)

**Componentes Removidos**:
- `AccessActionButtons` (stateful widget)
- `VehicleDialog` (não utilizado)
- Lógica de bloqueio entrada/saída
- Validação de veículo na saída

**Motivo**: Crashes constantes e problemas de setState em widget desmontado

**Status**: Revertido para botões simples

**Próximos Passos**: Reimplementar de forma mais simples e incremental

---

## 📊 Estatísticas

### Arquivos Modificados
- **Web**: 3 arquivos
- **Mobile**: 6 arquivos
- **Docs**: 2 arquivos novos

### Linhas de Código
- **Adicionadas**: ~500 linhas
- **Removidas**: ~300 linhas (reversão de componentes)
- **Modificadas**: ~200 linhas

### Tempo de Desenvolvimento
- **Implementação**: ~4 horas
- **Debug**: ~3 horas
- **Deploy**: ~30 minutos

---

## 🎯 Próxima Versão (1.2.0)

### Planejado
- [ ] Resolver crash ao registrar saída
- [ ] Reabilitar sincronização automática
- [ ] Implementar fluxo de veículos (versão simplificada)
- [ ] Adicionar busca por placa de veículo
- [ ] Exportação de relatórios PDF
- [ ] Notificações push

### Melhorias Técnicas
- [ ] Testes automatizados
- [ ] CI/CD completo
- [ ] Crash reporting (Sentry)
- [ ] Analytics (Google Analytics/Mixpanel)

---

## 📞 Suporte

Para problemas ou dúvidas sobre esta versão:
1. Verificar `docs/mobile_crash_investigation.md`
2. Consultar logs do Vercel para problemas no Web
3. Verificar `docs/deploy_guide.md` para instruções de deploy

---

## 🙏 Agradecimentos

Versão desenvolvida com foco em estabilidade e funcionalidades essenciais. Apesar dos desafios técnicos encontrados, as funcionalidades principais foram entregues com sucesso.
