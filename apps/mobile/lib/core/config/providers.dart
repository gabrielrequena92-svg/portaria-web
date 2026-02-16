import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import '../../data/database/app_database.dart';
import '../../data/datasources/local/local_datasource.dart';
import '../../data/datasources/remote/supabase_datasource.dart';
import '../../data/repositories/empresa_repository_impl.dart';
import '../../data/repositories/visitante_repository_impl.dart';
import '../../data/repositories/registro_repository_impl.dart';
import '../../data/repositories/tipo_visitante_repository_impl.dart';
import '../../domain/repositories/empresa_repository.dart';
import '../../domain/repositories/visitante_repository.dart';
import '../../domain/repositories/registro_repository.dart';
import '../../domain/repositories/tipo_visitante_repository.dart';
import '../../domain/usecases/sync_service.dart';

// --- External ---
final supabaseClientProvider = Provider((ref) => Supabase.instance.client);
final databaseProvider = Provider((ref) => AppDatabase());

// --- Datasources ---
final supabaseDatasourceProvider = Provider((ref) {
  return SupabaseDatasource(ref.watch(supabaseClientProvider));
});

final localDatasourceProvider = Provider((ref) {
  return LocalDatasource(ref.watch(databaseProvider));
});

// --- Repositories ---
final empresaRepositoryProvider = Provider<EmpresaRepository>((ref) {
  return EmpresaRepositoryImpl(
    ref.watch(localDatasourceProvider),
    ref.watch(supabaseDatasourceProvider),
  );
});

final visitanteRepositoryProvider = Provider<VisitanteRepository>((ref) {
  return VisitanteRepositoryImpl(
    ref.watch(localDatasourceProvider),
    ref.watch(supabaseDatasourceProvider),
  );
});

final registroRepositoryProvider = Provider<RegistroRepository>((ref) {
  return RegistroRepositoryImpl(
    ref.watch(localDatasourceProvider),
    ref.watch(supabaseDatasourceProvider),
  );
});

final tipoVisitanteRepositoryProvider = Provider<TipoVisitanteRepository>((ref) {
  return TipoVisitanteRepositoryImpl(
    ref.watch(localDatasourceProvider),
    ref.watch(supabaseDatasourceProvider),
  );
});

// --- Use Cases / Services ---
final syncServiceProvider = Provider((ref) {
  return SyncService(
    ref.watch(empresaRepositoryProvider),
    ref.watch(visitanteRepositoryProvider),
    ref.watch(registroRepositoryProvider),
    ref.watch(tipoVisitanteRepositoryProvider),
  );
});
