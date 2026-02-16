import 'package:drift/drift.dart';

class TiposVisitantes extends Table {
  TextColumn get id => text()();
  TextColumn get condominioId => text().nullable()();
  TextColumn get nome => text()();
  DateTimeColumn get createdAt => dateTime()();

  @override
  Set<Column> get primaryKey => {id};
}

class Empresas extends Table {
  TextColumn get id => text()(); // UUID from Supabase
  TextColumn get condominioId => text()();
  TextColumn get nome => text()();
  TextColumn get cnpj => text().nullable()();
  TextColumn get status => text().withDefault(const Constant('ativa'))(); 
  
  IntColumn get syncStatus => integer().withDefault(const Constant(0))(); 
  DateTimeColumn get createdAt => dateTime()();
  DateTimeColumn get updatedAt => dateTime()();
  DateTimeColumn get lastSyncedAt => dateTime().nullable()();

  @override
  Set<Column> get primaryKey => {id};
}

class Visitantes extends Table {
  TextColumn get id => text()(); 
  TextColumn get condominioId => text()();
  TextColumn get empresaId => text().nullable().references(Empresas, #id)();
  TextColumn get tipoVisitanteId => text().nullable().references(TiposVisitantes, #id)();
  TextColumn get nome => text()();
  TextColumn get documento => text().nullable()();
  TextColumn get fotoUrl => text().nullable()();
  TextColumn get status => text().withDefault(const Constant('ativo'))(); 

  IntColumn get syncStatus => integer().withDefault(const Constant(0))();
  DateTimeColumn get createdAt => dateTime()();
  DateTimeColumn get updatedAt => dateTime()();
  DateTimeColumn get lastSyncedAt => dateTime().nullable()();

  @override
  Set<Column> get primaryKey => {id};
}

class Registros extends Table {
  TextColumn get id => text()(); // UUID generated locally
  TextColumn get condominioId => text()();
  TextColumn get visitanteId => text().references(Visitantes, #id)();
  TextColumn get empresaId => text().nullable().references(Empresas, #id)();
  TextColumn get tipo => text()(); // 'entrada' or 'saida'
  TextColumn get placaVeiculo => text().nullable()();
  TextColumn get fotoVeiculoUrl => text().nullable()();
  DateTimeColumn get dataRegistro => dateTime()();

  // Snapshots (De-normalization for history)
  TextColumn get visitanteNomeSnapshot => text()();
  TextColumn get visitanteCpfSnapshot => text().nullable()();
  TextColumn get visitorPhotoSnapshot => text().nullable()();
  TextColumn get empresaNomeSnapshot => text().nullable()();

  IntColumn get syncStatus => integer().withDefault(const Constant(1))(); // 1 = Pending Upload
  DateTimeColumn get createdAt => dateTime()();
  
  @override
  Set<Column> get primaryKey => {id};
}
