import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../controllers/sync_viewmodel.dart';
import '../../../../core/utils/brazil_time.dart';

class SyncStatusFooter extends ConsumerWidget {
  const SyncStatusFooter({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final syncState = ref.watch(syncViewModelProvider);

    Color bgColor = Colors.green[50]!;
    Color iconColor = Colors.green[700]!;
    IconData iconData = Icons.cloud_done;
    String statusText = 'Sistema Atualizado';

    if (syncState.isSyncing) {
      bgColor = Colors.blue[50]!;
      iconColor = Colors.blue[700]!;
      iconData = Icons.cloud_sync;
      statusText = 'Sincronizando dados...';
    } else if (syncState.errorMessage != null) {
      bgColor = Colors.red[50]!;
      iconColor = Colors.red[700]!;
      iconData = Icons.cloud_off;
      statusText = 'Offline: ${syncState.pendingCount} pendentes. Erro: ${syncState.errorMessage}';
    } else if (syncState.pendingCount > 0) {
      bgColor = Colors.orange[50]!;
      iconColor = Colors.orange[700]!;
      iconData = Icons.cloud_upload;
      statusText = '${syncState.pendingCount} registro(s) aguardando conexão';
    }

    return Container(
      width: double.infinity,
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
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
            Icon(iconData, color: iconColor, size: 20),
          const SizedBox(width: 12),
          Expanded(
            child: Text(
              statusText,
              style: TextStyle(
                color: iconColor,
                fontWeight: FontWeight.w500,
                fontSize: 13,
              ),
            ),
          ),
          if (!syncState.isSyncing)
            IconButton(
              icon: Icon(Icons.sync, color: iconColor),
              iconSize: 24,
              padding: EdgeInsets.zero,
              constraints: const BoxConstraints(),
              onPressed: () {
                ref.read(syncViewModelProvider.notifier).syncData();
              },
            ),
        ],
      ),
    );
  }
}
