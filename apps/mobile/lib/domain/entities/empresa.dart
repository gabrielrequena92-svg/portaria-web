class Empresa {
  final String id;
  final String condominioId;
  final String nome;
  final String? cnpj;
  final String status;
  final int syncStatus;

  Empresa({
    required this.id,
    required this.condominioId,
    required this.nome,
    this.cnpj,
    required this.status,
    required this.syncStatus,
  });
}
