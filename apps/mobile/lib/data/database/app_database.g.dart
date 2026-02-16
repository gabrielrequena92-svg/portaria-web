// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'app_database.dart';

// ignore_for_file: type=lint
class $EmpresasTable extends Empresas with TableInfo<$EmpresasTable, Empresa> {
  @override
  final GeneratedDatabase attachedDatabase;
  final String? _alias;
  $EmpresasTable(this.attachedDatabase, [this._alias]);
  static const VerificationMeta _idMeta = const VerificationMeta('id');
  @override
  late final GeneratedColumn<String> id = GeneratedColumn<String>(
    'id',
    aliasedName,
    false,
    type: DriftSqlType.string,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _condominioIdMeta = const VerificationMeta(
    'condominioId',
  );
  @override
  late final GeneratedColumn<String> condominioId = GeneratedColumn<String>(
    'condominio_id',
    aliasedName,
    false,
    type: DriftSqlType.string,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _nomeMeta = const VerificationMeta('nome');
  @override
  late final GeneratedColumn<String> nome = GeneratedColumn<String>(
    'nome',
    aliasedName,
    false,
    type: DriftSqlType.string,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _cnpjMeta = const VerificationMeta('cnpj');
  @override
  late final GeneratedColumn<String> cnpj = GeneratedColumn<String>(
    'cnpj',
    aliasedName,
    true,
    type: DriftSqlType.string,
    requiredDuringInsert: false,
  );
  static const VerificationMeta _statusMeta = const VerificationMeta('status');
  @override
  late final GeneratedColumn<String> status = GeneratedColumn<String>(
    'status',
    aliasedName,
    false,
    type: DriftSqlType.string,
    requiredDuringInsert: false,
    defaultValue: const Constant('ativa'),
  );
  static const VerificationMeta _syncStatusMeta = const VerificationMeta(
    'syncStatus',
  );
  @override
  late final GeneratedColumn<int> syncStatus = GeneratedColumn<int>(
    'sync_status',
    aliasedName,
    false,
    type: DriftSqlType.int,
    requiredDuringInsert: false,
    defaultValue: const Constant(0),
  );
  static const VerificationMeta _createdAtMeta = const VerificationMeta(
    'createdAt',
  );
  @override
  late final GeneratedColumn<DateTime> createdAt = GeneratedColumn<DateTime>(
    'created_at',
    aliasedName,
    false,
    type: DriftSqlType.dateTime,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _updatedAtMeta = const VerificationMeta(
    'updatedAt',
  );
  @override
  late final GeneratedColumn<DateTime> updatedAt = GeneratedColumn<DateTime>(
    'updated_at',
    aliasedName,
    false,
    type: DriftSqlType.dateTime,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _lastSyncedAtMeta = const VerificationMeta(
    'lastSyncedAt',
  );
  @override
  late final GeneratedColumn<DateTime> lastSyncedAt = GeneratedColumn<DateTime>(
    'last_synced_at',
    aliasedName,
    true,
    type: DriftSqlType.dateTime,
    requiredDuringInsert: false,
  );
  @override
  List<GeneratedColumn> get $columns => [
    id,
    condominioId,
    nome,
    cnpj,
    status,
    syncStatus,
    createdAt,
    updatedAt,
    lastSyncedAt,
  ];
  @override
  String get aliasedName => _alias ?? actualTableName;
  @override
  String get actualTableName => $name;
  static const String $name = 'empresas';
  @override
  VerificationContext validateIntegrity(
    Insertable<Empresa> instance, {
    bool isInserting = false,
  }) {
    final context = VerificationContext();
    final data = instance.toColumns(true);
    if (data.containsKey('id')) {
      context.handle(_idMeta, id.isAcceptableOrUnknown(data['id']!, _idMeta));
    } else if (isInserting) {
      context.missing(_idMeta);
    }
    if (data.containsKey('condominio_id')) {
      context.handle(
        _condominioIdMeta,
        condominioId.isAcceptableOrUnknown(
          data['condominio_id']!,
          _condominioIdMeta,
        ),
      );
    } else if (isInserting) {
      context.missing(_condominioIdMeta);
    }
    if (data.containsKey('nome')) {
      context.handle(
        _nomeMeta,
        nome.isAcceptableOrUnknown(data['nome']!, _nomeMeta),
      );
    } else if (isInserting) {
      context.missing(_nomeMeta);
    }
    if (data.containsKey('cnpj')) {
      context.handle(
        _cnpjMeta,
        cnpj.isAcceptableOrUnknown(data['cnpj']!, _cnpjMeta),
      );
    }
    if (data.containsKey('status')) {
      context.handle(
        _statusMeta,
        status.isAcceptableOrUnknown(data['status']!, _statusMeta),
      );
    }
    if (data.containsKey('sync_status')) {
      context.handle(
        _syncStatusMeta,
        syncStatus.isAcceptableOrUnknown(data['sync_status']!, _syncStatusMeta),
      );
    }
    if (data.containsKey('created_at')) {
      context.handle(
        _createdAtMeta,
        createdAt.isAcceptableOrUnknown(data['created_at']!, _createdAtMeta),
      );
    } else if (isInserting) {
      context.missing(_createdAtMeta);
    }
    if (data.containsKey('updated_at')) {
      context.handle(
        _updatedAtMeta,
        updatedAt.isAcceptableOrUnknown(data['updated_at']!, _updatedAtMeta),
      );
    } else if (isInserting) {
      context.missing(_updatedAtMeta);
    }
    if (data.containsKey('last_synced_at')) {
      context.handle(
        _lastSyncedAtMeta,
        lastSyncedAt.isAcceptableOrUnknown(
          data['last_synced_at']!,
          _lastSyncedAtMeta,
        ),
      );
    }
    return context;
  }

  @override
  Set<GeneratedColumn> get $primaryKey => {id};
  @override
  Empresa map(Map<String, dynamic> data, {String? tablePrefix}) {
    final effectivePrefix = tablePrefix != null ? '$tablePrefix.' : '';
    return Empresa(
      id: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}id'],
      )!,
      condominioId: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}condominio_id'],
      )!,
      nome: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}nome'],
      )!,
      cnpj: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}cnpj'],
      ),
      status: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}status'],
      )!,
      syncStatus: attachedDatabase.typeMapping.read(
        DriftSqlType.int,
        data['${effectivePrefix}sync_status'],
      )!,
      createdAt: attachedDatabase.typeMapping.read(
        DriftSqlType.dateTime,
        data['${effectivePrefix}created_at'],
      )!,
      updatedAt: attachedDatabase.typeMapping.read(
        DriftSqlType.dateTime,
        data['${effectivePrefix}updated_at'],
      )!,
      lastSyncedAt: attachedDatabase.typeMapping.read(
        DriftSqlType.dateTime,
        data['${effectivePrefix}last_synced_at'],
      ),
    );
  }

  @override
  $EmpresasTable createAlias(String alias) {
    return $EmpresasTable(attachedDatabase, alias);
  }
}

class Empresa extends DataClass implements Insertable<Empresa> {
  final String id;
  final String condominioId;
  final String nome;
  final String? cnpj;
  final String status;
  final int syncStatus;
  final DateTime createdAt;
  final DateTime updatedAt;
  final DateTime? lastSyncedAt;
  const Empresa({
    required this.id,
    required this.condominioId,
    required this.nome,
    this.cnpj,
    required this.status,
    required this.syncStatus,
    required this.createdAt,
    required this.updatedAt,
    this.lastSyncedAt,
  });
  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    map['id'] = Variable<String>(id);
    map['condominio_id'] = Variable<String>(condominioId);
    map['nome'] = Variable<String>(nome);
    if (!nullToAbsent || cnpj != null) {
      map['cnpj'] = Variable<String>(cnpj);
    }
    map['status'] = Variable<String>(status);
    map['sync_status'] = Variable<int>(syncStatus);
    map['created_at'] = Variable<DateTime>(createdAt);
    map['updated_at'] = Variable<DateTime>(updatedAt);
    if (!nullToAbsent || lastSyncedAt != null) {
      map['last_synced_at'] = Variable<DateTime>(lastSyncedAt);
    }
    return map;
  }

  EmpresasCompanion toCompanion(bool nullToAbsent) {
    return EmpresasCompanion(
      id: Value(id),
      condominioId: Value(condominioId),
      nome: Value(nome),
      cnpj: cnpj == null && nullToAbsent ? const Value.absent() : Value(cnpj),
      status: Value(status),
      syncStatus: Value(syncStatus),
      createdAt: Value(createdAt),
      updatedAt: Value(updatedAt),
      lastSyncedAt: lastSyncedAt == null && nullToAbsent
          ? const Value.absent()
          : Value(lastSyncedAt),
    );
  }

  factory Empresa.fromJson(
    Map<String, dynamic> json, {
    ValueSerializer? serializer,
  }) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return Empresa(
      id: serializer.fromJson<String>(json['id']),
      condominioId: serializer.fromJson<String>(json['condominioId']),
      nome: serializer.fromJson<String>(json['nome']),
      cnpj: serializer.fromJson<String?>(json['cnpj']),
      status: serializer.fromJson<String>(json['status']),
      syncStatus: serializer.fromJson<int>(json['syncStatus']),
      createdAt: serializer.fromJson<DateTime>(json['createdAt']),
      updatedAt: serializer.fromJson<DateTime>(json['updatedAt']),
      lastSyncedAt: serializer.fromJson<DateTime?>(json['lastSyncedAt']),
    );
  }
  @override
  Map<String, dynamic> toJson({ValueSerializer? serializer}) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return <String, dynamic>{
      'id': serializer.toJson<String>(id),
      'condominioId': serializer.toJson<String>(condominioId),
      'nome': serializer.toJson<String>(nome),
      'cnpj': serializer.toJson<String?>(cnpj),
      'status': serializer.toJson<String>(status),
      'syncStatus': serializer.toJson<int>(syncStatus),
      'createdAt': serializer.toJson<DateTime>(createdAt),
      'updatedAt': serializer.toJson<DateTime>(updatedAt),
      'lastSyncedAt': serializer.toJson<DateTime?>(lastSyncedAt),
    };
  }

  Empresa copyWith({
    String? id,
    String? condominioId,
    String? nome,
    Value<String?> cnpj = const Value.absent(),
    String? status,
    int? syncStatus,
    DateTime? createdAt,
    DateTime? updatedAt,
    Value<DateTime?> lastSyncedAt = const Value.absent(),
  }) => Empresa(
    id: id ?? this.id,
    condominioId: condominioId ?? this.condominioId,
    nome: nome ?? this.nome,
    cnpj: cnpj.present ? cnpj.value : this.cnpj,
    status: status ?? this.status,
    syncStatus: syncStatus ?? this.syncStatus,
    createdAt: createdAt ?? this.createdAt,
    updatedAt: updatedAt ?? this.updatedAt,
    lastSyncedAt: lastSyncedAt.present ? lastSyncedAt.value : this.lastSyncedAt,
  );
  Empresa copyWithCompanion(EmpresasCompanion data) {
    return Empresa(
      id: data.id.present ? data.id.value : this.id,
      condominioId: data.condominioId.present
          ? data.condominioId.value
          : this.condominioId,
      nome: data.nome.present ? data.nome.value : this.nome,
      cnpj: data.cnpj.present ? data.cnpj.value : this.cnpj,
      status: data.status.present ? data.status.value : this.status,
      syncStatus: data.syncStatus.present
          ? data.syncStatus.value
          : this.syncStatus,
      createdAt: data.createdAt.present ? data.createdAt.value : this.createdAt,
      updatedAt: data.updatedAt.present ? data.updatedAt.value : this.updatedAt,
      lastSyncedAt: data.lastSyncedAt.present
          ? data.lastSyncedAt.value
          : this.lastSyncedAt,
    );
  }

  @override
  String toString() {
    return (StringBuffer('Empresa(')
          ..write('id: $id, ')
          ..write('condominioId: $condominioId, ')
          ..write('nome: $nome, ')
          ..write('cnpj: $cnpj, ')
          ..write('status: $status, ')
          ..write('syncStatus: $syncStatus, ')
          ..write('createdAt: $createdAt, ')
          ..write('updatedAt: $updatedAt, ')
          ..write('lastSyncedAt: $lastSyncedAt')
          ..write(')'))
        .toString();
  }

  @override
  int get hashCode => Object.hash(
    id,
    condominioId,
    nome,
    cnpj,
    status,
    syncStatus,
    createdAt,
    updatedAt,
    lastSyncedAt,
  );
  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      (other is Empresa &&
          other.id == this.id &&
          other.condominioId == this.condominioId &&
          other.nome == this.nome &&
          other.cnpj == this.cnpj &&
          other.status == this.status &&
          other.syncStatus == this.syncStatus &&
          other.createdAt == this.createdAt &&
          other.updatedAt == this.updatedAt &&
          other.lastSyncedAt == this.lastSyncedAt);
}

class EmpresasCompanion extends UpdateCompanion<Empresa> {
  final Value<String> id;
  final Value<String> condominioId;
  final Value<String> nome;
  final Value<String?> cnpj;
  final Value<String> status;
  final Value<int> syncStatus;
  final Value<DateTime> createdAt;
  final Value<DateTime> updatedAt;
  final Value<DateTime?> lastSyncedAt;
  final Value<int> rowid;
  const EmpresasCompanion({
    this.id = const Value.absent(),
    this.condominioId = const Value.absent(),
    this.nome = const Value.absent(),
    this.cnpj = const Value.absent(),
    this.status = const Value.absent(),
    this.syncStatus = const Value.absent(),
    this.createdAt = const Value.absent(),
    this.updatedAt = const Value.absent(),
    this.lastSyncedAt = const Value.absent(),
    this.rowid = const Value.absent(),
  });
  EmpresasCompanion.insert({
    required String id,
    required String condominioId,
    required String nome,
    this.cnpj = const Value.absent(),
    this.status = const Value.absent(),
    this.syncStatus = const Value.absent(),
    required DateTime createdAt,
    required DateTime updatedAt,
    this.lastSyncedAt = const Value.absent(),
    this.rowid = const Value.absent(),
  }) : id = Value(id),
       condominioId = Value(condominioId),
       nome = Value(nome),
       createdAt = Value(createdAt),
       updatedAt = Value(updatedAt);
  static Insertable<Empresa> custom({
    Expression<String>? id,
    Expression<String>? condominioId,
    Expression<String>? nome,
    Expression<String>? cnpj,
    Expression<String>? status,
    Expression<int>? syncStatus,
    Expression<DateTime>? createdAt,
    Expression<DateTime>? updatedAt,
    Expression<DateTime>? lastSyncedAt,
    Expression<int>? rowid,
  }) {
    return RawValuesInsertable({
      if (id != null) 'id': id,
      if (condominioId != null) 'condominio_id': condominioId,
      if (nome != null) 'nome': nome,
      if (cnpj != null) 'cnpj': cnpj,
      if (status != null) 'status': status,
      if (syncStatus != null) 'sync_status': syncStatus,
      if (createdAt != null) 'created_at': createdAt,
      if (updatedAt != null) 'updated_at': updatedAt,
      if (lastSyncedAt != null) 'last_synced_at': lastSyncedAt,
      if (rowid != null) 'rowid': rowid,
    });
  }

  EmpresasCompanion copyWith({
    Value<String>? id,
    Value<String>? condominioId,
    Value<String>? nome,
    Value<String?>? cnpj,
    Value<String>? status,
    Value<int>? syncStatus,
    Value<DateTime>? createdAt,
    Value<DateTime>? updatedAt,
    Value<DateTime?>? lastSyncedAt,
    Value<int>? rowid,
  }) {
    return EmpresasCompanion(
      id: id ?? this.id,
      condominioId: condominioId ?? this.condominioId,
      nome: nome ?? this.nome,
      cnpj: cnpj ?? this.cnpj,
      status: status ?? this.status,
      syncStatus: syncStatus ?? this.syncStatus,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
      lastSyncedAt: lastSyncedAt ?? this.lastSyncedAt,
      rowid: rowid ?? this.rowid,
    );
  }

  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    if (id.present) {
      map['id'] = Variable<String>(id.value);
    }
    if (condominioId.present) {
      map['condominio_id'] = Variable<String>(condominioId.value);
    }
    if (nome.present) {
      map['nome'] = Variable<String>(nome.value);
    }
    if (cnpj.present) {
      map['cnpj'] = Variable<String>(cnpj.value);
    }
    if (status.present) {
      map['status'] = Variable<String>(status.value);
    }
    if (syncStatus.present) {
      map['sync_status'] = Variable<int>(syncStatus.value);
    }
    if (createdAt.present) {
      map['created_at'] = Variable<DateTime>(createdAt.value);
    }
    if (updatedAt.present) {
      map['updated_at'] = Variable<DateTime>(updatedAt.value);
    }
    if (lastSyncedAt.present) {
      map['last_synced_at'] = Variable<DateTime>(lastSyncedAt.value);
    }
    if (rowid.present) {
      map['rowid'] = Variable<int>(rowid.value);
    }
    return map;
  }

  @override
  String toString() {
    return (StringBuffer('EmpresasCompanion(')
          ..write('id: $id, ')
          ..write('condominioId: $condominioId, ')
          ..write('nome: $nome, ')
          ..write('cnpj: $cnpj, ')
          ..write('status: $status, ')
          ..write('syncStatus: $syncStatus, ')
          ..write('createdAt: $createdAt, ')
          ..write('updatedAt: $updatedAt, ')
          ..write('lastSyncedAt: $lastSyncedAt, ')
          ..write('rowid: $rowid')
          ..write(')'))
        .toString();
  }
}

class $TiposVisitantesTable extends TiposVisitantes
    with TableInfo<$TiposVisitantesTable, TiposVisitante> {
  @override
  final GeneratedDatabase attachedDatabase;
  final String? _alias;
  $TiposVisitantesTable(this.attachedDatabase, [this._alias]);
  static const VerificationMeta _idMeta = const VerificationMeta('id');
  @override
  late final GeneratedColumn<String> id = GeneratedColumn<String>(
    'id',
    aliasedName,
    false,
    type: DriftSqlType.string,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _condominioIdMeta = const VerificationMeta(
    'condominioId',
  );
  @override
  late final GeneratedColumn<String> condominioId = GeneratedColumn<String>(
    'condominio_id',
    aliasedName,
    true,
    type: DriftSqlType.string,
    requiredDuringInsert: false,
  );
  static const VerificationMeta _nomeMeta = const VerificationMeta('nome');
  @override
  late final GeneratedColumn<String> nome = GeneratedColumn<String>(
    'nome',
    aliasedName,
    false,
    type: DriftSqlType.string,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _createdAtMeta = const VerificationMeta(
    'createdAt',
  );
  @override
  late final GeneratedColumn<DateTime> createdAt = GeneratedColumn<DateTime>(
    'created_at',
    aliasedName,
    false,
    type: DriftSqlType.dateTime,
    requiredDuringInsert: true,
  );
  @override
  List<GeneratedColumn> get $columns => [id, condominioId, nome, createdAt];
  @override
  String get aliasedName => _alias ?? actualTableName;
  @override
  String get actualTableName => $name;
  static const String $name = 'tipos_visitantes';
  @override
  VerificationContext validateIntegrity(
    Insertable<TiposVisitante> instance, {
    bool isInserting = false,
  }) {
    final context = VerificationContext();
    final data = instance.toColumns(true);
    if (data.containsKey('id')) {
      context.handle(_idMeta, id.isAcceptableOrUnknown(data['id']!, _idMeta));
    } else if (isInserting) {
      context.missing(_idMeta);
    }
    if (data.containsKey('condominio_id')) {
      context.handle(
        _condominioIdMeta,
        condominioId.isAcceptableOrUnknown(
          data['condominio_id']!,
          _condominioIdMeta,
        ),
      );
    }
    if (data.containsKey('nome')) {
      context.handle(
        _nomeMeta,
        nome.isAcceptableOrUnknown(data['nome']!, _nomeMeta),
      );
    } else if (isInserting) {
      context.missing(_nomeMeta);
    }
    if (data.containsKey('created_at')) {
      context.handle(
        _createdAtMeta,
        createdAt.isAcceptableOrUnknown(data['created_at']!, _createdAtMeta),
      );
    } else if (isInserting) {
      context.missing(_createdAtMeta);
    }
    return context;
  }

  @override
  Set<GeneratedColumn> get $primaryKey => {id};
  @override
  TiposVisitante map(Map<String, dynamic> data, {String? tablePrefix}) {
    final effectivePrefix = tablePrefix != null ? '$tablePrefix.' : '';
    return TiposVisitante(
      id: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}id'],
      )!,
      condominioId: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}condominio_id'],
      ),
      nome: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}nome'],
      )!,
      createdAt: attachedDatabase.typeMapping.read(
        DriftSqlType.dateTime,
        data['${effectivePrefix}created_at'],
      )!,
    );
  }

  @override
  $TiposVisitantesTable createAlias(String alias) {
    return $TiposVisitantesTable(attachedDatabase, alias);
  }
}

class TiposVisitante extends DataClass implements Insertable<TiposVisitante> {
  final String id;
  final String? condominioId;
  final String nome;
  final DateTime createdAt;
  const TiposVisitante({
    required this.id,
    this.condominioId,
    required this.nome,
    required this.createdAt,
  });
  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    map['id'] = Variable<String>(id);
    if (!nullToAbsent || condominioId != null) {
      map['condominio_id'] = Variable<String>(condominioId);
    }
    map['nome'] = Variable<String>(nome);
    map['created_at'] = Variable<DateTime>(createdAt);
    return map;
  }

  TiposVisitantesCompanion toCompanion(bool nullToAbsent) {
    return TiposVisitantesCompanion(
      id: Value(id),
      condominioId: condominioId == null && nullToAbsent
          ? const Value.absent()
          : Value(condominioId),
      nome: Value(nome),
      createdAt: Value(createdAt),
    );
  }

  factory TiposVisitante.fromJson(
    Map<String, dynamic> json, {
    ValueSerializer? serializer,
  }) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return TiposVisitante(
      id: serializer.fromJson<String>(json['id']),
      condominioId: serializer.fromJson<String?>(json['condominioId']),
      nome: serializer.fromJson<String>(json['nome']),
      createdAt: serializer.fromJson<DateTime>(json['createdAt']),
    );
  }
  @override
  Map<String, dynamic> toJson({ValueSerializer? serializer}) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return <String, dynamic>{
      'id': serializer.toJson<String>(id),
      'condominioId': serializer.toJson<String?>(condominioId),
      'nome': serializer.toJson<String>(nome),
      'createdAt': serializer.toJson<DateTime>(createdAt),
    };
  }

  TiposVisitante copyWith({
    String? id,
    Value<String?> condominioId = const Value.absent(),
    String? nome,
    DateTime? createdAt,
  }) => TiposVisitante(
    id: id ?? this.id,
    condominioId: condominioId.present ? condominioId.value : this.condominioId,
    nome: nome ?? this.nome,
    createdAt: createdAt ?? this.createdAt,
  );
  TiposVisitante copyWithCompanion(TiposVisitantesCompanion data) {
    return TiposVisitante(
      id: data.id.present ? data.id.value : this.id,
      condominioId: data.condominioId.present
          ? data.condominioId.value
          : this.condominioId,
      nome: data.nome.present ? data.nome.value : this.nome,
      createdAt: data.createdAt.present ? data.createdAt.value : this.createdAt,
    );
  }

  @override
  String toString() {
    return (StringBuffer('TiposVisitante(')
          ..write('id: $id, ')
          ..write('condominioId: $condominioId, ')
          ..write('nome: $nome, ')
          ..write('createdAt: $createdAt')
          ..write(')'))
        .toString();
  }

  @override
  int get hashCode => Object.hash(id, condominioId, nome, createdAt);
  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      (other is TiposVisitante &&
          other.id == this.id &&
          other.condominioId == this.condominioId &&
          other.nome == this.nome &&
          other.createdAt == this.createdAt);
}

class TiposVisitantesCompanion extends UpdateCompanion<TiposVisitante> {
  final Value<String> id;
  final Value<String?> condominioId;
  final Value<String> nome;
  final Value<DateTime> createdAt;
  final Value<int> rowid;
  const TiposVisitantesCompanion({
    this.id = const Value.absent(),
    this.condominioId = const Value.absent(),
    this.nome = const Value.absent(),
    this.createdAt = const Value.absent(),
    this.rowid = const Value.absent(),
  });
  TiposVisitantesCompanion.insert({
    required String id,
    this.condominioId = const Value.absent(),
    required String nome,
    required DateTime createdAt,
    this.rowid = const Value.absent(),
  }) : id = Value(id),
       nome = Value(nome),
       createdAt = Value(createdAt);
  static Insertable<TiposVisitante> custom({
    Expression<String>? id,
    Expression<String>? condominioId,
    Expression<String>? nome,
    Expression<DateTime>? createdAt,
    Expression<int>? rowid,
  }) {
    return RawValuesInsertable({
      if (id != null) 'id': id,
      if (condominioId != null) 'condominio_id': condominioId,
      if (nome != null) 'nome': nome,
      if (createdAt != null) 'created_at': createdAt,
      if (rowid != null) 'rowid': rowid,
    });
  }

  TiposVisitantesCompanion copyWith({
    Value<String>? id,
    Value<String?>? condominioId,
    Value<String>? nome,
    Value<DateTime>? createdAt,
    Value<int>? rowid,
  }) {
    return TiposVisitantesCompanion(
      id: id ?? this.id,
      condominioId: condominioId ?? this.condominioId,
      nome: nome ?? this.nome,
      createdAt: createdAt ?? this.createdAt,
      rowid: rowid ?? this.rowid,
    );
  }

  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    if (id.present) {
      map['id'] = Variable<String>(id.value);
    }
    if (condominioId.present) {
      map['condominio_id'] = Variable<String>(condominioId.value);
    }
    if (nome.present) {
      map['nome'] = Variable<String>(nome.value);
    }
    if (createdAt.present) {
      map['created_at'] = Variable<DateTime>(createdAt.value);
    }
    if (rowid.present) {
      map['rowid'] = Variable<int>(rowid.value);
    }
    return map;
  }

  @override
  String toString() {
    return (StringBuffer('TiposVisitantesCompanion(')
          ..write('id: $id, ')
          ..write('condominioId: $condominioId, ')
          ..write('nome: $nome, ')
          ..write('createdAt: $createdAt, ')
          ..write('rowid: $rowid')
          ..write(')'))
        .toString();
  }
}

class $VisitantesTable extends Visitantes
    with TableInfo<$VisitantesTable, Visitante> {
  @override
  final GeneratedDatabase attachedDatabase;
  final String? _alias;
  $VisitantesTable(this.attachedDatabase, [this._alias]);
  static const VerificationMeta _idMeta = const VerificationMeta('id');
  @override
  late final GeneratedColumn<String> id = GeneratedColumn<String>(
    'id',
    aliasedName,
    false,
    type: DriftSqlType.string,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _condominioIdMeta = const VerificationMeta(
    'condominioId',
  );
  @override
  late final GeneratedColumn<String> condominioId = GeneratedColumn<String>(
    'condominio_id',
    aliasedName,
    false,
    type: DriftSqlType.string,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _empresaIdMeta = const VerificationMeta(
    'empresaId',
  );
  @override
  late final GeneratedColumn<String> empresaId = GeneratedColumn<String>(
    'empresa_id',
    aliasedName,
    true,
    type: DriftSqlType.string,
    requiredDuringInsert: false,
    defaultConstraints: GeneratedColumn.constraintIsAlways(
      'REFERENCES empresas (id)',
    ),
  );
  static const VerificationMeta _tipoVisitanteIdMeta = const VerificationMeta(
    'tipoVisitanteId',
  );
  @override
  late final GeneratedColumn<String> tipoVisitanteId = GeneratedColumn<String>(
    'tipo_visitante_id',
    aliasedName,
    true,
    type: DriftSqlType.string,
    requiredDuringInsert: false,
    defaultConstraints: GeneratedColumn.constraintIsAlways(
      'REFERENCES tipos_visitantes (id)',
    ),
  );
  static const VerificationMeta _nomeMeta = const VerificationMeta('nome');
  @override
  late final GeneratedColumn<String> nome = GeneratedColumn<String>(
    'nome',
    aliasedName,
    false,
    type: DriftSqlType.string,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _documentoMeta = const VerificationMeta(
    'documento',
  );
  @override
  late final GeneratedColumn<String> documento = GeneratedColumn<String>(
    'documento',
    aliasedName,
    true,
    type: DriftSqlType.string,
    requiredDuringInsert: false,
  );
  static const VerificationMeta _fotoUrlMeta = const VerificationMeta(
    'fotoUrl',
  );
  @override
  late final GeneratedColumn<String> fotoUrl = GeneratedColumn<String>(
    'foto_url',
    aliasedName,
    true,
    type: DriftSqlType.string,
    requiredDuringInsert: false,
  );
  static const VerificationMeta _statusMeta = const VerificationMeta('status');
  @override
  late final GeneratedColumn<String> status = GeneratedColumn<String>(
    'status',
    aliasedName,
    false,
    type: DriftSqlType.string,
    requiredDuringInsert: false,
    defaultValue: const Constant('ativo'),
  );
  static const VerificationMeta _syncStatusMeta = const VerificationMeta(
    'syncStatus',
  );
  @override
  late final GeneratedColumn<int> syncStatus = GeneratedColumn<int>(
    'sync_status',
    aliasedName,
    false,
    type: DriftSqlType.int,
    requiredDuringInsert: false,
    defaultValue: const Constant(0),
  );
  static const VerificationMeta _createdAtMeta = const VerificationMeta(
    'createdAt',
  );
  @override
  late final GeneratedColumn<DateTime> createdAt = GeneratedColumn<DateTime>(
    'created_at',
    aliasedName,
    false,
    type: DriftSqlType.dateTime,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _updatedAtMeta = const VerificationMeta(
    'updatedAt',
  );
  @override
  late final GeneratedColumn<DateTime> updatedAt = GeneratedColumn<DateTime>(
    'updated_at',
    aliasedName,
    false,
    type: DriftSqlType.dateTime,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _lastSyncedAtMeta = const VerificationMeta(
    'lastSyncedAt',
  );
  @override
  late final GeneratedColumn<DateTime> lastSyncedAt = GeneratedColumn<DateTime>(
    'last_synced_at',
    aliasedName,
    true,
    type: DriftSqlType.dateTime,
    requiredDuringInsert: false,
  );
  @override
  List<GeneratedColumn> get $columns => [
    id,
    condominioId,
    empresaId,
    tipoVisitanteId,
    nome,
    documento,
    fotoUrl,
    status,
    syncStatus,
    createdAt,
    updatedAt,
    lastSyncedAt,
  ];
  @override
  String get aliasedName => _alias ?? actualTableName;
  @override
  String get actualTableName => $name;
  static const String $name = 'visitantes';
  @override
  VerificationContext validateIntegrity(
    Insertable<Visitante> instance, {
    bool isInserting = false,
  }) {
    final context = VerificationContext();
    final data = instance.toColumns(true);
    if (data.containsKey('id')) {
      context.handle(_idMeta, id.isAcceptableOrUnknown(data['id']!, _idMeta));
    } else if (isInserting) {
      context.missing(_idMeta);
    }
    if (data.containsKey('condominio_id')) {
      context.handle(
        _condominioIdMeta,
        condominioId.isAcceptableOrUnknown(
          data['condominio_id']!,
          _condominioIdMeta,
        ),
      );
    } else if (isInserting) {
      context.missing(_condominioIdMeta);
    }
    if (data.containsKey('empresa_id')) {
      context.handle(
        _empresaIdMeta,
        empresaId.isAcceptableOrUnknown(data['empresa_id']!, _empresaIdMeta),
      );
    }
    if (data.containsKey('tipo_visitante_id')) {
      context.handle(
        _tipoVisitanteIdMeta,
        tipoVisitanteId.isAcceptableOrUnknown(
          data['tipo_visitante_id']!,
          _tipoVisitanteIdMeta,
        ),
      );
    }
    if (data.containsKey('nome')) {
      context.handle(
        _nomeMeta,
        nome.isAcceptableOrUnknown(data['nome']!, _nomeMeta),
      );
    } else if (isInserting) {
      context.missing(_nomeMeta);
    }
    if (data.containsKey('documento')) {
      context.handle(
        _documentoMeta,
        documento.isAcceptableOrUnknown(data['documento']!, _documentoMeta),
      );
    }
    if (data.containsKey('foto_url')) {
      context.handle(
        _fotoUrlMeta,
        fotoUrl.isAcceptableOrUnknown(data['foto_url']!, _fotoUrlMeta),
      );
    }
    if (data.containsKey('status')) {
      context.handle(
        _statusMeta,
        status.isAcceptableOrUnknown(data['status']!, _statusMeta),
      );
    }
    if (data.containsKey('sync_status')) {
      context.handle(
        _syncStatusMeta,
        syncStatus.isAcceptableOrUnknown(data['sync_status']!, _syncStatusMeta),
      );
    }
    if (data.containsKey('created_at')) {
      context.handle(
        _createdAtMeta,
        createdAt.isAcceptableOrUnknown(data['created_at']!, _createdAtMeta),
      );
    } else if (isInserting) {
      context.missing(_createdAtMeta);
    }
    if (data.containsKey('updated_at')) {
      context.handle(
        _updatedAtMeta,
        updatedAt.isAcceptableOrUnknown(data['updated_at']!, _updatedAtMeta),
      );
    } else if (isInserting) {
      context.missing(_updatedAtMeta);
    }
    if (data.containsKey('last_synced_at')) {
      context.handle(
        _lastSyncedAtMeta,
        lastSyncedAt.isAcceptableOrUnknown(
          data['last_synced_at']!,
          _lastSyncedAtMeta,
        ),
      );
    }
    return context;
  }

  @override
  Set<GeneratedColumn> get $primaryKey => {id};
  @override
  Visitante map(Map<String, dynamic> data, {String? tablePrefix}) {
    final effectivePrefix = tablePrefix != null ? '$tablePrefix.' : '';
    return Visitante(
      id: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}id'],
      )!,
      condominioId: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}condominio_id'],
      )!,
      empresaId: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}empresa_id'],
      ),
      tipoVisitanteId: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}tipo_visitante_id'],
      ),
      nome: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}nome'],
      )!,
      documento: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}documento'],
      ),
      fotoUrl: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}foto_url'],
      ),
      status: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}status'],
      )!,
      syncStatus: attachedDatabase.typeMapping.read(
        DriftSqlType.int,
        data['${effectivePrefix}sync_status'],
      )!,
      createdAt: attachedDatabase.typeMapping.read(
        DriftSqlType.dateTime,
        data['${effectivePrefix}created_at'],
      )!,
      updatedAt: attachedDatabase.typeMapping.read(
        DriftSqlType.dateTime,
        data['${effectivePrefix}updated_at'],
      )!,
      lastSyncedAt: attachedDatabase.typeMapping.read(
        DriftSqlType.dateTime,
        data['${effectivePrefix}last_synced_at'],
      ),
    );
  }

  @override
  $VisitantesTable createAlias(String alias) {
    return $VisitantesTable(attachedDatabase, alias);
  }
}

class Visitante extends DataClass implements Insertable<Visitante> {
  final String id;
  final String condominioId;
  final String? empresaId;
  final String? tipoVisitanteId;
  final String nome;
  final String? documento;
  final String? fotoUrl;
  final String status;
  final int syncStatus;
  final DateTime createdAt;
  final DateTime updatedAt;
  final DateTime? lastSyncedAt;
  const Visitante({
    required this.id,
    required this.condominioId,
    this.empresaId,
    this.tipoVisitanteId,
    required this.nome,
    this.documento,
    this.fotoUrl,
    required this.status,
    required this.syncStatus,
    required this.createdAt,
    required this.updatedAt,
    this.lastSyncedAt,
  });
  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    map['id'] = Variable<String>(id);
    map['condominio_id'] = Variable<String>(condominioId);
    if (!nullToAbsent || empresaId != null) {
      map['empresa_id'] = Variable<String>(empresaId);
    }
    if (!nullToAbsent || tipoVisitanteId != null) {
      map['tipo_visitante_id'] = Variable<String>(tipoVisitanteId);
    }
    map['nome'] = Variable<String>(nome);
    if (!nullToAbsent || documento != null) {
      map['documento'] = Variable<String>(documento);
    }
    if (!nullToAbsent || fotoUrl != null) {
      map['foto_url'] = Variable<String>(fotoUrl);
    }
    map['status'] = Variable<String>(status);
    map['sync_status'] = Variable<int>(syncStatus);
    map['created_at'] = Variable<DateTime>(createdAt);
    map['updated_at'] = Variable<DateTime>(updatedAt);
    if (!nullToAbsent || lastSyncedAt != null) {
      map['last_synced_at'] = Variable<DateTime>(lastSyncedAt);
    }
    return map;
  }

  VisitantesCompanion toCompanion(bool nullToAbsent) {
    return VisitantesCompanion(
      id: Value(id),
      condominioId: Value(condominioId),
      empresaId: empresaId == null && nullToAbsent
          ? const Value.absent()
          : Value(empresaId),
      tipoVisitanteId: tipoVisitanteId == null && nullToAbsent
          ? const Value.absent()
          : Value(tipoVisitanteId),
      nome: Value(nome),
      documento: documento == null && nullToAbsent
          ? const Value.absent()
          : Value(documento),
      fotoUrl: fotoUrl == null && nullToAbsent
          ? const Value.absent()
          : Value(fotoUrl),
      status: Value(status),
      syncStatus: Value(syncStatus),
      createdAt: Value(createdAt),
      updatedAt: Value(updatedAt),
      lastSyncedAt: lastSyncedAt == null && nullToAbsent
          ? const Value.absent()
          : Value(lastSyncedAt),
    );
  }

  factory Visitante.fromJson(
    Map<String, dynamic> json, {
    ValueSerializer? serializer,
  }) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return Visitante(
      id: serializer.fromJson<String>(json['id']),
      condominioId: serializer.fromJson<String>(json['condominioId']),
      empresaId: serializer.fromJson<String?>(json['empresaId']),
      tipoVisitanteId: serializer.fromJson<String?>(json['tipoVisitanteId']),
      nome: serializer.fromJson<String>(json['nome']),
      documento: serializer.fromJson<String?>(json['documento']),
      fotoUrl: serializer.fromJson<String?>(json['fotoUrl']),
      status: serializer.fromJson<String>(json['status']),
      syncStatus: serializer.fromJson<int>(json['syncStatus']),
      createdAt: serializer.fromJson<DateTime>(json['createdAt']),
      updatedAt: serializer.fromJson<DateTime>(json['updatedAt']),
      lastSyncedAt: serializer.fromJson<DateTime?>(json['lastSyncedAt']),
    );
  }
  @override
  Map<String, dynamic> toJson({ValueSerializer? serializer}) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return <String, dynamic>{
      'id': serializer.toJson<String>(id),
      'condominioId': serializer.toJson<String>(condominioId),
      'empresaId': serializer.toJson<String?>(empresaId),
      'tipoVisitanteId': serializer.toJson<String?>(tipoVisitanteId),
      'nome': serializer.toJson<String>(nome),
      'documento': serializer.toJson<String?>(documento),
      'fotoUrl': serializer.toJson<String?>(fotoUrl),
      'status': serializer.toJson<String>(status),
      'syncStatus': serializer.toJson<int>(syncStatus),
      'createdAt': serializer.toJson<DateTime>(createdAt),
      'updatedAt': serializer.toJson<DateTime>(updatedAt),
      'lastSyncedAt': serializer.toJson<DateTime?>(lastSyncedAt),
    };
  }

  Visitante copyWith({
    String? id,
    String? condominioId,
    Value<String?> empresaId = const Value.absent(),
    Value<String?> tipoVisitanteId = const Value.absent(),
    String? nome,
    Value<String?> documento = const Value.absent(),
    Value<String?> fotoUrl = const Value.absent(),
    String? status,
    int? syncStatus,
    DateTime? createdAt,
    DateTime? updatedAt,
    Value<DateTime?> lastSyncedAt = const Value.absent(),
  }) => Visitante(
    id: id ?? this.id,
    condominioId: condominioId ?? this.condominioId,
    empresaId: empresaId.present ? empresaId.value : this.empresaId,
    tipoVisitanteId: tipoVisitanteId.present
        ? tipoVisitanteId.value
        : this.tipoVisitanteId,
    nome: nome ?? this.nome,
    documento: documento.present ? documento.value : this.documento,
    fotoUrl: fotoUrl.present ? fotoUrl.value : this.fotoUrl,
    status: status ?? this.status,
    syncStatus: syncStatus ?? this.syncStatus,
    createdAt: createdAt ?? this.createdAt,
    updatedAt: updatedAt ?? this.updatedAt,
    lastSyncedAt: lastSyncedAt.present ? lastSyncedAt.value : this.lastSyncedAt,
  );
  Visitante copyWithCompanion(VisitantesCompanion data) {
    return Visitante(
      id: data.id.present ? data.id.value : this.id,
      condominioId: data.condominioId.present
          ? data.condominioId.value
          : this.condominioId,
      empresaId: data.empresaId.present ? data.empresaId.value : this.empresaId,
      tipoVisitanteId: data.tipoVisitanteId.present
          ? data.tipoVisitanteId.value
          : this.tipoVisitanteId,
      nome: data.nome.present ? data.nome.value : this.nome,
      documento: data.documento.present ? data.documento.value : this.documento,
      fotoUrl: data.fotoUrl.present ? data.fotoUrl.value : this.fotoUrl,
      status: data.status.present ? data.status.value : this.status,
      syncStatus: data.syncStatus.present
          ? data.syncStatus.value
          : this.syncStatus,
      createdAt: data.createdAt.present ? data.createdAt.value : this.createdAt,
      updatedAt: data.updatedAt.present ? data.updatedAt.value : this.updatedAt,
      lastSyncedAt: data.lastSyncedAt.present
          ? data.lastSyncedAt.value
          : this.lastSyncedAt,
    );
  }

  @override
  String toString() {
    return (StringBuffer('Visitante(')
          ..write('id: $id, ')
          ..write('condominioId: $condominioId, ')
          ..write('empresaId: $empresaId, ')
          ..write('tipoVisitanteId: $tipoVisitanteId, ')
          ..write('nome: $nome, ')
          ..write('documento: $documento, ')
          ..write('fotoUrl: $fotoUrl, ')
          ..write('status: $status, ')
          ..write('syncStatus: $syncStatus, ')
          ..write('createdAt: $createdAt, ')
          ..write('updatedAt: $updatedAt, ')
          ..write('lastSyncedAt: $lastSyncedAt')
          ..write(')'))
        .toString();
  }

  @override
  int get hashCode => Object.hash(
    id,
    condominioId,
    empresaId,
    tipoVisitanteId,
    nome,
    documento,
    fotoUrl,
    status,
    syncStatus,
    createdAt,
    updatedAt,
    lastSyncedAt,
  );
  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      (other is Visitante &&
          other.id == this.id &&
          other.condominioId == this.condominioId &&
          other.empresaId == this.empresaId &&
          other.tipoVisitanteId == this.tipoVisitanteId &&
          other.nome == this.nome &&
          other.documento == this.documento &&
          other.fotoUrl == this.fotoUrl &&
          other.status == this.status &&
          other.syncStatus == this.syncStatus &&
          other.createdAt == this.createdAt &&
          other.updatedAt == this.updatedAt &&
          other.lastSyncedAt == this.lastSyncedAt);
}

class VisitantesCompanion extends UpdateCompanion<Visitante> {
  final Value<String> id;
  final Value<String> condominioId;
  final Value<String?> empresaId;
  final Value<String?> tipoVisitanteId;
  final Value<String> nome;
  final Value<String?> documento;
  final Value<String?> fotoUrl;
  final Value<String> status;
  final Value<int> syncStatus;
  final Value<DateTime> createdAt;
  final Value<DateTime> updatedAt;
  final Value<DateTime?> lastSyncedAt;
  final Value<int> rowid;
  const VisitantesCompanion({
    this.id = const Value.absent(),
    this.condominioId = const Value.absent(),
    this.empresaId = const Value.absent(),
    this.tipoVisitanteId = const Value.absent(),
    this.nome = const Value.absent(),
    this.documento = const Value.absent(),
    this.fotoUrl = const Value.absent(),
    this.status = const Value.absent(),
    this.syncStatus = const Value.absent(),
    this.createdAt = const Value.absent(),
    this.updatedAt = const Value.absent(),
    this.lastSyncedAt = const Value.absent(),
    this.rowid = const Value.absent(),
  });
  VisitantesCompanion.insert({
    required String id,
    required String condominioId,
    this.empresaId = const Value.absent(),
    this.tipoVisitanteId = const Value.absent(),
    required String nome,
    this.documento = const Value.absent(),
    this.fotoUrl = const Value.absent(),
    this.status = const Value.absent(),
    this.syncStatus = const Value.absent(),
    required DateTime createdAt,
    required DateTime updatedAt,
    this.lastSyncedAt = const Value.absent(),
    this.rowid = const Value.absent(),
  }) : id = Value(id),
       condominioId = Value(condominioId),
       nome = Value(nome),
       createdAt = Value(createdAt),
       updatedAt = Value(updatedAt);
  static Insertable<Visitante> custom({
    Expression<String>? id,
    Expression<String>? condominioId,
    Expression<String>? empresaId,
    Expression<String>? tipoVisitanteId,
    Expression<String>? nome,
    Expression<String>? documento,
    Expression<String>? fotoUrl,
    Expression<String>? status,
    Expression<int>? syncStatus,
    Expression<DateTime>? createdAt,
    Expression<DateTime>? updatedAt,
    Expression<DateTime>? lastSyncedAt,
    Expression<int>? rowid,
  }) {
    return RawValuesInsertable({
      if (id != null) 'id': id,
      if (condominioId != null) 'condominio_id': condominioId,
      if (empresaId != null) 'empresa_id': empresaId,
      if (tipoVisitanteId != null) 'tipo_visitante_id': tipoVisitanteId,
      if (nome != null) 'nome': nome,
      if (documento != null) 'documento': documento,
      if (fotoUrl != null) 'foto_url': fotoUrl,
      if (status != null) 'status': status,
      if (syncStatus != null) 'sync_status': syncStatus,
      if (createdAt != null) 'created_at': createdAt,
      if (updatedAt != null) 'updated_at': updatedAt,
      if (lastSyncedAt != null) 'last_synced_at': lastSyncedAt,
      if (rowid != null) 'rowid': rowid,
    });
  }

  VisitantesCompanion copyWith({
    Value<String>? id,
    Value<String>? condominioId,
    Value<String?>? empresaId,
    Value<String?>? tipoVisitanteId,
    Value<String>? nome,
    Value<String?>? documento,
    Value<String?>? fotoUrl,
    Value<String>? status,
    Value<int>? syncStatus,
    Value<DateTime>? createdAt,
    Value<DateTime>? updatedAt,
    Value<DateTime?>? lastSyncedAt,
    Value<int>? rowid,
  }) {
    return VisitantesCompanion(
      id: id ?? this.id,
      condominioId: condominioId ?? this.condominioId,
      empresaId: empresaId ?? this.empresaId,
      tipoVisitanteId: tipoVisitanteId ?? this.tipoVisitanteId,
      nome: nome ?? this.nome,
      documento: documento ?? this.documento,
      fotoUrl: fotoUrl ?? this.fotoUrl,
      status: status ?? this.status,
      syncStatus: syncStatus ?? this.syncStatus,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
      lastSyncedAt: lastSyncedAt ?? this.lastSyncedAt,
      rowid: rowid ?? this.rowid,
    );
  }

  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    if (id.present) {
      map['id'] = Variable<String>(id.value);
    }
    if (condominioId.present) {
      map['condominio_id'] = Variable<String>(condominioId.value);
    }
    if (empresaId.present) {
      map['empresa_id'] = Variable<String>(empresaId.value);
    }
    if (tipoVisitanteId.present) {
      map['tipo_visitante_id'] = Variable<String>(tipoVisitanteId.value);
    }
    if (nome.present) {
      map['nome'] = Variable<String>(nome.value);
    }
    if (documento.present) {
      map['documento'] = Variable<String>(documento.value);
    }
    if (fotoUrl.present) {
      map['foto_url'] = Variable<String>(fotoUrl.value);
    }
    if (status.present) {
      map['status'] = Variable<String>(status.value);
    }
    if (syncStatus.present) {
      map['sync_status'] = Variable<int>(syncStatus.value);
    }
    if (createdAt.present) {
      map['created_at'] = Variable<DateTime>(createdAt.value);
    }
    if (updatedAt.present) {
      map['updated_at'] = Variable<DateTime>(updatedAt.value);
    }
    if (lastSyncedAt.present) {
      map['last_synced_at'] = Variable<DateTime>(lastSyncedAt.value);
    }
    if (rowid.present) {
      map['rowid'] = Variable<int>(rowid.value);
    }
    return map;
  }

  @override
  String toString() {
    return (StringBuffer('VisitantesCompanion(')
          ..write('id: $id, ')
          ..write('condominioId: $condominioId, ')
          ..write('empresaId: $empresaId, ')
          ..write('tipoVisitanteId: $tipoVisitanteId, ')
          ..write('nome: $nome, ')
          ..write('documento: $documento, ')
          ..write('fotoUrl: $fotoUrl, ')
          ..write('status: $status, ')
          ..write('syncStatus: $syncStatus, ')
          ..write('createdAt: $createdAt, ')
          ..write('updatedAt: $updatedAt, ')
          ..write('lastSyncedAt: $lastSyncedAt, ')
          ..write('rowid: $rowid')
          ..write(')'))
        .toString();
  }
}

class $RegistrosTable extends Registros
    with TableInfo<$RegistrosTable, Registro> {
  @override
  final GeneratedDatabase attachedDatabase;
  final String? _alias;
  $RegistrosTable(this.attachedDatabase, [this._alias]);
  static const VerificationMeta _idMeta = const VerificationMeta('id');
  @override
  late final GeneratedColumn<String> id = GeneratedColumn<String>(
    'id',
    aliasedName,
    false,
    type: DriftSqlType.string,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _condominioIdMeta = const VerificationMeta(
    'condominioId',
  );
  @override
  late final GeneratedColumn<String> condominioId = GeneratedColumn<String>(
    'condominio_id',
    aliasedName,
    false,
    type: DriftSqlType.string,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _visitanteIdMeta = const VerificationMeta(
    'visitanteId',
  );
  @override
  late final GeneratedColumn<String> visitanteId = GeneratedColumn<String>(
    'visitante_id',
    aliasedName,
    false,
    type: DriftSqlType.string,
    requiredDuringInsert: true,
    defaultConstraints: GeneratedColumn.constraintIsAlways(
      'REFERENCES visitantes (id)',
    ),
  );
  static const VerificationMeta _empresaIdMeta = const VerificationMeta(
    'empresaId',
  );
  @override
  late final GeneratedColumn<String> empresaId = GeneratedColumn<String>(
    'empresa_id',
    aliasedName,
    true,
    type: DriftSqlType.string,
    requiredDuringInsert: false,
    defaultConstraints: GeneratedColumn.constraintIsAlways(
      'REFERENCES empresas (id)',
    ),
  );
  static const VerificationMeta _tipoMeta = const VerificationMeta('tipo');
  @override
  late final GeneratedColumn<String> tipo = GeneratedColumn<String>(
    'tipo',
    aliasedName,
    false,
    type: DriftSqlType.string,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _placaVeiculoMeta = const VerificationMeta(
    'placaVeiculo',
  );
  @override
  late final GeneratedColumn<String> placaVeiculo = GeneratedColumn<String>(
    'placa_veiculo',
    aliasedName,
    true,
    type: DriftSqlType.string,
    requiredDuringInsert: false,
  );
  static const VerificationMeta _fotoVeiculoUrlMeta = const VerificationMeta(
    'fotoVeiculoUrl',
  );
  @override
  late final GeneratedColumn<String> fotoVeiculoUrl = GeneratedColumn<String>(
    'foto_veiculo_url',
    aliasedName,
    true,
    type: DriftSqlType.string,
    requiredDuringInsert: false,
  );
  static const VerificationMeta _dataRegistroMeta = const VerificationMeta(
    'dataRegistro',
  );
  @override
  late final GeneratedColumn<DateTime> dataRegistro = GeneratedColumn<DateTime>(
    'data_registro',
    aliasedName,
    false,
    type: DriftSqlType.dateTime,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _visitanteNomeSnapshotMeta =
      const VerificationMeta('visitanteNomeSnapshot');
  @override
  late final GeneratedColumn<String> visitanteNomeSnapshot =
      GeneratedColumn<String>(
        'visitante_nome_snapshot',
        aliasedName,
        false,
        type: DriftSqlType.string,
        requiredDuringInsert: true,
      );
  static const VerificationMeta _visitanteCpfSnapshotMeta =
      const VerificationMeta('visitanteCpfSnapshot');
  @override
  late final GeneratedColumn<String> visitanteCpfSnapshot =
      GeneratedColumn<String>(
        'visitante_cpf_snapshot',
        aliasedName,
        true,
        type: DriftSqlType.string,
        requiredDuringInsert: false,
      );
  static const VerificationMeta _visitorPhotoSnapshotMeta =
      const VerificationMeta('visitorPhotoSnapshot');
  @override
  late final GeneratedColumn<String> visitorPhotoSnapshot =
      GeneratedColumn<String>(
        'visitor_photo_snapshot',
        aliasedName,
        true,
        type: DriftSqlType.string,
        requiredDuringInsert: false,
      );
  static const VerificationMeta _empresaNomeSnapshotMeta =
      const VerificationMeta('empresaNomeSnapshot');
  @override
  late final GeneratedColumn<String> empresaNomeSnapshot =
      GeneratedColumn<String>(
        'empresa_nome_snapshot',
        aliasedName,
        true,
        type: DriftSqlType.string,
        requiredDuringInsert: false,
      );
  static const VerificationMeta _statusSnapshotMeta = const VerificationMeta(
    'statusSnapshot',
  );
  @override
  late final GeneratedColumn<String> statusSnapshot = GeneratedColumn<String>(
    'status_snapshot',
    aliasedName,
    true,
    type: DriftSqlType.string,
    requiredDuringInsert: false,
  );
  static const VerificationMeta _syncStatusMeta = const VerificationMeta(
    'syncStatus',
  );
  @override
  late final GeneratedColumn<int> syncStatus = GeneratedColumn<int>(
    'sync_status',
    aliasedName,
    false,
    type: DriftSqlType.int,
    requiredDuringInsert: false,
    defaultValue: const Constant(1),
  );
  static const VerificationMeta _createdAtMeta = const VerificationMeta(
    'createdAt',
  );
  @override
  late final GeneratedColumn<DateTime> createdAt = GeneratedColumn<DateTime>(
    'created_at',
    aliasedName,
    false,
    type: DriftSqlType.dateTime,
    requiredDuringInsert: true,
  );
  @override
  List<GeneratedColumn> get $columns => [
    id,
    condominioId,
    visitanteId,
    empresaId,
    tipo,
    placaVeiculo,
    fotoVeiculoUrl,
    dataRegistro,
    visitanteNomeSnapshot,
    visitanteCpfSnapshot,
    visitorPhotoSnapshot,
    empresaNomeSnapshot,
    statusSnapshot,
    syncStatus,
    createdAt,
  ];
  @override
  String get aliasedName => _alias ?? actualTableName;
  @override
  String get actualTableName => $name;
  static const String $name = 'registros';
  @override
  VerificationContext validateIntegrity(
    Insertable<Registro> instance, {
    bool isInserting = false,
  }) {
    final context = VerificationContext();
    final data = instance.toColumns(true);
    if (data.containsKey('id')) {
      context.handle(_idMeta, id.isAcceptableOrUnknown(data['id']!, _idMeta));
    } else if (isInserting) {
      context.missing(_idMeta);
    }
    if (data.containsKey('condominio_id')) {
      context.handle(
        _condominioIdMeta,
        condominioId.isAcceptableOrUnknown(
          data['condominio_id']!,
          _condominioIdMeta,
        ),
      );
    } else if (isInserting) {
      context.missing(_condominioIdMeta);
    }
    if (data.containsKey('visitante_id')) {
      context.handle(
        _visitanteIdMeta,
        visitanteId.isAcceptableOrUnknown(
          data['visitante_id']!,
          _visitanteIdMeta,
        ),
      );
    } else if (isInserting) {
      context.missing(_visitanteIdMeta);
    }
    if (data.containsKey('empresa_id')) {
      context.handle(
        _empresaIdMeta,
        empresaId.isAcceptableOrUnknown(data['empresa_id']!, _empresaIdMeta),
      );
    }
    if (data.containsKey('tipo')) {
      context.handle(
        _tipoMeta,
        tipo.isAcceptableOrUnknown(data['tipo']!, _tipoMeta),
      );
    } else if (isInserting) {
      context.missing(_tipoMeta);
    }
    if (data.containsKey('placa_veiculo')) {
      context.handle(
        _placaVeiculoMeta,
        placaVeiculo.isAcceptableOrUnknown(
          data['placa_veiculo']!,
          _placaVeiculoMeta,
        ),
      );
    }
    if (data.containsKey('foto_veiculo_url')) {
      context.handle(
        _fotoVeiculoUrlMeta,
        fotoVeiculoUrl.isAcceptableOrUnknown(
          data['foto_veiculo_url']!,
          _fotoVeiculoUrlMeta,
        ),
      );
    }
    if (data.containsKey('data_registro')) {
      context.handle(
        _dataRegistroMeta,
        dataRegistro.isAcceptableOrUnknown(
          data['data_registro']!,
          _dataRegistroMeta,
        ),
      );
    } else if (isInserting) {
      context.missing(_dataRegistroMeta);
    }
    if (data.containsKey('visitante_nome_snapshot')) {
      context.handle(
        _visitanteNomeSnapshotMeta,
        visitanteNomeSnapshot.isAcceptableOrUnknown(
          data['visitante_nome_snapshot']!,
          _visitanteNomeSnapshotMeta,
        ),
      );
    } else if (isInserting) {
      context.missing(_visitanteNomeSnapshotMeta);
    }
    if (data.containsKey('visitante_cpf_snapshot')) {
      context.handle(
        _visitanteCpfSnapshotMeta,
        visitanteCpfSnapshot.isAcceptableOrUnknown(
          data['visitante_cpf_snapshot']!,
          _visitanteCpfSnapshotMeta,
        ),
      );
    }
    if (data.containsKey('visitor_photo_snapshot')) {
      context.handle(
        _visitorPhotoSnapshotMeta,
        visitorPhotoSnapshot.isAcceptableOrUnknown(
          data['visitor_photo_snapshot']!,
          _visitorPhotoSnapshotMeta,
        ),
      );
    }
    if (data.containsKey('empresa_nome_snapshot')) {
      context.handle(
        _empresaNomeSnapshotMeta,
        empresaNomeSnapshot.isAcceptableOrUnknown(
          data['empresa_nome_snapshot']!,
          _empresaNomeSnapshotMeta,
        ),
      );
    }
    if (data.containsKey('status_snapshot')) {
      context.handle(
        _statusSnapshotMeta,
        statusSnapshot.isAcceptableOrUnknown(
          data['status_snapshot']!,
          _statusSnapshotMeta,
        ),
      );
    }
    if (data.containsKey('sync_status')) {
      context.handle(
        _syncStatusMeta,
        syncStatus.isAcceptableOrUnknown(data['sync_status']!, _syncStatusMeta),
      );
    }
    if (data.containsKey('created_at')) {
      context.handle(
        _createdAtMeta,
        createdAt.isAcceptableOrUnknown(data['created_at']!, _createdAtMeta),
      );
    } else if (isInserting) {
      context.missing(_createdAtMeta);
    }
    return context;
  }

  @override
  Set<GeneratedColumn> get $primaryKey => {id};
  @override
  Registro map(Map<String, dynamic> data, {String? tablePrefix}) {
    final effectivePrefix = tablePrefix != null ? '$tablePrefix.' : '';
    return Registro(
      id: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}id'],
      )!,
      condominioId: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}condominio_id'],
      )!,
      visitanteId: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}visitante_id'],
      )!,
      empresaId: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}empresa_id'],
      ),
      tipo: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}tipo'],
      )!,
      placaVeiculo: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}placa_veiculo'],
      ),
      fotoVeiculoUrl: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}foto_veiculo_url'],
      ),
      dataRegistro: attachedDatabase.typeMapping.read(
        DriftSqlType.dateTime,
        data['${effectivePrefix}data_registro'],
      )!,
      visitanteNomeSnapshot: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}visitante_nome_snapshot'],
      )!,
      visitanteCpfSnapshot: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}visitante_cpf_snapshot'],
      ),
      visitorPhotoSnapshot: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}visitor_photo_snapshot'],
      ),
      empresaNomeSnapshot: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}empresa_nome_snapshot'],
      ),
      statusSnapshot: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}status_snapshot'],
      ),
      syncStatus: attachedDatabase.typeMapping.read(
        DriftSqlType.int,
        data['${effectivePrefix}sync_status'],
      )!,
      createdAt: attachedDatabase.typeMapping.read(
        DriftSqlType.dateTime,
        data['${effectivePrefix}created_at'],
      )!,
    );
  }

  @override
  $RegistrosTable createAlias(String alias) {
    return $RegistrosTable(attachedDatabase, alias);
  }
}

class Registro extends DataClass implements Insertable<Registro> {
  final String id;
  final String condominioId;
  final String visitanteId;
  final String? empresaId;
  final String tipo;
  final String? placaVeiculo;
  final String? fotoVeiculoUrl;
  final DateTime dataRegistro;
  final String visitanteNomeSnapshot;
  final String? visitanteCpfSnapshot;
  final String? visitorPhotoSnapshot;
  final String? empresaNomeSnapshot;
  final String? statusSnapshot;
  final int syncStatus;
  final DateTime createdAt;
  const Registro({
    required this.id,
    required this.condominioId,
    required this.visitanteId,
    this.empresaId,
    required this.tipo,
    this.placaVeiculo,
    this.fotoVeiculoUrl,
    required this.dataRegistro,
    required this.visitanteNomeSnapshot,
    this.visitanteCpfSnapshot,
    this.visitorPhotoSnapshot,
    this.empresaNomeSnapshot,
    this.statusSnapshot,
    required this.syncStatus,
    required this.createdAt,
  });
  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    map['id'] = Variable<String>(id);
    map['condominio_id'] = Variable<String>(condominioId);
    map['visitante_id'] = Variable<String>(visitanteId);
    if (!nullToAbsent || empresaId != null) {
      map['empresa_id'] = Variable<String>(empresaId);
    }
    map['tipo'] = Variable<String>(tipo);
    if (!nullToAbsent || placaVeiculo != null) {
      map['placa_veiculo'] = Variable<String>(placaVeiculo);
    }
    if (!nullToAbsent || fotoVeiculoUrl != null) {
      map['foto_veiculo_url'] = Variable<String>(fotoVeiculoUrl);
    }
    map['data_registro'] = Variable<DateTime>(dataRegistro);
    map['visitante_nome_snapshot'] = Variable<String>(visitanteNomeSnapshot);
    if (!nullToAbsent || visitanteCpfSnapshot != null) {
      map['visitante_cpf_snapshot'] = Variable<String>(visitanteCpfSnapshot);
    }
    if (!nullToAbsent || visitorPhotoSnapshot != null) {
      map['visitor_photo_snapshot'] = Variable<String>(visitorPhotoSnapshot);
    }
    if (!nullToAbsent || empresaNomeSnapshot != null) {
      map['empresa_nome_snapshot'] = Variable<String>(empresaNomeSnapshot);
    }
    if (!nullToAbsent || statusSnapshot != null) {
      map['status_snapshot'] = Variable<String>(statusSnapshot);
    }
    map['sync_status'] = Variable<int>(syncStatus);
    map['created_at'] = Variable<DateTime>(createdAt);
    return map;
  }

  RegistrosCompanion toCompanion(bool nullToAbsent) {
    return RegistrosCompanion(
      id: Value(id),
      condominioId: Value(condominioId),
      visitanteId: Value(visitanteId),
      empresaId: empresaId == null && nullToAbsent
          ? const Value.absent()
          : Value(empresaId),
      tipo: Value(tipo),
      placaVeiculo: placaVeiculo == null && nullToAbsent
          ? const Value.absent()
          : Value(placaVeiculo),
      fotoVeiculoUrl: fotoVeiculoUrl == null && nullToAbsent
          ? const Value.absent()
          : Value(fotoVeiculoUrl),
      dataRegistro: Value(dataRegistro),
      visitanteNomeSnapshot: Value(visitanteNomeSnapshot),
      visitanteCpfSnapshot: visitanteCpfSnapshot == null && nullToAbsent
          ? const Value.absent()
          : Value(visitanteCpfSnapshot),
      visitorPhotoSnapshot: visitorPhotoSnapshot == null && nullToAbsent
          ? const Value.absent()
          : Value(visitorPhotoSnapshot),
      empresaNomeSnapshot: empresaNomeSnapshot == null && nullToAbsent
          ? const Value.absent()
          : Value(empresaNomeSnapshot),
      statusSnapshot: statusSnapshot == null && nullToAbsent
          ? const Value.absent()
          : Value(statusSnapshot),
      syncStatus: Value(syncStatus),
      createdAt: Value(createdAt),
    );
  }

  factory Registro.fromJson(
    Map<String, dynamic> json, {
    ValueSerializer? serializer,
  }) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return Registro(
      id: serializer.fromJson<String>(json['id']),
      condominioId: serializer.fromJson<String>(json['condominioId']),
      visitanteId: serializer.fromJson<String>(json['visitanteId']),
      empresaId: serializer.fromJson<String?>(json['empresaId']),
      tipo: serializer.fromJson<String>(json['tipo']),
      placaVeiculo: serializer.fromJson<String?>(json['placaVeiculo']),
      fotoVeiculoUrl: serializer.fromJson<String?>(json['fotoVeiculoUrl']),
      dataRegistro: serializer.fromJson<DateTime>(json['dataRegistro']),
      visitanteNomeSnapshot: serializer.fromJson<String>(
        json['visitanteNomeSnapshot'],
      ),
      visitanteCpfSnapshot: serializer.fromJson<String?>(
        json['visitanteCpfSnapshot'],
      ),
      visitorPhotoSnapshot: serializer.fromJson<String?>(
        json['visitorPhotoSnapshot'],
      ),
      empresaNomeSnapshot: serializer.fromJson<String?>(
        json['empresaNomeSnapshot'],
      ),
      statusSnapshot: serializer.fromJson<String?>(json['statusSnapshot']),
      syncStatus: serializer.fromJson<int>(json['syncStatus']),
      createdAt: serializer.fromJson<DateTime>(json['createdAt']),
    );
  }
  @override
  Map<String, dynamic> toJson({ValueSerializer? serializer}) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return <String, dynamic>{
      'id': serializer.toJson<String>(id),
      'condominioId': serializer.toJson<String>(condominioId),
      'visitanteId': serializer.toJson<String>(visitanteId),
      'empresaId': serializer.toJson<String?>(empresaId),
      'tipo': serializer.toJson<String>(tipo),
      'placaVeiculo': serializer.toJson<String?>(placaVeiculo),
      'fotoVeiculoUrl': serializer.toJson<String?>(fotoVeiculoUrl),
      'dataRegistro': serializer.toJson<DateTime>(dataRegistro),
      'visitanteNomeSnapshot': serializer.toJson<String>(visitanteNomeSnapshot),
      'visitanteCpfSnapshot': serializer.toJson<String?>(visitanteCpfSnapshot),
      'visitorPhotoSnapshot': serializer.toJson<String?>(visitorPhotoSnapshot),
      'empresaNomeSnapshot': serializer.toJson<String?>(empresaNomeSnapshot),
      'statusSnapshot': serializer.toJson<String?>(statusSnapshot),
      'syncStatus': serializer.toJson<int>(syncStatus),
      'createdAt': serializer.toJson<DateTime>(createdAt),
    };
  }

  Registro copyWith({
    String? id,
    String? condominioId,
    String? visitanteId,
    Value<String?> empresaId = const Value.absent(),
    String? tipo,
    Value<String?> placaVeiculo = const Value.absent(),
    Value<String?> fotoVeiculoUrl = const Value.absent(),
    DateTime? dataRegistro,
    String? visitanteNomeSnapshot,
    Value<String?> visitanteCpfSnapshot = const Value.absent(),
    Value<String?> visitorPhotoSnapshot = const Value.absent(),
    Value<String?> empresaNomeSnapshot = const Value.absent(),
    Value<String?> statusSnapshot = const Value.absent(),
    int? syncStatus,
    DateTime? createdAt,
  }) => Registro(
    id: id ?? this.id,
    condominioId: condominioId ?? this.condominioId,
    visitanteId: visitanteId ?? this.visitanteId,
    empresaId: empresaId.present ? empresaId.value : this.empresaId,
    tipo: tipo ?? this.tipo,
    placaVeiculo: placaVeiculo.present ? placaVeiculo.value : this.placaVeiculo,
    fotoVeiculoUrl: fotoVeiculoUrl.present
        ? fotoVeiculoUrl.value
        : this.fotoVeiculoUrl,
    dataRegistro: dataRegistro ?? this.dataRegistro,
    visitanteNomeSnapshot: visitanteNomeSnapshot ?? this.visitanteNomeSnapshot,
    visitanteCpfSnapshot: visitanteCpfSnapshot.present
        ? visitanteCpfSnapshot.value
        : this.visitanteCpfSnapshot,
    visitorPhotoSnapshot: visitorPhotoSnapshot.present
        ? visitorPhotoSnapshot.value
        : this.visitorPhotoSnapshot,
    empresaNomeSnapshot: empresaNomeSnapshot.present
        ? empresaNomeSnapshot.value
        : this.empresaNomeSnapshot,
    statusSnapshot: statusSnapshot.present
        ? statusSnapshot.value
        : this.statusSnapshot,
    syncStatus: syncStatus ?? this.syncStatus,
    createdAt: createdAt ?? this.createdAt,
  );
  Registro copyWithCompanion(RegistrosCompanion data) {
    return Registro(
      id: data.id.present ? data.id.value : this.id,
      condominioId: data.condominioId.present
          ? data.condominioId.value
          : this.condominioId,
      visitanteId: data.visitanteId.present
          ? data.visitanteId.value
          : this.visitanteId,
      empresaId: data.empresaId.present ? data.empresaId.value : this.empresaId,
      tipo: data.tipo.present ? data.tipo.value : this.tipo,
      placaVeiculo: data.placaVeiculo.present
          ? data.placaVeiculo.value
          : this.placaVeiculo,
      fotoVeiculoUrl: data.fotoVeiculoUrl.present
          ? data.fotoVeiculoUrl.value
          : this.fotoVeiculoUrl,
      dataRegistro: data.dataRegistro.present
          ? data.dataRegistro.value
          : this.dataRegistro,
      visitanteNomeSnapshot: data.visitanteNomeSnapshot.present
          ? data.visitanteNomeSnapshot.value
          : this.visitanteNomeSnapshot,
      visitanteCpfSnapshot: data.visitanteCpfSnapshot.present
          ? data.visitanteCpfSnapshot.value
          : this.visitanteCpfSnapshot,
      visitorPhotoSnapshot: data.visitorPhotoSnapshot.present
          ? data.visitorPhotoSnapshot.value
          : this.visitorPhotoSnapshot,
      empresaNomeSnapshot: data.empresaNomeSnapshot.present
          ? data.empresaNomeSnapshot.value
          : this.empresaNomeSnapshot,
      statusSnapshot: data.statusSnapshot.present
          ? data.statusSnapshot.value
          : this.statusSnapshot,
      syncStatus: data.syncStatus.present
          ? data.syncStatus.value
          : this.syncStatus,
      createdAt: data.createdAt.present ? data.createdAt.value : this.createdAt,
    );
  }

  @override
  String toString() {
    return (StringBuffer('Registro(')
          ..write('id: $id, ')
          ..write('condominioId: $condominioId, ')
          ..write('visitanteId: $visitanteId, ')
          ..write('empresaId: $empresaId, ')
          ..write('tipo: $tipo, ')
          ..write('placaVeiculo: $placaVeiculo, ')
          ..write('fotoVeiculoUrl: $fotoVeiculoUrl, ')
          ..write('dataRegistro: $dataRegistro, ')
          ..write('visitanteNomeSnapshot: $visitanteNomeSnapshot, ')
          ..write('visitanteCpfSnapshot: $visitanteCpfSnapshot, ')
          ..write('visitorPhotoSnapshot: $visitorPhotoSnapshot, ')
          ..write('empresaNomeSnapshot: $empresaNomeSnapshot, ')
          ..write('statusSnapshot: $statusSnapshot, ')
          ..write('syncStatus: $syncStatus, ')
          ..write('createdAt: $createdAt')
          ..write(')'))
        .toString();
  }

  @override
  int get hashCode => Object.hash(
    id,
    condominioId,
    visitanteId,
    empresaId,
    tipo,
    placaVeiculo,
    fotoVeiculoUrl,
    dataRegistro,
    visitanteNomeSnapshot,
    visitanteCpfSnapshot,
    visitorPhotoSnapshot,
    empresaNomeSnapshot,
    statusSnapshot,
    syncStatus,
    createdAt,
  );
  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      (other is Registro &&
          other.id == this.id &&
          other.condominioId == this.condominioId &&
          other.visitanteId == this.visitanteId &&
          other.empresaId == this.empresaId &&
          other.tipo == this.tipo &&
          other.placaVeiculo == this.placaVeiculo &&
          other.fotoVeiculoUrl == this.fotoVeiculoUrl &&
          other.dataRegistro == this.dataRegistro &&
          other.visitanteNomeSnapshot == this.visitanteNomeSnapshot &&
          other.visitanteCpfSnapshot == this.visitanteCpfSnapshot &&
          other.visitorPhotoSnapshot == this.visitorPhotoSnapshot &&
          other.empresaNomeSnapshot == this.empresaNomeSnapshot &&
          other.statusSnapshot == this.statusSnapshot &&
          other.syncStatus == this.syncStatus &&
          other.createdAt == this.createdAt);
}

class RegistrosCompanion extends UpdateCompanion<Registro> {
  final Value<String> id;
  final Value<String> condominioId;
  final Value<String> visitanteId;
  final Value<String?> empresaId;
  final Value<String> tipo;
  final Value<String?> placaVeiculo;
  final Value<String?> fotoVeiculoUrl;
  final Value<DateTime> dataRegistro;
  final Value<String> visitanteNomeSnapshot;
  final Value<String?> visitanteCpfSnapshot;
  final Value<String?> visitorPhotoSnapshot;
  final Value<String?> empresaNomeSnapshot;
  final Value<String?> statusSnapshot;
  final Value<int> syncStatus;
  final Value<DateTime> createdAt;
  final Value<int> rowid;
  const RegistrosCompanion({
    this.id = const Value.absent(),
    this.condominioId = const Value.absent(),
    this.visitanteId = const Value.absent(),
    this.empresaId = const Value.absent(),
    this.tipo = const Value.absent(),
    this.placaVeiculo = const Value.absent(),
    this.fotoVeiculoUrl = const Value.absent(),
    this.dataRegistro = const Value.absent(),
    this.visitanteNomeSnapshot = const Value.absent(),
    this.visitanteCpfSnapshot = const Value.absent(),
    this.visitorPhotoSnapshot = const Value.absent(),
    this.empresaNomeSnapshot = const Value.absent(),
    this.statusSnapshot = const Value.absent(),
    this.syncStatus = const Value.absent(),
    this.createdAt = const Value.absent(),
    this.rowid = const Value.absent(),
  });
  RegistrosCompanion.insert({
    required String id,
    required String condominioId,
    required String visitanteId,
    this.empresaId = const Value.absent(),
    required String tipo,
    this.placaVeiculo = const Value.absent(),
    this.fotoVeiculoUrl = const Value.absent(),
    required DateTime dataRegistro,
    required String visitanteNomeSnapshot,
    this.visitanteCpfSnapshot = const Value.absent(),
    this.visitorPhotoSnapshot = const Value.absent(),
    this.empresaNomeSnapshot = const Value.absent(),
    this.statusSnapshot = const Value.absent(),
    this.syncStatus = const Value.absent(),
    required DateTime createdAt,
    this.rowid = const Value.absent(),
  }) : id = Value(id),
       condominioId = Value(condominioId),
       visitanteId = Value(visitanteId),
       tipo = Value(tipo),
       dataRegistro = Value(dataRegistro),
       visitanteNomeSnapshot = Value(visitanteNomeSnapshot),
       createdAt = Value(createdAt);
  static Insertable<Registro> custom({
    Expression<String>? id,
    Expression<String>? condominioId,
    Expression<String>? visitanteId,
    Expression<String>? empresaId,
    Expression<String>? tipo,
    Expression<String>? placaVeiculo,
    Expression<String>? fotoVeiculoUrl,
    Expression<DateTime>? dataRegistro,
    Expression<String>? visitanteNomeSnapshot,
    Expression<String>? visitanteCpfSnapshot,
    Expression<String>? visitorPhotoSnapshot,
    Expression<String>? empresaNomeSnapshot,
    Expression<String>? statusSnapshot,
    Expression<int>? syncStatus,
    Expression<DateTime>? createdAt,
    Expression<int>? rowid,
  }) {
    return RawValuesInsertable({
      if (id != null) 'id': id,
      if (condominioId != null) 'condominio_id': condominioId,
      if (visitanteId != null) 'visitante_id': visitanteId,
      if (empresaId != null) 'empresa_id': empresaId,
      if (tipo != null) 'tipo': tipo,
      if (placaVeiculo != null) 'placa_veiculo': placaVeiculo,
      if (fotoVeiculoUrl != null) 'foto_veiculo_url': fotoVeiculoUrl,
      if (dataRegistro != null) 'data_registro': dataRegistro,
      if (visitanteNomeSnapshot != null)
        'visitante_nome_snapshot': visitanteNomeSnapshot,
      if (visitanteCpfSnapshot != null)
        'visitante_cpf_snapshot': visitanteCpfSnapshot,
      if (visitorPhotoSnapshot != null)
        'visitor_photo_snapshot': visitorPhotoSnapshot,
      if (empresaNomeSnapshot != null)
        'empresa_nome_snapshot': empresaNomeSnapshot,
      if (statusSnapshot != null) 'status_snapshot': statusSnapshot,
      if (syncStatus != null) 'sync_status': syncStatus,
      if (createdAt != null) 'created_at': createdAt,
      if (rowid != null) 'rowid': rowid,
    });
  }

  RegistrosCompanion copyWith({
    Value<String>? id,
    Value<String>? condominioId,
    Value<String>? visitanteId,
    Value<String?>? empresaId,
    Value<String>? tipo,
    Value<String?>? placaVeiculo,
    Value<String?>? fotoVeiculoUrl,
    Value<DateTime>? dataRegistro,
    Value<String>? visitanteNomeSnapshot,
    Value<String?>? visitanteCpfSnapshot,
    Value<String?>? visitorPhotoSnapshot,
    Value<String?>? empresaNomeSnapshot,
    Value<String?>? statusSnapshot,
    Value<int>? syncStatus,
    Value<DateTime>? createdAt,
    Value<int>? rowid,
  }) {
    return RegistrosCompanion(
      id: id ?? this.id,
      condominioId: condominioId ?? this.condominioId,
      visitanteId: visitanteId ?? this.visitanteId,
      empresaId: empresaId ?? this.empresaId,
      tipo: tipo ?? this.tipo,
      placaVeiculo: placaVeiculo ?? this.placaVeiculo,
      fotoVeiculoUrl: fotoVeiculoUrl ?? this.fotoVeiculoUrl,
      dataRegistro: dataRegistro ?? this.dataRegistro,
      visitanteNomeSnapshot:
          visitanteNomeSnapshot ?? this.visitanteNomeSnapshot,
      visitanteCpfSnapshot: visitanteCpfSnapshot ?? this.visitanteCpfSnapshot,
      visitorPhotoSnapshot: visitorPhotoSnapshot ?? this.visitorPhotoSnapshot,
      empresaNomeSnapshot: empresaNomeSnapshot ?? this.empresaNomeSnapshot,
      statusSnapshot: statusSnapshot ?? this.statusSnapshot,
      syncStatus: syncStatus ?? this.syncStatus,
      createdAt: createdAt ?? this.createdAt,
      rowid: rowid ?? this.rowid,
    );
  }

  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    if (id.present) {
      map['id'] = Variable<String>(id.value);
    }
    if (condominioId.present) {
      map['condominio_id'] = Variable<String>(condominioId.value);
    }
    if (visitanteId.present) {
      map['visitante_id'] = Variable<String>(visitanteId.value);
    }
    if (empresaId.present) {
      map['empresa_id'] = Variable<String>(empresaId.value);
    }
    if (tipo.present) {
      map['tipo'] = Variable<String>(tipo.value);
    }
    if (placaVeiculo.present) {
      map['placa_veiculo'] = Variable<String>(placaVeiculo.value);
    }
    if (fotoVeiculoUrl.present) {
      map['foto_veiculo_url'] = Variable<String>(fotoVeiculoUrl.value);
    }
    if (dataRegistro.present) {
      map['data_registro'] = Variable<DateTime>(dataRegistro.value);
    }
    if (visitanteNomeSnapshot.present) {
      map['visitante_nome_snapshot'] = Variable<String>(
        visitanteNomeSnapshot.value,
      );
    }
    if (visitanteCpfSnapshot.present) {
      map['visitante_cpf_snapshot'] = Variable<String>(
        visitanteCpfSnapshot.value,
      );
    }
    if (visitorPhotoSnapshot.present) {
      map['visitor_photo_snapshot'] = Variable<String>(
        visitorPhotoSnapshot.value,
      );
    }
    if (empresaNomeSnapshot.present) {
      map['empresa_nome_snapshot'] = Variable<String>(
        empresaNomeSnapshot.value,
      );
    }
    if (statusSnapshot.present) {
      map['status_snapshot'] = Variable<String>(statusSnapshot.value);
    }
    if (syncStatus.present) {
      map['sync_status'] = Variable<int>(syncStatus.value);
    }
    if (createdAt.present) {
      map['created_at'] = Variable<DateTime>(createdAt.value);
    }
    if (rowid.present) {
      map['rowid'] = Variable<int>(rowid.value);
    }
    return map;
  }

  @override
  String toString() {
    return (StringBuffer('RegistrosCompanion(')
          ..write('id: $id, ')
          ..write('condominioId: $condominioId, ')
          ..write('visitanteId: $visitanteId, ')
          ..write('empresaId: $empresaId, ')
          ..write('tipo: $tipo, ')
          ..write('placaVeiculo: $placaVeiculo, ')
          ..write('fotoVeiculoUrl: $fotoVeiculoUrl, ')
          ..write('dataRegistro: $dataRegistro, ')
          ..write('visitanteNomeSnapshot: $visitanteNomeSnapshot, ')
          ..write('visitanteCpfSnapshot: $visitanteCpfSnapshot, ')
          ..write('visitorPhotoSnapshot: $visitorPhotoSnapshot, ')
          ..write('empresaNomeSnapshot: $empresaNomeSnapshot, ')
          ..write('statusSnapshot: $statusSnapshot, ')
          ..write('syncStatus: $syncStatus, ')
          ..write('createdAt: $createdAt, ')
          ..write('rowid: $rowid')
          ..write(')'))
        .toString();
  }
}

abstract class _$AppDatabase extends GeneratedDatabase {
  _$AppDatabase(QueryExecutor e) : super(e);
  $AppDatabaseManager get managers => $AppDatabaseManager(this);
  late final $EmpresasTable empresas = $EmpresasTable(this);
  late final $TiposVisitantesTable tiposVisitantes = $TiposVisitantesTable(
    this,
  );
  late final $VisitantesTable visitantes = $VisitantesTable(this);
  late final $RegistrosTable registros = $RegistrosTable(this);
  @override
  Iterable<TableInfo<Table, Object?>> get allTables =>
      allSchemaEntities.whereType<TableInfo<Table, Object?>>();
  @override
  List<DatabaseSchemaEntity> get allSchemaEntities => [
    empresas,
    tiposVisitantes,
    visitantes,
    registros,
  ];
}

typedef $$EmpresasTableCreateCompanionBuilder =
    EmpresasCompanion Function({
      required String id,
      required String condominioId,
      required String nome,
      Value<String?> cnpj,
      Value<String> status,
      Value<int> syncStatus,
      required DateTime createdAt,
      required DateTime updatedAt,
      Value<DateTime?> lastSyncedAt,
      Value<int> rowid,
    });
typedef $$EmpresasTableUpdateCompanionBuilder =
    EmpresasCompanion Function({
      Value<String> id,
      Value<String> condominioId,
      Value<String> nome,
      Value<String?> cnpj,
      Value<String> status,
      Value<int> syncStatus,
      Value<DateTime> createdAt,
      Value<DateTime> updatedAt,
      Value<DateTime?> lastSyncedAt,
      Value<int> rowid,
    });

final class $$EmpresasTableReferences
    extends BaseReferences<_$AppDatabase, $EmpresasTable, Empresa> {
  $$EmpresasTableReferences(super.$_db, super.$_table, super.$_typedResult);

  static MultiTypedResultKey<$VisitantesTable, List<Visitante>>
  _visitantesRefsTable(_$AppDatabase db) => MultiTypedResultKey.fromTable(
    db.visitantes,
    aliasName: $_aliasNameGenerator(db.empresas.id, db.visitantes.empresaId),
  );

  $$VisitantesTableProcessedTableManager get visitantesRefs {
    final manager = $$VisitantesTableTableManager(
      $_db,
      $_db.visitantes,
    ).filter((f) => f.empresaId.id.sqlEquals($_itemColumn<String>('id')!));

    final cache = $_typedResult.readTableOrNull(_visitantesRefsTable($_db));
    return ProcessedTableManager(
      manager.$state.copyWith(prefetchedData: cache),
    );
  }

  static MultiTypedResultKey<$RegistrosTable, List<Registro>>
  _registrosRefsTable(_$AppDatabase db) => MultiTypedResultKey.fromTable(
    db.registros,
    aliasName: $_aliasNameGenerator(db.empresas.id, db.registros.empresaId),
  );

  $$RegistrosTableProcessedTableManager get registrosRefs {
    final manager = $$RegistrosTableTableManager(
      $_db,
      $_db.registros,
    ).filter((f) => f.empresaId.id.sqlEquals($_itemColumn<String>('id')!));

    final cache = $_typedResult.readTableOrNull(_registrosRefsTable($_db));
    return ProcessedTableManager(
      manager.$state.copyWith(prefetchedData: cache),
    );
  }
}

class $$EmpresasTableFilterComposer
    extends Composer<_$AppDatabase, $EmpresasTable> {
  $$EmpresasTableFilterComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  ColumnFilters<String> get id => $composableBuilder(
    column: $table.id,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get condominioId => $composableBuilder(
    column: $table.condominioId,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get nome => $composableBuilder(
    column: $table.nome,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get cnpj => $composableBuilder(
    column: $table.cnpj,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get status => $composableBuilder(
    column: $table.status,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<int> get syncStatus => $composableBuilder(
    column: $table.syncStatus,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<DateTime> get createdAt => $composableBuilder(
    column: $table.createdAt,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<DateTime> get updatedAt => $composableBuilder(
    column: $table.updatedAt,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<DateTime> get lastSyncedAt => $composableBuilder(
    column: $table.lastSyncedAt,
    builder: (column) => ColumnFilters(column),
  );

  Expression<bool> visitantesRefs(
    Expression<bool> Function($$VisitantesTableFilterComposer f) f,
  ) {
    final $$VisitantesTableFilterComposer composer = $composerBuilder(
      composer: this,
      getCurrentColumn: (t) => t.id,
      referencedTable: $db.visitantes,
      getReferencedColumn: (t) => t.empresaId,
      builder:
          (
            joinBuilder, {
            $addJoinBuilderToRootComposer,
            $removeJoinBuilderFromRootComposer,
          }) => $$VisitantesTableFilterComposer(
            $db: $db,
            $table: $db.visitantes,
            $addJoinBuilderToRootComposer: $addJoinBuilderToRootComposer,
            joinBuilder: joinBuilder,
            $removeJoinBuilderFromRootComposer:
                $removeJoinBuilderFromRootComposer,
          ),
    );
    return f(composer);
  }

  Expression<bool> registrosRefs(
    Expression<bool> Function($$RegistrosTableFilterComposer f) f,
  ) {
    final $$RegistrosTableFilterComposer composer = $composerBuilder(
      composer: this,
      getCurrentColumn: (t) => t.id,
      referencedTable: $db.registros,
      getReferencedColumn: (t) => t.empresaId,
      builder:
          (
            joinBuilder, {
            $addJoinBuilderToRootComposer,
            $removeJoinBuilderFromRootComposer,
          }) => $$RegistrosTableFilterComposer(
            $db: $db,
            $table: $db.registros,
            $addJoinBuilderToRootComposer: $addJoinBuilderToRootComposer,
            joinBuilder: joinBuilder,
            $removeJoinBuilderFromRootComposer:
                $removeJoinBuilderFromRootComposer,
          ),
    );
    return f(composer);
  }
}

class $$EmpresasTableOrderingComposer
    extends Composer<_$AppDatabase, $EmpresasTable> {
  $$EmpresasTableOrderingComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  ColumnOrderings<String> get id => $composableBuilder(
    column: $table.id,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get condominioId => $composableBuilder(
    column: $table.condominioId,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get nome => $composableBuilder(
    column: $table.nome,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get cnpj => $composableBuilder(
    column: $table.cnpj,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get status => $composableBuilder(
    column: $table.status,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<int> get syncStatus => $composableBuilder(
    column: $table.syncStatus,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<DateTime> get createdAt => $composableBuilder(
    column: $table.createdAt,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<DateTime> get updatedAt => $composableBuilder(
    column: $table.updatedAt,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<DateTime> get lastSyncedAt => $composableBuilder(
    column: $table.lastSyncedAt,
    builder: (column) => ColumnOrderings(column),
  );
}

class $$EmpresasTableAnnotationComposer
    extends Composer<_$AppDatabase, $EmpresasTable> {
  $$EmpresasTableAnnotationComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  GeneratedColumn<String> get id =>
      $composableBuilder(column: $table.id, builder: (column) => column);

  GeneratedColumn<String> get condominioId => $composableBuilder(
    column: $table.condominioId,
    builder: (column) => column,
  );

  GeneratedColumn<String> get nome =>
      $composableBuilder(column: $table.nome, builder: (column) => column);

  GeneratedColumn<String> get cnpj =>
      $composableBuilder(column: $table.cnpj, builder: (column) => column);

  GeneratedColumn<String> get status =>
      $composableBuilder(column: $table.status, builder: (column) => column);

  GeneratedColumn<int> get syncStatus => $composableBuilder(
    column: $table.syncStatus,
    builder: (column) => column,
  );

  GeneratedColumn<DateTime> get createdAt =>
      $composableBuilder(column: $table.createdAt, builder: (column) => column);

  GeneratedColumn<DateTime> get updatedAt =>
      $composableBuilder(column: $table.updatedAt, builder: (column) => column);

  GeneratedColumn<DateTime> get lastSyncedAt => $composableBuilder(
    column: $table.lastSyncedAt,
    builder: (column) => column,
  );

  Expression<T> visitantesRefs<T extends Object>(
    Expression<T> Function($$VisitantesTableAnnotationComposer a) f,
  ) {
    final $$VisitantesTableAnnotationComposer composer = $composerBuilder(
      composer: this,
      getCurrentColumn: (t) => t.id,
      referencedTable: $db.visitantes,
      getReferencedColumn: (t) => t.empresaId,
      builder:
          (
            joinBuilder, {
            $addJoinBuilderToRootComposer,
            $removeJoinBuilderFromRootComposer,
          }) => $$VisitantesTableAnnotationComposer(
            $db: $db,
            $table: $db.visitantes,
            $addJoinBuilderToRootComposer: $addJoinBuilderToRootComposer,
            joinBuilder: joinBuilder,
            $removeJoinBuilderFromRootComposer:
                $removeJoinBuilderFromRootComposer,
          ),
    );
    return f(composer);
  }

  Expression<T> registrosRefs<T extends Object>(
    Expression<T> Function($$RegistrosTableAnnotationComposer a) f,
  ) {
    final $$RegistrosTableAnnotationComposer composer = $composerBuilder(
      composer: this,
      getCurrentColumn: (t) => t.id,
      referencedTable: $db.registros,
      getReferencedColumn: (t) => t.empresaId,
      builder:
          (
            joinBuilder, {
            $addJoinBuilderToRootComposer,
            $removeJoinBuilderFromRootComposer,
          }) => $$RegistrosTableAnnotationComposer(
            $db: $db,
            $table: $db.registros,
            $addJoinBuilderToRootComposer: $addJoinBuilderToRootComposer,
            joinBuilder: joinBuilder,
            $removeJoinBuilderFromRootComposer:
                $removeJoinBuilderFromRootComposer,
          ),
    );
    return f(composer);
  }
}

class $$EmpresasTableTableManager
    extends
        RootTableManager<
          _$AppDatabase,
          $EmpresasTable,
          Empresa,
          $$EmpresasTableFilterComposer,
          $$EmpresasTableOrderingComposer,
          $$EmpresasTableAnnotationComposer,
          $$EmpresasTableCreateCompanionBuilder,
          $$EmpresasTableUpdateCompanionBuilder,
          (Empresa, $$EmpresasTableReferences),
          Empresa,
          PrefetchHooks Function({bool visitantesRefs, bool registrosRefs})
        > {
  $$EmpresasTableTableManager(_$AppDatabase db, $EmpresasTable table)
    : super(
        TableManagerState(
          db: db,
          table: table,
          createFilteringComposer: () =>
              $$EmpresasTableFilterComposer($db: db, $table: table),
          createOrderingComposer: () =>
              $$EmpresasTableOrderingComposer($db: db, $table: table),
          createComputedFieldComposer: () =>
              $$EmpresasTableAnnotationComposer($db: db, $table: table),
          updateCompanionCallback:
              ({
                Value<String> id = const Value.absent(),
                Value<String> condominioId = const Value.absent(),
                Value<String> nome = const Value.absent(),
                Value<String?> cnpj = const Value.absent(),
                Value<String> status = const Value.absent(),
                Value<int> syncStatus = const Value.absent(),
                Value<DateTime> createdAt = const Value.absent(),
                Value<DateTime> updatedAt = const Value.absent(),
                Value<DateTime?> lastSyncedAt = const Value.absent(),
                Value<int> rowid = const Value.absent(),
              }) => EmpresasCompanion(
                id: id,
                condominioId: condominioId,
                nome: nome,
                cnpj: cnpj,
                status: status,
                syncStatus: syncStatus,
                createdAt: createdAt,
                updatedAt: updatedAt,
                lastSyncedAt: lastSyncedAt,
                rowid: rowid,
              ),
          createCompanionCallback:
              ({
                required String id,
                required String condominioId,
                required String nome,
                Value<String?> cnpj = const Value.absent(),
                Value<String> status = const Value.absent(),
                Value<int> syncStatus = const Value.absent(),
                required DateTime createdAt,
                required DateTime updatedAt,
                Value<DateTime?> lastSyncedAt = const Value.absent(),
                Value<int> rowid = const Value.absent(),
              }) => EmpresasCompanion.insert(
                id: id,
                condominioId: condominioId,
                nome: nome,
                cnpj: cnpj,
                status: status,
                syncStatus: syncStatus,
                createdAt: createdAt,
                updatedAt: updatedAt,
                lastSyncedAt: lastSyncedAt,
                rowid: rowid,
              ),
          withReferenceMapper: (p0) => p0
              .map(
                (e) => (
                  e.readTable(table),
                  $$EmpresasTableReferences(db, table, e),
                ),
              )
              .toList(),
          prefetchHooksCallback:
              ({visitantesRefs = false, registrosRefs = false}) {
                return PrefetchHooks(
                  db: db,
                  explicitlyWatchedTables: [
                    if (visitantesRefs) db.visitantes,
                    if (registrosRefs) db.registros,
                  ],
                  addJoins: null,
                  getPrefetchedDataCallback: (items) async {
                    return [
                      if (visitantesRefs)
                        await $_getPrefetchedData<
                          Empresa,
                          $EmpresasTable,
                          Visitante
                        >(
                          currentTable: table,
                          referencedTable: $$EmpresasTableReferences
                              ._visitantesRefsTable(db),
                          managerFromTypedResult: (p0) =>
                              $$EmpresasTableReferences(
                                db,
                                table,
                                p0,
                              ).visitantesRefs,
                          referencedItemsForCurrentItem:
                              (item, referencedItems) => referencedItems.where(
                                (e) => e.empresaId == item.id,
                              ),
                          typedResults: items,
                        ),
                      if (registrosRefs)
                        await $_getPrefetchedData<
                          Empresa,
                          $EmpresasTable,
                          Registro
                        >(
                          currentTable: table,
                          referencedTable: $$EmpresasTableReferences
                              ._registrosRefsTable(db),
                          managerFromTypedResult: (p0) =>
                              $$EmpresasTableReferences(
                                db,
                                table,
                                p0,
                              ).registrosRefs,
                          referencedItemsForCurrentItem:
                              (item, referencedItems) => referencedItems.where(
                                (e) => e.empresaId == item.id,
                              ),
                          typedResults: items,
                        ),
                    ];
                  },
                );
              },
        ),
      );
}

typedef $$EmpresasTableProcessedTableManager =
    ProcessedTableManager<
      _$AppDatabase,
      $EmpresasTable,
      Empresa,
      $$EmpresasTableFilterComposer,
      $$EmpresasTableOrderingComposer,
      $$EmpresasTableAnnotationComposer,
      $$EmpresasTableCreateCompanionBuilder,
      $$EmpresasTableUpdateCompanionBuilder,
      (Empresa, $$EmpresasTableReferences),
      Empresa,
      PrefetchHooks Function({bool visitantesRefs, bool registrosRefs})
    >;
typedef $$TiposVisitantesTableCreateCompanionBuilder =
    TiposVisitantesCompanion Function({
      required String id,
      Value<String?> condominioId,
      required String nome,
      required DateTime createdAt,
      Value<int> rowid,
    });
typedef $$TiposVisitantesTableUpdateCompanionBuilder =
    TiposVisitantesCompanion Function({
      Value<String> id,
      Value<String?> condominioId,
      Value<String> nome,
      Value<DateTime> createdAt,
      Value<int> rowid,
    });

final class $$TiposVisitantesTableReferences
    extends
        BaseReferences<_$AppDatabase, $TiposVisitantesTable, TiposVisitante> {
  $$TiposVisitantesTableReferences(
    super.$_db,
    super.$_table,
    super.$_typedResult,
  );

  static MultiTypedResultKey<$VisitantesTable, List<Visitante>>
  _visitantesRefsTable(_$AppDatabase db) => MultiTypedResultKey.fromTable(
    db.visitantes,
    aliasName: $_aliasNameGenerator(
      db.tiposVisitantes.id,
      db.visitantes.tipoVisitanteId,
    ),
  );

  $$VisitantesTableProcessedTableManager get visitantesRefs {
    final manager = $$VisitantesTableTableManager($_db, $_db.visitantes).filter(
      (f) => f.tipoVisitanteId.id.sqlEquals($_itemColumn<String>('id')!),
    );

    final cache = $_typedResult.readTableOrNull(_visitantesRefsTable($_db));
    return ProcessedTableManager(
      manager.$state.copyWith(prefetchedData: cache),
    );
  }
}

class $$TiposVisitantesTableFilterComposer
    extends Composer<_$AppDatabase, $TiposVisitantesTable> {
  $$TiposVisitantesTableFilterComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  ColumnFilters<String> get id => $composableBuilder(
    column: $table.id,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get condominioId => $composableBuilder(
    column: $table.condominioId,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get nome => $composableBuilder(
    column: $table.nome,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<DateTime> get createdAt => $composableBuilder(
    column: $table.createdAt,
    builder: (column) => ColumnFilters(column),
  );

  Expression<bool> visitantesRefs(
    Expression<bool> Function($$VisitantesTableFilterComposer f) f,
  ) {
    final $$VisitantesTableFilterComposer composer = $composerBuilder(
      composer: this,
      getCurrentColumn: (t) => t.id,
      referencedTable: $db.visitantes,
      getReferencedColumn: (t) => t.tipoVisitanteId,
      builder:
          (
            joinBuilder, {
            $addJoinBuilderToRootComposer,
            $removeJoinBuilderFromRootComposer,
          }) => $$VisitantesTableFilterComposer(
            $db: $db,
            $table: $db.visitantes,
            $addJoinBuilderToRootComposer: $addJoinBuilderToRootComposer,
            joinBuilder: joinBuilder,
            $removeJoinBuilderFromRootComposer:
                $removeJoinBuilderFromRootComposer,
          ),
    );
    return f(composer);
  }
}

class $$TiposVisitantesTableOrderingComposer
    extends Composer<_$AppDatabase, $TiposVisitantesTable> {
  $$TiposVisitantesTableOrderingComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  ColumnOrderings<String> get id => $composableBuilder(
    column: $table.id,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get condominioId => $composableBuilder(
    column: $table.condominioId,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get nome => $composableBuilder(
    column: $table.nome,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<DateTime> get createdAt => $composableBuilder(
    column: $table.createdAt,
    builder: (column) => ColumnOrderings(column),
  );
}

class $$TiposVisitantesTableAnnotationComposer
    extends Composer<_$AppDatabase, $TiposVisitantesTable> {
  $$TiposVisitantesTableAnnotationComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  GeneratedColumn<String> get id =>
      $composableBuilder(column: $table.id, builder: (column) => column);

  GeneratedColumn<String> get condominioId => $composableBuilder(
    column: $table.condominioId,
    builder: (column) => column,
  );

  GeneratedColumn<String> get nome =>
      $composableBuilder(column: $table.nome, builder: (column) => column);

  GeneratedColumn<DateTime> get createdAt =>
      $composableBuilder(column: $table.createdAt, builder: (column) => column);

  Expression<T> visitantesRefs<T extends Object>(
    Expression<T> Function($$VisitantesTableAnnotationComposer a) f,
  ) {
    final $$VisitantesTableAnnotationComposer composer = $composerBuilder(
      composer: this,
      getCurrentColumn: (t) => t.id,
      referencedTable: $db.visitantes,
      getReferencedColumn: (t) => t.tipoVisitanteId,
      builder:
          (
            joinBuilder, {
            $addJoinBuilderToRootComposer,
            $removeJoinBuilderFromRootComposer,
          }) => $$VisitantesTableAnnotationComposer(
            $db: $db,
            $table: $db.visitantes,
            $addJoinBuilderToRootComposer: $addJoinBuilderToRootComposer,
            joinBuilder: joinBuilder,
            $removeJoinBuilderFromRootComposer:
                $removeJoinBuilderFromRootComposer,
          ),
    );
    return f(composer);
  }
}

class $$TiposVisitantesTableTableManager
    extends
        RootTableManager<
          _$AppDatabase,
          $TiposVisitantesTable,
          TiposVisitante,
          $$TiposVisitantesTableFilterComposer,
          $$TiposVisitantesTableOrderingComposer,
          $$TiposVisitantesTableAnnotationComposer,
          $$TiposVisitantesTableCreateCompanionBuilder,
          $$TiposVisitantesTableUpdateCompanionBuilder,
          (TiposVisitante, $$TiposVisitantesTableReferences),
          TiposVisitante,
          PrefetchHooks Function({bool visitantesRefs})
        > {
  $$TiposVisitantesTableTableManager(
    _$AppDatabase db,
    $TiposVisitantesTable table,
  ) : super(
        TableManagerState(
          db: db,
          table: table,
          createFilteringComposer: () =>
              $$TiposVisitantesTableFilterComposer($db: db, $table: table),
          createOrderingComposer: () =>
              $$TiposVisitantesTableOrderingComposer($db: db, $table: table),
          createComputedFieldComposer: () =>
              $$TiposVisitantesTableAnnotationComposer($db: db, $table: table),
          updateCompanionCallback:
              ({
                Value<String> id = const Value.absent(),
                Value<String?> condominioId = const Value.absent(),
                Value<String> nome = const Value.absent(),
                Value<DateTime> createdAt = const Value.absent(),
                Value<int> rowid = const Value.absent(),
              }) => TiposVisitantesCompanion(
                id: id,
                condominioId: condominioId,
                nome: nome,
                createdAt: createdAt,
                rowid: rowid,
              ),
          createCompanionCallback:
              ({
                required String id,
                Value<String?> condominioId = const Value.absent(),
                required String nome,
                required DateTime createdAt,
                Value<int> rowid = const Value.absent(),
              }) => TiposVisitantesCompanion.insert(
                id: id,
                condominioId: condominioId,
                nome: nome,
                createdAt: createdAt,
                rowid: rowid,
              ),
          withReferenceMapper: (p0) => p0
              .map(
                (e) => (
                  e.readTable(table),
                  $$TiposVisitantesTableReferences(db, table, e),
                ),
              )
              .toList(),
          prefetchHooksCallback: ({visitantesRefs = false}) {
            return PrefetchHooks(
              db: db,
              explicitlyWatchedTables: [if (visitantesRefs) db.visitantes],
              addJoins: null,
              getPrefetchedDataCallback: (items) async {
                return [
                  if (visitantesRefs)
                    await $_getPrefetchedData<
                      TiposVisitante,
                      $TiposVisitantesTable,
                      Visitante
                    >(
                      currentTable: table,
                      referencedTable: $$TiposVisitantesTableReferences
                          ._visitantesRefsTable(db),
                      managerFromTypedResult: (p0) =>
                          $$TiposVisitantesTableReferences(
                            db,
                            table,
                            p0,
                          ).visitantesRefs,
                      referencedItemsForCurrentItem: (item, referencedItems) =>
                          referencedItems.where(
                            (e) => e.tipoVisitanteId == item.id,
                          ),
                      typedResults: items,
                    ),
                ];
              },
            );
          },
        ),
      );
}

typedef $$TiposVisitantesTableProcessedTableManager =
    ProcessedTableManager<
      _$AppDatabase,
      $TiposVisitantesTable,
      TiposVisitante,
      $$TiposVisitantesTableFilterComposer,
      $$TiposVisitantesTableOrderingComposer,
      $$TiposVisitantesTableAnnotationComposer,
      $$TiposVisitantesTableCreateCompanionBuilder,
      $$TiposVisitantesTableUpdateCompanionBuilder,
      (TiposVisitante, $$TiposVisitantesTableReferences),
      TiposVisitante,
      PrefetchHooks Function({bool visitantesRefs})
    >;
typedef $$VisitantesTableCreateCompanionBuilder =
    VisitantesCompanion Function({
      required String id,
      required String condominioId,
      Value<String?> empresaId,
      Value<String?> tipoVisitanteId,
      required String nome,
      Value<String?> documento,
      Value<String?> fotoUrl,
      Value<String> status,
      Value<int> syncStatus,
      required DateTime createdAt,
      required DateTime updatedAt,
      Value<DateTime?> lastSyncedAt,
      Value<int> rowid,
    });
typedef $$VisitantesTableUpdateCompanionBuilder =
    VisitantesCompanion Function({
      Value<String> id,
      Value<String> condominioId,
      Value<String?> empresaId,
      Value<String?> tipoVisitanteId,
      Value<String> nome,
      Value<String?> documento,
      Value<String?> fotoUrl,
      Value<String> status,
      Value<int> syncStatus,
      Value<DateTime> createdAt,
      Value<DateTime> updatedAt,
      Value<DateTime?> lastSyncedAt,
      Value<int> rowid,
    });

final class $$VisitantesTableReferences
    extends BaseReferences<_$AppDatabase, $VisitantesTable, Visitante> {
  $$VisitantesTableReferences(super.$_db, super.$_table, super.$_typedResult);

  static $EmpresasTable _empresaIdTable(_$AppDatabase db) =>
      db.empresas.createAlias(
        $_aliasNameGenerator(db.visitantes.empresaId, db.empresas.id),
      );

  $$EmpresasTableProcessedTableManager? get empresaId {
    final $_column = $_itemColumn<String>('empresa_id');
    if ($_column == null) return null;
    final manager = $$EmpresasTableTableManager(
      $_db,
      $_db.empresas,
    ).filter((f) => f.id.sqlEquals($_column));
    final item = $_typedResult.readTableOrNull(_empresaIdTable($_db));
    if (item == null) return manager;
    return ProcessedTableManager(
      manager.$state.copyWith(prefetchedData: [item]),
    );
  }

  static $TiposVisitantesTable _tipoVisitanteIdTable(_$AppDatabase db) =>
      db.tiposVisitantes.createAlias(
        $_aliasNameGenerator(
          db.visitantes.tipoVisitanteId,
          db.tiposVisitantes.id,
        ),
      );

  $$TiposVisitantesTableProcessedTableManager? get tipoVisitanteId {
    final $_column = $_itemColumn<String>('tipo_visitante_id');
    if ($_column == null) return null;
    final manager = $$TiposVisitantesTableTableManager(
      $_db,
      $_db.tiposVisitantes,
    ).filter((f) => f.id.sqlEquals($_column));
    final item = $_typedResult.readTableOrNull(_tipoVisitanteIdTable($_db));
    if (item == null) return manager;
    return ProcessedTableManager(
      manager.$state.copyWith(prefetchedData: [item]),
    );
  }

  static MultiTypedResultKey<$RegistrosTable, List<Registro>>
  _registrosRefsTable(_$AppDatabase db) => MultiTypedResultKey.fromTable(
    db.registros,
    aliasName: $_aliasNameGenerator(db.visitantes.id, db.registros.visitanteId),
  );

  $$RegistrosTableProcessedTableManager get registrosRefs {
    final manager = $$RegistrosTableTableManager(
      $_db,
      $_db.registros,
    ).filter((f) => f.visitanteId.id.sqlEquals($_itemColumn<String>('id')!));

    final cache = $_typedResult.readTableOrNull(_registrosRefsTable($_db));
    return ProcessedTableManager(
      manager.$state.copyWith(prefetchedData: cache),
    );
  }
}

class $$VisitantesTableFilterComposer
    extends Composer<_$AppDatabase, $VisitantesTable> {
  $$VisitantesTableFilterComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  ColumnFilters<String> get id => $composableBuilder(
    column: $table.id,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get condominioId => $composableBuilder(
    column: $table.condominioId,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get nome => $composableBuilder(
    column: $table.nome,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get documento => $composableBuilder(
    column: $table.documento,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get fotoUrl => $composableBuilder(
    column: $table.fotoUrl,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get status => $composableBuilder(
    column: $table.status,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<int> get syncStatus => $composableBuilder(
    column: $table.syncStatus,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<DateTime> get createdAt => $composableBuilder(
    column: $table.createdAt,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<DateTime> get updatedAt => $composableBuilder(
    column: $table.updatedAt,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<DateTime> get lastSyncedAt => $composableBuilder(
    column: $table.lastSyncedAt,
    builder: (column) => ColumnFilters(column),
  );

  $$EmpresasTableFilterComposer get empresaId {
    final $$EmpresasTableFilterComposer composer = $composerBuilder(
      composer: this,
      getCurrentColumn: (t) => t.empresaId,
      referencedTable: $db.empresas,
      getReferencedColumn: (t) => t.id,
      builder:
          (
            joinBuilder, {
            $addJoinBuilderToRootComposer,
            $removeJoinBuilderFromRootComposer,
          }) => $$EmpresasTableFilterComposer(
            $db: $db,
            $table: $db.empresas,
            $addJoinBuilderToRootComposer: $addJoinBuilderToRootComposer,
            joinBuilder: joinBuilder,
            $removeJoinBuilderFromRootComposer:
                $removeJoinBuilderFromRootComposer,
          ),
    );
    return composer;
  }

  $$TiposVisitantesTableFilterComposer get tipoVisitanteId {
    final $$TiposVisitantesTableFilterComposer composer = $composerBuilder(
      composer: this,
      getCurrentColumn: (t) => t.tipoVisitanteId,
      referencedTable: $db.tiposVisitantes,
      getReferencedColumn: (t) => t.id,
      builder:
          (
            joinBuilder, {
            $addJoinBuilderToRootComposer,
            $removeJoinBuilderFromRootComposer,
          }) => $$TiposVisitantesTableFilterComposer(
            $db: $db,
            $table: $db.tiposVisitantes,
            $addJoinBuilderToRootComposer: $addJoinBuilderToRootComposer,
            joinBuilder: joinBuilder,
            $removeJoinBuilderFromRootComposer:
                $removeJoinBuilderFromRootComposer,
          ),
    );
    return composer;
  }

  Expression<bool> registrosRefs(
    Expression<bool> Function($$RegistrosTableFilterComposer f) f,
  ) {
    final $$RegistrosTableFilterComposer composer = $composerBuilder(
      composer: this,
      getCurrentColumn: (t) => t.id,
      referencedTable: $db.registros,
      getReferencedColumn: (t) => t.visitanteId,
      builder:
          (
            joinBuilder, {
            $addJoinBuilderToRootComposer,
            $removeJoinBuilderFromRootComposer,
          }) => $$RegistrosTableFilterComposer(
            $db: $db,
            $table: $db.registros,
            $addJoinBuilderToRootComposer: $addJoinBuilderToRootComposer,
            joinBuilder: joinBuilder,
            $removeJoinBuilderFromRootComposer:
                $removeJoinBuilderFromRootComposer,
          ),
    );
    return f(composer);
  }
}

class $$VisitantesTableOrderingComposer
    extends Composer<_$AppDatabase, $VisitantesTable> {
  $$VisitantesTableOrderingComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  ColumnOrderings<String> get id => $composableBuilder(
    column: $table.id,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get condominioId => $composableBuilder(
    column: $table.condominioId,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get nome => $composableBuilder(
    column: $table.nome,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get documento => $composableBuilder(
    column: $table.documento,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get fotoUrl => $composableBuilder(
    column: $table.fotoUrl,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get status => $composableBuilder(
    column: $table.status,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<int> get syncStatus => $composableBuilder(
    column: $table.syncStatus,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<DateTime> get createdAt => $composableBuilder(
    column: $table.createdAt,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<DateTime> get updatedAt => $composableBuilder(
    column: $table.updatedAt,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<DateTime> get lastSyncedAt => $composableBuilder(
    column: $table.lastSyncedAt,
    builder: (column) => ColumnOrderings(column),
  );

  $$EmpresasTableOrderingComposer get empresaId {
    final $$EmpresasTableOrderingComposer composer = $composerBuilder(
      composer: this,
      getCurrentColumn: (t) => t.empresaId,
      referencedTable: $db.empresas,
      getReferencedColumn: (t) => t.id,
      builder:
          (
            joinBuilder, {
            $addJoinBuilderToRootComposer,
            $removeJoinBuilderFromRootComposer,
          }) => $$EmpresasTableOrderingComposer(
            $db: $db,
            $table: $db.empresas,
            $addJoinBuilderToRootComposer: $addJoinBuilderToRootComposer,
            joinBuilder: joinBuilder,
            $removeJoinBuilderFromRootComposer:
                $removeJoinBuilderFromRootComposer,
          ),
    );
    return composer;
  }

  $$TiposVisitantesTableOrderingComposer get tipoVisitanteId {
    final $$TiposVisitantesTableOrderingComposer composer = $composerBuilder(
      composer: this,
      getCurrentColumn: (t) => t.tipoVisitanteId,
      referencedTable: $db.tiposVisitantes,
      getReferencedColumn: (t) => t.id,
      builder:
          (
            joinBuilder, {
            $addJoinBuilderToRootComposer,
            $removeJoinBuilderFromRootComposer,
          }) => $$TiposVisitantesTableOrderingComposer(
            $db: $db,
            $table: $db.tiposVisitantes,
            $addJoinBuilderToRootComposer: $addJoinBuilderToRootComposer,
            joinBuilder: joinBuilder,
            $removeJoinBuilderFromRootComposer:
                $removeJoinBuilderFromRootComposer,
          ),
    );
    return composer;
  }
}

class $$VisitantesTableAnnotationComposer
    extends Composer<_$AppDatabase, $VisitantesTable> {
  $$VisitantesTableAnnotationComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  GeneratedColumn<String> get id =>
      $composableBuilder(column: $table.id, builder: (column) => column);

  GeneratedColumn<String> get condominioId => $composableBuilder(
    column: $table.condominioId,
    builder: (column) => column,
  );

  GeneratedColumn<String> get nome =>
      $composableBuilder(column: $table.nome, builder: (column) => column);

  GeneratedColumn<String> get documento =>
      $composableBuilder(column: $table.documento, builder: (column) => column);

  GeneratedColumn<String> get fotoUrl =>
      $composableBuilder(column: $table.fotoUrl, builder: (column) => column);

  GeneratedColumn<String> get status =>
      $composableBuilder(column: $table.status, builder: (column) => column);

  GeneratedColumn<int> get syncStatus => $composableBuilder(
    column: $table.syncStatus,
    builder: (column) => column,
  );

  GeneratedColumn<DateTime> get createdAt =>
      $composableBuilder(column: $table.createdAt, builder: (column) => column);

  GeneratedColumn<DateTime> get updatedAt =>
      $composableBuilder(column: $table.updatedAt, builder: (column) => column);

  GeneratedColumn<DateTime> get lastSyncedAt => $composableBuilder(
    column: $table.lastSyncedAt,
    builder: (column) => column,
  );

  $$EmpresasTableAnnotationComposer get empresaId {
    final $$EmpresasTableAnnotationComposer composer = $composerBuilder(
      composer: this,
      getCurrentColumn: (t) => t.empresaId,
      referencedTable: $db.empresas,
      getReferencedColumn: (t) => t.id,
      builder:
          (
            joinBuilder, {
            $addJoinBuilderToRootComposer,
            $removeJoinBuilderFromRootComposer,
          }) => $$EmpresasTableAnnotationComposer(
            $db: $db,
            $table: $db.empresas,
            $addJoinBuilderToRootComposer: $addJoinBuilderToRootComposer,
            joinBuilder: joinBuilder,
            $removeJoinBuilderFromRootComposer:
                $removeJoinBuilderFromRootComposer,
          ),
    );
    return composer;
  }

  $$TiposVisitantesTableAnnotationComposer get tipoVisitanteId {
    final $$TiposVisitantesTableAnnotationComposer composer = $composerBuilder(
      composer: this,
      getCurrentColumn: (t) => t.tipoVisitanteId,
      referencedTable: $db.tiposVisitantes,
      getReferencedColumn: (t) => t.id,
      builder:
          (
            joinBuilder, {
            $addJoinBuilderToRootComposer,
            $removeJoinBuilderFromRootComposer,
          }) => $$TiposVisitantesTableAnnotationComposer(
            $db: $db,
            $table: $db.tiposVisitantes,
            $addJoinBuilderToRootComposer: $addJoinBuilderToRootComposer,
            joinBuilder: joinBuilder,
            $removeJoinBuilderFromRootComposer:
                $removeJoinBuilderFromRootComposer,
          ),
    );
    return composer;
  }

  Expression<T> registrosRefs<T extends Object>(
    Expression<T> Function($$RegistrosTableAnnotationComposer a) f,
  ) {
    final $$RegistrosTableAnnotationComposer composer = $composerBuilder(
      composer: this,
      getCurrentColumn: (t) => t.id,
      referencedTable: $db.registros,
      getReferencedColumn: (t) => t.visitanteId,
      builder:
          (
            joinBuilder, {
            $addJoinBuilderToRootComposer,
            $removeJoinBuilderFromRootComposer,
          }) => $$RegistrosTableAnnotationComposer(
            $db: $db,
            $table: $db.registros,
            $addJoinBuilderToRootComposer: $addJoinBuilderToRootComposer,
            joinBuilder: joinBuilder,
            $removeJoinBuilderFromRootComposer:
                $removeJoinBuilderFromRootComposer,
          ),
    );
    return f(composer);
  }
}

class $$VisitantesTableTableManager
    extends
        RootTableManager<
          _$AppDatabase,
          $VisitantesTable,
          Visitante,
          $$VisitantesTableFilterComposer,
          $$VisitantesTableOrderingComposer,
          $$VisitantesTableAnnotationComposer,
          $$VisitantesTableCreateCompanionBuilder,
          $$VisitantesTableUpdateCompanionBuilder,
          (Visitante, $$VisitantesTableReferences),
          Visitante,
          PrefetchHooks Function({
            bool empresaId,
            bool tipoVisitanteId,
            bool registrosRefs,
          })
        > {
  $$VisitantesTableTableManager(_$AppDatabase db, $VisitantesTable table)
    : super(
        TableManagerState(
          db: db,
          table: table,
          createFilteringComposer: () =>
              $$VisitantesTableFilterComposer($db: db, $table: table),
          createOrderingComposer: () =>
              $$VisitantesTableOrderingComposer($db: db, $table: table),
          createComputedFieldComposer: () =>
              $$VisitantesTableAnnotationComposer($db: db, $table: table),
          updateCompanionCallback:
              ({
                Value<String> id = const Value.absent(),
                Value<String> condominioId = const Value.absent(),
                Value<String?> empresaId = const Value.absent(),
                Value<String?> tipoVisitanteId = const Value.absent(),
                Value<String> nome = const Value.absent(),
                Value<String?> documento = const Value.absent(),
                Value<String?> fotoUrl = const Value.absent(),
                Value<String> status = const Value.absent(),
                Value<int> syncStatus = const Value.absent(),
                Value<DateTime> createdAt = const Value.absent(),
                Value<DateTime> updatedAt = const Value.absent(),
                Value<DateTime?> lastSyncedAt = const Value.absent(),
                Value<int> rowid = const Value.absent(),
              }) => VisitantesCompanion(
                id: id,
                condominioId: condominioId,
                empresaId: empresaId,
                tipoVisitanteId: tipoVisitanteId,
                nome: nome,
                documento: documento,
                fotoUrl: fotoUrl,
                status: status,
                syncStatus: syncStatus,
                createdAt: createdAt,
                updatedAt: updatedAt,
                lastSyncedAt: lastSyncedAt,
                rowid: rowid,
              ),
          createCompanionCallback:
              ({
                required String id,
                required String condominioId,
                Value<String?> empresaId = const Value.absent(),
                Value<String?> tipoVisitanteId = const Value.absent(),
                required String nome,
                Value<String?> documento = const Value.absent(),
                Value<String?> fotoUrl = const Value.absent(),
                Value<String> status = const Value.absent(),
                Value<int> syncStatus = const Value.absent(),
                required DateTime createdAt,
                required DateTime updatedAt,
                Value<DateTime?> lastSyncedAt = const Value.absent(),
                Value<int> rowid = const Value.absent(),
              }) => VisitantesCompanion.insert(
                id: id,
                condominioId: condominioId,
                empresaId: empresaId,
                tipoVisitanteId: tipoVisitanteId,
                nome: nome,
                documento: documento,
                fotoUrl: fotoUrl,
                status: status,
                syncStatus: syncStatus,
                createdAt: createdAt,
                updatedAt: updatedAt,
                lastSyncedAt: lastSyncedAt,
                rowid: rowid,
              ),
          withReferenceMapper: (p0) => p0
              .map(
                (e) => (
                  e.readTable(table),
                  $$VisitantesTableReferences(db, table, e),
                ),
              )
              .toList(),
          prefetchHooksCallback:
              ({
                empresaId = false,
                tipoVisitanteId = false,
                registrosRefs = false,
              }) {
                return PrefetchHooks(
                  db: db,
                  explicitlyWatchedTables: [if (registrosRefs) db.registros],
                  addJoins:
                      <
                        T extends TableManagerState<
                          dynamic,
                          dynamic,
                          dynamic,
                          dynamic,
                          dynamic,
                          dynamic,
                          dynamic,
                          dynamic,
                          dynamic,
                          dynamic,
                          dynamic
                        >
                      >(state) {
                        if (empresaId) {
                          state =
                              state.withJoin(
                                    currentTable: table,
                                    currentColumn: table.empresaId,
                                    referencedTable: $$VisitantesTableReferences
                                        ._empresaIdTable(db),
                                    referencedColumn:
                                        $$VisitantesTableReferences
                                            ._empresaIdTable(db)
                                            .id,
                                  )
                                  as T;
                        }
                        if (tipoVisitanteId) {
                          state =
                              state.withJoin(
                                    currentTable: table,
                                    currentColumn: table.tipoVisitanteId,
                                    referencedTable: $$VisitantesTableReferences
                                        ._tipoVisitanteIdTable(db),
                                    referencedColumn:
                                        $$VisitantesTableReferences
                                            ._tipoVisitanteIdTable(db)
                                            .id,
                                  )
                                  as T;
                        }

                        return state;
                      },
                  getPrefetchedDataCallback: (items) async {
                    return [
                      if (registrosRefs)
                        await $_getPrefetchedData<
                          Visitante,
                          $VisitantesTable,
                          Registro
                        >(
                          currentTable: table,
                          referencedTable: $$VisitantesTableReferences
                              ._registrosRefsTable(db),
                          managerFromTypedResult: (p0) =>
                              $$VisitantesTableReferences(
                                db,
                                table,
                                p0,
                              ).registrosRefs,
                          referencedItemsForCurrentItem:
                              (item, referencedItems) => referencedItems.where(
                                (e) => e.visitanteId == item.id,
                              ),
                          typedResults: items,
                        ),
                    ];
                  },
                );
              },
        ),
      );
}

typedef $$VisitantesTableProcessedTableManager =
    ProcessedTableManager<
      _$AppDatabase,
      $VisitantesTable,
      Visitante,
      $$VisitantesTableFilterComposer,
      $$VisitantesTableOrderingComposer,
      $$VisitantesTableAnnotationComposer,
      $$VisitantesTableCreateCompanionBuilder,
      $$VisitantesTableUpdateCompanionBuilder,
      (Visitante, $$VisitantesTableReferences),
      Visitante,
      PrefetchHooks Function({
        bool empresaId,
        bool tipoVisitanteId,
        bool registrosRefs,
      })
    >;
typedef $$RegistrosTableCreateCompanionBuilder =
    RegistrosCompanion Function({
      required String id,
      required String condominioId,
      required String visitanteId,
      Value<String?> empresaId,
      required String tipo,
      Value<String?> placaVeiculo,
      Value<String?> fotoVeiculoUrl,
      required DateTime dataRegistro,
      required String visitanteNomeSnapshot,
      Value<String?> visitanteCpfSnapshot,
      Value<String?> visitorPhotoSnapshot,
      Value<String?> empresaNomeSnapshot,
      Value<String?> statusSnapshot,
      Value<int> syncStatus,
      required DateTime createdAt,
      Value<int> rowid,
    });
typedef $$RegistrosTableUpdateCompanionBuilder =
    RegistrosCompanion Function({
      Value<String> id,
      Value<String> condominioId,
      Value<String> visitanteId,
      Value<String?> empresaId,
      Value<String> tipo,
      Value<String?> placaVeiculo,
      Value<String?> fotoVeiculoUrl,
      Value<DateTime> dataRegistro,
      Value<String> visitanteNomeSnapshot,
      Value<String?> visitanteCpfSnapshot,
      Value<String?> visitorPhotoSnapshot,
      Value<String?> empresaNomeSnapshot,
      Value<String?> statusSnapshot,
      Value<int> syncStatus,
      Value<DateTime> createdAt,
      Value<int> rowid,
    });

final class $$RegistrosTableReferences
    extends BaseReferences<_$AppDatabase, $RegistrosTable, Registro> {
  $$RegistrosTableReferences(super.$_db, super.$_table, super.$_typedResult);

  static $VisitantesTable _visitanteIdTable(_$AppDatabase db) =>
      db.visitantes.createAlias(
        $_aliasNameGenerator(db.registros.visitanteId, db.visitantes.id),
      );

  $$VisitantesTableProcessedTableManager get visitanteId {
    final $_column = $_itemColumn<String>('visitante_id')!;

    final manager = $$VisitantesTableTableManager(
      $_db,
      $_db.visitantes,
    ).filter((f) => f.id.sqlEquals($_column));
    final item = $_typedResult.readTableOrNull(_visitanteIdTable($_db));
    if (item == null) return manager;
    return ProcessedTableManager(
      manager.$state.copyWith(prefetchedData: [item]),
    );
  }

  static $EmpresasTable _empresaIdTable(_$AppDatabase db) =>
      db.empresas.createAlias(
        $_aliasNameGenerator(db.registros.empresaId, db.empresas.id),
      );

  $$EmpresasTableProcessedTableManager? get empresaId {
    final $_column = $_itemColumn<String>('empresa_id');
    if ($_column == null) return null;
    final manager = $$EmpresasTableTableManager(
      $_db,
      $_db.empresas,
    ).filter((f) => f.id.sqlEquals($_column));
    final item = $_typedResult.readTableOrNull(_empresaIdTable($_db));
    if (item == null) return manager;
    return ProcessedTableManager(
      manager.$state.copyWith(prefetchedData: [item]),
    );
  }
}

class $$RegistrosTableFilterComposer
    extends Composer<_$AppDatabase, $RegistrosTable> {
  $$RegistrosTableFilterComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  ColumnFilters<String> get id => $composableBuilder(
    column: $table.id,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get condominioId => $composableBuilder(
    column: $table.condominioId,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get tipo => $composableBuilder(
    column: $table.tipo,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get placaVeiculo => $composableBuilder(
    column: $table.placaVeiculo,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get fotoVeiculoUrl => $composableBuilder(
    column: $table.fotoVeiculoUrl,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<DateTime> get dataRegistro => $composableBuilder(
    column: $table.dataRegistro,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get visitanteNomeSnapshot => $composableBuilder(
    column: $table.visitanteNomeSnapshot,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get visitanteCpfSnapshot => $composableBuilder(
    column: $table.visitanteCpfSnapshot,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get visitorPhotoSnapshot => $composableBuilder(
    column: $table.visitorPhotoSnapshot,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get empresaNomeSnapshot => $composableBuilder(
    column: $table.empresaNomeSnapshot,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get statusSnapshot => $composableBuilder(
    column: $table.statusSnapshot,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<int> get syncStatus => $composableBuilder(
    column: $table.syncStatus,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<DateTime> get createdAt => $composableBuilder(
    column: $table.createdAt,
    builder: (column) => ColumnFilters(column),
  );

  $$VisitantesTableFilterComposer get visitanteId {
    final $$VisitantesTableFilterComposer composer = $composerBuilder(
      composer: this,
      getCurrentColumn: (t) => t.visitanteId,
      referencedTable: $db.visitantes,
      getReferencedColumn: (t) => t.id,
      builder:
          (
            joinBuilder, {
            $addJoinBuilderToRootComposer,
            $removeJoinBuilderFromRootComposer,
          }) => $$VisitantesTableFilterComposer(
            $db: $db,
            $table: $db.visitantes,
            $addJoinBuilderToRootComposer: $addJoinBuilderToRootComposer,
            joinBuilder: joinBuilder,
            $removeJoinBuilderFromRootComposer:
                $removeJoinBuilderFromRootComposer,
          ),
    );
    return composer;
  }

  $$EmpresasTableFilterComposer get empresaId {
    final $$EmpresasTableFilterComposer composer = $composerBuilder(
      composer: this,
      getCurrentColumn: (t) => t.empresaId,
      referencedTable: $db.empresas,
      getReferencedColumn: (t) => t.id,
      builder:
          (
            joinBuilder, {
            $addJoinBuilderToRootComposer,
            $removeJoinBuilderFromRootComposer,
          }) => $$EmpresasTableFilterComposer(
            $db: $db,
            $table: $db.empresas,
            $addJoinBuilderToRootComposer: $addJoinBuilderToRootComposer,
            joinBuilder: joinBuilder,
            $removeJoinBuilderFromRootComposer:
                $removeJoinBuilderFromRootComposer,
          ),
    );
    return composer;
  }
}

class $$RegistrosTableOrderingComposer
    extends Composer<_$AppDatabase, $RegistrosTable> {
  $$RegistrosTableOrderingComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  ColumnOrderings<String> get id => $composableBuilder(
    column: $table.id,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get condominioId => $composableBuilder(
    column: $table.condominioId,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get tipo => $composableBuilder(
    column: $table.tipo,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get placaVeiculo => $composableBuilder(
    column: $table.placaVeiculo,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get fotoVeiculoUrl => $composableBuilder(
    column: $table.fotoVeiculoUrl,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<DateTime> get dataRegistro => $composableBuilder(
    column: $table.dataRegistro,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get visitanteNomeSnapshot => $composableBuilder(
    column: $table.visitanteNomeSnapshot,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get visitanteCpfSnapshot => $composableBuilder(
    column: $table.visitanteCpfSnapshot,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get visitorPhotoSnapshot => $composableBuilder(
    column: $table.visitorPhotoSnapshot,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get empresaNomeSnapshot => $composableBuilder(
    column: $table.empresaNomeSnapshot,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get statusSnapshot => $composableBuilder(
    column: $table.statusSnapshot,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<int> get syncStatus => $composableBuilder(
    column: $table.syncStatus,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<DateTime> get createdAt => $composableBuilder(
    column: $table.createdAt,
    builder: (column) => ColumnOrderings(column),
  );

  $$VisitantesTableOrderingComposer get visitanteId {
    final $$VisitantesTableOrderingComposer composer = $composerBuilder(
      composer: this,
      getCurrentColumn: (t) => t.visitanteId,
      referencedTable: $db.visitantes,
      getReferencedColumn: (t) => t.id,
      builder:
          (
            joinBuilder, {
            $addJoinBuilderToRootComposer,
            $removeJoinBuilderFromRootComposer,
          }) => $$VisitantesTableOrderingComposer(
            $db: $db,
            $table: $db.visitantes,
            $addJoinBuilderToRootComposer: $addJoinBuilderToRootComposer,
            joinBuilder: joinBuilder,
            $removeJoinBuilderFromRootComposer:
                $removeJoinBuilderFromRootComposer,
          ),
    );
    return composer;
  }

  $$EmpresasTableOrderingComposer get empresaId {
    final $$EmpresasTableOrderingComposer composer = $composerBuilder(
      composer: this,
      getCurrentColumn: (t) => t.empresaId,
      referencedTable: $db.empresas,
      getReferencedColumn: (t) => t.id,
      builder:
          (
            joinBuilder, {
            $addJoinBuilderToRootComposer,
            $removeJoinBuilderFromRootComposer,
          }) => $$EmpresasTableOrderingComposer(
            $db: $db,
            $table: $db.empresas,
            $addJoinBuilderToRootComposer: $addJoinBuilderToRootComposer,
            joinBuilder: joinBuilder,
            $removeJoinBuilderFromRootComposer:
                $removeJoinBuilderFromRootComposer,
          ),
    );
    return composer;
  }
}

class $$RegistrosTableAnnotationComposer
    extends Composer<_$AppDatabase, $RegistrosTable> {
  $$RegistrosTableAnnotationComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  GeneratedColumn<String> get id =>
      $composableBuilder(column: $table.id, builder: (column) => column);

  GeneratedColumn<String> get condominioId => $composableBuilder(
    column: $table.condominioId,
    builder: (column) => column,
  );

  GeneratedColumn<String> get tipo =>
      $composableBuilder(column: $table.tipo, builder: (column) => column);

  GeneratedColumn<String> get placaVeiculo => $composableBuilder(
    column: $table.placaVeiculo,
    builder: (column) => column,
  );

  GeneratedColumn<String> get fotoVeiculoUrl => $composableBuilder(
    column: $table.fotoVeiculoUrl,
    builder: (column) => column,
  );

  GeneratedColumn<DateTime> get dataRegistro => $composableBuilder(
    column: $table.dataRegistro,
    builder: (column) => column,
  );

  GeneratedColumn<String> get visitanteNomeSnapshot => $composableBuilder(
    column: $table.visitanteNomeSnapshot,
    builder: (column) => column,
  );

  GeneratedColumn<String> get visitanteCpfSnapshot => $composableBuilder(
    column: $table.visitanteCpfSnapshot,
    builder: (column) => column,
  );

  GeneratedColumn<String> get visitorPhotoSnapshot => $composableBuilder(
    column: $table.visitorPhotoSnapshot,
    builder: (column) => column,
  );

  GeneratedColumn<String> get empresaNomeSnapshot => $composableBuilder(
    column: $table.empresaNomeSnapshot,
    builder: (column) => column,
  );

  GeneratedColumn<String> get statusSnapshot => $composableBuilder(
    column: $table.statusSnapshot,
    builder: (column) => column,
  );

  GeneratedColumn<int> get syncStatus => $composableBuilder(
    column: $table.syncStatus,
    builder: (column) => column,
  );

  GeneratedColumn<DateTime> get createdAt =>
      $composableBuilder(column: $table.createdAt, builder: (column) => column);

  $$VisitantesTableAnnotationComposer get visitanteId {
    final $$VisitantesTableAnnotationComposer composer = $composerBuilder(
      composer: this,
      getCurrentColumn: (t) => t.visitanteId,
      referencedTable: $db.visitantes,
      getReferencedColumn: (t) => t.id,
      builder:
          (
            joinBuilder, {
            $addJoinBuilderToRootComposer,
            $removeJoinBuilderFromRootComposer,
          }) => $$VisitantesTableAnnotationComposer(
            $db: $db,
            $table: $db.visitantes,
            $addJoinBuilderToRootComposer: $addJoinBuilderToRootComposer,
            joinBuilder: joinBuilder,
            $removeJoinBuilderFromRootComposer:
                $removeJoinBuilderFromRootComposer,
          ),
    );
    return composer;
  }

  $$EmpresasTableAnnotationComposer get empresaId {
    final $$EmpresasTableAnnotationComposer composer = $composerBuilder(
      composer: this,
      getCurrentColumn: (t) => t.empresaId,
      referencedTable: $db.empresas,
      getReferencedColumn: (t) => t.id,
      builder:
          (
            joinBuilder, {
            $addJoinBuilderToRootComposer,
            $removeJoinBuilderFromRootComposer,
          }) => $$EmpresasTableAnnotationComposer(
            $db: $db,
            $table: $db.empresas,
            $addJoinBuilderToRootComposer: $addJoinBuilderToRootComposer,
            joinBuilder: joinBuilder,
            $removeJoinBuilderFromRootComposer:
                $removeJoinBuilderFromRootComposer,
          ),
    );
    return composer;
  }
}

class $$RegistrosTableTableManager
    extends
        RootTableManager<
          _$AppDatabase,
          $RegistrosTable,
          Registro,
          $$RegistrosTableFilterComposer,
          $$RegistrosTableOrderingComposer,
          $$RegistrosTableAnnotationComposer,
          $$RegistrosTableCreateCompanionBuilder,
          $$RegistrosTableUpdateCompanionBuilder,
          (Registro, $$RegistrosTableReferences),
          Registro,
          PrefetchHooks Function({bool visitanteId, bool empresaId})
        > {
  $$RegistrosTableTableManager(_$AppDatabase db, $RegistrosTable table)
    : super(
        TableManagerState(
          db: db,
          table: table,
          createFilteringComposer: () =>
              $$RegistrosTableFilterComposer($db: db, $table: table),
          createOrderingComposer: () =>
              $$RegistrosTableOrderingComposer($db: db, $table: table),
          createComputedFieldComposer: () =>
              $$RegistrosTableAnnotationComposer($db: db, $table: table),
          updateCompanionCallback:
              ({
                Value<String> id = const Value.absent(),
                Value<String> condominioId = const Value.absent(),
                Value<String> visitanteId = const Value.absent(),
                Value<String?> empresaId = const Value.absent(),
                Value<String> tipo = const Value.absent(),
                Value<String?> placaVeiculo = const Value.absent(),
                Value<String?> fotoVeiculoUrl = const Value.absent(),
                Value<DateTime> dataRegistro = const Value.absent(),
                Value<String> visitanteNomeSnapshot = const Value.absent(),
                Value<String?> visitanteCpfSnapshot = const Value.absent(),
                Value<String?> visitorPhotoSnapshot = const Value.absent(),
                Value<String?> empresaNomeSnapshot = const Value.absent(),
                Value<String?> statusSnapshot = const Value.absent(),
                Value<int> syncStatus = const Value.absent(),
                Value<DateTime> createdAt = const Value.absent(),
                Value<int> rowid = const Value.absent(),
              }) => RegistrosCompanion(
                id: id,
                condominioId: condominioId,
                visitanteId: visitanteId,
                empresaId: empresaId,
                tipo: tipo,
                placaVeiculo: placaVeiculo,
                fotoVeiculoUrl: fotoVeiculoUrl,
                dataRegistro: dataRegistro,
                visitanteNomeSnapshot: visitanteNomeSnapshot,
                visitanteCpfSnapshot: visitanteCpfSnapshot,
                visitorPhotoSnapshot: visitorPhotoSnapshot,
                empresaNomeSnapshot: empresaNomeSnapshot,
                statusSnapshot: statusSnapshot,
                syncStatus: syncStatus,
                createdAt: createdAt,
                rowid: rowid,
              ),
          createCompanionCallback:
              ({
                required String id,
                required String condominioId,
                required String visitanteId,
                Value<String?> empresaId = const Value.absent(),
                required String tipo,
                Value<String?> placaVeiculo = const Value.absent(),
                Value<String?> fotoVeiculoUrl = const Value.absent(),
                required DateTime dataRegistro,
                required String visitanteNomeSnapshot,
                Value<String?> visitanteCpfSnapshot = const Value.absent(),
                Value<String?> visitorPhotoSnapshot = const Value.absent(),
                Value<String?> empresaNomeSnapshot = const Value.absent(),
                Value<String?> statusSnapshot = const Value.absent(),
                Value<int> syncStatus = const Value.absent(),
                required DateTime createdAt,
                Value<int> rowid = const Value.absent(),
              }) => RegistrosCompanion.insert(
                id: id,
                condominioId: condominioId,
                visitanteId: visitanteId,
                empresaId: empresaId,
                tipo: tipo,
                placaVeiculo: placaVeiculo,
                fotoVeiculoUrl: fotoVeiculoUrl,
                dataRegistro: dataRegistro,
                visitanteNomeSnapshot: visitanteNomeSnapshot,
                visitanteCpfSnapshot: visitanteCpfSnapshot,
                visitorPhotoSnapshot: visitorPhotoSnapshot,
                empresaNomeSnapshot: empresaNomeSnapshot,
                statusSnapshot: statusSnapshot,
                syncStatus: syncStatus,
                createdAt: createdAt,
                rowid: rowid,
              ),
          withReferenceMapper: (p0) => p0
              .map(
                (e) => (
                  e.readTable(table),
                  $$RegistrosTableReferences(db, table, e),
                ),
              )
              .toList(),
          prefetchHooksCallback: ({visitanteId = false, empresaId = false}) {
            return PrefetchHooks(
              db: db,
              explicitlyWatchedTables: [],
              addJoins:
                  <
                    T extends TableManagerState<
                      dynamic,
                      dynamic,
                      dynamic,
                      dynamic,
                      dynamic,
                      dynamic,
                      dynamic,
                      dynamic,
                      dynamic,
                      dynamic,
                      dynamic
                    >
                  >(state) {
                    if (visitanteId) {
                      state =
                          state.withJoin(
                                currentTable: table,
                                currentColumn: table.visitanteId,
                                referencedTable: $$RegistrosTableReferences
                                    ._visitanteIdTable(db),
                                referencedColumn: $$RegistrosTableReferences
                                    ._visitanteIdTable(db)
                                    .id,
                              )
                              as T;
                    }
                    if (empresaId) {
                      state =
                          state.withJoin(
                                currentTable: table,
                                currentColumn: table.empresaId,
                                referencedTable: $$RegistrosTableReferences
                                    ._empresaIdTable(db),
                                referencedColumn: $$RegistrosTableReferences
                                    ._empresaIdTable(db)
                                    .id,
                              )
                              as T;
                    }

                    return state;
                  },
              getPrefetchedDataCallback: (items) async {
                return [];
              },
            );
          },
        ),
      );
}

typedef $$RegistrosTableProcessedTableManager =
    ProcessedTableManager<
      _$AppDatabase,
      $RegistrosTable,
      Registro,
      $$RegistrosTableFilterComposer,
      $$RegistrosTableOrderingComposer,
      $$RegistrosTableAnnotationComposer,
      $$RegistrosTableCreateCompanionBuilder,
      $$RegistrosTableUpdateCompanionBuilder,
      (Registro, $$RegistrosTableReferences),
      Registro,
      PrefetchHooks Function({bool visitanteId, bool empresaId})
    >;

class $AppDatabaseManager {
  final _$AppDatabase _db;
  $AppDatabaseManager(this._db);
  $$EmpresasTableTableManager get empresas =>
      $$EmpresasTableTableManager(_db, _db.empresas);
  $$TiposVisitantesTableTableManager get tiposVisitantes =>
      $$TiposVisitantesTableTableManager(_db, _db.tiposVisitantes);
  $$VisitantesTableTableManager get visitantes =>
      $$VisitantesTableTableManager(_db, _db.visitantes);
  $$RegistrosTableTableManager get registros =>
      $$RegistrosTableTableManager(_db, _db.registros);
}
