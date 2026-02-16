import 'package:uuid/uuid.dart';
import '../../../domain/entities/visitante.dart';
import '../../../domain/repositories/visitante_repository.dart';
import '../datasources/local/local_datasource.dart';
import '../datasources/remote/supabase_datasource.dart';
import '../models/visitante_model.dart';

class VisitanteRepositoryImpl implements VisitanteRepository {
  final LocalDatasource _local;
  final SupabaseDatasource _remote;

  VisitanteRepositoryImpl(this._local, this._remote);

  @override
  Future<List<Visitante>> getVisitantes() {
    return _local.getAllVisitantes();
  }

  @override
  Future<Visitante?> getVisitanteById(String id) async {
    final model = await _local.getVisitanteById(id);
    return model != null ? Visitante(
      id: model.id,
      condominioId: model.condominioId,
      empresaId: model.empresaId,
      tipoVisitanteId: model.tipoVisitanteId,
      nome: model.nome,
      documento: model.documento,
      fotoUrl: model.fotoUrl,
      status: model.status,
      syncStatus: model.syncStatus,
    ) : null;
  }

  @override
  Future<void> saveVisitante(Visitante visitante) async {
    // If ID is empty/new, generate UUIDv4
    final id = visitante.id.isEmpty ? const Uuid().v4() : visitante.id;
    
    final model = VisitanteModel(
      id: id,
      condominioId: visitante.condominioId,
      empresaId: visitante.empresaId,
      tipoVisitanteId: visitante.tipoVisitanteId,
      nome: visitante.nome,
      documento: visitante.documento,
      fotoUrl: visitante.fotoUrl,
      status: visitante.status,
      syncStatus: 1, // 1 = Pending Insert/Update
    );
    
    await _local.saveVisitante(model);
  }

  @override
  Future<void> syncVisitantes(String condominioId) async {
    // 1. Push Local Changes
    final unsynced = await _local.getUnsyncedVisitantes();
    for (var v in unsynced) {
      try {
        await _remote.uploadVisitante(v);
        await _local.markVisitanteAsSynced(v.id);
      } catch (e) {
        // Log error, continue to next
        print('Error syncing visitante ${v.id}: $e');
      }
    }

    // 2. Pull Remote Changes
    try {
      final remote = await _remote.fetchVisitantes(condominioId: condominioId);
      await _local.upsertVisitantes(remote);
    } catch (e) {
       print('Error pulling visitantes: $e');
    }
  }
}
