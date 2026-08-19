import 'package:flutter/material.dart';
import '../config/constants.dart';

class LeaguesScreen extends StatelessWidget {
  const LeaguesScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppConstants.darkBackground,
      appBar: AppBar(
        backgroundColor: AppConstants.primaryPurple,
        title: const Text(
          'الدوريات والترتيب (Leagues)',
          style: TextStyle(color: AppConstants.primaryGreen, fontWeight: FontWeight.bold),
        ),
        centerTitle: true,
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'الدوريات الخاصة بك',
              style: TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 12),
            Expanded(
              child: ListView(
                children: [
                  _buildLeagueCard('الدوري العام (Global Classic League)', '1,245,890', '1,450 pts'),
                  _buildLeagueCard('دوري الأصدقاء (Friends Mini League)', '4', '1,450 pts'),
                  _buildLeagueCard('دوري مصر (Egypt League)', '23,410', '1,450 pts'),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildLeagueCard(String title, String rank, String points) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppConstants.cardBackground,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: AppConstants.surfaceColor),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Row(
            children: [
              const Icon(Icons.emoji_events, color: Colors.amber, size: 28),
              const SizedBox(width: 12),
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    title,
                    style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 14),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    'ترتيبك الحالي: #$rank',
                    style: const TextStyle(color: AppConstants.textSecondary, fontSize: 12),
                  ),
                ],
              ),
            ],
          ),
          Text(
            points,
            style: const TextStyle(color: AppConstants.primaryGreen, fontWeight: FontWeight.bold),
          ),
        ],
      ),
    );
  }
}
