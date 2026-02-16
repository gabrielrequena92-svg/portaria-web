import 'package:go_router/go_router.dart';
import '../../presentation/features/auth/splash_screen.dart';
import '../../presentation/features/visitors/screens/home_screen.dart';
final appRouter = GoRouter(
  initialLocation: '/',
  routes: [
    GoRoute(
      path: '/',
      builder: (context, state) => const SplashScreen(),
    ),
    GoRoute(
      path: '/home',
      builder: (context, state) => const HomeScreen(),
    ),
  ],
);
