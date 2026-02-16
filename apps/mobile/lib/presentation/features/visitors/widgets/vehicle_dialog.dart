import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import 'dart:io';

class VehicleDialog extends StatefulWidget {
  final String? initialPlaca;
  final String? initialFotoPath;
  final Function(String placa, String? fotoPath) onSave;

  const VehicleDialog({
    super.key,
    this.initialPlaca,
    this.initialFotoPath,
    required this.onSave,
  });

  @override
  State<VehicleDialog> createState() => _VehicleDialogState();
}

class _VehicleDialogState extends State<VehicleDialog> {
  late TextEditingController _placaController;
  String? _fotoPath;
  final ImagePicker _picker = ImagePicker();

  @override
  void initState() {
    super.initState();
    _placaController = TextEditingController(text: widget.initialPlaca);
    _fotoPath = widget.initialFotoPath;
  }

  @override
  void dispose() {
    _placaController.dispose();
    super.dispose();
  }

  Future<void> _tirarFoto() async {
    try {
      final XFile? photo = await _picker.pickImage(
        source: ImageSource.camera,
        maxWidth: 1920,
        maxHeight: 1080,
        imageQuality: 85,
      );

      if (photo != null) {
        setState(() {
          _fotoPath = photo.path;
        });
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Erro ao capturar foto: $e')),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      title: const Row(
        children: [
          Icon(Icons.directions_car, color: Color(0xFF022C22)),
          SizedBox(width: 8),
          Text('Dados do Veículo'),
        ],
      ),
      content: SingleChildScrollView(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // Placa Input
            TextField(
              controller: _placaController,
              decoration: const InputDecoration(
                labelText: 'Placa do Veículo',
                hintText: 'ABC-1234',
                prefixIcon: Icon(Icons.pin),
                border: OutlineInputBorder(),
              ),
              textCapitalization: TextCapitalization.characters,
              maxLength: 8,
            ),
            const SizedBox(height: 16),

            // Foto Preview
            if (_fotoPath != null)
              Container(
                height: 200,
                decoration: BoxDecoration(
                  border: Border.all(color: Colors.grey[300]!),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: ClipRRect(
                  borderRadius: BorderRadius.circular(8),
                  child: Image.file(
                    File(_fotoPath!),
                    fit: BoxFit.cover,
                  ),
                ),
              ),

            const SizedBox(height: 12),

            // Camera Button
            OutlinedButton.icon(
              onPressed: _tirarFoto,
              icon: const Icon(Icons.camera_alt),
              label: Text(_fotoPath == null ? 'Tirar Foto do Veículo' : 'Tirar Nova Foto'),
              style: OutlinedButton.styleFrom(
                padding: const EdgeInsets.symmetric(vertical: 12),
              ),
            ),
          ],
        ),
      ),
      actions: [
        TextButton(
          onPressed: () => Navigator.pop(context),
          child: const Text('Cancelar'),
        ),
        ElevatedButton(
          onPressed: () {
            final placa = _placaController.text.trim();
            if (placa.isEmpty) {
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('Por favor, insira a placa do veículo')),
              );
              return;
            }
            widget.onSave(placa, _fotoPath);
            Navigator.pop(context);
          },
          style: ElevatedButton.styleFrom(
            backgroundColor: const Color(0xFF022C22),
            foregroundColor: Colors.white,
          ),
          child: const Text('Salvar'),
        ),
      ],
    );
  }
}
