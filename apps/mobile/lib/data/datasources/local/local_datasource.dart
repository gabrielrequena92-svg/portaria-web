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
