import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../controllers/sync_viewmodel.dart';
import '../../../../core/utils/brazil_time.dart';

class SyncStatusFooter extends ConsumerWidget {
  const SyncStatusFooter({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final syncState = ref.watch(syncViewModelProvider);

    // Only show if something is happening
    final bool shouldShow = syncState.isSyncing || 
                           syncState.hasConnectionError || 
                           syncState.pendingCount > 0 || 
                           syncState.showSuccessMessage;

    if (!shouldShow) {
      return const SizedBox.shrink();
    }

    Color bgColor = Colors.green[50]!;
    Color iconColor = Colors.green[700]!;
    IconData iconData = Icons.cloud_done;
    String statusText = 'Sistema Atualizado';

    if (syncState.isSyncing) {
      bgColor = Colors.blue[50]!;
      iconColor = Colors.blue[700]!;
      iconData = Icons.cloud_sync;
      statusText = 'Sincronizando dados...';
    } else if (syncState.hasConnectionError) {
      bgColor = Colors.red[50]!;
      iconColor = Colors.red[700]!;
      iconData = Icons.cloud_off;
      statusText = 'Verifique conexão';
    } else if (syncState.errorMessage != null) {
      bgColor = Colors.red[50]!;
      iconColor = Colors.red[700]!;
      iconData = Icons.cloud_off;
      statusText = 'Erro na sincronização';
    } else if (syncState.pendingCount > 0) {
      bgColor = Colors.orange[50]!;
      iconColor = Colors.orange[700]!;
      iconData = Icons.cloud_upload;
      statusText = '${syncState.pendingCount} registro(s) aguardando conexão';
    }

    return Container(
      width: double.infinity,
      height: 40, // Consistent height for all states
      padding: const EdgeInsets.symmetric(horizontal: 16),
      color: bgColor,
      child: Row(
        children: [
          if (syncState.isSyncing)
            SizedBox(
              width: 16,
              height: 16,
              child: CircularProgressIndicator(
                strokeWidth: 2,
                valueColor: AlwaysStoppedAnimation<Color>(iconColor),
              ),
            )
          else
            Icon(iconData, color: iconColor, size: 18),
          const SizedBox(width: 12),
          Expanded(
            child: Text(
              statusText,
              style: TextStyle(
                color: iconColor,
                fontWeight: FontWeight.w600,
                fontSize: 12,
              ),
            ),
          ),
        ],
      ),
    );
  }
}
