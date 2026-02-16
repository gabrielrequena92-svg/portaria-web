import 'dart:io';
import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import '../../../../domain/entities/visitante.dart';

class VehicleAccessDialog extends StatefulWidget {
  final Visitante visitante;
  final String tipo; // 'entrada', 'saida', 'veiculo_pre_cadastro'
  final String? empresaNome;
  final Function(String? placa, String? fotoUrl) onConfirm;

  const VehicleAccessDialog({
    super.key,
    required this.visitante,
    required this.tipo,
    this.empresaNome,
    required this.onConfirm,
  });

  @override
  State<VehicleAccessDialog> createState() => _VehicleAccessDialogState();
}

class _VehicleAccessDialogState extends State<VehicleAccessDialog> {
  final TextEditingController _placaController = TextEditingController();
  XFile? _veiculoImagem;
  final ImagePicker _picker = ImagePicker();
  bool _isLoading = false;

  Future<void> _tirarFoto() async {
    try {
      final XFile? photo = await _picker.pickImage(
        source: ImageSource.camera,
        maxWidth: 1024,
        maxHeight: 1024,
        imageQuality: 80,
      );
      if (photo != null) {
        setState(() => _veiculoImagem = photo);
      }
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Erro ao abrir câmera: $e')),
      );
    }
  }

  void _onConfirmPressed() async {
    setState(() => _isLoading = true);
    try {
      await widget.onConfirm(
        _placaController.text.isNotEmpty ? _placaController.text : null,
        _veiculoImagem?.path,
      );
      // Dialog will be closed by the parent or we can close it here if onConfirm returns Future
      if (mounted) Navigator.of(context).pop(); 
    } catch (e) {
      // Error handling should be done by parent or here?
      // For now, parent handles the logic, but we handle the UI state.
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final isEntrada = widget.tipo == 'entrada';
    final isPreCadastro = widget.tipo == 'veiculo_pre_cadastro';
    
    final Color actionColor;
    final String actionLabel;
    final IconData icon;

    if (isPreCadastro) {
      actionColor = Colors.blue[700]!;
      actionLabel = 'REGISTRAR VEÍCULO';
      icon = Icons.save;
    } else if (isEntrada) {
      actionColor = Colors.green[700]!;
      actionLabel = 'REGISTRAR ENTRADA';
      icon = Icons.login;
    } else {
      actionColor = Colors.red[700]!;
      actionLabel = 'REGISTRAR SAÍDA';
      icon = Icons.logout;
    }

    return AlertDialog(
      title: Row(
        children: [
          Icon(Icons.directions_car, color: actionColor),
          const SizedBox(width: 8),
          const Text('Registro de Veículo'),
        ],
      ),
      content: SingleChildScrollView(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Visitante: ${widget.visitante.nome}',
              style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
            ),
            if (widget.visitante.documento != null)
              Text('CPF: ${widget.visitante.documento}', style: TextStyle(color: Colors.grey[600])),
            if (widget.empresaNome != null)
              Text('Empresa: ${widget.empresaNome}', style: TextStyle(color: Colors.grey[600])),
             
            const SizedBox(height: 16),
            
            // Placa
            TextField(
              controller: _placaController,
              decoration: InputDecoration(
                labelText: 'Placa do Veículo (Opcional)',
                hintText: 'ABC-1234',
                border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                prefixIcon: const Icon(Icons.abc),
              ),
              textCapitalization: TextCapitalization.characters,
            ),
            const SizedBox(height: 16),

            // Foto
            Row(
              children: [
                Expanded(
                  child: OutlinedButton.icon(
                    onPressed: _tirarFoto,
                    icon: Icon(_veiculoImagem == null ? Icons.camera_alt : Icons.check_circle, 
                        color: _veiculoImagem == null ? Colors.grey[700] : Colors.green),
                    label: Text(_veiculoImagem == null ? 'Foto do Veículo' : 'Foto Capturada'),
                    style: OutlinedButton.styleFrom(
                      padding: const EdgeInsets.symmetric(vertical: 12),
                    ),
                  ),
                ),
              ],
            ),
            if (_veiculoImagem != null)
              Padding(
                padding: const EdgeInsets.only(top: 8),
                child: Center(
                  child: Container(
                    height: 100,
                    decoration: BoxDecoration(
                      border: Border.all(color: Colors.grey[300]!),
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: Image.file(
                      File(_veiculoImagem!.path),
                      fit: BoxFit.cover,
                    ),
                  ),
                ),
              ),
          ],
        ),
      ),
      actions: [
        TextButton(
          onPressed: () => Navigator.of(context).pop(),
          child: const Text('CANCELAR', style: TextStyle(color: Colors.grey)),
        ),
        ElevatedButton.icon(
          onPressed: _isLoading ? null : _onConfirmPressed,
          style: ElevatedButton.styleFrom(
            backgroundColor: actionColor,
            foregroundColor: Colors.white,
          ),
          icon: _isLoading 
              ? const SizedBox(width: 16, height: 16, child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2)) 
              : Icon(icon, size: 18),
          label: Text(actionLabel),
        ),
      ],
    );
  }
}
