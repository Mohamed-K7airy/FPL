import 'package:flutter/material.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';
import '../core/constants/app_colors.dart';
import 'home/home_screen.dart';
import 'points/points_screen.dart';
import 'transfers/transfers_screen.dart';
import 'squad/squad_screen.dart';
import 'leagues/leagues_screen.dart';

class MainLayoutScreen extends StatefulWidget {
  const MainLayoutScreen({super.key});

  @override
  State<MainLayoutScreen> createState() => _MainLayoutScreenState();
}

class _MainLayoutScreenState extends State<MainLayoutScreen> {
  int _currentIndex = 0;

  void _onTabTapped(int index) {
    setState(() {
      _currentIndex = index;
    });
  }

  @override
  Widget build(BuildContext context) {
    final screens = [
      HomeScreen(onNavigateTab: _onTabTapped),
      const PointsScreen(),
      const TransfersScreen(),
      const SquadScreen(),
      const LeaguesScreen(),
    ];

    return Scaffold(
      body: IndexedStack(
        index: _currentIndex,
        children: screens,
      ),
      bottomNavigationBar: Container(
        decoration: BoxDecoration(
          color: AppColors.primaryPurple,
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.15),
              blurRadius: 12,
              offset: const Offset(0, -3),
            ),
          ],
        ),
        child: BottomNavigationBar(
          currentIndex: _currentIndex,
          onTap: _onTabTapped,
          type: BottomNavigationBarType.fixed,
          backgroundColor: AppColors.primaryPurple,
          selectedItemColor: AppColors.accentGreen,
          unselectedItemColor: Colors.white60,
          selectedLabelStyle: const TextStyle(fontWeight: FontWeight.w900, fontSize: 11),
          unselectedLabelStyle: const TextStyle(fontWeight: FontWeight.w600, fontSize: 10.5),
          items: const [
            BottomNavigationBarItem(
              icon: Icon(LucideIcons.home, size: 20),
              label: 'الرئيسية',
            ),
            BottomNavigationBarItem(
              icon: Icon(LucideIcons.trophy, size: 20),
              label: 'نقاطي',
            ),
            BottomNavigationBarItem(
              icon: Icon(LucideIcons.repeat, size: 20),
              label: 'الانتقالات',
            ),
            BottomNavigationBarItem(
              icon: Icon(LucideIcons.layoutGrid, size: 20),
              label: 'تشكيلتي',
            ),
            BottomNavigationBarItem(
              icon: Icon(LucideIcons.users, size: 20),
              label: 'الدوريات',
            ),
          ],
        ),
      ),
    );
  }
}
