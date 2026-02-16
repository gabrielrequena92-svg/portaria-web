import 'package:flutter/material.dart';
import 'package:mobile_scanner/mobile_scanner.dart';
import 'package:vibration/vibration.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../controllers/home_viewmodel.dart';
import '../../../../domain/entities/visitante.dart';

class ScannerScreen extends ConsumerStatefulWidget {
  const ScannerScreen({super.key});

  @override
  ConsumerState<ScannerScreen> createState() => _ScannerScreenState();
}

class _ScannerScreenState extends ConsumerState<ScannerScreen> {
  bool _isProcessing = false;
  final MobileScannerController _controller = MobileScannerController();

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  Future<void> _handleCapture(BarcodeCapture capture) async {
    if (_isProcessing) return;

    final List<Barcode> barcodes = capture.barcodes;
    for (final barcode in barcodes) {
      final String? rawValue = barcode.rawValue;
      if (rawValue != null) {
        setState(() => _isProcessing = true);
        
        // Tactile Feedback
        if (await Vibration.hasVibrator() ?? false) {
          Vibration.vibrate(duration: 100);
        }

        final viewModel = ref.read(homeViewModelProvider.notifier);
        final visitante = await viewModel.processQrCode(rawValue);

        if (visitante != null) {
          if (mounted) {
            Navigator.pop(context, visitante);
          }
        } else {
          setState(() => _isProcessing = false);
          if (mounted) {
            ScaffoldMessenger.of(context).showSnackBar(
              const SnackBar(
                content: Text('QR Code inválido ou não reconhecido.'),
                backgroundColor: Colors.red,
              ),
            );
          }
        }
        break;
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Escanear QR Code'),
        backgroundColor: Colors.white,
        foregroundColor: const Color(0xFF022C22),
        elevation: 0,
      ),
      body: Stack(
        children: [
          MobileScanner(
            controller: _controller,
            onDetect: _handleCapture,
          ),
          
          // Overlay Scanner Frame
          Center(
            child: Container(
              width: 250,
              height: 250,
              decoration: BoxDecoration(
                border: Border.all(color: Colors.white, width: 2),
                borderRadius: BorderRadius.circular(20),
              ),
              child: Stack(
                children: [
                   // Corners (simulated)
                   Positioned(
                     top: 0, left: 0, 
                     child: Container(width: 40, height: 40, decoration: const BoxDecoration(border: Border(top: BorderSide(color: Colors.green, width: 4), left: BorderSide(color: Colors.green, width: 4)), borderRadius: BorderRadius.only(topLeft: Radius.circular(20))))),
                   Positioned(
                     top: 0, right: 0, 
                     child: Container(width: 40, height: 40, decoration: const BoxDecoration(border: Border(top: BorderSide(color: Colors.green, width: 4), right: BorderSide(color: Colors.green, width: 4)), borderRadius: BorderRadius.only(topRight: Radius.circular(20))))),
                   Positioned(
                     bottom: 0, left: 0, 
                     child: Container(width: 40, height: 40, decoration: const BoxDecoration(border: Border(bottom: BorderSide(color: Colors.green, width: 4), left: BorderSide(color: Colors.green, width: 4)), borderRadius: BorderRadius.only(bottomLeft: Radius.circular(20))))),
                   Positioned(
                     bottom: 0, right: 0, 
                     child: Container(width: 40, height: 40, decoration: const BoxDecoration(border: Border(bottom: BorderSide(color: Colors.green, width: 4), right: BorderSide(color: Colors.green, width: 4)), borderRadius: BorderRadius.only(bottomRight: Radius.circular(20))))),
                ],
              ),
            ),
          ),

          // Processing Indicator
          if (_isProcessing)
            Container(
              color: Colors.black45,
              child: const Center(
                child: CircularProgressIndicator(color: Colors.green),
              ),
            ),

          // Instructions
          Positioned(
            bottom: 80,
            left: 0,
            right: 0,
            child: Center(
              child: Container(
                padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
                decoration: BoxDecoration(
                  color: Colors.black54,
                  borderRadius: BorderRadius.circular(30),
                ),
                child: const Text(
                  'Posicione o QR Code dentro do quadro',
                  style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
