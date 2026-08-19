import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';
import '../../core/constants/app_colors.dart';
import '../../providers/auth_provider.dart';
import '../../providers/transfers_provider.dart';
import '../../widgets/pitch_view_widget.dart';
import '../../widgets/player_detail_dialog.dart';

class SquadScreen extends StatefulWidget {
  const SquadScreen({super.key});

  @override
  State<SquadScreen> createState() => _SquadScreenState();
}

class _SquadScreenState extends State<SquadScreen> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<TransfersProvider>().fetchExistingSquad();
      context.read<AuthProvider>().refreshUser();
    });
  }

  void _showCaptaincyModal(int slot) {
    final provider = context.read<TransfersProvider>();
    final slotModel = provider.squadSlots[slot];
    if (slotModel == null || slotModel.isEmpty) return;

    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.white,
      shape: const RoundedRectangleBorder(borderRadius: BorderRadius.vertical(top: Radius.circular(22))),
      builder: (ctx) {
        return Padding(
          padding: const EdgeInsets.all(20),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              Text(
                'خيارات: ${slotModel.player!.webName}',
                style: const TextStyle(fontWeight: FontWeight.w900, fontSize: 16, color: AppColors.primaryPurple),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 16),
              ListTile(
                leading: Container(
                  padding: const EdgeInsets.all(6),
                  decoration: BoxDecoration(color: AppColors.primaryPurple, borderRadius: BorderRadius.circular(6)),
                  child: const Text('C', style: TextStyle(color: AppColors.accentGreen, fontWeight: FontWeight.w900)),
                ),
                title: const Text('تعيين كابتن (مضاعفة النقاط x2)', style: TextStyle(fontWeight: FontWeight.w800)),
                onTap: () {
                  provider.setCaptain(slot);
                  Navigator.pop(ctx);
                },
              ),
              ListTile(
                leading: Container(
                  padding: const EdgeInsets.all(6),
                  decoration: BoxDecoration(color: const Color(0xFF64748B), borderRadius: BorderRadius.circular(6)),
                  child: const Text('V', style: TextStyle(color: Colors.white, fontWeight: FontWeight.w900)),
                ),
                title: const Text('تعيين نائب الكابتن', style: TextStyle(fontWeight: FontWeight.w800)),
                onTap: () {
                  provider.setViceCaptain(slot);
                  Navigator.pop(ctx);
                },
              ),
            ],
          ),
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    final auth = context.watch<AuthProvider>();
    final transfers = context.watch<TransfersProvider>();

    return Scaffold(
      backgroundColor: AppColors.bgLight,
      appBar: AppBar(
        title: Text(auth.user?.teamName ?? 'تشكيلتي الخماسية', style: const TextStyle(fontWeight: FontWeight.w900, fontSize: 16)),
        backgroundColor: AppColors.primaryPurple,
        foregroundColor: Colors.white,
        elevation: 0,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
        child: Column(
          children: [
            // 3 Top Widgets: Triple Captain Chip | Squad Value | Overall Rank
            Row(
              children: [
                // Triple Captain Card
                Expanded(
                  child: Container(
                    padding: const EdgeInsets.all(10),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(color: AppColors.borderLight),
                    ),
                    child: Column(
                      children: [
                        const Text('الخاصية المفعلة', style: TextStyle(fontSize: 10, fontWeight: FontWeight.w800, color: AppColors.textMuted)),
                        const SizedBox(height: 4),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                          decoration: BoxDecoration(color: AppColors.deepPurple, borderRadius: BorderRadius.circular(8)),
                          child: const Text('تريبل كابتن 3x', style: TextStyle(color: AppColors.accentGreen, fontSize: 9.5, fontWeight: FontWeight.w900)),
                        ),
                      ],
                    ),
                  ),
                ),
                const SizedBox(width: 8),

                // Squad Value Card
                Expanded(
                  child: Container(
                    padding: const EdgeInsets.all(10),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(color: const Color(0xFF0284C7), width: 1.5),
                    ),
                    child: Column(
                      children: [
                        const Text('قيمة التشكيلة', style: TextStyle(fontSize: 10, fontWeight: FontWeight.w800, color: AppColors.textMuted)),
                        const SizedBox(height: 2),
                        Text(
                          '£${(transfers.totalSquadCost / 10).toStringAsFixed(1)}m',
                          style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w900, color: AppColors.primaryPurple),
                        ),
                      ],
                    ),
                  ),
                ),
                const SizedBox(width: 8),

                // Overall Rank Card
                Expanded(
                  child: Container(
                    padding: const EdgeInsets.all(10),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(color: AppColors.borderLight),
                    ),
                    child: Column(
                      children: [
                        const Text('الترتيب العام', style: TextStyle(fontSize: 10, fontWeight: FontWeight.w800, color: AppColors.textMuted)),
                        const SizedBox(height: 2),
                        Text(
                          '#${auth.user?.rank ?? 1}',
                          style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w900, color: AppColors.primaryPurple),
                        ),
                      ],
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 14),

            // Interactive Pitch View
            PitchViewWidget(
              picks: transfers.pitchPicks,
              onSlotClick: (slot) => _showCaptaincyModal(slot),
              onPlayerInfoClick: (player) {
                showDialog(
                  context: context,
                  builder: (ctx) => PlayerDetailDialog(player: player),
                );
              },
            ),

            const SizedBox(height: 14),

            // Hint Card
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: const Color(0xFFF3E8FF),
                borderRadius: BorderRadius.circular(14),
                border: Border.all(color: const Color(0xFFD8B4FE)),
              ),
              child: const Row(
                children: [
                  Icon(LucideIcons.sparkles, color: AppColors.primaryPurple, size: 16),
                  SizedBox(width: 8),
                  Expanded(
                    child: Text(
                      'انقر على أي لاعب لتعيين الكابتن (C) أو نائب الكابتن (V)',
                      style: TextStyle(fontSize: 11.5, fontWeight: FontWeight.w800, color: AppColors.primaryPurple),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
