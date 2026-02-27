import '../entities/visitante.dart';

abstract class VisitanteRepository {
  Future<List<Visitante>> getVisitantes();
  Future<Visitante?> getVisitanteById(String id);
  Future<void> saveVisitante(Visitante visitante);
  Future<void> syncVisitantes(String condominioId);
  Future<int> getPendingSyncCount();
}
