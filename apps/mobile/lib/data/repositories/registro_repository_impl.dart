import 'package:uuid/uuid.dart';
import '../../../domain/entities/registro.dart';
import '../../../domain/repositories/registro_repository.dart';
import '../datasources/local/local_datasource.dart';
import '../datasources/remote/supabase_datasource.dart';
import '../models/registro_model.dart';

class RegistroRepositoryImpl implements RegistroRepository {
  final LocalDatasource _local;
  final SupabaseDatasource _remote;

  RegistroRepositoryImpl(this._local, this._remote);

  @override
  Future<void> saveRegistro(Registro registro) async {
    final id = registro.id.isEmpty ? const Uuid().v4() : registro.id;
    
    final model = RegistroModel(
      id: id,
      condominioId: registro.condominioId,
      visitanteId: registro.visitanteId,
      empresaId: registro.empresaId,
      tipo: registro.tipo,
      dataRegistro: registro.dataRegistro,
      placaVeiculo: registro.placaVeiculo,
      fotoVeiculoUrl: registro.fotoVeiculoUrl,
      visitanteNomeSnapshot: registro.visitanteNomeSnapshot,
      visitanteCpfSnapshot: registro.visitanteCpfSnapshot,
      visitorPhotoSnapshot: registro.visitorPhotoSnapshot,
      empresaNomeSnapshot: registro.empresaNomeSnapshot,
      syncStatus: 1, // Pending Upload
    );
    
    // Validação de Ciclo (No Local)
    final ultimo = await _local.getUltimoRegistroVisitante(registro.visitanteId);
    if (ultimo != null && ultimo.tipo == registro.tipo) {
      throw Exception('Não é possível registrar duas ${registro.tipo}s seguidas para o mesmo visitante.');
    }
    
    await _local.saveRegistro(model);
  }

  @override
  Future<void> syncRegistros() async {
    final unsynced = await _local.getUnsyncedRegistros();
    for (var r in unsynced) {
      try {
        var updatedRecord = r;
        
        // Se houver foto local (caminho de arquivo), faz o upload
        if (r.fotoVeiculoUrl != null && !r.fotoVeiculoUrl!.startsWith('http')) {
          final fileName = 'veiculo_${r.id}_${DateTime.now().millisecondsSinceEpoch}.jpg';
          final publicUrl = await _remote.uploadFoto(r.fotoVeiculoUrl!, fileName);
          if (publicUrl != null) {
            updatedRecord = r.copyWith(fotoVeiculoUrl: publicUrl);
          }
        }

        await _remote.uploadRegistro(updatedRecord);
        await _local.markRegistroAsSynced(r.id);
      } catch (e) {
        print('Error syncing registro ${r.id}: $e');
      }
    }
  }
}
