import 'package:drift/drift.dart';
import '../../../core/utils/brazil_time.dart';
import '../../../domain/entities/registro.dart';
import '../database/app_database.dart' as db;

class RegistroModel extends Registro {
  RegistroModel({
    required String id,
    required String condominioId,
    required String visitanteId,
    String? empresaId,
    required String tipo,
    required DateTime dataRegistro,
    String? placaVeiculo,
    String? fotoVeiculoUrl,
    required String visitanteNomeSnapshot,
    String? visitanteCpfSnapshot,
    String? visitorPhotoSnapshot,
    String? empresaNomeSnapshot,
    String? statusSnapshot,
    required int syncStatus,
  }) : super(
          id: id,
          condominioId: condominioId,
          visitanteId: visitanteId,
          empresaId: empresaId,
          tipo: tipo,
          dataRegistro: dataRegistro,
          placaVeiculo: placaVeiculo,
          fotoVeiculoUrl: fotoVeiculoUrl,
          visitanteNomeSnapshot: visitanteNomeSnapshot,
          visitanteCpfSnapshot: visitanteCpfSnapshot,
          visitorPhotoSnapshot: visitorPhotoSnapshot,
          empresaNomeSnapshot: empresaNomeSnapshot,
          statusSnapshot: statusSnapshot,
          syncStatus: syncStatus,
        );

  // To Supabase JSON (For Upload)
  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'condominio_id': condominioId,
      'visitante_id': visitanteId,
      'empresa_id': empresaId,
      'tipo': tipo,
      // Supabase expects UTC timestamps (timestamptz column type)
      'data_registro': dataRegistro.toUtc().toIso8601String(),
      'placa_veiculo': placaVeiculo,
      'foto_veiculo_url': fotoVeiculoUrl,
      'visitante_nome_snapshot': visitanteNomeSnapshot,
      'visitante_cpf_snapshot': visitanteCpfSnapshot,
      'visitor_photo_snapshot': visitorPhotoSnapshot,
      'empresa_nome_snapshot': empresaNomeSnapshot,
      'status_snapshot': statusSnapshot,
    };
  }

  // From Drift Class
  factory RegistroModel.fromDrift(db.Registro driftObject) {
    return RegistroModel(
      id: driftObject.id,
      condominioId: driftObject.condominioId,
      visitanteId: driftObject.visitanteId,
      empresaId: driftObject.empresaId,
      tipo: driftObject.tipo,
      dataRegistro: driftObject.dataRegistro,
      placaVeiculo: driftObject.placaVeiculo,
      fotoVeiculoUrl: driftObject.fotoVeiculoUrl,
      visitanteNomeSnapshot: driftObject.visitanteNomeSnapshot,
      visitanteCpfSnapshot: driftObject.visitanteCpfSnapshot,
      visitorPhotoSnapshot: driftObject.visitorPhotoSnapshot,
      empresaNomeSnapshot: driftObject.empresaNomeSnapshot,
      statusSnapshot: driftObject.statusSnapshot,
      syncStatus: driftObject.syncStatus,
    );
  }

  // To Drift Companion (For Insert)
  db.RegistrosCompanion toDrift() {
    return db.RegistrosCompanion(
      id: Value(id),
      condominioId: Value(condominioId),
      visitanteId: Value(visitanteId),
      empresaId: Value(empresaId),
      tipo: Value(tipo),
      dataRegistro: Value(dataRegistro),
      placaVeiculo: Value(placaVeiculo),
      fotoVeiculoUrl: Value(fotoVeiculoUrl),
      visitanteNomeSnapshot: Value(visitanteNomeSnapshot),
      visitanteCpfSnapshot: Value(visitanteCpfSnapshot),
      visitorPhotoSnapshot: Value(visitorPhotoSnapshot),
      empresaNomeSnapshot: Value(empresaNomeSnapshot),
      statusSnapshot: Value(statusSnapshot),
      syncStatus: Value(syncStatus),
      createdAt: Value(BrazilTime.now()),
    );
  }

  RegistroModel copyWith({
    String? id,
    String? condominioId,
    String? visitanteId,
    String? empresaId,
    String? tipo,
    DateTime? dataRegistro,
    String? placaVeiculo,
    String? fotoVeiculoUrl,
    String? visitanteNomeSnapshot,
    String? visitanteCpfSnapshot,
    String? visitorPhotoSnapshot,
    String? empresaNomeSnapshot,
    String? statusSnapshot,
    int? syncStatus,
  }) {
    return RegistroModel(
      id: id ?? this.id,
      condominioId: condominioId ?? this.condominioId,
      visitanteId: visitanteId ?? this.visitanteId,
      empresaId: empresaId ?? this.empresaId,
      tipo: tipo ?? this.tipo,
      dataRegistro: dataRegistro ?? this.dataRegistro,
      placaVeiculo: placaVeiculo ?? this.placaVeiculo,
      fotoVeiculoUrl: fotoVeiculoUrl ?? this.fotoVeiculoUrl,
      visitanteNomeSnapshot: visitanteNomeSnapshot ?? this.visitanteNomeSnapshot,
      visitanteCpfSnapshot: visitanteCpfSnapshot ?? this.visitanteCpfSnapshot,
      visitorPhotoSnapshot: visitorPhotoSnapshot ?? this.visitorPhotoSnapshot,
      empresaNomeSnapshot: empresaNomeSnapshot ?? this.empresaNomeSnapshot,
      statusSnapshot: statusSnapshot ?? this.statusSnapshot,
      syncStatus: syncStatus ?? this.syncStatus,
    );
  }
}
