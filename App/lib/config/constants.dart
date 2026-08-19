import 'package:flutter/material.dart';

class AppConstants {
  // API Configuration
  static const String apiBaseUrl = 'https://fpl-production-fb03.up.railway.app/api';
  
  // App Colors (Dark Mode FPL Palette)
  static const Color primaryGreen = Color(0xFF00FF87);
  static const Color primaryPurple = Color(0xFF38003C);
  static const Color darkBackground = Color(0xFF11071F);
  static const Color cardBackground = Color(0xFF1F0D33);
  static const Color surfaceColor = Color(0xFF2A1245);
  static const Color textPrimary = Colors.white;
  static const Color textSecondary = Color(0xB3FFFFFF);
  static const Color accentPink = Color(0xFFFF007A);
  static const Color pitchGreen = Color(0xFF0F5A2D);
  static const Color pitchLine = Color(0x33FFFFFF);

  // Storage Keys
  static const String tokenKey = 'jwt_access_token';
  static const String userKey = 'user_data';
}
