import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mocktail/mocktail.dart';
import 'package:mobile/core/config/providers.dart';
import 'package:mobile/domain/entities/visitante.dart';
import 'package:mobile/domain/repositories/visitante_repository.dart';
import 'package:mobile/presentation/features/visitors/controllers/home_viewmodel.dart';
import 'package:mobile/domain/usecases/sync_service.dart';

import 'package:mobile/domain/repositories/registro_repository.dart';

// Mocks
class MockVisitanteRepository extends Mock implements VisitanteRepository {}
class MockSyncService extends Mock implements SyncService {}
class MockRegistroRepository extends Mock implements RegistroRepository {}

void main() {
  late MockVisitanteRepository mockVisitanteRepository;
  late MockSyncService mockSyncService;
  late MockRegistroRepository mockRegistroRepository;
  late ProviderContainer container;

  setUp(() {
    mockVisitanteRepository = MockVisitanteRepository();
    mockSyncService = MockSyncService();
    mockRegistroRepository = MockRegistroRepository();

    container = ProviderContainer(
      overrides: [
        visitanteRepositoryProvider.overrideWithValue(mockVisitanteRepository),
        syncServiceProvider.overrideWithValue(mockSyncService),
        registroRepositoryProvider.overrideWithValue(mockRegistroRepository),
      ],
    );
  });

  tearDown(() {
    container.dispose();
  });

  group('HomeViewModel', () {
    test('Initial state should be loading then loaded with empty list', () async {
      // Arrange
      when(() => mockVisitanteRepository.getVisitantes()).thenAnswer((_) async => []);

      // Act
      final viewModel = container.read(homeViewModelProvider.notifier);
      // Wait for async init in constructor
      await Future.delayed(Duration.zero); 

      // Assert
      final state = container.read(homeViewModelProvider);
      expect(state.isLoading, false);
      expect(state.visitantes, isEmpty);
      verify(() => mockVisitanteRepository.getVisitantes()).called(1);
    });

    test('loadVisitantes should update state with visitors', () async {
      // Arrange
      final visitor = Visitante(
        id: '1',
        condominioId: 'c1',
        nome: 'John Doe',
        status: 'ativo',
        situacao: 'FORA',
        syncStatus: 0,
      );
      when(() => mockVisitanteRepository.getVisitantes()).thenAnswer((_) async => [visitor]);

      // Act
      final viewModel = container.read(homeViewModelProvider.notifier);
      await viewModel.loadVisitantes();

      // Assert
      final state = container.read(homeViewModelProvider);
      expect(state.visitantes.length, 1);
      expect(state.visitantes.first.nome, 'John Doe');
    });

     test('Search should filter visitors', () async {
      // Arrange
      final v1 = Visitante(id: '1', condominioId: 'c1', nome: 'John Doe', status: 'ativo', situacao: 'DENTRO', syncStatus: 0);
      final v2 = Visitante(id: '2', condominioId: 'c1', nome: 'Jane Smith', status: 'ativo', situacao: 'FORA', syncStatus: 0);
      
      when(() => mockVisitanteRepository.getVisitantes()).thenAnswer((_) async => [v1, v2]);

      // Act
      final viewModel = container.read(homeViewModelProvider.notifier);
      await viewModel.loadVisitantes('Jane');

      // Assert
      final state = container.read(homeViewModelProvider);
      expect(state.visitantes.length, 1);
      expect(state.visitantes.first.nome, 'Jane Smith');
    });
  });
}
