import 'package:drift/drift.dart';
import '../../../domain/entities/tipo_visitante.dart';
import '../database/app_database.dart' as db;

class TipoVisitanteModel extends TipoVisitante {
  TipoVisitanteModel({
    required String id,
    String? condominioId,
    required String nome,
    required DateTime createdAt,
  }) : super(
          id: id,
          condominioId: condominioId,
          nome: nome,
          createdAt: createdAt,
        );

  factory TipoVisitanteModel.fromJson(Map<String, dynamic> json) {
    return TipoVisitanteModel(
      id: json['id'],
      condominioId: json['condominio_id'],
      nome: json['nome'],
      createdAt: DateTime.parse(json['created_at']),
    );
  }

  factory TipoVisitanteModel.fromDrift(db.TiposVisitante driftObject) {
    return TipoVisitanteModel(
      id: driftObject.id,
      condominioId: driftObject.condominioId,
      nome: driftObject.nome,
      createdAt: driftObject.createdAt,
    );
  }

  db.TiposVisitantesCompanion toDrift() {
    return db.TiposVisitantesCompanion(
      id: Value(id),
      condominioId: Value(condominioId),
      nome: Value(nome),
      createdAt: Value(createdAt),
    );
  }
}
