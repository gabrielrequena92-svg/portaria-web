class Visitante {
  final String id;
  final String condominioId;
  final String? empresaId;
  final String? tipoVisitanteId;
  final String nome;
  final String? documento;
  final String? fotoUrl;
  final String status;
  final int syncStatus;

  Visitante({
    required this.id,
    required this.condominioId,
    this.empresaId,
    this.tipoVisitanteId,
    required this.nome,
    this.documento,
    this.fotoUrl,
    required this.status,
    required this.syncStatus,
  });
}
