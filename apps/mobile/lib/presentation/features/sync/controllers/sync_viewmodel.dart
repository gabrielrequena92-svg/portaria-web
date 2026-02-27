import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../../core/config/providers.dart';

class SyncViewState {
  final bool isSyncing;
  final int pendingCount;
  final String? errorMessage;
  final DateTime? lastSyncTime;

  SyncViewState({
    this.isSyncing = false,
    this.pendingCount = 0,
    this.errorMessage,
    this.lastSyncTime,
  });

  SyncViewState copyWith({
    bool? isSyncing,
    int? pendingCount,
    String? errorMessage,
    DateTime? lastSyncTime,
  }) {
    return SyncViewState(
      isSyncing: isSyncing ?? this.isSyncing,
      pendingCount: pendingCount ?? this.pendingCount,
      errorMessage: errorMessage ?? this.errorMessage,
      lastSyncTime: lastSyncTime ?? this.lastSyncTime,
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

    state = state.copyWith(isSyncing: true, errorMessage: null);
    try {
      final syncService = ref.read(syncServiceProvider);
      // Hardcoded for MVP v1 (as it was in home_viewmodel)
      const condominioId = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11';

      await syncService.syncAll(condominioId);
      state = state.copyWith(lastSyncTime: DateTime.now());
      await checkPendingCounts(); // Refresh count properly after finish
    } catch (e) {
      state = state.copyWith(errorMessage: 'Erro: $e');
    } finally {
      state = state.copyWith(isSyncing: false);
    }
  }
}

final syncViewModelProvider = StateNotifierProvider<SyncViewModel, SyncViewState>((ref) {
  return SyncViewModel(ref);
});
