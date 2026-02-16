import 'package:flutter/material.dart';
import 'package:cached_network_image/cached_network_image.dart';
import '../../../../domain/entities/visitante.dart';

class VisitanteCard extends StatelessWidget {
  final Visitante visitante;
  final VoidCallback onTap;
  final VoidCallback onAction; // Entry or Exit action

  const VisitanteCard({
    super.key,
    required this.visitante,
    required this.onTap,
    required this.onAction,
  });

  @override
  Widget build(BuildContext context) {
    // Web Palette: Card Background white, Text Dark Green/Black
    final colorScheme = Theme.of(context).colorScheme;

    return Card(
      elevation: 2,
      margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      color: Colors.white,
      surfaceTintColor: Colors.white,
      child: Padding(
        padding: const EdgeInsets.all(12),
        child: Row(
          children: [
            // Avatar
            CircleAvatar(
              radius: 28,
              backgroundColor: colorScheme.primaryContainer,
              // Use CachedNetworkImageProvider for caching
              backgroundImage: visitante.fotoUrl != null
                  ? CachedNetworkImageProvider(visitante.fotoUrl!)
                  : null,
              child: visitante.fotoUrl == null
                  ? Text(
                      visitante.nome.substring(0, 1).toUpperCase(),
                      style: TextStyle(
                        color: colorScheme.onPrimaryContainer,
                        fontWeight: FontWeight.bold,
                        fontSize: 20,
                      ),
                    )
                  : null,
            ),
            const SizedBox(width: 16),
            
            // Info
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    visitante.nome,
                    style: const TextStyle(
                      fontWeight: FontWeight.bold,
                      fontSize: 16,
                      color: Color(0xFF022C22), // Deep Forest Green from web
                    ),
                  ),
                  const SizedBox(height: 4),
                  if (visitante.documento != null)
                    Text(
                      'Doc: ${visitante.documento}',
                      style: TextStyle(
                        color: Colors.grey[600],
                        fontSize: 12,
                      ),
                    ),
                  if (visitante.tipoVisitanteId != null)
                    Padding(
                      padding: const EdgeInsets.only(top: 4),
                      child: Text(
                        'Categoria: ${visitante.tipoVisitanteId}', // TODO: Resolve name if possible
                        style: TextStyle(
                          fontSize: 12,
                          color: colorScheme.primary,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ),
                ],
              ),
            ),

            // Action Button
            IconButton.filled(
              onPressed: onAction,
              style: IconButton.styleFrom(
                backgroundColor: colorScheme.primary, // Deep Green
                foregroundColor: Colors.white,
              ),
              icon: const Icon(Icons.login), // Or logout based on state?
              // For v1 simplificado: Just "Log Event". 
              // Ideally update icon based on last log, but we don't have that state yet easily.
            ),
          ],
        ),
      ),
    );
  }
}
