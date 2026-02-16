import 'dart:io';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:cached_network_image/cached_network_image.dart';
import 'package:image_picker/image_picker.dart';
import '../controllers/home_viewmodel.dart';
import '../screens/scanner_screen.dart';
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
                              return _buildVisitanteProfileCard(context, visitante, empresaNome, viewModel);
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

  Widget _buildVisitanteProfileCard(
    BuildContext context, 
    Visitante visitante,
    String empresaNome,
    HomeViewModel viewModel
  ) {
    Color statusColor = Colors.grey;
    if (visitante.status == 'ativo') statusColor = Colors.green;
    if (visitante.status == 'bloqueado') statusColor = Colors.red;

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
          // 1. Large Photo
          Container(
            width: 220,
            height: 220,
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              color: Colors.grey[200],
              border: Border.all(color: Colors.white, width: 4),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withOpacity(0.1),
                  blurRadius: 10,
                )
              ],
            ),
            child: ClipOval(
              child: visitante.fotoUrl != null && visitante.fotoUrl!.isNotEmpty
                  ? CachedNetworkImage(
                      imageUrl: visitante.fotoUrl!,
                      fit: BoxFit.cover,
                      placeholder: (context, url) => Icon(Icons.person, size: 100, color: Colors.grey[400]),
                      errorWidget: (context, url, error) => Icon(Icons.person, size: 100, color: Colors.grey[400]),
                    )
                  : Icon(Icons.person, size: 100, color: Colors.grey[400]),
            ),
          ),
          const SizedBox(height: 12),

          // 2. Name & CPF
          Text(
            visitante.nome,
            style: const TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 2),
          Text(
            'CPF: ${visitante.documento ?? "N/A"}',
            style: TextStyle(fontSize: 18, color: Colors.grey[600]),
          ),
          
          const SizedBox(height: 12),

          // 3. Info Badges (Empresa & Status)
          Wrap(
            spacing: 8,
            runSpacing: 4,
            alignment: WrapAlignment.center,
            children: [
              Chip(
                avatar: const Icon(Icons.business, size: 16, color: Colors.grey),
                label: Text(empresaNome, style: const TextStyle(fontWeight: FontWeight.w500)),
                backgroundColor: Colors.grey[100],
                padding: EdgeInsets.zero,
                visualDensity: VisualDensity.compact,
              ),
              Chip(
                avatar: Icon(Icons.circle, size: 12, color: statusColor),
                label: Text(
                  visitante.status.toUpperCase(), 
                  style: TextStyle(color: statusColor, fontWeight: FontWeight.bold)
                ),
                backgroundColor: statusColor.withOpacity(0.1),
                side: BorderSide.none,
                padding: EdgeInsets.zero,
                visualDensity: VisualDensity.compact,
              ),
            ],
          ),

          const SizedBox(height: 16),

          // 4. Action Buttons
          Row(
            children: [
              Expanded(
                child: ElevatedButton.icon(
                  onPressed: () async {
                    await viewModel.registerAccess(visitante, 'entrada');
                    if (context.mounted) {
                      _searchController.clear();
                      viewModel.loadVisitantes('');
                      ScaffoldMessenger.of(context).showSnackBar(
                        SnackBar(
                          content: Text('Entrada de ${visitante.nome} registrada!'),
                          backgroundColor: Colors.green[700],
                        ),
                      );
                    }
                  },
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
              const SizedBox(width: 16),
              Expanded(
                child: ElevatedButton.icon(
                  onPressed: () async {
                    await viewModel.registerAccess(visitante, 'saida');
                    if (context.mounted) {
                      _searchController.clear();
                      viewModel.loadVisitantes('');
                      ScaffoldMessenger.of(context).showSnackBar(
                        SnackBar(
                          content: Text('Saída de ${visitante.nome} registrada!'),
                          backgroundColor: Colors.red[700],
                        ),
                      );
                    }
                  },
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
            ],
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

    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.transparent,
      isScrollControlled: true,
      builder: (context) => Container(
        decoration: const BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.vertical(top: Radius.circular(32)),
        ),
        padding: const EdgeInsets.all(32),
        child: _AccessForm(
          visitante: visitante,
          viewModel: viewModel,
          empresa: empresa,
          isBlocked: isBlocked,
          statusColor: statusColor,
          statusIcon: statusIcon,
          statusTitle: statusTitle,
          statusMessage: statusMessage,
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

class _AccessForm extends StatefulWidget {
  final Visitante visitante;
  final HomeViewModel viewModel;
  final dynamic empresa;
  final bool isBlocked;
  final Color statusColor;
  final IconData statusIcon;
  final String statusTitle;
  final String statusMessage;

  const _AccessForm({
    required this.visitante,
    required this.viewModel,
    this.empresa,
    required this.isBlocked,
    required this.statusColor,
    required this.statusIcon,
    required this.statusTitle,
    required this.statusMessage,
  });

  @override
  State<_AccessForm> createState() => _AccessFormState();
}

class _AccessFormState extends State<_AccessForm> {
  final TextEditingController _placaController = TextEditingController();
  XFile? _veiculoImagem;
  final ImagePicker _picker = ImagePicker();

  Future<void> _tirarFoto() async {
    final XFile? photo = await _picker.pickImage(
      source: ImageSource.camera,
      maxWidth: 1024,
      maxHeight: 1024,
      imageQuality: 80,
    );
    if (photo != null) {
      setState(() => _veiculoImagem = photo);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            // Status Icon & Header
            Container(
              width: 100, height: 100,
              decoration: BoxDecoration(
                shape: BoxShape.circle, 
                color: widget.statusColor.withOpacity(0.1),
              ),
              child: Icon(widget.statusIcon, color: widget.statusColor, size: 50),
            ),
            const SizedBox(height: 16),
            
            Text(
              widget.statusTitle,
              style: TextStyle(
                fontSize: 24, 
                fontWeight: FontWeight.w900, 
                color: widget.statusColor,
                letterSpacing: -0.5,
              ),
              textAlign: TextAlign.center,
            ),
             const SizedBox(height: 8),
            Text(
              widget.visitante.nome,
              style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 4),
            Text(
              widget.statusMessage, 
              style: TextStyle(
                color: widget.isBlocked ? Colors.red[700] : Colors.grey[600],
                fontWeight: widget.isBlocked ? FontWeight.bold : FontWeight.normal,
                fontSize: 16,
              ),
              textAlign: TextAlign.center,
            ),
            
            if (widget.empresa != null) ...[
                const SizedBox(height: 8),
                Container(
                    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                    decoration: BoxDecoration(
                        color: Colors.grey[100],
                        borderRadius: BorderRadius.circular(20),
                    ),
                    child: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                            const Icon(Icons.business, size: 16, color: Colors.grey),
                            const SizedBox(width: 8),
                            Text(widget.empresa.nome, style: const TextStyle(fontWeight: FontWeight.w500)),
                        ],
                    ),
                ),
            ],

            const SizedBox(height: 24),
            
            // Vehicle Plate Field
            Row(
              children: [
                Expanded(
                  child: TextField(
                    controller: _placaController,
                    decoration: InputDecoration(
                      labelText: 'Placa do Veículo (Opcional)',
                      hintText: 'ABC-1234',
                      prefixIcon: const Icon(Icons.directions_car),
                      border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                    ),
                    textCapitalization: TextCapitalization.characters,
                  ),
                ),
                const SizedBox(width: 8),
                IconButton.outlined(
                  onPressed: _tirarFoto,
                  icon: Icon(
                    _veiculoImagem == null ? Icons.camera_alt : Icons.check_circle,
                    color: _veiculoImagem == null ? null : Colors.green,
                  ),
                  tooltip: 'Foto do Veículo',
                  style: IconButton.styleFrom(
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                    padding: const EdgeInsets.all(16),
                  ),
                ),
              ],
            ),
            if (_veiculoImagem != null)
              Padding(
                padding: const EdgeInsets.only(top: 8),
                child: Text(
                  'Foto capturada: ${_veiculoImagem!.name}',
                  style: const TextStyle(fontSize: 12, color: Colors.green, fontWeight: FontWeight.bold),
                ),
              ),

            const SizedBox(height: 32),
            
            // Allow actions even if blocked, as requested
            Row(
              children: [
                Expanded(
                  child: OutlinedButton(
                    onPressed: () async {
                      try {
                        await widget.viewModel.registerAccess(
                          widget.visitante, 
                          'saida',
                          placaVeiculo: _placaController.text.isNotEmpty ? _placaController.text : null,
                          fotoVeiculoUrl: _veiculoImagem?.path,
                        );
                        if (mounted) {
                          Navigator.pop(context);
                          ScaffoldMessenger.of(context).showSnackBar(
                            SnackBar(
                                content: Text('Saída de ${widget.visitante.nome} registrada!'),
                                backgroundColor: Colors.red[700],
                            ),
                          );
                        }
                      } catch (e) {
                        ScaffoldMessenger.of(context).showSnackBar(
                          SnackBar(content: Text(e.toString()), backgroundColor: Colors.red),
                        );
                      }
                    },
                    style: OutlinedButton.styleFrom(
                      padding: const EdgeInsets.symmetric(vertical: 16),
                      side: const BorderSide(color: Colors.red),
                      foregroundColor: Colors.red,
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                    ),
                    child: const Text('SAÍDA', style: TextStyle(fontWeight: FontWeight.bold)),
                  ),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: ElevatedButton(
                    onPressed: () async {
                      try {
                        await widget.viewModel.registerAccess(
                          widget.visitante, 
                          'entrada',
                          placaVeiculo: _placaController.text.isNotEmpty ? _placaController.text : null,
                          fotoVeiculoUrl: _veiculoImagem?.path,
                        );
                        if (mounted) {
                          Navigator.pop(context);
                          if (widget.isBlocked) {
                            ScaffoldMessenger.of(context).showSnackBar(
                                SnackBar(
                                    content: const Text('Entrada REGISTRADA (Alerta: Visitante Bloqueado/Inativo)'),
                                    backgroundColor: Colors.orange[800],
                                ),
                            );
                          } else {
                            ScaffoldMessenger.of(context).showSnackBar(
                                SnackBar(
                                    content: Text('Entrada de ${widget.visitante.nome} registrada!'),
                                    backgroundColor: Colors.green[700],
                                ),
                            );
                          }
                        }
                      } catch (e) {
                        ScaffoldMessenger.of(context).showSnackBar(
                          SnackBar(content: Text(e.toString()), backgroundColor: Colors.red),
                        );
                      }
                    },
                    style: ElevatedButton.styleFrom(
                      padding: const EdgeInsets.symmetric(vertical: 16),
                      backgroundColor: const Color(0xFF022C22),
                      foregroundColor: Colors.white,
                      elevation: 0,
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                    ),
                    child: const Text('ENTRADA', style: TextStyle(fontWeight: FontWeight.bold)),
                  ),
                ),
              ],
            ),
          ],
        );
  }
}
