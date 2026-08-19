import 'package:flutter/material.dart';

class AppColors {
  // Premier League & MINI FPL Brand Colors
  static const Color primaryPurple = Color(0xFF37003C);
  static const Color deepPurple = Color(0xFF1E1B4B);
  static const Color darkPurple = Color(0xFF2E1065);
  static const Color accentGreen = Color(0xFF00FF85);
  static const Color emerald = Color(0xFF059669);
  static const Color vibrantCyan = Color(0xFF00C49F);
  static const Color skyBlue = Color(0xFF0284C7);
  static const Color brightBlue = Color(0xFF38BDF8);
  static const Color magenta = Color(0xFFEB008B);
  static const Color pink = Color(0xFFEC4899);
  static const Color gold = Color(0xFFF59E0B);
  static const Color amber = Color(0xFFD97706);
  static const Color dangerRed = Color(0xFFE11D48);

  // Pitch Greens
  static const Color pitchTop = Color(0xFF059669);
  static const Color pitchBottom = Color(0xFF047857);
  static const Color pitchGrassLight = Color(0xFF10B981);
  static const Color pitchGrassDark = Color(0xFF047857);

  // Background & Cards
  static const Color bgLight = Color(0xFFF8FAFC);
  static const Color cardBg = Color(0xFFFFFFFF);
  static const Color borderLight = Color(0xFFE2E8F0);
  static const Color textMain = Color(0xFF0F172A);
  static const Color textMuted = Color(0xFF64748B);
  static const Color textLight = Color(0xFF94A3B8);

  // Position Colors
  static const Color posGkp = Color(0xFFF59E0B);
  static const Color posDef = Color(0xFF2563EB);
  static const Color posMid = Color(0xFF7C3AED);
  static const Color posFwd = Color(0xFFDC2626);

  // Gradients
  static const LinearGradient purpleGrad = LinearGradient(
    colors: [primaryPurple, deepPurple],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );

  static const LinearGradient pitchGrad = LinearGradient(
    colors: [pitchTop, pitchBottom],
    begin: Alignment.topCenter,
    end: Alignment.bottomCenter,
  );

  static const LinearGradient skyGrad = LinearGradient(
    colors: [skyBlue, pitchTop],
    begin: Alignment.topCenter,
    end: Alignment.bottomCenter,
  );
}
