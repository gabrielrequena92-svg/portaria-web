import '../../database/app_database.dart';
import '../../models/empresa_model.dart';
import '../../models/visitante_model.dart';
import '../../models/registro_model.dart';
import '../../models/tipo_visitante_model.dart';
import 'package:drift/drift.dart';
import '../../../core/utils/brazil_time.dart';

class LocalDatasource {
  final AppDatabase _db;

  LocalDatasource(this._db);

  // --- Empresas ---
  Future<List<EmpresaModel>> getAllEmpresas() async {
    final query = _db.select(_db.empresas);
    final results = await query.get();
    return results.map((e) => EmpresaModel.fromDrift(e)).toList();
  }

  Future<void> upsertEmpresas(List<EmpresaModel> empresas) async {
    await _db.batch((batch) {
      batch.insertAll(
        _db.empresas,
        empresas.map((e) => e.toDrift()).toList(),
        mode: InsertMode.insertOrReplace,
      );
    });
  }

  // --- Visitantes ---
  Future<List<VisitanteModel>> getAllVisitantes() async {
    final query = _db.select(_db.visitantes);
    final results = await query.get();
    return results.map((e) => VisitanteModel.fromDrift(e)).toList();
  }
  
  Future<VisitanteModel?> getVisitanteById(String id) async {
    final query = _db.select(_db.visitantes)..where((tbl) => tbl.id.equals(id));
    final result = await query.getSingleOrNull();
    return result != null ? VisitanteModel.fromDrift(result) : null;
  }
  
  Future<List<VisitanteModel>> getUnsyncedVisitantes() async {
    final query = _db.select(_db.visitantes)..where((tbl) => tbl.syncStatus.isNotValue(0)); 
    final results = await query.get();
    return results.map((e) => VisitanteModel.fromDrift(e)).toList();
  }

  Future<void> upsertVisitantes(List<VisitanteModel> visitantes) async {
    await _db.batch((batch) {
      batch.insertAll(
        _db.visitantes,
        visitantes.map((e) => e.toDrift()).toList(),
        mode: InsertMode.insertOrReplace,
      );
    });
  }
  
  Future<void> saveVisitante(VisitanteModel visitante) async {
    await _db.into(_db.visitantes).insertOnConflictUpdate(visitante.toDrift());
  }
  
  Future<void> markVisitanteAsSynced(String id) async {
     await (_db.update(_db.visitantes)..where((tbl) => tbl.id.equals(id))).write(
       VisitantesCompanion(
         syncStatus: const Value(0), 
         lastSyncedAt: Value(BrazilTime.now()),
       ),
     );
  }

  // --- Registros (Logs) ---
  Future<void> saveRegistro(RegistroModel registro) async {
    await _db.into(_db.registros).insert(registro.toDrift());
  }

  Future<void> upsertRegistros(List<RegistroModel> registros) async {
    await _db.batch((batch) {
      batch.insertAll(
        _db.registros,
        registros.map((e) => e.toDrift()).toList(),
        mode: InsertMode.insertOrReplace,
      );
    });

    // CRITICAL: Update Visitante Status based on these new logs
    // We group by visitor and find their latest log to determine current status
    for (var r in registros) {
      // Find latest log for this visitor (including the one we just inserted or others)
      final latest = await getUltimoRegistroVisitante(r.visitanteId);
      if (latest != null) {
        final newStatus = latest.tipo.toLowerCase() == 'entrada' ? 'DENTRO' : 'FORA';
        
        // Update Visitante Table
        await (_db.update(_db.visitantes)..where((tbl) => tbl.id.equals(r.visitanteId))).write(
          VisitantesCompanion(
            situacao: Value(newStatus),
            lastSyncedAt: Value(BrazilTime.now()), // Mark as 'touched'
          ),
        );
      }
    }
  }

  Future<List<RegistroModel>> getUnsyncedRegistros() async {
    final query = _db.select(_db.registros)..where((tbl) => tbl.syncStatus.isNotValue(0)); 
    final results = await query.get();
    return results.map((e) => RegistroModel.fromDrift(e)).toList();
  }
  
  Future<void> markRegistroAsSynced(String id) async {
     // For logs, we might delete them after sync or just mark as synced.
     // To save space on mobile, maybe delete old synced logs?
     // For now, let's just mark as synced.
     await (_db.update(_db.registros)..where((tbl) => tbl.id.equals(id))).write(
       RegistrosCompanion(
         syncStatus: const Value(0), 
       ),
     );
  }

  Future<RegistroModel?> getUltimoRegistroVisitante(String visitanteId) async {
    final query = _db.select(_db.registros)
      ..where((tbl) => tbl.visitanteId.equals(visitanteId))
      ..orderBy([(t) => OrderingTerm(expression: t.dataRegistro, mode: OrderingMode.desc)])
      ..limit(1);
    
    final result = await query.getSingleOrNull();
    return result != null ? RegistroModel.fromDrift(result) : null;
  }

  // Get last registro of visitor TODAY (for entry/exit blocking logic)
  Future<RegistroModel?> getUltimoRegistroHoje(String visitanteId) async {
    final now = BrazilTime.now();
    final startOfDay = DateTime(now.year, now.month, now.day, 0, 0, 0);
    final endOfDay = DateTime(now.year, now.month, now.day, 23, 59, 59);
    
    final query = _db.select(_db.registros)
      ..where((tbl) => 
        tbl.visitanteId.equals(visitanteId) &
        tbl.dataRegistro.isBiggerOrEqualValue(startOfDay) &
        tbl.dataRegistro.isSmallerOrEqualValue(endOfDay)
      )
      ..orderBy([(t) => OrderingTerm(expression: t.dataRegistro, mode: OrderingMode.desc)])
      ..limit(1);
    
    final result = await query.getSingleOrNull();
    return result != null ? RegistroModel.fromDrift(result) : null;
  }

  // --- Tipos de Visitantes ---
  Future<List<TipoVisitanteModel>> getAllTiposVisitantes() async {
    final query = _db.select(_db.tiposVisitantes);
    final results = await query.get();
    return results.map((e) => TipoVisitanteModel.fromDrift(e)).toList();
  }

  Future<void> upsertTiposVisitantes(List<TipoVisitanteModel> tipos) async {
    await _db.batch((batch) {
      batch.insertAll(
        _db.tiposVisitantes,
        tipos.map((e) => e.toDrift()).toList(),
        mode: InsertMode.insertOrReplace,
      );
    });
  }
}
