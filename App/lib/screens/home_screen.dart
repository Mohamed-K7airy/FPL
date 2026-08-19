import 'package:flutter/material.dart';
import '../config/constants.dart';
import 'pitch_view_screen.dart';
import 'transfers_screen.dart';
import 'leagues_screen.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  int _currentIndex = 0;

  final List<Widget> _screens = const [
    PitchViewScreen(),
    TransfersScreen(),
    LeaguesScreen(),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: IndexedStack(
        index: _currentIndex,
        children: _screens,
      ),
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _currentIndex,
        onTap: (index) {
          setState(() {
            _currentIndex = index;
          });
        },
        backgroundColor: AppConstants.primaryPurple,
        selectedItemColor: AppConstants.primaryGreen,
        unselectedItemColor: AppConstants.textSecondary,
        items: const [
          BottomNavigationBarViewItem(
            icon: Icon(Icons.sports_soccer),
            label: 'التشكيلة',
          ),
          BottomNavigationBarViewItem(
            icon: Icon(Icons.swap_horiz),
            label: 'الانتقالات',
          ),
          BottomNavigationBarViewItem(
            icon: Icon(Icons.emoji_events),
            label: 'الدوريات',
          ),
        ],
      ),
    );
  }
}

class BottomNavigationBarViewItem extends BottomNavigationBarItem {
  const BottomNavigationBarViewItem({
    required Widget icon,
    required String label,
  }) : super(icon: icon, label: label);
}
