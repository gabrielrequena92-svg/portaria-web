class TipoVisitante {
  final String id;
  final String? condominioId;
  final String nome;
  final DateTime createdAt;

  TipoVisitante({
    required this.id,
    this.condominioId,
    required this.nome,
    required this.createdAt,
  });
}
