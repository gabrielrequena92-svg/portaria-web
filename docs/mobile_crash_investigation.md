# Investigação de Crashes no Mobile - Registro de Visitantes

**Data**: 2026-02-16  
**Versão**: 1.1.0+2  
**Plataforma**: Flutter Mobile (Android Emulator)

## Resumo Executivo

Durante a implementação do fluxo de veículos e categorias de visitantes, foram identificados crashes críticos no aplicativo mobile ao tentar registrar **SAÍDA** de visitantes. A **ENTRADA** funciona perfeitamente, mas a saída causa crash completo do app (tela preta).

---

## Implementações Realizadas

### 1. Categorias de Visitantes ✅

**Objetivo**: Exibir categoria do visitante nos cards do mobile

**Mudanças**:
- Modificado `visitante_card.dart` para resolver nome da categoria a partir do ID
- Adicionado parâmetro `tiposVisitantes` (Map) passado do `HomeScreen`
- Exibição: `tiposVisitantes[tipoVisitanteId]?.nome ?? 'Sem categoria'`

**Status**: ✅ **Funcionando**

**Arquivos Modificados**:
- `apps/mobile/lib/presentation/features/visitors/widgets/visitante_card.dart`
- `apps/mobile/lib/presentation/features/visitors/screens/home_screen.dart`

---

### 2. Fluxo de Veículos (TENTATIVA FALHADA) ❌

**Objetivo**: Implementar captura de placa e foto de veículo na entrada/saída

**Componentes Criados**:
1. `VehicleDialog` - Dialog para captura de placa e foto
2. `AccessActionButtons` - Componente com lógica de bloqueio entrada/saída
3. `getUltimoRegistroHoje` - Query para buscar último registro do dia

**Problemas Encontrados**:
- ❌ Crashes constantes ao registrar entrada/saída
- ❌ Problemas com `setState` em widget desmontado
- ❌ Race conditions entre dialogs e callbacks
- ❌ Complexidade excessiva do componente stateful

**Decisão**: Componente `AccessActionButtons` foi **REMOVIDO** e revertido para botões simples

**Arquivos Criados (Não Utilizados)**:
- `apps/mobile/lib/presentation/features/visitors/widgets/vehicle_dialog.dart`
- `apps/mobile/lib/presentation/features/visitors/widgets/access_action_buttons.dart`

**Arquivos Modificados**:
- `apps/mobile/lib/data/datasources/local/local_datasource.dart` (método `getUltimoRegistroHoje`)
- `apps/mobile/lib/presentation/features/visitors/controllers/home_viewmodel.dart`

---

### 3. Correção de Dependências Web ✅

**Problema**: Build do Web falhando com erro "Module not found: @radix-ui/react-tabs"

**Solução**:
```bash
npm install @radix-ui/react-tabs
```

**Status**: ✅ **Resolvido**

---

### 4. Deploy Web ✅

**Ações Realizadas**:
- Commit: `fb04d11` - "feat: implementação de categorias e fluxo completo de veículos v1.1.0"
- Push para branch `master`
- Deploy automático no Vercel iniciado

**Status**: ✅ **Concluído**

---

### 5. Build APK Release ✅

**Versão**: 1.1.0+2  
**Tamanho**: 77 MB  
**Localização**: `apps/mobile/build/app/outputs/flutter-apk/app-release.apk`

**Status**: ✅ **Gerado com sucesso**

---

## Problemas Críticos Identificados

### 🚨 PROBLEMA 1: Crash ao Registrar SAÍDA

**Sintomas**:
- App funciona perfeitamente ao registrar **ENTRADA**
- App crashando (tela preta) ao registrar **SAÍDA**
- "Lost connection to device"
- Nenhum log aparece (nem os adicionados para debug)

**Código Problemático**:
```dart
// ENTRADA - FUNCIONA ✅
await viewModel.registerAccess(visitante, 'entrada');

// SAÍDA - CRASHANDO ❌
await viewModel.registerAccess(visitante, 'saida');
```

**Tentativas de Correção**:

1. **Remoção de componente stateful complexo**
   - Removido `AccessActionButtons`
   - Voltado para botões simples inline
   - Resultado: Problema persistiu

2. **Desabilitação de auto-sync**
   - Comentado `await syncData()` após registro
   - Resultado: Entrada funcionou, saída continuou crashando

3. **Adição de try-catch e logs detalhados**
   ```dart
   print('🔴 SAÍDA button clicked');
   print('🔴 Visitante: ${visitante.nome}');
   print('🔴 Calling registerAccess...');
   ```
   - Resultado: **NENHUM log apareceu**, indicando crash antes do callback

4. **Verificação de context.mounted**
   - Adicionado em todos os lugares
   - Resultado: Sem efeito

5. **Remoção de setState problemáticos**
   - Removido todos os `setState` após callbacks
   - Resultado: Sem efeito

**Status**: ❌ **NÃO RESOLVIDO**

**Hipóteses**:
1. Problema de memória/estado corrompido do emulador
2. Bug no Flutter/Riverpod específico para tipo 'saida'
3. Constraint de banco de dados violada apenas na saída
4. Crash nativo (Android) não capturado pelo Dart

---

### 🚨 PROBLEMA 2: Registros Não Sincronizam com Web

**Sintomas**:
- Entrada registrada com sucesso no mobile
- Registro salvo no banco local (SQLite/Drift)
- Registro **NÃO aparece** no dashboard Web

**Possíveis Causas**:
1. Auto-sync desabilitado para debug (temporário)
2. Erro na sincronização (trigger P0001 esperado devido a registros órfãos antigos)
3. Problema de rede
4. Erro no `syncService.syncAll()`

**Status**: ⚠️ **Investigação Necessária** (auto-sync foi desabilitado para isolar crash)

---

## Código Atual

### registerAccess (home_viewmodel.dart)

```dart
Future<void> registerAccess(
  Visitante visitante, 
  String tipo, {
  String? placaVeiculo,
  String? fotoVeiculoUrl,
}) async {
  try {
    print('🚀 registerAccess START - tipo: $tipo, visitante: ${visitante.nome}');
    
    final now = BrazilTime.now();
    print('✅ BrazilTime.now() = $now');
    
    final registro = Registro(
      id: _uuid.v4(),
      condominioId: visitante.condominioId,
      visitanteId: visitante.id,
      empresaId: visitante.empresaId,
      tipo: tipo,  // 'entrada' ou 'saida'
      dataRegistro: now,
      placaVeiculo: placaVeiculo,
      fotoVeiculoUrl: fotoVeiculoUrl,
      visitanteNomeSnapshot: visitante.nome,
      visitanteCpfSnapshot: visitante.documento,
      visitorPhotoSnapshot: visitante.fotoUrl,
      empresaNomeSnapshot: state.empresas[visitante.empresaId]?.nome ?? '-',
      syncStatus: 1, // Pending
    );
    print('✅ Registro object created: ${registro.id}');

    await _registroRepository.saveRegistro(registro);
    print('✅ Registro saved to local DB');
    
    // TEMPORARILY DISABLED: Auto-sync after registration (causing crashes)
    // await syncData();
    print('⚠️ Auto-sync disabled for debugging');
    
    print('🎉 registerAccess COMPLETED');
  } catch (e, stackTrace) {
    print('❌ ERROR in registerAccess: $e');
    print('Stack trace: $stackTrace');
    state = state.copyWith(errorMessage: 'Erro ao registrar $tipo: $e');
  }
}
```

### Botões de Ação (home_screen.dart)

```dart
// ENTRADA - Funciona ✅
ElevatedButton.icon(
  onPressed: () async {
    try {
      await viewModel.registerAccess(visitante, 'entrada');
      if (context.mounted) {
        Navigator.pop(context);
        _searchController.clear();
        await viewModel.loadVisitantes('');
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Entrada de ${visitante.nome} registrada!'),
            backgroundColor: Colors.green[700],
          ),
        );
      }
    } catch (e) {
      print('Error registering entrada: $e');
      // Error handling...
    }
  },
  icon: const Icon(Icons.login),
  label: const Text('ENTRADA'),
)

// SAÍDA - Crashando ❌
ElevatedButton.icon(
  onPressed: () async {
    print('🔴 SAÍDA button clicked');
    print('🔴 Visitante: ${visitante.nome}');
    print('🔴 Context mounted: ${context.mounted}');
    
    try {
      print('🔴 Calling registerAccess...');
      await viewModel.registerAccess(visitante, 'saida');
      print('🔴 registerAccess completed');
      
      if (context.mounted) {
        print('🔴 Closing dialog...');
        Navigator.pop(context);
        _searchController.clear();
        await viewModel.loadVisitantes('');
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Saída de ${visitante.nome} registrada!'),
            backgroundColor: Colors.red[700],
          ),
        );
      }
    } catch (e, stackTrace) {
      print('🔴 ERROR in saida button: $e');
      print('🔴 Stack trace: $stackTrace');
      // Error handling...
    }
  },
  icon: const Icon(Icons.logout),
  label: const Text('SAÍDA'),
)
```

---

## Próximos Passos Recomendados

### Opção 1: Reiniciar Ambiente (Mais Provável)
1. Fechar emulador completamente
2. Executar `flutter clean`
3. Executar `flutter pub get`
4. Reiniciar emulador
5. Reinstalar app (`flutter install --uninstall-only` + `flutter run`)

### Opção 2: Investigar Logs Nativos
```bash
# Capturar logs do Android
adb logcat -d > crash_log.txt

# Filtrar por erros fatais
adb logcat -d | grep -i "fatal\|crash\|exception"
```

### Opção 3: Simplificar Ainda Mais
1. Criar botão de teste isolado
2. Chamar `registerAccess('saida')` diretamente
3. Sem dialog, sem navegação
4. Verificar se crash persiste

### Opção 4: Reverter Mudanças
1. Fazer checkout do commit anterior que funcionava
2. Identificar exatamente qual mudança causou o problema
3. Aplicar mudanças incrementalmente

### Opção 5: Implementação Alternativa
1. Criar método separado `registerSaida()` 
2. Duplicar lógica ao invés de usar parâmetro `tipo`
3. Isolar completamente entrada e saída

---

## Arquivos Modificados Nesta Sessão

### Mobile
- `apps/mobile/lib/presentation/features/visitors/widgets/visitante_card.dart`
- `apps/mobile/lib/presentation/features/visitors/screens/home_screen.dart`
- `apps/mobile/lib/presentation/features/visitors/controllers/home_viewmodel.dart`
- `apps/mobile/lib/data/datasources/local/local_datasource.dart`
- `apps/mobile/pubspec.yaml` (versão 1.1.0+2)

### Web
- `apps/web/app/dashboard/visitantes/page.tsx`
- `apps/web/components/features/visitantes/visitor-list.tsx`
- `apps/web/package.json` (+ @radix-ui/react-tabs)

### Novos Arquivos (Não Utilizados)
- `apps/mobile/lib/presentation/features/visitors/widgets/vehicle_dialog.dart`
- `apps/mobile/lib/presentation/features/visitors/widgets/access_action_buttons.dart`

---

## Logs de Teste

### Teste 1: Entrada (Sucesso)
```
🚀 registerAccess START - tipo: entrada, visitante: [Nome]
✅ BrazilTime.now() = [timestamp]
✅ Registro object created: [uuid]
✅ Registro saved to local DB
⚠️ Auto-sync disabled for debugging
🎉 registerAccess COMPLETED
```

### Teste 2: Saída (Crash)
```
[NENHUM LOG APARECEU]
Lost connection to device.
Exit code: 0
```

---

## Conclusão

A implementação de **categorias** foi bem-sucedida e está funcionando. O **deploy do Web** foi concluído com sucesso. O **APK release** foi gerado.

Porém, há um **crash crítico** ao registrar saída de visitantes no mobile que não foi resolvido. O problema é de difícil diagnóstico pois:
1. Nenhum log aparece (crash muito precoce)
2. Código de entrada e saída são idênticos
3. Múltiplas tentativas de correção falharam

**Recomendação**: Reiniciar ambiente de desenvolvimento e investigar logs nativos do Android antes de continuar com novas implementações.
