class Registro {
  final String id;
  final String condominioId;
  final String visitanteId;
  final String? empresaId;
  final String tipo; // 'entrada', 'saida'
  final DateTime dataRegistro;
  final String? placaVeiculo;
  final String? fotoVeiculoUrl;
  
  // Snapshots
  final String visitanteNomeSnapshot;
  final String? visitanteCpfSnapshot;
  final String? visitorPhotoSnapshot;
  final String? empresaNomeSnapshot;
  final String? statusSnapshot;

  final int syncStatus;

  Registro({
    required this.id,
    required this.condominioId,
    required this.visitanteId,
    this.empresaId,
    required this.tipo,
    required this.dataRegistro,
    this.placaVeiculo,
    this.fotoVeiculoUrl,
    required this.visitanteNomeSnapshot,
    this.visitanteCpfSnapshot,
    this.visitorPhotoSnapshot,
    this.empresaNomeSnapshot,
    this.statusSnapshot,
    required this.syncStatus,
  });
}
