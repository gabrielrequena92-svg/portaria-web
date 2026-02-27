import 'package:uuid/uuid.dart';
import '../../../domain/entities/visitante.dart';
import '../../../domain/repositories/visitante_repository.dart';
import '../datasources/local/local_datasource.dart';
import '../datasources/remote/supabase_datasource.dart';
import '../models/visitante_model.dart';
import '../../../core/utils/brazil_time.dart';

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
      situacao: model.situacao,
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
      situacao: visitante.situacao,
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
      // We use a custom upsert to avoid overwriting "status" if we just calculated it from logs
      // But for now, let's assume the log sync is the source of truth for status.
      // If we blindly upsert, we might revert status if the remote 'visitantes' table is outdated.
      // Ideally, the remote 'visitantes' table should be updated when a log is inserted (via database function/trigger).
      // Since we don't have backend code control here, we will rely on client-side calculation.
      // Strategy: Upsert visitors -> Re-run status calculation from logs to ensure consistency.
      await _local.upsertVisitantes(remote);
      
      // Re-calculate status from local logs to ensure they are correct even after visitor sync
      // This is expensive but safer for consistency without backend triggers
      final allVisitors = await _local.getAllVisitantes();
      for(var vModel in allVisitors) {
         // Use the general 'Last Record' method to avoid Timezone/Day boundary issues with 'Hoje'
         final lastLog = await _local.getUltimoRegistroVisitante(vModel.id); 
         if (lastLog != null) {
            final correctStatus = lastLog.tipo.toLowerCase() == 'entrada' ? 'DENTRO' : 'FORA';
             // Only update if situacao implies a change
            if (vModel.situacao != correctStatus) {
               await _local.saveVisitante(vModel.copyWith(situacao: correctStatus, syncStatus: 0));
            }
         }
      }

    } catch (e) {
       print('Error pulling visitantes: $e');
    }
  }

  @override
  Future<int> getPendingSyncCount() async {
    return await _local.getPendingVisitantesCount();
  }
}
