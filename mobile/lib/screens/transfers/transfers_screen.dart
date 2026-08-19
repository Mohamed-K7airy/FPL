import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';
import '../../core/constants/app_colors.dart';
import '../../providers/transfers_provider.dart';
import '../../widgets/pitch_view_widget.dart';
import '../../widgets/player_picker_bottom_sheet.dart';
import '../../widgets/player_detail_dialog.dart';

class TransfersScreen extends StatefulWidget {
  const TransfersScreen({super.key});

  @override
  State<TransfersScreen> createState() => _TransfersScreenState();
}

class _TransfersScreenState extends State<TransfersScreen> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<TransfersProvider>().init();
    });
  }

  void _openPlayerPicker() {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (ctx) => const PlayerPickerBottomSheet(),
    );
  }

  @override
  Widget build(BuildContext context) {
    final provider = context.watch<TransfersProvider>();

    return Scaffold(
      backgroundColor: AppColors.bgLight,
      appBar: AppBar(
        title: const Text('سوق الانتقالات والتشكيلة', style: TextStyle(fontWeight: FontWeight.w900, fontSize: 16)),
        backgroundColor: AppColors.primaryPurple,
        foregroundColor: Colors.white,
        elevation: 0,
        actions: [
          IconButton(
            icon: const Icon(LucideIcons.rotateCcw, size: 18),
            tooltip: 'إعادة ضبط',
            onPressed: () => provider.fetchExistingSquad(),
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
        child: Column(
          children: [
            // Top Master Pitch Card
            Container(
              decoration: BoxDecoration(
                gradient: const LinearGradient(
                  colors: [Color(0xFF0284C7), Color(0xFF38BDF8), Color(0xFF059669)],
                  begin: Alignment.topCenter,
                  end: Alignment.bottomCenter,
                ),
                borderRadius: BorderRadius.circular(24),
                boxShadow: const [
                  BoxShadow(color: Colors.black12, blurRadius: 20, offset: Offset(0, 8)),
                ],
              ),
              padding: const EdgeInsets.all(14),
              child: Column(
                children: [
                  // GW Navigation Row
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      ElevatedButton(
                        onPressed: () => provider.setGw(provider.gw > 1 ? provider.gw - 1 : 1),
                        style: ElevatedButton.styleFrom(
                          backgroundColor: AppColors.deepPurple,
                          foregroundColor: Colors.white,
                          padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                        ),
                        child: const Text('السابق', style: TextStyle(fontSize: 11.5, fontWeight: FontWeight.w800)),
                      ),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
                        decoration: BoxDecoration(
                          color: AppColors.deepPurple,
                          borderRadius: BorderRadius.circular(20),
                        ),
                        child: Text(
                          'الجولة ${provider.gw}',
                          style: const TextStyle(color: Colors.white, fontSize: 12, fontWeight: FontWeight.w900),
                        ),
                      ),
                      ElevatedButton(
                        onPressed: () => provider.setGw(provider.gw < 38 ? provider.gw + 1 : 38),
                        style: ElevatedButton.styleFrom(
                          backgroundColor: AppColors.deepPurple,
                          foregroundColor: Colors.white,
                          padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                        ),
                        child: const Text('التالي', style: TextStyle(fontSize: 11.5, fontWeight: FontWeight.w800)),
                      ),
                    ],
                  ),
                  const SizedBox(height: 12),

                  // 3 Stat Cards (Chips, Budget, Transfers)
                  Row(
                    children: [
                      // Chips Card
                      Expanded(
                        child: Container(
                          padding: const EdgeInsets.symmetric(vertical: 8, horizontal: 6),
                          decoration: BoxDecoration(
                            color: Colors.white,
                            borderRadius: BorderRadius.circular(14),
                          ),
                          child: Column(
                            children: [
                              const Text('الخواص (Chips)', style: TextStyle(fontSize: 9.5, fontWeight: FontWeight.w800, color: AppColors.textMuted)),
                              const SizedBox(height: 6),
                              Row(
                                children: [
                                  Expanded(
                                    child: GestureDetector(
                                      onTap: () {
                                        if (provider.isWildcardActive) {
                                          provider.deactivateChip('wildcard');
                                        } else {
                                          provider.activateChip('wildcard');
                                        }
                                      },
                                      child: Container(
                                        padding: const EdgeInsets.symmetric(vertical: 4),
                                        decoration: BoxDecoration(
                                          color: provider.isWildcardActive ? AppColors.emerald : AppColors.deepPurple,
                                          borderRadius: BorderRadius.circular(6),
                                        ),
                                        alignment: Alignment.center,
                                        child: Text(
                                          provider.isWildcardActive ? 'مفعل' : 'وايلد كارد',
                                          style: const TextStyle(color: Colors.white, fontSize: 8.5, fontWeight: FontWeight.w900),
                                        ),
                                      ),
                                    ),
                                  ),
                                  const SizedBox(width: 4),
                                  Expanded(
                                    child: GestureDetector(
                                      onTap: () {
                                        if (provider.isFreeHitActive) {
                                          provider.deactivateChip('freehit');
                                        } else {
                                          provider.activateChip('freehit');
                                        }
                                      },
                                      child: Container(
                                        padding: const EdgeInsets.symmetric(vertical: 4),
                                        decoration: BoxDecoration(
                                          color: provider.isFreeHitActive ? AppColors.emerald : AppColors.pink,
                                          borderRadius: BorderRadius.circular(6),
                                        ),
                                        alignment: Alignment.center,
                                        child: Text(
                                          provider.isFreeHitActive ? 'مفعل' : 'فري هيت',
                                          style: const TextStyle(color: Colors.white, fontSize: 8.5, fontWeight: FontWeight.w900),
                                        ),
                                      ),
                                    ),
                                  ),
                                ],
                              ),
                            ],
                          ),
                        ),
                      ),
                      const SizedBox(width: 8),

                      // Budget Card
                      Expanded(
                        child: Container(
                          padding: const EdgeInsets.symmetric(vertical: 8, horizontal: 6),
                          decoration: BoxDecoration(
                            color: Colors.white,
                            borderRadius: BorderRadius.circular(14),
                            border: Border.all(color: const Color(0xFFFACC15), width: 1.5),
                          ),
                          child: Column(
                            children: [
                              const Text('الميزانية المتبقية', style: TextStyle(fontSize: 9.5, fontWeight: FontWeight.w800, color: AppColors.textMuted)),
                              const SizedBox(height: 2),
                              Text(
                                provider.formattedRemainingBudget,
                                style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w900, color: AppColors.primaryPurple),
                              ),
                              const Text('الكلية: £50.0m', style: TextStyle(fontSize: 8.5, color: AppColors.textMuted)),
                            ],
                          ),
                        ),
                      ),
                      const SizedBox(width: 8),

                      // Transfers Count Card
                      Expanded(
                        child: Container(
                          padding: const EdgeInsets.symmetric(vertical: 8, horizontal: 6),
                          decoration: BoxDecoration(
                            color: Colors.white,
                            borderRadius: BorderRadius.circular(14),
                          ),
                          child: Column(
                            children: [
                              const Text('التغييرات', style: TextStyle(fontSize: 9.5, fontWeight: FontWeight.w800, color: AppColors.textMuted)),
                              const SizedBox(height: 2),
                              Container(
                                padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                                decoration: BoxDecoration(
                                  color: AppColors.deepPurple,
                                  borderRadius: BorderRadius.circular(6),
                                ),
                                child: const Text('غير محدود', style: TextStyle(color: Colors.white, fontSize: 10, fontWeight: FontWeight.w900)),
                              ),
                              const Text('قبل الجولة 1', style: TextStyle(fontSize: 8.5, color: AppColors.textMuted)),
                            ],
                          ),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 14),

                  // Pitch View
                  PitchViewWidget(
                    picks: provider.pitchPicks,
                    selectedSlot: provider.selectedSlot,
                    onEmptySlotClick: (pos, slot) {
                      provider.setSelectedSlot(slot);
                      _openPlayerPicker();
                    },
                    onSlotClick: (slot) {
                      provider.setSelectedSlot(slot);
                      _openPlayerPicker();
                    },
                    onRemovePlayer: (slot) => provider.removePlayerFromSlot(slot),
                    onPlayerInfoClick: (player) {
                      showDialog(
                        context: context,
                        builder: (ctx) => PlayerDetailDialog(player: player),
                      );
                    },
                  ),
                  const SizedBox(height: 14),

                  // Emerald Confirm Button
                  SizedBox(
                    width: double.infinity,
                    child: ElevatedButton.icon(
                      onPressed: provider.isSubmitting
                          ? null
                          : () async {
                              final error = await provider.submitSquad();
                              if (error == null && mounted) {
                                ScaffoldMessenger.of(context).showSnackBar(
                                  const SnackBar(
                                    content: Text('تم حفظ التشكيلة والانتقالات بنجاح!'),
                                    backgroundColor: AppColors.emerald,
                                  ),
                                );
                              } else if (mounted && error != null) {
                                ScaffoldMessenger.of(context).showSnackBar(
                                  SnackBar(content: Text(error), backgroundColor: AppColors.dangerRed),
                                );
                              }
                            },
                      icon: const Icon(LucideIcons.checkCircle2, size: 18),
                      label: Text(
                        provider.isSubmitting
                            ? 'جاري الحفظ...'
                            : (provider.hasExistingSquad ? 'تأكيد وحفظ الانتقالات' : 'إنشاء فريق'),
                        style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w900),
                      ),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: AppColors.accentGreen,
                        foregroundColor: AppColors.primaryPurple,
                        padding: const EdgeInsets.symmetric(vertical: 14),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                        elevation: 4,
                      ),
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
