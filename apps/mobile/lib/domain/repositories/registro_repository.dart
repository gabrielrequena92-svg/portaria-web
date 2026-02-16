import '../entities/registro.dart';

abstract class RegistroRepository {
  Future<void> saveRegistro(Registro registro);
  Future<void> syncRegistros();
}
