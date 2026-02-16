import 'dart:io';
import 'package:supabase_flutter/supabase_flutter.dart';
import '../../models/empresa_model.dart';
import '../../models/visitante_model.dart';
import '../../models/registro_model.dart';
import '../../models/tipo_visitante_model.dart';

class SupabaseDatasource {
  final SupabaseClient _client;

  SupabaseDatasource(this._client);

  // --- Empresas ---
  Future<List<EmpresaModel>> fetchEmpresas({required String condominioId}) async {
    final response = await _client
        .from('empresas')
        .select()
        .eq('condominio_id', condominioId)
        .order('nome');

    return (response as List).map((e) => EmpresaModel.fromJson(e)).toList();
  }

  // --- Visitantes ---
  Future<List<VisitanteModel>> fetchVisitantes({required String condominioId}) async {
    final response = await _client
        .from('visitantes')
        .select()
        .eq('condominio_id', condominioId)
        .order('created_at');

    return (response as List).map((e) => VisitanteModel.fromJson(e)).toList();
  }

  Future<VisitanteModel> uploadVisitante(VisitanteModel visitante) async {
    final data = visitante.toJson();
    final response = await _client
        .from('visitantes')
        .upsert(data)
        .select()
        .single();

    return VisitanteModel.fromJson(response);
  }

  // --- Registros (Logs) ---
  Future<void> uploadRegistro(RegistroModel registro) async {
      await _client.from('registros').insert(registro.toJson());
  }

  Future<String?> uploadFoto(String path, String fileName) async {
    try {
      await _client.storage.from('registros').upload(
        'fotos/$fileName',
        File(path),
        fileOptions: const FileOptions(cacheControl: '3600', upsert: false),
      );
      
      final publicUrl = _client.storage.from('registros').getPublicUrl('fotos/$fileName');
      return publicUrl;
    } catch (e) {
      print('Error uploading photo: $e');
      return null;
    }
  }

  Future<List<TipoVisitanteModel>> fetchTiposVisitantes() async {
    try {
      final response = await _client
          .from('tipos_visitantes')
          .select()
          .order('nome');
      
      final List<dynamic> data = response;
      return data.map((json) => TipoVisitanteModel.fromJson(json)).toList();
    } catch (e) {
      print('Error fetching tipos visitantes: $e');
      rethrow;
    }
  }
}
