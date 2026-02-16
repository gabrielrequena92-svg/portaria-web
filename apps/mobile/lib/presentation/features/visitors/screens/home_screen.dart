import 'dart:io';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../controllers/home_viewmodel.dart';
import '../screens/scanner_screen.dart';
import '../widgets/visitante_card.dart';
import '../../../../domain/entities/visitante.dart';

class HomeScreen extends ConsumerStatefulWidget {
  const HomeScreen({super.key});

  @override
  ConsumerState<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends ConsumerState<HomeScreen> {
  final TextEditingController _searchController = TextEditingController();

  @override
  Widget build(BuildContext context) {
    final state = ref.watch(homeViewModelProvider);
    final viewModel = ref.read(homeViewModelProvider.notifier);

    return Scaffold(
      backgroundColor: Colors.grey[50],
      appBar: AppBar(
        title: const Text(
          'Controle de Acesso',
          style: TextStyle(fontWeight: FontWeight.bold),
        ),
        backgroundColor: Colors.white,
        foregroundColor: const Color(0xFF022C22),
        actions: [
          IconButton(
            onPressed: state.isSyncing 
                ? null 
                : () async {
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(content: Text('Sincronizando...')),
                    );
                    await viewModel.syncData();
                  },
            icon: state.isSyncing
                ? const SizedBox(
                    width: 20, 
                    height: 20, 
                    child: CircularProgressIndicator(strokeWidth: 2),
                  )
                : const Icon(Icons.sync),
            tooltip: 'Sincronizar',
          ),
          const SizedBox(width: 8),
        ],
      ),
      body: Column(
        children: [
          // Search Bar
          Padding(
            padding: const EdgeInsets.all(16),
            child: TextField(
              controller: _searchController,
              onChanged: (value) => viewModel.loadVisitantes(value),
              keyboardType: TextInputType.number,
              inputFormatters: [
                FilteringTextInputFormatter.digitsOnly,
              ],
              decoration: InputDecoration(
                hintText: 'Buscar por Nome ou CPF',
                prefixIcon: const Icon(Icons.search),
                suffixIcon: _searchController.text.isNotEmpty 
                  ? IconButton(
                      icon: const Icon(Icons.clear), 
                      onPressed: () {
                        _searchController.clear();
                        viewModel.loadVisitantes('');
                      },
                    ) 
                  : null,
                filled: true,
                fillColor: Colors.white,
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                  borderSide: BorderSide.none,
                ),
                enabledBorder: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                  borderSide: BorderSide(color: Colors.grey[200]!),
                ),
              ),
            ),
          ),

          // Error Message
          if (state.errorMessage != null)
            Container(
              padding: const EdgeInsets.all(8),
              color: Colors.red[50],
              width: double.infinity,
              child: Text(
                state.errorMessage!,
                style: TextStyle(color: Colors.red[800]),
                textAlign: TextAlign.center,
              ),
            ),

          // Content Area
          Expanded(
            child: state.isLoading
                ? const Center(child: CircularProgressIndicator())
                : !state.hasSearched
                    ? _buildEmptyState()
                    : state.visitantes.isEmpty
                        ? _buildNotFoundState()
                        : ListView.separated(
                            padding: const EdgeInsets.all(16),
                            itemCount: state.visitantes.length,
                            separatorBuilder: (_, __) => const SizedBox(height: 16),
                            itemBuilder: (context, index) {
                              final visitante = state.visitantes[index];
                              final empresaNome = state.empresas[visitante.empresaId]?.nome ?? '-';
                              return VisitanteCard(
                                visitante: visitante,
                                empresaNome: empresaNome,
                                viewModel: viewModel,
                              );
                            },
                          ),
          ),
        ],
      ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () async {
          final Visitante? scannedVisitante = await Navigator.push(
            context,
            MaterialPageRoute(builder: (context) => const ScannerScreen()),
          );

          if (scannedVisitante != null && mounted) {
            final viewModel = ref.read(homeViewModelProvider.notifier);
            _showQuickAccessDialog(context, scannedVisitante, viewModel);
          }
        },
        backgroundColor: const Color(0xFF022C22),
        foregroundColor: Colors.white,
        icon: const Icon(Icons.qr_code_scanner),
        label: const Text('ESCANEAR QR', style: TextStyle(fontWeight: FontWeight.bold)),
      ),
    );
  }

  Widget _buildEmptyState() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(Icons.search, size: 80, color: Colors.grey[300]),
          const SizedBox(height: 16),
          Text(
            'Digite o CPF ou Nome para buscar',
            style: TextStyle(fontSize: 18, color: Colors.grey[500]),
          ),
        ],
      ),
    );
  }

  Widget _buildNotFoundState() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(Icons.person_off, size: 80, color: Colors.grey[300]),
          const SizedBox(height: 16),
          Text(
            'Nenhum visitante encontrado',
            style: TextStyle(fontSize: 18, color: Colors.grey[500]),
          ),
        ],
      ),
    );
  }


  void _showQuickAccessDialog(BuildContext context, Visitante visitante, HomeViewModel viewModel) {
    // 1. Validate Status
    final state = ref.read(homeViewModelProvider);
    final empresa = state.empresas[visitante.empresaId];
    
    bool isVisitanteBlocked = visitante.status != 'ativo';
    bool isEmpresaBlocked = empresa != null && empresa.status != 'ativa';
    bool isBlocked = isVisitanteBlocked || isEmpresaBlocked;

    String statusTitle = 'Acesso Liberado';
    String statusMessage = 'Visitante e Empresa ativos';
    Color statusColor = const Color(0xFF10B981); // Emerald Green
    IconData statusIcon = Icons.check_circle;

    if (isBlocked) {
      statusColor = Colors.red;
      statusIcon = Icons.cancel;
      if (isVisitanteBlocked) {
        statusTitle = 'ACESSO NEGADO';
        statusMessage = 'Visitante ${visitante.status.toUpperCase()}';
      } else if (isEmpresaBlocked) {
         statusTitle = 'ACESSO NEGADO';
         statusMessage = 'Empresa ${empresa.nome} ${empresa.status.toUpperCase()}';
      }
    }

    final empresaNome = empresa?.nome ?? '-';

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      builder: (context) => Padding(
        padding: EdgeInsets.only(
          bottom: MediaQuery.of(context).viewInsets.bottom,
        ),
        child: SingleChildScrollView(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
               // Header with Status (Kept for visual feedback on scan)
               Container(
                width: double.infinity,
                padding: const EdgeInsets.symmetric(vertical: 16),
                decoration: BoxDecoration(
                  color: statusColor,
                  borderRadius: const BorderRadius.vertical(top: Radius.circular(24)),
                ),
                child: Column(
                  children: [
                    Icon(statusIcon, size: 48, color: Colors.white),
                    const SizedBox(height: 8),
                    Text(
                      statusMessage.toUpperCase(),
                      style: const TextStyle(
                        color: Colors.white,
                        fontSize: 20,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ],
                ),
              ),
              
              // The Card Logic
              Padding(
                padding: const EdgeInsets.all(16.0),
                child: VisitanteCard(
                  visitante: visitante,
                  empresaNome: empresaNome,
                  viewModel: viewModel,
                  onSuccess: () => Navigator.pop(context), // Close modal on success
                ),
              ),
              const SizedBox(height: 16),
            ],
          ),
        ),
      ),
    );
  }

  void _showSuccessSnackBar(BuildContext context, String message) {
    if (!mounted) return;
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Row(
          children: [
            const Icon(Icons.check_circle, color: Colors.white),
            const SizedBox(width: 12),
            Text(message),
          ],
        ),
        backgroundColor: Colors.green[700],
        behavior: SnackBarBehavior.floating,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
      ),
    );
  }
}


