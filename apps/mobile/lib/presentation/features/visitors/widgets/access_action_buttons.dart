import 'package:flutter/material.dart';
import '../../../../domain/entities/visitante.dart';
import '../../../../domain/entities/registro.dart';
import 'vehicle_dialog.dart';

class AccessActionButtons extends StatefulWidget {
  final Visitante visitante;
  final Registro? ultimoRegistroHoje;
  final Function(String tipo, String? placa, String? fotoPath) onRegisterAccess;

  const AccessActionButtons({
    super.key,
    required this.visitante,
    required this.ultimoRegistroHoje,
    required this.onRegisterAccess,
  });

  @override
  State<AccessActionButtons> createState() => _AccessActionButtonsState();
}

class _AccessActionButtonsState extends State<AccessActionButtons> {
  String? _placaVeiculo;
  String? _fotoVeiculoPath;

  bool get _podeEntrar => widget.ultimoRegistroHoje == null || widget.ultimoRegistroHoje!.tipo == 'saida';
  bool get _podeSair => widget.ultimoRegistroHoje != null && widget.ultimoRegistroHoje!.tipo == 'entrada';

  void _abrirDialogVeiculo() {
    showDialog(
      context: context,
      builder: (context) => VehicleDialog(
        initialPlaca: _placaVeiculo,
        initialFotoPath: _fotoVeiculoPath,
        onSave: (placa, fotoPath) {
          setState(() {
            _placaVeiculo = placa;
            _fotoVeiculoPath = fotoPath;
          });
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content: Text('Dados do veículo salvos!'),
              backgroundColor: Colors.green,
              duration: Duration(seconds: 2),
            ),
          );
        },
      ),
    );
  }

  Future<void> _registrarEntrada() async {
    widget.onRegisterAccess('entrada', _placaVeiculo, _fotoVeiculoPath);
    // Clear vehicle data after entry
    setState(() {
      _placaVeiculo = null;
      _fotoVeiculoPath = null;
    });
  }

  Future<void> _registrarSaida() async {
    // Check if entry had vehicle
    final entradaComVeiculo = widget.ultimoRegistroHoje?.placaVeiculo != null;

    if (entradaComVeiculo) {
      // Ask if leaving with same vehicle
      final mesmoVeiculo = await showDialog<bool>(
        context: context,
        builder: (context) => AlertDialog(
          title: const Text('Veículo na Saída'),
          content: Text(
            'Visitante entrou com o veículo:\n\nPlaca: ${widget.ultimoRegistroHoje!.placaVeiculo}\n\nSaindo com o mesmo veículo?',
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(context, false),
              child: const Text('NÃO'),
            ),
            ElevatedButton(
              onPressed: () => Navigator.pop(context, true),
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFF022C22),
                foregroundColor: Colors.white,
              ),
              child: const Text('SIM'),
            ),
          ],
        ),
      );

      if (mesmoVeiculo == null) return; // User cancelled

      if (mesmoVeiculo) {
        // Same vehicle - use entry data
        widget.onRegisterAccess(
          'saida',
          widget.ultimoRegistroHoje!.placaVeiculo,
          widget.ultimoRegistroHoje!.fotoVeiculoUrl,
        );
      } else {
        // Different vehicle - ask for new plate
        if (mounted) {
          showDialog(
            context: context,
            builder: (context) => VehicleDialog(
              onSave: (placa, fotoPath) {
                widget.onRegisterAccess('saida', placa, fotoPath);
              },
            ),
          );
        }
      }
    } else {
      // No vehicle on entry - normal exit
      widget.onRegisterAccess('saida', null, null);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      mainAxisSize: MainAxisSize.min,
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        // Vehicle Button (always visible)
        OutlinedButton.icon(
          onPressed: _abrirDialogVeiculo,
          icon: const Icon(Icons.directions_car),
          label: Text(
            _placaVeiculo != null ? 'VEÍCULO: $_placaVeiculo' : 'VEÍCULO',
            style: const TextStyle(fontWeight: FontWeight.bold),
          ),
          style: OutlinedButton.styleFrom(
            padding: const EdgeInsets.symmetric(vertical: 16),
            side: BorderSide(
              color: _placaVeiculo != null ? Colors.green : Colors.grey,
              width: 2,
            ),
            foregroundColor: _placaVeiculo != null ? Colors.green : Colors.grey[700],
          ),
        ),

        const SizedBox(height: 12),

        // Entry and Exit Buttons
        Row(
          children: [
            // Entry Button
            Expanded(
              child: ElevatedButton.icon(
                onPressed: _podeEntrar ? _registrarEntrada : null,
                icon: const Icon(Icons.login),
                label: const Text('ENTRADA'),
                style: ElevatedButton.styleFrom(
                  backgroundColor: _podeEntrar ? Colors.green[700] : Colors.grey[300],
                  foregroundColor: _podeEntrar ? Colors.white : Colors.grey[600],
                  padding: const EdgeInsets.symmetric(vertical: 16),
                  disabledBackgroundColor: Colors.grey[300],
                  disabledForegroundColor: Colors.grey[600],
                ),
              ),
            ),

            const SizedBox(width: 12),

            // Exit Button
            Expanded(
              child: ElevatedButton.icon(
                onPressed: _podeSair ? _registrarSaida : null,
                icon: const Icon(Icons.logout),
                label: const Text('SAÍDA'),
                style: ElevatedButton.styleFrom(
                  backgroundColor: _podeSair ? Colors.red[700] : Colors.grey[300],
                  foregroundColor: _podeSair ? Colors.white : Colors.grey[600],
                  padding: const EdgeInsets.symmetric(vertical: 16),
                  disabledBackgroundColor: Colors.grey[300],
                  disabledForegroundColor: Colors.grey[600],
                ),
              ),
            ),
          ],
        ),
      ],
    );
  }
}
