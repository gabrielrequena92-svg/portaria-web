import '../../../domain/entities/empresa.dart';
import '../../../domain/repositories/empresa_repository.dart';
import '../datasources/local/local_datasource.dart';
import '../datasources/remote/supabase_datasource.dart';
import '../models/empresa_model.dart';

class EmpresaRepositoryImpl implements EmpresaRepository {
  final LocalDatasource _local;
  final SupabaseDatasource _remote;

  EmpresaRepositoryImpl(this._local, this._remote);

  @override
  Future<List<Empresa>> getEmpresas() {
    return _local.getAllEmpresas();
  }

  @override
  Future<void> syncEmpresas(String condominioId) async {
    try {
      final remoteEmpresas = await _remote.fetchEmpresas(condominioId: condominioId);
      await _local.upsertEmpresas(remoteEmpresas);
    } catch (e) {
      // Todo: Handle error (log it, but don't crash app)
      rethrow;
    }
  }
}
