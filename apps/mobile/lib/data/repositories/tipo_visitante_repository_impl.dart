import '../../domain/entities/tipo_visitante.dart';
import '../../domain/repositories/tipo_visitante_repository.dart';
import '../datasources/local/local_datasource.dart';
import '../datasources/remote/supabase_datasource.dart';
import '../models/tipo_visitante_model.dart';

class TipoVisitanteRepositoryImpl implements TipoVisitanteRepository {
  final LocalDatasource _local;
  final SupabaseDatasource _remote;

  TipoVisitanteRepositoryImpl(this._local, this._remote);

  @override
  Future<List<TipoVisitante>> getTiposVisitantes() async {
    return await _local.getAllTiposVisitantes();
  }

  @override
  Future<void> syncTiposVisitantes(String condominioId) async {
    try {
      final remoteList = await _remote.fetchTiposVisitantes();
      await _local.upsertTiposVisitantes(remoteList);
    } catch (e) {
      print('Error syncing tipos visitantes: $e');
    }
  }
}
