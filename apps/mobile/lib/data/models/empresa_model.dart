import 'package:drift/drift.dart';
import '../../../core/utils/brazil_time.dart';
import '../../../domain/entities/empresa.dart';
import '../database/app_database.dart' as db;

class EmpresaModel extends Empresa {
  EmpresaModel({
    required String id,
    required String condominioId,
    required String nome,
    String? cnpj,
    required String status,
    required int syncStatus,
  }) : super(
          id: id,
          condominioId: condominioId,
          nome: nome,
          cnpj: cnpj,
          status: status,
          syncStatus: syncStatus,
        );

  // From Supabase JSON
  factory EmpresaModel.fromJson(Map<String, dynamic> json) {
    return EmpresaModel(
      id: json['id'],
      condominioId: json['condominio_id'],
      nome: json['nome'],
      cnpj: json['cnpj'],
      status: json['status'],
      syncStatus: 0, // From remote is always synced initially
    );
  }

  // To Supabase JSON
  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'condominio_id': condominioId,
      'nome': nome,
      'cnpj': cnpj,
      'status': status,
    };
  }

  // From Drift Class
  factory EmpresaModel.fromDrift(db.Empresa driftObject) {
    return EmpresaModel(
      id: driftObject.id,
      condominioId: driftObject.condominioId,
      nome: driftObject.nome,
      cnpj: driftObject.cnpj,
      status: driftObject.status,
      syncStatus: driftObject.syncStatus,
    );
  }

  // To Drift Companion (for Insert/Update)
  db.EmpresasCompanion toDrift() {
    return db.EmpresasCompanion(
      id: Value(id),
      condominioId: Value(condominioId),
      nome: Value(nome),
      cnpj: Value(cnpj),
      status: Value(status),
      syncStatus: Value(syncStatus),
      updatedAt: Value(BrazilTime.now()),
      createdAt: Value(BrazilTime.now()),
    );
  }
}
