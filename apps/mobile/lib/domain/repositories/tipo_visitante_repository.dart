import '../entities/tipo_visitante.dart';

abstract class TipoVisitanteRepository {
  Future<List<TipoVisitante>> getTiposVisitantes();
  Future<void> syncTiposVisitantes(String condominioId);
}
