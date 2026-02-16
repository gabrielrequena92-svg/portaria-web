import '../entities/empresa.dart';

abstract class EmpresaRepository {
  Future<List<Empresa>> getEmpresas();
  Future<void> syncEmpresas(String condominioId);
}
