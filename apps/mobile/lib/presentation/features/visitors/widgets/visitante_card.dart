import 'dart:io';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:cached_network_image/cached_network_image.dart';
import '../../../../domain/entities/visitante.dart';
import '../../../../domain/entities/registro.dart';
import '../controllers/home_viewmodel.dart';
import 'vehicle_access_dialog.dart';

class VisitanteCard extends ConsumerStatefulWidget {
  final Visitante visitante;
  final String empresaNome;
  final HomeViewModel viewModel;
  final VoidCallback? onSuccess;

  const VisitanteCard({
    super.key,
    required this.visitante,
    required this.empresaNome,
    required this.viewModel,
    this.onSuccess,
  });

  @override
  ConsumerState<VisitanteCard> createState() => _VisitanteCardState();
}

class _VisitanteCardState extends ConsumerState<VisitanteCard> {
  bool _isLoadingStatus = true;
  Registro? _ultimoRegistro;
  String? _placaTemporaria;
  String? _fotoVeiculoTemporaria;

  @override
  void initState() {
    super.initState();
    _loadStatus();
  }

  @override
  void didUpdateWidget(VisitanteCard oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.visitante.id != widget.visitante.id) {
      _loadStatus();
    }
  }

  Future<void> _loadStatus() async {
    final registro = await widget.viewModel.getUltimoRegistroVisitante(widget.visitante.id);
    if (mounted) {
      setState(() {
        _ultimoRegistro = registro;
        _isLoadingStatus = false;
      });
    }
  }

  bool get _isInside {
    if (_ultimoRegistro == null) return false;
    return _ultimoRegistro!.tipo.toLowerCase() == 'entrada';
  }

  Color get _statusColor {
    if (widget.visitante.status == 'ativo') return Colors.green;
    if (widget.visitante.status == 'bloqueado') return Colors.red;
    return Colors.grey;
  }

  void _abrirDialogoVeiculo() {
    showDialog(
      context: context,
      builder: (context) => VehicleAccessDialog(
        visitante: widget.visitante,
        tipo: 'veiculo_pre_cadastro', // Just for label
        onConfirm: (placa, fotoUrl) {
          setState(() {
            _placaTemporaria = placa;
            _fotoVeiculoTemporaria = fotoUrl;
          });
          ScaffoldMessenger.of(context).showSnackBar(
             const SnackBar(content: Text('Dados do veículo salvos temporariamente for Entrada.')),
          );
        },
      ),
    );
  }

  Future<void> _registrarEntrada() async {
    try {
      await widget.viewModel.registerAccess(
        widget.visitante, 
        'entrada',
        placaVeiculo: _placaTemporaria,
        fotoVeiculoUrl: _fotoVeiculoTemporaria,
      );
      
      // Clear temp data
      setState(() {
        _placaTemporaria = null;
        _fotoVeiculoTemporaria = null;
      });

      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Entrada de ${widget.visitante.nome} registrada!'),
            backgroundColor: Colors.green[700],
          ),
        );
        // Reload status to update buttons logic
        _loadStatus();
        widget.onSuccess?.call(); 
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Erro: $e'), backgroundColor: Colors.red),
        );
      }
    }
  }

  Future<void> _iniciarSaida() async {
    // 1. Check if entered with vehicle
    if (_ultimoRegistro?.placaVeiculo != null || _ultimoRegistro?.fotoVeiculoUrl != null) {
      // Show confirmation dialog: Same vehicle?
      showDialog(
        context: context,
        builder: (ctx) => AlertDialog(
          title: const Text('Saída com Veículo'),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text('O visitante entrou com o veículo:'),
              const SizedBox(height: 8),
              if (_ultimoRegistro?.placaVeiculo != null)
                Text('Placa: ${_ultimoRegistro!.placaVeiculo}', style: const TextStyle(fontWeight: FontWeight.bold)),
              const SizedBox(height: 16),
              const Text('Está saindo com o mesmo veículo?'),
            ],
          ),
          actions: [
            TextButton(
              onPressed: () {
                Navigator.pop(ctx);
                _abrirDialogoSaidaNovoVeiculo(); // User said NO, open new vehicle dialog
              },
              child: const Text('NÃO'),
            ),
            ElevatedButton(
              onPressed: () {
                Navigator.pop(ctx);
                _registrarSaida(
                  placa: _ultimoRegistro!.placaVeiculo,
                  fotoUrl: _ultimoRegistro!.fotoVeiculoUrl,
                );
              },
              child: const Text('SIM'),
            ),
          ],
        ),
      );
    } else {
      // No vehicle on entry, or unknown. Ask for vehicle details directly?
      // Requirement: "abre a janela para que ele insira a placa e foto do veiculo que ele saiu"
      // Assuming we always ask if no previous vehicle found, or we could just register.
      // Let's ask via the standard dialog (optional fields)
      _abrirDialogoSaidaNovoVeiculo();
    }
  }

  void _abrirDialogoSaidaNovoVeiculo() {
      showDialog(
        context: context,
        builder: (context) => VehicleAccessDialog(
          visitante: widget.visitante,
          tipo: 'saida',
          onConfirm: (placa, fotoUrl) {
             _registrarSaida(placa: placa, fotoUrl: fotoUrl);
          },
        ),
      );
  }

  Future<void> _registrarSaida({String? placa, String? fotoUrl}) async {
    try {
      await widget.viewModel.registerAccess(
        widget.visitante, 
        'saida',
        placaVeiculo: placa,
        fotoVeiculoUrl: fotoUrl,
      );
      
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Saída de ${widget.visitante.nome} registrada!'),
            backgroundColor: Colors.red[700],
          ),
        );
        // Reload status to update buttons logic
        _loadStatus();
        widget.onSuccess?.call(); 
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Erro: $e'), backgroundColor: Colors.red),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.05),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      padding: const EdgeInsets.all(24),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.center,
        mainAxisSize: MainAxisSize.min,
        children: [
          // 1. Photo
          Container(
            width: 150, // Slightly smaller than before to fit content
            height: 150,
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              color: Colors.grey[200],
              border: Border.all(color: _isInside ? Colors.green : Colors.grey[300]!, width: 4),
            ),
            child: ClipOval(
              child: widget.visitante.fotoUrl != null && widget.visitante.fotoUrl!.isNotEmpty
                  ? CachedNetworkImage(
                      imageUrl: widget.visitante.fotoUrl!,
                      fit: BoxFit.cover,
                      placeholder: (context, url) => Icon(Icons.person, size: 80, color: Colors.grey[400]),
                      errorWidget: (context, url, error) => Icon(Icons.person, size: 80, color: Colors.grey[400]),
                    )
                  : Icon(Icons.person, size: 80, color: Colors.grey[400]),
            ),
          ),
          const SizedBox(height: 12),

          // 2. Name & Info
          Text(
            widget.visitante.nome,
            style: const TextStyle(fontSize: 22, fontWeight: FontWeight.bold),
            textAlign: TextAlign.center,
          ),
          Text(
            'CPF: ${widget.visitante.documento ?? "N/A"}',
            style: TextStyle(fontSize: 16, color: Colors.grey[600]),
          ),
          const SizedBox(height: 8),

           Wrap(
            spacing: 8,
            runSpacing: 8,
            alignment: WrapAlignment.center,
            children: [
              Chip(
                label: Text(widget.empresaNome),
                backgroundColor: Colors.grey[100],
              ),
              // Status Cadastral (Ativo/Bloqueado)
              Chip(
                avatar: Icon(
                  widget.visitante.status == 'bloqueado' ? Icons.block : Icons.check_circle,
                  size: 16,
                  color: Colors.white,
                ),
                label: Text(
                  widget.visitante.status.toUpperCase(),
                  style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
                ),
                backgroundColor: _statusColor,
              ),
              // Status de Presença (No Local)
              if (_isInside)
                Chip(
                   avatar: const Icon(Icons.location_on, size: 16, color: Colors.white),
                   label: const Text('NO LOCAL', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
                   backgroundColor: Colors.blue[700],
                ),
            ],
          ),

          const SizedBox(height: 20),

          // 3. Vehicle Button
          if (!_isInside && !_isLoadingStatus) ...[
             OutlinedButton.icon(
              onPressed: _abrirDialogoVeiculo,
              icon: Icon(
                _placaTemporaria != null ? Icons.check_circle : Icons.directions_car,
                color: _placaTemporaria != null ? Colors.green : Colors.blue,
              ),
              label: Text(
                _placaTemporaria != null 
                  ? 'Veículo: $_placaTemporaria' 
                  : 'Adicionar Veículo (Entrada)',
                style: TextStyle(
                   color: _placaTemporaria != null ? Colors.green : Colors.blue,
                ),
              ),
              style: OutlinedButton.styleFrom(
                minimumSize: const Size(double.infinity, 48),
                side: BorderSide(color: _placaTemporaria != null ? Colors.green : Colors.blue),
              ),
            ),
            const SizedBox(height: 12),
          ],

          // 4. Action Buttons
          if (_isLoadingStatus)
             const CircularProgressIndicator()
          else
            Row(
              children: [
                // ENTRADA
                Expanded(
                  child: Opacity(
                    opacity: _isInside ? 0.5 : 1.0,
                    child: ElevatedButton.icon(
                      // Block if Inside
                      onPressed: _isInside ? null : _registrarEntrada,
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.green[700],
                        foregroundColor: Colors.white,
                        padding: const EdgeInsets.symmetric(vertical: 16),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                      ),
                      icon: const Icon(Icons.login),
                      label: const Text('ENTRADA', style: TextStyle(fontWeight: FontWeight.bold)),
                    ),
                  ),
                ),
                const SizedBox(width: 16),
                
                // SAIDA
                Expanded(
                   child: Opacity(
                    opacity: !_isInside ? 0.5 : 1.0,
                    child: ElevatedButton.icon(
                      // Block if Outside (NOT Inside)
                      onPressed: !_isInside ? null : _iniciarSaida,
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.red[700],
                        foregroundColor: Colors.white,
                        padding: const EdgeInsets.symmetric(vertical: 16),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                      ),
                      icon: const Icon(Icons.logout),
                      label: const Text('SAÍDA', style: TextStyle(fontWeight: FontWeight.bold)),
                    ),
                  ),
                ),
              ],
            ),
        ],
      ),
    );
  }
}
