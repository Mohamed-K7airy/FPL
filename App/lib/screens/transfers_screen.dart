import 'package:flutter/material.dart';
import '../config/constants.dart';

class TransfersScreen extends StatelessWidget {
  const TransfersScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppConstants.darkBackground,
      appBar: AppBar(
        backgroundColor: AppConstants.primaryPurple,
        title: const Text(
          'الانتقالات (Transfers)',
          style: TextStyle(color: AppConstants.primaryGreen, fontWeight: FontWeight.bold),
        ),
        centerTitle: true,
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: [
            // Status bar
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: AppConstants.cardBackground,
                borderRadius: BorderRadius.circular(14),
                border: Border.all(color: AppConstants.surfaceColor),
              ),
              child: const Row(
                mainAxisAlignment: MainAxisAlignment.spaceAround,
                children: [
                  Column(
                    children: [
                      Text('Free Transfers', style: TextStyle(color: AppConstants.textSecondary, fontSize: 12)),
                      SizedBox(height: 4),
                      Text('1', style: TextStyle(color: AppConstants.primaryGreen, fontSize: 18, fontWeight: FontWeight.bold)),
                    ],
                  ),
                  Column(
                    children: [
                      Text('Cost', style: TextStyle(color: AppConstants.textSecondary, fontSize: 12)),
                      SizedBox(height: 4),
                      Text('0 pts', style: TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold)),
                    ],
                  ),
                  Column(
                    children: [
                      Text('Money Remaining', style: TextStyle(color: AppConstants.textSecondary, fontSize: 12)),
                      SizedBox(height: 4),
                      Text('£0.5m', style: TextStyle(color: AppConstants.primaryGreen, fontSize: 18, fontWeight: FontWeight.bold)),
                    ],
                  ),
                ],
              ),
            ),
            const SizedBox(height: 20),

            // Search Bar
            TextField(
              style: const TextStyle(color: Colors.white),
              decoration: InputDecoration(
                hintText: 'ابحث عن لاعب...',
                hintStyle: const TextStyle(color: AppConstants.textSecondary),
                prefixIcon: const Icon(Icons.search, color: AppConstants.primaryGreen),
                filled: true,
                fillColor: AppConstants.cardBackground,
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                  borderSide: BorderSide.none,
                ),
              ),
            ),
            const SizedBox(height: 16),

            // Players List placeholder
            Expanded(
              child: ListView.builder(
                itemCount: 10,
                itemBuilder: (context, index) {
                  return Container(
                    margin: const EdgeInsets.only(bottom: 8),
                    decoration: BoxDecoration(
                      color: AppConstants.cardBackground,
                      borderRadius: BorderRadius.circular(10),
                    ),
                    child: ListTile(
                      leading: CircleAvatar(
                        backgroundColor: AppConstants.primaryPurple,
                        child: const Icon(Icons.person, color: AppConstants.primaryGreen),
                      ),
                      title: Text(
                        'اسم اللاعب ${index + 1}',
                        style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
                      ),
                      subtitle: Text(
                        'الفريق | MID',
                        style: const TextStyle(color: AppConstants.textSecondary, fontSize: 12),
                      ),
                      trailing: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Text(
                            '£${(6.0 + index * 0.5).toStringAsFixed(1)}m',
                            style: const TextStyle(color: AppConstants.primaryGreen, fontWeight: FontWeight.bold),
                          ),
                          const SizedBox(width: 10),
                          IconButton(
                            icon: const Icon(Icons.add_circle, color: AppConstants.primaryGreen),
                            onPressed: () {},
                          ),
                        ],
                      ),
                    ),
                  );
                },
              ),
            ),
          ],
        ),
      ),
    );
  }
}
