import '../repositories/empresa_repository.dart';
import '../repositories/visitante_repository.dart';
import '../repositories/registro_repository.dart';
import '../repositories/tipo_visitante_repository.dart';

class SyncService {
  final EmpresaRepository _empresaRepository;
  final VisitanteRepository _visitanteRepository;
  final RegistroRepository _registroRepository;
  final TipoVisitanteRepository _tipoVisitanteRepository;

  SyncService(
    this._empresaRepository, 
    this._visitanteRepository,
    this._registroRepository,
    this._tipoVisitanteRepository,
  );

  Future<void> syncAll(String condominioId) async {
    try {
      // 1. Upload Logs (Priority: ensure cloud has latest movements)
      await _registroRepository.syncRegistros();
      
      // 2. Upload New Visitors (if any)
      await _visitanteRepository.syncVisitantes(condominioId);
  
      // 3. Download Updates (Empresas/Visitantes/Tipos)
      await _empresaRepository.syncEmpresas(condominioId);
      await _tipoVisitanteRepository.syncTiposVisitantes(condominioId);
      // Note: syncVisitantes already pulls updates after push
    } catch (e) {
      // 4. Handle Offline Mode Gracefully
      final errorStr = e.toString().toLowerCase();
      if (errorStr.contains('socketexception') || 
          errorStr.contains('network') || 
          errorStr.contains('clientexception')) {
        // Log locally but don't crash UI
        print('Offline mode: Sync deferred. Data queued locally.');
        return; 
      }
      // Rethrow other unexpected errors so UI can show them if critical
      rethrow;
    }
  }
}
