import 'package:flutter/material.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'package:provider/provider.dart';
import 'package:google_fonts/google_fonts.dart';

import 'core/constants/app_colors.dart';
import 'providers/auth_provider.dart';
import 'providers/transfers_provider.dart';
import 'providers/points_provider.dart';
import 'providers/leagues_provider.dart';
import 'providers/language_provider.dart';
import 'screens/auth/login_screen.dart';
import 'screens/main_layout_screen.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(const MiniFplApp());
}

class MiniFplApp extends StatelessWidget {
  const MiniFplApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => LanguageProvider()),
        ChangeNotifierProvider(create: (_) => AuthProvider()..checkAuthStatus()),
        ChangeNotifierProvider(create: (_) => TransfersProvider()),
        ChangeNotifierProvider(create: (_) => PointsProvider()),
        ChangeNotifierProvider(create: (_) => LeaguesProvider()),
      ],
      child: Consumer2<LanguageProvider, AuthProvider>(
        builder: (context, langProv, authProv, _) {
          return MaterialApp(
            title: 'MINI FPL',
            debugShowCheckedModeBanner: false,
            locale: langProv.locale,
            supportedLocales: const [
              Locale('ar'),
              Locale('en'),
            ],
            localizationsDelegates: const [
              GlobalMaterialLocalizations.delegate,
              GlobalWidgetsLocalizations.delegate,
              GlobalCupertinoLocalizations.delegate,
            ],
            theme: ThemeData(
              useMaterial3: true,
              colorScheme: ColorScheme.fromSeed(
                seedColor: AppColors.primaryPurple,
                primary: AppColors.primaryPurple,
                secondary: AppColors.accentGreen,
              ),
              scaffoldBackgroundColor: AppColors.bgLight,
              textTheme: GoogleFonts.cairoTextTheme(Theme.of(context).textTheme),
              appBarTheme: const AppBarTheme(
                backgroundColor: AppColors.primaryPurple,
                foregroundColor: Colors.white,
                elevation: 0,
                centerTitle: true,
              ),
            ),
            home: authProv.isLoading
                ? const Scaffold(
                    body: Center(
                      child: CircularProgressIndicator(color: AppColors.primaryPurple),
                    ),
                  )
                : authProv.isAuthenticated
                    ? const MainLayoutScreen()
                    : const LoginScreen(),
          );
        },
      ),
    );
  }
}
