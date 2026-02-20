import 'dart:io';

import 'package:drift/drift.dart';
import 'package:drift/native.dart';
import 'package:path_provider/path_provider.dart';
import 'package:path/path.dart' as p;
import 'package:sqlite3/sqlite3.dart';
import 'package:sqlite3_flutter_libs/sqlite3_flutter_libs.dart';

import 'tables/tables.dart';

part 'app_database.g.dart';

@DriftDatabase(tables: [Empresas, Visitantes, Registros, TiposVisitantes])
class AppDatabase extends _$AppDatabase {
  AppDatabase() : super(_openConnection());

  @override
  int get schemaVersion => 5; // Added situacao to Visitantes
  
  @override
  MigrationStrategy get migration {
    return MigrationStrategy(
      onCreate: (Migrator m) async {
        await m.createAll();
      },
      onUpgrade: (Migrator m, int from, int to) async {
        if (from < 2) {
          await m.createTable(registros);
        } else if (from < 3) {
          // Manually add missing columns if build_runner failed to update schema
          // Use try-catch for each to handle cases where some columns might already exist
          Future<void> addSafely(GeneratedColumn col) async {
            try {
              await m.addColumn(registros, col);
            } catch (e) {
              // Ignore duplicate column errors
              if (e.toString().contains('duplicate column name')) {
                return;
              }
              rethrow;
            }
          }

          await addSafely(registros.empresaId);
          await addSafely(registros.visitanteCpfSnapshot);
          await addSafely(registros.visitorPhotoSnapshot);
          await addSafely(registros.empresaNomeSnapshot);
        } else if (from < 4) {
             Future<void> addSafely(GeneratedColumn col) async {
            try {
              await m.addColumn(registros, col);
            } catch (e) {
              if (e.toString().contains('duplicate column name')) return;
              rethrow;
            }
          }
          await addSafely(registros.statusSnapshot);
        } else if (from < 5) {
           Future<void> addVisitanteSafely(GeneratedColumn col) async {
            try {
              await m.addColumn(visitantes, col);
            } catch (e) {
              if (e.toString().contains('duplicate column name')) return;
              rethrow;
            }
          }
          await addVisitanteSafely(visitantes.situacao);
        }
      },
    );
  }
}

LazyDatabase _openConnection() {
  return LazyDatabase(() async {
    final dbFolder = await getApplicationDocumentsDirectory();
    final file = File(p.join(dbFolder.path, 'db.sqlite'));

    if (Platform.isAndroid) {
      await applyWorkaroundToOpenSqlite3OnOldAndroidVersions();
    }

    final cachebase = (await getTemporaryDirectory()).path;
    sqlite3.tempDirectory = cachebase;

    return NativeDatabase.createInBackground(file);
  });
}
