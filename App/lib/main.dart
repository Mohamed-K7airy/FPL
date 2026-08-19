import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:google_fonts/google_fonts.dart';
import 'config/constants.dart';
import 'providers/auth_provider.dart';
import 'providers/squad_provider.dart';
import 'screens/login_screen.dart';
import 'screens/home_screen.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(const FplApp());
}

class FplApp extends StatelessWidget {
  const FplApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => AuthProvider()..checkAuthStatus()),
        ChangeNotifierProvider(create: (_) => SquadProvider()),
      ],
      child: MaterialApp(
        title: 'FPL Companion',
        debugShowCheckedModeBanner: false,
        theme: ThemeData(
          useMaterial3: true,
          scaffoldBackgroundColor: AppConstants.darkBackground,
          colorScheme: ColorScheme.fromSeed(
            seedColor: AppConstants.primaryGreen,
            brightness: Brightness.dark,
          ),
          textTheme: GoogleFonts.cairoTextTheme(
            ThemeData.dark().textTheme,
          ),
        ),
        home: Consumer<AuthProvider>(
          builder: (context, auth, _) {
            if (auth.isLoading) {
              return const Scaffold(
                backgroundColor: AppConstants.darkBackground,
                body: Center(
                  child: CircularProgressIndicator(color: AppConstants.primaryGreen),
                ),
              );
            }
            if (auth.isAuthenticated) {
              return const HomeScreen();
            }
            return const LoginScreen();
          },
        ),
        routes: {
          '/login': (context) => const LoginScreen(),
          '/home': (context) => const HomeScreen(),
        },
      ),
    );
  }
}
