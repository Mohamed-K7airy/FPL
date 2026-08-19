import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';
import '../../core/constants/app_colors.dart';
import '../../providers/points_provider.dart';
import '../../widgets/pitch_view_widget.dart';
import '../../widgets/player_detail_dialog.dart';

class PointsScreen extends StatefulWidget {
  const PointsScreen({super.key});

  @override
  State<PointsScreen> createState() => _PointsScreenState();
}

class _PointsScreenState extends State<PointsScreen> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<PointsProvider>().fetchPoints();
    });
  }

  @override
  Widget build(BuildContext context) {
    final provider = context.watch<PointsProvider>();
    final gwPoints = provider.gwPoints;

    return Scaffold(
      backgroundColor: AppColors.bgLight,
      appBar: AppBar(
        title: const Text('نقاط الجولة المباشرة', style: TextStyle(fontWeight: FontWeight.w900, fontSize: 16)),
        backgroundColor: AppColors.primaryPurple,
        foregroundColor: Colors.white,
        elevation: 0,
        actions: [
          IconButton(
            icon: const Icon(LucideIcons.rotateCcw, size: 18),
            onPressed: () => provider.fetchPoints(),
          ),
        ],
      ),
      body: provider.isLoading
          ? const Center(child: CircularProgressIndicator(color: AppColors.primaryPurple))
          : SingleChildScrollView(
              padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
              child: Column(
                children: [
                  // Top Master Blue Gradient Card
                  Container(
                    decoration: BoxDecoration(
                      gradient: const LinearGradient(
                        colors: [Color(0xFF0284C7), Color(0xFF38BDF8)],
                        begin: Alignment.topCenter,
                        end: Alignment.bottomCenter,
                      ),
                      borderRadius: BorderRadius.circular(24),
                      boxShadow: const [
                        BoxShadow(color: Colors.black12, blurRadius: 20, offset: Offset(0, 8)),
                      ],
                    ),
                    padding: const EdgeInsets.all(16),
                    child: Column(
                      children: [
                        // GW Navigation Row
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            ElevatedButton(
                              onPressed: () => provider.setGw(provider.currentGw > 1 ? provider.currentGw - 1 : 1),
                              style: ElevatedButton.styleFrom(
                                backgroundColor: Colors.white24,
                                foregroundColor: Colors.white,
                                elevation: 0,
                                padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
                                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                              ),
                              child: const Text('السابق', style: TextStyle(fontSize: 11.5, fontWeight: FontWeight.w800)),
                            ),
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
                              decoration: BoxDecoration(
                                color: Colors.white24,
                                borderRadius: BorderRadius.circular(20),
                              ),
                              child: Text(
                                'الجولة ${provider.currentGw}',
                                style: const TextStyle(color: Colors.white, fontSize: 13, fontWeight: FontWeight.w900),
                              ),
                            ),
                            ElevatedButton(
                              onPressed: () => provider.setGw(provider.currentGw < 38 ? provider.currentGw + 1 : 38),
                              style: ElevatedButton.styleFrom(
                                backgroundColor: Colors.white24,
                                foregroundColor: Colors.white,
                                elevation: 0,
                                padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
                                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                              ),
                              child: const Text('التالي', style: TextStyle(fontSize: 11.5, fontWeight: FontWeight.w800)),
                            ),
                          ],
                        ),
                        const SizedBox(height: 18),

                        // 3 Main Stat Cards (المتوسط | نقاطك | الأعلى) with clean Arabic text
                        Row(
                          crossAxisAlignment: CrossAxisAlignment.end,
                          children: [
                            // Average
                            Expanded(
                              child: Column(
                                children: [
                                  Text(
                                    '${gwPoints?.avgScore ?? 0}',
                                    style: const TextStyle(fontSize: 22, fontWeight: FontWeight.w900, color: Colors.white),
                                  ),
                                  const SizedBox(height: 4),
                                  const Text('المتوسط', style: TextStyle(fontSize: 12, fontWeight: FontWeight.w800, color: Colors.white70)),
                                ],
                              ),
                            ),

                            // Center: Your Score
                            Expanded(
                              flex: 2,
                              child: Container(
                                padding: const EdgeInsets.symmetric(vertical: 12, horizontal: 8),
                                decoration: BoxDecoration(
                                  color: Colors.white.withOpacity(0.22),
                                  borderRadius: BorderRadius.circular(18),
                                  border: Border.all(color: Colors.white38),
                                ),
                                child: Column(
                                  children: [
                                    Text(
                                      '${gwPoints?.userScore ?? 0}',
                                      style: const TextStyle(fontSize: 36, fontWeight: FontWeight.w900, color: Colors.white, height: 1.1),
                                    ),
                                    const SizedBox(height: 4),
                                    const Text('نقاطك', style: TextStyle(fontSize: 13, fontWeight: FontWeight.w900, color: Colors.white)),
                                  ],
                                ),
                              ),
                            ),

                            // Highest
                            Expanded(
                              child: Column(
                                children: [
                                  Text(
                                    '${gwPoints?.highestScore ?? 0}',
                                    style: const TextStyle(fontSize: 22, fontWeight: FontWeight.w900, color: Colors.white),
                                  ),
                                  const SizedBox(height: 4),
                                  const Text('الأعلى', style: TextStyle(fontSize: 12, fontWeight: FontWeight.w800, color: Colors.white70)),
                                ],
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),

                  const SizedBox(height: 14),

                  // Pitch View with Points Highlight
                  PitchViewWidget(
                    picks: provider.pitchPicks,
                    isReadOnly: true,
                    showPointsOnly: true,
                    onPlayerInfoClick: (player) {
                      showDialog(
                        context: context,
                        builder: (ctx) => PlayerDetailDialog(player: player),
                      );
                    },
                  ),

                  const SizedBox(height: 16),

                  // Points Breakdown List
                  if (gwPoints != null && gwPoints.picks.isNotEmpty)
                    Container(
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(18),
                        border: Border.all(color: AppColors.borderLight),
                      ),
                      padding: const EdgeInsets.all(16),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text('تفاصيل أداء اللاعبين', style: TextStyle(fontSize: 14, fontWeight: FontWeight.w900, color: AppColors.primaryPurple)),
                          const SizedBox(height: 10),
                          ListView.separated(
                            shrinkWrap: true,
                            physics: const NeverScrollableScrollPhysics(),
                            itemCount: gwPoints.picks.length,
                            separatorBuilder: (ctx, i) => const Divider(height: 1, color: Color(0xFFF1F5F9)),
                            itemBuilder: (ctx, i) {
                              final pick = gwPoints.picks[i];
                              return ListTile(
                                dense: true,
                                contentPadding: EdgeInsets.zero,
                                title: Row(
                                  children: [
                                    Text(pick.player.webName, style: const TextStyle(fontWeight: FontWeight.w900, fontSize: 13)),
                                    if (pick.isCaptain)
                                      Container(
                                        margin: const EdgeInsets.only(right: 6),
                                        padding: const EdgeInsets.symmetric(horizontal: 4, vertical: 1),
                                        decoration: BoxDecoration(color: AppColors.primaryPurple, borderRadius: BorderRadius.circular(4)),
                                        child: Text(
                                          pick.multiplier == 3 ? '3x C' : 'C',
                                          style: const TextStyle(color: AppColors.accentGreen, fontSize: 9, fontWeight: FontWeight.w900),
                                        ),
                                      ),
                                  ],
                                ),
                                subtitle: Text(pick.player.teamName ?? 'Premier League', style: const TextStyle(fontSize: 11, color: AppColors.textMuted)),
                                trailing: Text(
                                  '${pick.calculatedPoints} نقطة',
                                  style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w900, color: AppColors.emerald),
                                ),
                              );
                            },
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
