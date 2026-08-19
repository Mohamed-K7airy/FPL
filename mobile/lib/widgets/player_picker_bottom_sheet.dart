import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';
import '../core/constants/app_colors.dart';
import '../providers/transfers_provider.dart';
import 'player_detail_dialog.dart';

class PlayerPickerBottomSheet extends StatelessWidget {
  const PlayerPickerBottomSheet({super.key});

  @override
  Widget build(BuildContext context) {
    final provider = context.watch<TransfersProvider>();
    final selectedSlot = provider.selectedSlot;

    String title = 'اختر لاعباً لتشكيلتك';
    if (selectedSlot == 1) title = 'اختر حارس المرمى (GKP)';
    if (selectedSlot == 2) title = 'اختر المدافع (DEF)';
    if (selectedSlot == 3 || selectedSlot == 4) title = 'اختر لاعب الوسط (MID)';
    if (selectedSlot == 5) title = 'اختر المهاجم (FWD)';

    return Container(
      height: MediaQuery.of(context).size.height * 0.82,
      decoration: const BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.vertical(top: Radius.circular(26)),
      ),
      child: Column(
        children: [
          // Drag Handle
          Container(
            width: 44,
            height: 5,
            margin: const EdgeInsets.only(top: 12, bottom: 8),
            decoration: BoxDecoration(
              color: const Color(0xFFCBD5E1),
              borderRadius: BorderRadius.circular(999),
            ),
          ),

          // Header
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 8),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      title,
                      style: const TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.w900,
                        color: AppColors.primaryPurple,
                      ),
                    ),
                    const SizedBox(height: 2),
                    Text(
                      'الميزانية المتبقية: ${provider.formattedRemainingBudget}',
                      style: const TextStyle(
                        fontSize: 12,
                        fontWeight: FontWeight.w700,
                        color: AppColors.textMuted,
                      ),
                    ),
                  ],
                ),
                IconButton(
                  onPressed: () => Navigator.pop(context),
                  icon: const Icon(Icons.close, color: Color(0xFF64748B)),
                  style: IconButton.styleFrom(
                    backgroundColor: const Color(0xFFF1F5F9),
                  ),
                ),
              ],
            ),
          ),

          const Divider(height: 1, color: Color(0xFFF1F5F9)),

          // Search Box
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
            child: TextField(
              onChanged: (val) => provider.setSearchQuery(val),
              decoration: InputDecoration(
                hintText: 'ابحث باسم اللاعب...',
                prefixIcon: const Icon(LucideIcons.search, size: 18, color: Color(0xFF94A3B8)),
                filled: true,
                fillColor: const Color(0xFFF8FAFC),
                contentPadding: const EdgeInsets.symmetric(vertical: 0, horizontal: 16),
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(14),
                  borderSide: const BorderSide(color: Color(0xFFE2E8F0)),
                ),
                enabledBorder: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(14),
                  borderSide: const BorderSide(color: Color(0xFFE2E8F0)),
                ),
              ),
            ),
          ),

          // Filter Pills Row
          SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
            child: Row(
              children: [
                _buildFilterPill(context, 'الكل', null, provider.positionFilter == null, () => provider.setPositionFilter(null)),
                _buildFilterPill(context, 'حراس (GKP)', 1, provider.positionFilter == 1, () => provider.setPositionFilter(1)),
                _buildFilterPill(context, 'مدافعون (DEF)', 2, provider.positionFilter == 2, () => provider.setPositionFilter(2)),
                _buildFilterPill(context, 'وسط (MID)', 3, provider.positionFilter == 3, () => provider.setPositionFilter(3)),
                _buildFilterPill(context, 'مهاجمون (FWD)', 4, provider.positionFilter == 4, () => provider.setPositionFilter(4)),
              ],
            ),
          ),

          const SizedBox(height: 6),

          // Players List
          Expanded(
            child: provider.isLoadingPlayers
                ? const Center(child: CircularProgressIndicator(color: AppColors.primaryPurple))
                : provider.players.isEmpty
                    ? const Center(child: Text('لا يوجد لاعبين مطابقين للبحث', style: TextStyle(color: AppColors.textMuted)))
                    : ListView.separated(
                        itemCount: provider.players.length,
                        separatorBuilder: (ctx, i) => const Divider(height: 1, color: Color(0xFFF1F5F9)),
                        itemBuilder: (ctx, i) {
                          final player = provider.players[i];
                          final isSelected = provider.isPlayerSelected(player.id);

                          return ListTile(
                            contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 2),
                            onTap: () {
                              final success = provider.addOrTogglePlayer(player);
                              if (success) {
                                Navigator.pop(context);
                              }
                            },
                            leading: Row(
                              mainAxisSize: MainAxisSize.min,
                              children: [
                                IconButton(
                                  icon: const Icon(LucideIcons.info, size: 16, color: Color(0xFF64748B)),
                                  onPressed: () {
                                    showDialog(
                                      context: context,
                                      builder: (dCtx) => PlayerDetailDialog(player: player),
                                    );
                                  },
                                ),
                                Container(
                                  width: 32,
                                  height: 32,
                                  decoration: BoxDecoration(
                                    color: _getPositionColor(player.position).withOpacity(0.15),
                                    shape: BoxShape.circle,
                                  ),
                                  alignment: Alignment.center,
                                  child: Text(
                                    player.positionNameEn,
                                    style: TextStyle(
                                      color: _getPositionColor(player.position),
                                      fontSize: 10,
                                      fontWeight: FontWeight.w900,
                                    ),
                                  ),
                                ),
                              ],
                            ),
                            title: Text(
                              player.webName,
                              style: const TextStyle(fontWeight: FontWeight.w900, fontSize: 13.5, color: AppColors.textMain),
                            ),
                            subtitle: Text(
                              player.teamName ?? 'Premier League',
                              style: const TextStyle(fontSize: 11, color: AppColors.textMuted),
                            ),
                            trailing: Row(
                              mainAxisSize: MainAxisSize.min,
                              children: [
                                Column(
                                  mainAxisAlignment: MainAxisAlignment.center,
                                  crossAxisAlignment: CrossAxisAlignment.end,
                                  children: [
                                    Text(
                                      player.formattedPrice,
                                      style: const TextStyle(fontWeight: FontWeight.w800, fontSize: 13, color: AppColors.primaryPurple),
                                    ),
                                    Text(
                                      '${player.totalPoints} نقطة',
                                      style: const TextStyle(fontWeight: FontWeight.w700, fontSize: 11, color: AppColors.emerald),
                                    ),
                                  ],
                                ),
                                const SizedBox(width: 10),
                                Container(
                                  width: 32,
                                  height: 32,
                                  decoration: BoxDecoration(
                                    color: isSelected ? const Color(0xFFFEE2E2) : const Color(0xFFF3E8FF),
                                    shape: BoxShape.circle,
                                  ),
                                  alignment: Alignment.center,
                                  child: Icon(
                                    isSelected ? Icons.close : Icons.add,
                                    color: isSelected ? AppColors.dangerRed : AppColors.primaryPurple,
                                    size: 18,
                                  ),
                                ),
                              ],
                            ),
                          );
                        },
                      ),
          ),
        ],
      ),
    );
  }

  Widget _buildFilterPill(BuildContext context, String label, int? pos, bool isSelected, VoidCallback onTap) {
    return Padding(
      padding: const EdgeInsets.only(left: 6),
      child: GestureDetector(
        onTap: onTap,
        child: Container(
          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
          decoration: BoxDecoration(
            color: isSelected ? AppColors.primaryPurple : const Color(0xFFF1F5F9),
            borderRadius: BorderRadius.circular(10),
            border: Border.all(color: isSelected ? AppColors.primaryPurple : const Color(0xFFE2E8F0)),
          ),
          child: Text(
            label,
            style: TextStyle(
              color: isSelected ? Colors.white : const Color(0xFF475569),
              fontSize: 11.5,
              fontWeight: FontWeight.w800,
            ),
          ),
        ),
      ),
    );
  }

  Color _getPositionColor(int position) {
    switch (position) {
      case 1:
        return AppColors.posGkp;
      case 2:
        return AppColors.posDef;
      case 3:
        return AppColors.posMid;
      case 4:
        return AppColors.posFwd;
      default:
        return AppColors.primaryPurple;
    }
  }
}
