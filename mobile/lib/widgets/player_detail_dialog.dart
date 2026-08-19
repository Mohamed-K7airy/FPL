import 'package:flutter/material.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';
import '../core/constants/app_colors.dart';
import '../models/player_model.dart';

class PlayerDetailDialog extends StatelessWidget {
  final PlayerModel player;

  const PlayerDetailDialog({super.key, required this.player});

  @override
  Widget build(BuildContext context) {
    return Dialog(
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24)),
      elevation: 10,
      backgroundColor: Colors.white,
      child: Container(
        padding: const EdgeInsets.all(20),
        constraints: const BoxConstraints(maxWidth: 420),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // Top Row: Player Header & Close
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Row(
                  children: [
                    Container(
                      width: 44,
                      height: 44,
                      decoration: const BoxDecoration(
                        color: Color(0xFFF3E8FF),
                        shape: BoxShape.circle,
                      ),
                      alignment: Alignment.center,
                      child: Text(
                        player.teamShort ?? 'PL',
                        style: const TextStyle(fontWeight: FontWeight.w900, fontSize: 12, color: AppColors.primaryPurple),
                      ),
                    ),
                    const SizedBox(width: 12),
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          player.webName,
                          style: const TextStyle(fontWeight: FontWeight.w900, fontSize: 16, color: AppColors.textMain),
                        ),
                        Text(
                          '${player.teamName ?? 'Premier League'} • ${player.positionNameAr}',
                          style: const TextStyle(fontSize: 12, color: AppColors.textMuted, fontWeight: FontWeight.w600),
                        ),
                      ],
                    ),
                  ],
                ),
                IconButton(
                  onPressed: () => Navigator.pop(context),
                  icon: const Icon(Icons.close, color: Color(0xFF64748B)),
                  style: IconButton.styleFrom(backgroundColor: const Color(0xFFF1F5F9)),
                ),
              ],
            ),

            const SizedBox(height: 18),

            // 3 Main Stat Cards (Total Points, Price, Form)
            Row(
              children: [
                Expanded(child: _buildStatCard('إجمالي النقاط', '${player.totalPoints}', AppColors.emerald)),
                const SizedBox(width: 8),
                Expanded(child: _buildStatCard('السعر', player.formattedPrice, AppColors.primaryPurple)),
                const SizedBox(width: 8),
                Expanded(child: _buildStatCard('الفورم', player.form ?? '0.0', AppColors.skyBlue)),
              ],
            ),

            const SizedBox(height: 14),

            // Performance Breakdown Grid
            Container(
              padding: const EdgeInsets.all(14),
              decoration: BoxDecoration(
                color: const Color(0xFFF8FAFC),
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: const Color(0xFFE2E8F0)),
              ),
              child: Column(
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      _buildBreakdownItem(LucideIcons.activity, 'الأهداف', '${player.goals ?? 0}', AppColors.emerald),
                      _buildBreakdownItem(LucideIcons.award, 'التمريرات الحاسمة', '${player.assists ?? 0}', AppColors.skyBlue),
                    ],
                  ),
                  const Divider(height: 16, color: Color(0xFFE2E8F0)),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      _buildBreakdownItem(LucideIcons.shieldCheck, 'شباك نظيفة', '${player.cleanSheets ?? 0}', AppColors.emerald),
                      _buildBreakdownItem(LucideIcons.trophy, 'نقاط البونص', '${player.bonus ?? 0}', AppColors.gold),
                    ],
                  ),
                ],
              ),
            ),

            const SizedBox(height: 16),

            // Close button
            ElevatedButton(
              onPressed: () => Navigator.pop(context),
              style: ElevatedButton.styleFrom(
                backgroundColor: AppColors.primaryPurple,
                foregroundColor: Colors.white,
                padding: const EdgeInsets.symmetric(vertical: 12),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
              ),
              child: const Text('إغلاق', style: TextStyle(fontWeight: FontWeight.w800, fontSize: 14)),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildStatCard(String label, String value, Color color) {
    return Container(
      padding: const EdgeInsets.symmetric(vertical: 10, horizontal: 6),
      decoration: BoxDecoration(
        color: const Color(0xFFF8FAFC),
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: const Color(0xFFE2E8F0)),
      ),
      child: Column(
        children: [
          Text(label, style: const TextStyle(fontSize: 10.5, color: AppColors.textMuted, fontWeight: FontWeight.w700)),
          const SizedBox(height: 4),
          Text(value, style: TextStyle(fontSize: 16, fontWeight: FontWeight.w900, color: color)),
        ],
      ),
    );
  }

  Widget _buildBreakdownItem(IconData icon, String label, String value, Color iconColor) {
    return Row(
      children: [
        Icon(icon, size: 14, color: iconColor),
        const SizedBox(width: 6),
        Text('$label: ', style: const TextStyle(fontSize: 12, color: AppColors.textMuted, fontWeight: FontWeight.w600)),
        Text(value, style: const TextStyle(fontSize: 12.5, fontWeight: FontWeight.w900, color: AppColors.textMain)),
      ],
    );
  }
}
