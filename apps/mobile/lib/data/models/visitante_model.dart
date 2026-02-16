import 'package:drift/drift.dart';
import '../../../core/utils/brazil_time.dart';
import '../../../domain/entities/visitante.dart';
import '../database/app_database.dart' as db;

class VisitanteModel extends Visitante {
  VisitanteModel({
    required String id,
    required String condominioId,
    String? empresaId,
    String? tipoVisitanteId,
    required String nome,
    String? documento,
    String? fotoUrl,
    required String status,
    required int syncStatus,
  }) : super(
          id: id,
          condominioId: condominioId,
          empresaId: empresaId,
          tipoVisitanteId: tipoVisitanteId,
          nome: nome,
          documento: documento,
          fotoUrl: fotoUrl,
          status: status,
          syncStatus: syncStatus,
        );

  factory VisitanteModel.fromJson(Map<String, dynamic> json) {
    return VisitanteModel(
      id: json['id'],
      condominioId: json['condominio_id'],
      empresaId: json['empresa_id'],
      tipoVisitanteId: json['tipo_visitante_id'],
      nome: json['nome'],
      documento: json['cpf'], 
      fotoUrl: json['foto_url'],
      status: json['status'],
      syncStatus: 0,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'condominio_id': condominioId,
      'empresa_id': empresaId,
      'tipo_visitante_id': tipoVisitanteId,
      'nome': nome,
      'cpf': documento,
      'foto_url': fotoUrl,
      'status': status,
    };
  }

  factory VisitanteModel.fromDrift(db.Visitante driftObject) {
    return VisitanteModel(
      id: driftObject.id,
      condominioId: driftObject.condominioId,
      empresaId: driftObject.empresaId,
      tipoVisitanteId: driftObject.tipoVisitanteId,
      nome: driftObject.nome,
      documento: driftObject.documento,
      fotoUrl: driftObject.fotoUrl,
      status: driftObject.status,
      syncStatus: driftObject.syncStatus,
    );
  }

  db.VisitantesCompanion toDrift() {
    return db.VisitantesCompanion(
      id: Value(id),
      condominioId: Value(condominioId),
      empresaId: Value(empresaId),
      tipoVisitanteId: Value(tipoVisitanteId),
      nome: Value(nome),
      documento: Value(documento),
      fotoUrl: Value(fotoUrl),
      status: Value(status),
      syncStatus: Value(syncStatus),
      updatedAt: Value(BrazilTime.now()),
      createdAt: Value(BrazilTime.now()),
    );
  }

  VisitanteModel copyWith({
    String? id,
    String? condominioId,
    String? empresaId,
    String? tipoVisitanteId,
    String? nome,
    String? documento,
    String? fotoUrl,
    String? status,
    int? syncStatus,
  }) {
    return VisitanteModel(
      id: id ?? this.id,
      condominioId: condominioId ?? this.condominioId,
      empresaId: empresaId ?? this.empresaId,
      tipoVisitanteId: tipoVisitanteId ?? this.tipoVisitanteId,
      nome: nome ?? this.nome,
      documento: documento ?? this.documento,
      fotoUrl: fotoUrl ?? this.fotoUrl,
      status: status ?? this.status,
      syncStatus: syncStatus ?? this.syncStatus,
    );
  }
}
