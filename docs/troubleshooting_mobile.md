# Troubleshooting - Mobile App

Guia de resolução de problemas comuns no aplicativo mobile.

---

## 🚨 Crash ao Registrar Saída

### Sintomas
- App funciona ao registrar ENTRADA
- Tela preta ao clicar em SAÍDA
- "Lost connection to device" nos logs
- App precisa ser reiniciado

### Causa
Não identificada. Investigação em andamento.

### Soluções Tentadas (Sem Sucesso)
1. ❌ Remoção de componentes stateful complexos
2. ❌ Desabilitação de auto-sync
3. ❌ Adição de try-catch e verificações mounted
4. ❌ Simplificação de lógica de navegação

### Workaround Temporário
**Nenhum disponível**. Funcionalidade de saída está indisponível.

### Próximos Passos
1. Reiniciar emulador
2. Executar `flutter clean`
3. Verificar logs nativos do Android via `adb logcat`
4. Testar em dispositivo físico

---

## ⚠️ Registros Não Sincronizam

### Sintomas
- Entrada registrada com sucesso no mobile
- Registro não aparece no dashboard Web
- Sem mensagens de erro visíveis

### Causa
Auto-sync temporariamente desabilitado para debug de crashes.

### Solução
Reabilitar auto-sync no código:

```dart
// Em home_viewmodel.dart, método registerAccess
// Descomentar estas linhas:
print('🔄 Starting syncData...');
await syncData();
print('✅ syncData completed');
```

### Sincronização Manual
Para sincronizar manualmente:
1. Abrir menu do app
2. Clicar em "Sincronizar"
3. Aguardar conclusão

---

## 🔄 Erro 23502 (NOT NULL Constraint)

### Sintomas
```
PostgresException: null value in column "condominio_id" violates not-null constraint
```

### Causa
Registros órfãos no banco local sem `condominio_id`.

### Solução
Reinstalar app para limpar banco local:

```bash
flutter install --uninstall-only
flutter run
```

**Atenção**: Isso apagará todos os dados locais não sincronizados!

---

## 📱 App Não Instala no Emulador

### Sintomas
- Erro ao instalar APK
- "Installation failed"

### Soluções

#### 1. Verificar Espaço
```bash
adb shell df /data
```

#### 2. Limpar Cache
```bash
adb shell pm clear com.portaria.app.mobile
```

#### 3. Desinstalar Versão Antiga
```bash
adb uninstall com.portaria.app.mobile
```

#### 4. Reiniciar Emulador
- Fechar emulador
- Limpar cache do AVD
- Reiniciar

---

## 🐌 App Lento/Travando

### Causas Comuns
1. Muitas imagens em cache
2. Banco de dados grande
3. Sincronização em background

### Soluções

#### Limpar Cache de Imagens
```dart
// No código
await CachedNetworkImage.evictFromCache(imageUrl);
```

#### Limpar Banco Local
```bash
flutter install --uninstall-only
```

#### Otimizar Queries
- Adicionar índices no Drift
- Limitar resultados com `.limit()`
- Usar paginação

---

## 📸 Foto Não Carrega

### Sintomas
- Placeholder aparece
- Imagem não carrega
- Erro de rede

### Soluções

#### 1. Verificar Conexão
```dart
// Testar conectividade
final result = await InternetAddress.lookup('google.com');
if (result.isNotEmpty && result[0].rawAddress.isNotEmpty) {
  print('Connected');
}
```

#### 2. Verificar URL
- URL deve ser HTTPS
- URL deve ser acessível publicamente
- Verificar CORS no Supabase

#### 3. Limpar Cache
```dart
await CachedNetworkImage.evictFromCache(imageUrl);
```

---

## 🔐 Erro de Autenticação

### Sintomas
- "Unauthorized"
- "Invalid token"
- Logout automático

### Soluções

#### 1. Verificar Token
```dart
final session = await Supabase.instance.client.auth.currentSession;
print('Token: ${session?.accessToken}');
```

#### 2. Fazer Logout e Login Novamente
```dart
await Supabase.instance.client.auth.signOut();
// Fazer login novamente
```

#### 3. Verificar Validade do Token
Tokens expiram após 1 hora. O refresh deve ser automático.

---

## 🗄️ Erro no Banco de Dados Local

### Sintomas
- "SqliteException"
- "Database is locked"
- "No such table"

### Soluções

#### 1. Regenerar Schema
```bash
flutter pub run build_runner build --delete-conflicting-outputs
```

#### 2. Reinstalar App
```bash
flutter install --uninstall-only
flutter run
```

#### 3. Verificar Migrations
Checar se todas as migrations foram aplicadas corretamente.

---

## 🔄 Sincronização Travada

### Sintomas
- Indicador de sync não para
- "Sincronizando..." infinito

### Solução
```dart
// Resetar estado de sync
state = state.copyWith(isSyncing: false);
```

Ou reiniciar o app.

---

## 📋 Logs de Debug

### Habilitar Logs Detalhados

```dart
// Em main.dart
void main() {
  // Habilitar logs
  Logger.root.level = Level.ALL;
  Logger.root.onRecord.listen((record) {
    print('${record.level.name}: ${record.time}: ${record.message}');
  });
  
  runApp(MyApp());
}
```

### Capturar Logs do Android

```bash
# Logs em tempo real
adb logcat | grep -i flutter

# Salvar logs em arquivo
adb logcat -d > logs.txt

# Filtrar por erro
adb logcat -d | grep -i "error\|exception\|fatal"
```

### Logs do iOS

```bash
# Abrir Console.app no Mac
# Filtrar por "flutter" ou nome do app
```

---

## 🛠️ Comandos Úteis

### Limpar Tudo
```bash
flutter clean
flutter pub get
flutter pub run build_runner build --delete-conflicting-outputs
```

### Reinstalar App
```bash
flutter install --uninstall-only
flutter run
```

### Verificar Dispositivos
```bash
flutter devices
```

### Hot Reload
```
r - Hot reload
R - Hot restart
q - Quit
```

### Build Release
```bash
flutter build apk --release
flutter build appbundle --release  # Para Play Store
```

---

## 📞 Quando Pedir Ajuda

Se nenhuma solução acima resolver:

1. **Coletar Informações**:
   - Versão do Flutter (`flutter --version`)
   - Versão do app (`pubspec.yaml`)
   - Logs completos (`adb logcat -d > logs.txt`)
   - Screenshots do erro

2. **Reproduzir o Problema**:
   - Passos exatos para reproduzir
   - Frequência (sempre, às vezes, raro)
   - Dispositivos afetados

3. **Verificar Documentação**:
   - `docs/mobile_crash_investigation.md`
   - `docs/changelog_v1.1.0.md`
   - Artifacts na pasta `.gemini/antigravity/brain/`

---

## 🔗 Links Úteis

- [Flutter Docs](https://docs.flutter.dev/)
- [Drift Documentation](https://drift.simonbinder.eu/)
- [Supabase Flutter](https://supabase.com/docs/reference/dart/introduction)
- [Riverpod](https://riverpod.dev/)
