import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../../core/config/providers.dart';

class SyncViewState {
  final bool isSyncing;
  final int pendingCount;
  final String? errorMessage;
  final DateTime? lastSyncTime;
  final bool hasConnectionError;
  final bool showSuccessMessage;

  SyncViewState({
    this.isSyncing = false,
    this.pendingCount = 0,
    this.errorMessage,
    this.lastSyncTime,
    this.hasConnectionError = false,
    this.showSuccessMessage = false,
  });

  SyncViewState copyWith({
    bool? isSyncing,
    int? pendingCount,
    String? errorMessage,
    DateTime? lastSyncTime,
    bool? hasConnectionError,
    bool? showSuccessMessage,
  }) {
    return SyncViewState(
      isSyncing: isSyncing ?? this.isSyncing,
      pendingCount: pendingCount ?? this.pendingCount,
      errorMessage: errorMessage ?? this.errorMessage,
      lastSyncTime: lastSyncTime ?? this.lastSyncTime,
      hasConnectionError: hasConnectionError ?? this.hasConnectionError,
      showSuccessMessage: showSuccessMessage ?? this.showSuccessMessage,
    );
  }
}

class SyncViewModel extends StateNotifier<SyncViewState> {
  final Ref ref;

  SyncViewModel(this.ref) : super(SyncViewState()) {
    checkPendingCounts();
  }

  Future<void> checkPendingCounts() async {
    try {
      final registroRepo = ref.read(registroRepositoryProvider);
      final visitanteRepo = ref.read(visitanteRepositoryProvider);

      final rCount = await registroRepo.getPendingSyncCount();
      final vCount = await visitanteRepo.getPendingSyncCount();

      state = state.copyWith(pendingCount: rCount + vCount);
    } catch (e) {
      print('Error checking pending counts: $e');
    }
  }

  Future<void> syncData() async {
    if (state.isSyncing) return;

    state = state.copyWith(
      isSyncing: true, 
      errorMessage: null, 
      hasConnectionError: false,
      showSuccessMessage: false,
    );
    try {
      final syncService = ref.read(syncServiceProvider);
      const condominioId = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11';

      await syncService.syncAll(condominioId);
      
      state = state.copyWith(
        lastSyncTime: DateTime.now(), 
        hasConnectionError: false,
        showSuccessMessage: true,
      );
      await checkPendingCounts(); 

      // Hide success message after 3 seconds
      Future.delayed(const Duration(seconds: 3), () {
        if (mounted) {
          state = state.copyWith(showSuccessMessage: false);
        }
      });
    } catch (e) {
      final errorStr = e.toString().toLowerCase();
      final isNetwork = errorStr.contains('socketexception') || 
                       errorStr.contains('network') || 
                       errorStr.contains('clientexception');
      
      state = state.copyWith(
        errorMessage: isNetwork ? null : 'Erro: $e',
        hasConnectionError: isNetwork,
        showSuccessMessage: false,
      );
    } finally {
      state = state.copyWith(isSyncing: false);
    }
  }
}

final syncViewModelProvider = StateNotifierProvider<SyncViewModel, SyncViewState>((ref) {
  return SyncViewModel(ref);
});
