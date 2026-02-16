import 'dart:convert';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:uuid/uuid.dart';
import '../../../../core/config/providers.dart';
import '../../../../core/utils/brazil_time.dart';
import '../../../../data/models/visitante_model.dart';
import '../../../../domain/entities/visitante.dart';
import '../../../../domain/entities/empresa.dart';
import '../../../../domain/entities/registro.dart';
import '../../../../domain/entities/tipo_visitante.dart';
import '../../../../domain/repositories/registro_repository.dart';
import '../../../../domain/repositories/tipo_visitante_repository.dart';

// State for the Home Screen
class HomeState {
  final List<Visitante> visitantes;
  final bool isLoading;
  final bool isSyncing;
  final String? errorMessage;
  final bool hasSearched;
  final Map<String, Empresa> empresas;
  final List<TipoVisitante> tiposVisitantes;

  HomeState({
    this.visitantes = const [],
    this.isLoading = false,
    this.isSyncing = false,
    this.errorMessage,
    this.hasSearched = false,
    this.empresas = const {},
    this.tiposVisitantes = const [],
  });

  HomeState copyWith({
    List<Visitante>? visitantes,
    bool? isLoading,
    bool? isSyncing,
    String? errorMessage,
    bool? hasSearched,
    Map<String, Empresa>? empresas,
    List<TipoVisitante>? tiposVisitantes,
  }) {
    return HomeState(
      visitantes: visitantes ?? this.visitantes,
      isLoading: isLoading ?? this.isLoading,
      isSyncing: isSyncing ?? this.isSyncing,
      errorMessage: errorMessage ?? this.errorMessage,
      hasSearched: hasSearched ?? this.hasSearched,
      empresas: empresas ?? this.empresas,
      tiposVisitantes: tiposVisitantes ?? this.tiposVisitantes,
    );
  }
}

class HomeViewModel extends StateNotifier<HomeState> {
  final Ref ref;
  final Uuid _uuid = const Uuid();
  late final RegistroRepository _registroRepository;

  HomeViewModel(this.ref) : super(HomeState()) {
    _registroRepository = ref.read(registroRepositoryProvider);
    loadEmpresas();
    loadTiposVisitantes();
  }

  Future<void> loadTiposVisitantes() async {
    try {
      final repository = ref.read(tipoVisitanteRepositoryProvider);
      final list = await repository.getTiposVisitantes();
      state = state.copyWith(tiposVisitantes: list);
    } catch (e) {
      print('Error loading tipos visitantes: $e');
    }
  }

  Future<void> loadEmpresas() async {
    try {
      final repository = ref.read(empresaRepositoryProvider);
      final empresasList = await repository.getEmpresas();
      final map = {for (var e in empresasList) e.id: e};
      state = state.copyWith(empresas: map);
    } catch (e) {
      // Non-critical, just won't show names
      print('Error loading empresas: $e');
    }
  }

  Future<void> loadVisitantes([String? query]) async {
    state = state.copyWith(isLoading: true);
    try {
      final repository = ref.read(visitanteRepositoryProvider);
      var list = await repository.getVisitantes(); // Local DB

      if (query != null && query.isNotEmpty) {
        // Remove non-numeric characters for CPF search
        final normalizedQuery = query.replaceAll(RegExp(r'[^0-9a-zA-Z]'), '').toLowerCase();
        
        list = list.where((v) {
          final nomeLower = v.nome.toLowerCase();
          final docClean = v.documento?.replaceAll(RegExp(r'[^0-9a-zA-Z]'), '').toLowerCase() ?? '';
          
          return nomeLower.contains(normalizedQuery) || docClean.contains(normalizedQuery);
        }).toList();

        // Only set hasSearched to true if there was a query
        state = state.copyWith(visitantes: list, isLoading: false, hasSearched: true);
      } else {
        // Reset search if query is cleared
        state = state.copyWith(visitantes: [], isLoading: false, hasSearched: false);
      }
    } catch (e) {
      state = state.copyWith(isLoading: false, errorMessage: e.toString());
    }
  }

  Future<void> syncData() async {
    if (state.isSyncing) return;
    
    state = state.copyWith(isSyncing: true);
    try {
      final syncService = ref.read(syncServiceProvider);
      // TODO: Get real condominioId from Auth/Config. Hardcoded for MVP v1.
      const condominioId = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'; 
      
      await syncService.syncAll(condominioId);
      
      // Reload local data after sync
      await loadEmpresas();
      await loadVisitantes(); // This might clear search, which is fine
    } catch (e) {
      state = state.copyWith(errorMessage: 'Erro ao sincronizar: $e');
    } finally {
      state = state.copyWith(isSyncing: false);
    }
  }

  Future<void> registerAccess(
    Visitante visitante, 
    String tipo, {
    String? placaVeiculo,
    String? fotoVeiculoUrl,
  }) async {
    try {
      // Use BrazilTime to get correct Brazil time regardless of device timezone
      final now = BrazilTime.now();
      
      final registro = Registro(
        id: _uuid.v4(),
        condominioId: visitante.condominioId,
        visitanteId: visitante.id,
        empresaId: visitante.empresaId,
        tipo: tipo,
        dataRegistro: now,
        placaVeiculo: placaVeiculo,
        fotoVeiculoUrl: fotoVeiculoUrl,
        visitanteNomeSnapshot: visitante.nome,
        visitanteCpfSnapshot: visitante.documento,
        visitorPhotoSnapshot: visitante.fotoUrl,
        empresaNomeSnapshot: state.empresas[visitante.empresaId]?.nome ?? '-',
        syncStatus: 1, // Pending
      );

      await _registroRepository.saveRegistro(registro);
      
      // Auto-sync after registration
      await syncData();
    } catch (e) {
      state = state.copyWith(errorMessage: 'Erro ao registrar $tipo: $e');
    }
  }

  Future<Visitante?> processQrCode(String rawData) async {
    try {
      // 1. Parse JSON
      final Map<String, dynamic> data = jsonDecode(rawData);
      
      // 2. Validate version/schema
      if (data['v'] != 'v1') return null;
      
      final String visitorId = data['id'];
      final String condominoId = data['c'];

      // 3. Simple security check: Must be the same condominium
      // TODO: Get real condominoId from Auth. 
      const currentCondominioId = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11';
      if (condominoId != currentCondominioId) {
        state = state.copyWith(errorMessage: 'QR Code de outro condomínio!');
        return null;
      }

      // 4. Fetch Visitor from Local DB
      final repository = ref.read(visitanteRepositoryProvider);
      final visitante = await repository.getVisitanteById(visitorId);

      if (visitante == null) {
        state = state.copyWith(errorMessage: 'Visitante não encontrado localmente. Sincronize os dados.');
        return null;
      }

      return visitante;
    } catch (e) {
      print('Error parsing QR: $e');
      return null;
    }
  }
}

final homeViewModelProvider = StateNotifierProvider<HomeViewModel, HomeState>((ref) {
  return HomeViewModel(ref);
});
