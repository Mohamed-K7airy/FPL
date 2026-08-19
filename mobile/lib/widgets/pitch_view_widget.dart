import 'package:flutter/material.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';
import '../core/constants/app_colors.dart';
import '../models/squad_slot_model.dart';
import '../models/player_model.dart';

class PitchViewWidget extends StatelessWidget {
  final List<SquadSlotModel> picks;
  final int? selectedSlot;
  final Function(int slot)? onSlotClick;
  final Function(int position, int slot)? onEmptySlotClick;
  final Function(int slot)? onRemovePlayer;
  final Function(PlayerModel player)? onPlayerInfoClick;
  final bool isReadOnly;
  final bool showPointsOnly;

  const PitchViewWidget({
    super.key,
    required this.picks,
    this.selectedSlot,
    this.onSlotClick,
    this.onEmptySlotClick,
    this.onRemovePlayer,
    this.onPlayerInfoClick,
    this.isReadOnly = false,
    this.showPointsOnly = false,
  });

  @override
  Widget build(BuildContext context) {
    // Group picks by row:
    // Row 1: GKP (Slot 1)
    // Row 2: DEF (Slot 2)
    // Row 3: MID (Slots 3 & 4)
    // Row 4: FWD (Slot 5)
    final gkpSlot = picks.firstWhere((p) => p.slot == 1, orElse: () => SquadSlotModel(slot: 1, position: 1));
    final defSlot = picks.firstWhere((p) => p.slot == 2, orElse: () => SquadSlotModel(slot: 2, position: 2));
    final midSlots = picks.where((p) => p.slot == 3 || p.slot == 4).toList();
    while (midSlots.length < 2) {
      midSlots.add(SquadSlotModel(slot: midSlots.isEmpty ? 3 : 4, position: 3));
    }
    final fwdSlot = picks.firstWhere((p) => p.slot == 5, orElse: () => SquadSlotModel(slot: 5, position: 4));

    return Container(
      width: double.infinity,
      decoration: BoxDecoration(
        gradient: const LinearGradient(
          colors: [Color(0xFF00A859), Color(0xFF008744)],
          begin: Alignment.topCenter,
          end: Alignment.bottomCenter,
        ),
        borderRadius: BorderRadius.circular(20),
        boxShadow: const [
          BoxShadow(
            color: Colors.black26,
            blurRadius: 15,
            offset: Offset(0, 8),
          )
        ],
      ),
      child: Stack(
        children: [
          // Authentic Pitch White Lines
          CustomPaint(
            size: const Size(double.infinity, 490),
            painter: PitchLinesPainter(),
          ),

          // Player Rows
          Padding(
            padding: const EdgeInsets.symmetric(vertical: 14, horizontal: 12),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
              children: [
                // GKP Row
                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [_buildPlayerNode(context, gkpSlot)],
                ),
                const SizedBox(height: 10),

                // DEF Row
                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [_buildPlayerNode(context, defSlot)],
                ),
                const SizedBox(height: 10),

                // MID Row (2 Mids)
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                  children: midSlots.map((m) => _buildPlayerNode(context, m)).toList(),
                ),
                const SizedBox(height: 10),

                // FWD Row
                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [_buildPlayerNode(context, fwdSlot)],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildPlayerNode(BuildContext context, SquadSlotModel slotModel) {
    final isSelected = selectedSlot == slotModel.slot;
    final isEmpty = slotModel.isEmpty;

    if (isEmpty) {
      String posName = 'حارس';
      if (slotModel.position == 2) posName = 'مدافع';
      if (slotModel.position == 3) posName = 'وسط';
      if (slotModel.position == 4) posName = 'مهاجم';

      return GestureDetector(
        onTap: () {
          if (!isReadOnly && onEmptySlotClick != null) {
            onEmptySlotClick!(slotModel.position, slotModel.slot);
          }
        },
        child: Container(
          width: 82,
          decoration: BoxDecoration(
            color: const Color(0x33003C23),
            borderRadius: BorderRadius.circular(12),
            border: Border.all(color: Colors.white60, width: 1.5, style: BorderStyle.solid),
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              // Price placeholder
              Container(
                width: double.infinity,
                padding: const EdgeInsets.symmetric(vertical: 2),
                alignment: Alignment.center,
                child: const Text('£5.0m', style: TextStyle(color: Colors.white70, fontSize: 10, fontWeight: FontWeight.w700)),
              ),
              // Jersey Placeholder Icon
              const Padding(
                padding: EdgeInsets.symmetric(vertical: 4),
                child: Icon(LucideIcons.shirt, color: Colors.white54, size: 28),
              ),
              // White Card Box
              Container(
                width: double.infinity,
                decoration: const BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.vertical(bottom: Radius.circular(10)),
                ),
                child: Column(
                  children: [
                    const Padding(
                      padding: EdgeInsets.symmetric(vertical: 2),
                      child: Text('+ إضافة لاعب', style: TextStyle(color: AppColors.primaryPurple, fontSize: 10, fontWeight: FontWeight.w900)),
                    ),
                    Container(
                      width: double.infinity,
                      padding: const EdgeInsets.symmetric(vertical: 2),
                      decoration: const BoxDecoration(
                        color: Color(0xFFEBEFF4),
                        border: Border(top: BorderSide(color: Color(0xFFCBD5E1))),
                        borderRadius: BorderRadius.vertical(bottom: Radius.circular(10)),
                      ),
                      alignment: Alignment.center,
                      child: Text(posName, style: const TextStyle(color: Color(0xFF1E293B), fontSize: 9, fontWeight: FontWeight.w800)),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      );
    }

    final p = slotModel.player!;
    final bottomText = showPointsOnly || slotModel.points != null
        ? '${slotModel.points ?? p.totalPoints} نقطة'
        : (slotModel.fixtureInfo ?? '${p.teamShort ?? 'PL'} (H)');

    return GestureDetector(
      onTap: () {
        if (!isReadOnly && onSlotClick != null) {
          onSlotClick!(slotModel.slot);
        }
      },
      child: Container(
        width: 86,
        decoration: BoxDecoration(
          color: isSelected ? const Color(0x33FACC15) : Colors.transparent,
          borderRadius: BorderRadius.circular(14),
          border: isSelected ? Border.all(color: const Color(0xFFFACC15), width: 2) : null,
          boxShadow: isSelected
              ? const [BoxShadow(color: Color(0x66FACC15), blurRadius: 10, spreadRadius: 2)]
              : null,
        ),
        child: Stack(
          children: [
            Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                // Top Bar (Price Tag & Captain Badge)
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 4, vertical: 2),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      if (slotModel.isCaptain)
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 5, vertical: 1),
                          decoration: BoxDecoration(
                            color: AppColors.primaryPurple,
                            borderRadius: BorderRadius.circular(4),
                            border: Border.all(color: AppColors.gold, width: 1.2),
                          ),
                          child: const Text('C', style: TextStyle(color: AppColors.accentGreen, fontSize: 9, fontWeight: FontWeight.w900)),
                        )
                      else if (slotModel.isVice)
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 5, vertical: 1),
                          decoration: BoxDecoration(
                            color: const Color(0xFF475569),
                            borderRadius: BorderRadius.circular(4),
                          ),
                          child: const Text('V', style: TextStyle(color: Colors.white, fontSize: 9, fontWeight: FontWeight.w900)),
                        )
                      else
                        const SizedBox(width: 14),

                      Text(
                        p.formattedPrice,
                        style: const TextStyle(color: Colors.white, fontSize: 10, fontWeight: FontWeight.w800, shadows: [Shadow(color: Colors.black54, blurRadius: 4)]),
                      ),

                      if (onPlayerInfoClick != null)
                        GestureDetector(
                          onTap: () => onPlayerInfoClick!(p),
                          child: Container(
                            width: 18,
                            height: 18,
                            decoration: const BoxDecoration(
                              color: Colors.white,
                              shape: BoxShape.circle,
                            ),
                            child: const Icon(LucideIcons.eye, size: 11, color: Color(0xFF0F172A)),
                          ),
                        )
                      else
                        const SizedBox(width: 14),
                    ],
                  ),
                ),

                // Center Jersey
                Padding(
                  padding: const EdgeInsets.symmetric(vertical: 2),
                  child: _buildJersey(p.position, p.teamShort),
                ),

                // Official Dual-Tone Bottom Box (Name on Top, Fixture/Points on Bottom)
                Container(
                  width: double.infinity,
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(10),
                    boxShadow: const [BoxShadow(color: Colors.black12, blurRadius: 4, offset: Offset(0, 2))],
                  ),
                  child: Column(
                    children: [
                      // Player Name Top Row
                      Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 2, vertical: 3),
                        child: Text(
                          p.webName,
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                          textAlign: TextAlign.center,
                          style: const TextStyle(
                            color: AppColors.primaryPurple,
                            fontWeight: FontWeight.w900,
                            fontSize: 10.5,
                          ),
                        ),
                      ),

                      // Fixture / Points Bottom Row (Matching User's Dual-Tone Red/Purple Request)
                      Container(
                        width: double.infinity,
                        padding: const EdgeInsets.symmetric(vertical: 2.5),
                        decoration: BoxDecoration(
                          color: (showPointsOnly || slotModel.points != null)
                              ? AppColors.darkPurple
                              : const Color(0xFFEBEFF4),
                          border: Border(
                            top: BorderSide(
                              color: (showPointsOnly || slotModel.points != null)
                                  ? const Color(0x3300FF85)
                                  : const Color(0xFFCBD5E1),
                            ),
                          ),
                          borderRadius: const BorderRadius.vertical(bottom: Radius.circular(10)),
                        ),
                        alignment: Alignment.center,
                        child: Text(
                          bottomText,
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                          style: TextStyle(
                            color: (showPointsOnly || slotModel.points != null)
                                ? AppColors.accentGreen
                                : const Color(0xFF1E293B),
                            fontWeight: FontWeight.w900,
                            fontSize: 9.5,
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),

            // Remove Button on Top Right in Transfers Mode
            if (!isReadOnly && onRemovePlayer != null)
              Positioned(
                top: 0,
                right: 0,
                child: GestureDetector(
                  onTap: () => onRemovePlayer!(slotModel.slot),
                  child: Container(
                    width: 18,
                    height: 18,
                    decoration: const BoxDecoration(
                      color: AppColors.dangerRed,
                      shape: BoxShape.circle,
                    ),
                    alignment: Alignment.center,
                    child: const Icon(Icons.close, color: Colors.white, size: 12),
                  ),
                ),
              ),
          ],
        ),
      ),
    );
  }

  Widget _buildJersey(int position, String? teamShort) {
    Color jerseyColor = const Color(0xFFDC2626);
    if (position == 1) jerseyColor = const Color(0xFFF59E0B);
    if (teamShort == 'MCI') jerseyColor = const Color(0xFF38BDF8);
    if (teamShort == 'CHE') jerseyColor = const Color(0xFF2563EB);
    if (teamShort == 'NEW') jerseyColor = const Color(0xFF0F172A);
    if (teamShort == 'TOT') jerseyColor = const Color(0xFFF8FAFC);

    return Container(
      width: 42,
      height: 42,
      decoration: BoxDecoration(
        color: jerseyColor,
        shape: BoxShape.circle,
        border: Border.all(color: Colors.white, width: 2),
        boxShadow: const [BoxShadow(color: Colors.black26, blurRadius: 4, offset: Offset(0, 2))],
      ),
      alignment: Alignment.center,
      child: Text(
        teamShort ?? 'PL',
        style: TextStyle(
          color: jerseyColor == const Color(0xFFF8FAFC) ? AppColors.primaryPurple : Colors.white,
          fontSize: 10,
          fontWeight: FontWeight.w900,
        ),
      ),
    );
  }
}

class PitchLinesPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = Colors.white.withOpacity(0.35)
      ..style = PaintingStyle.stroke
      ..strokeWidth = 1.5;

    // Pitch outer boundary
    final rect = Rect.fromLTWH(12, 12, size.width - 24, size.height - 24);
    canvas.drawRRect(RRect.fromRectAndRadius(rect, const Radius.circular(16)), paint);

    // Goal Box Top
    final goalBoxTop = Rect.fromLTWH(size.width / 2 - 45, 12, 90, 45);
    canvas.drawRect(goalBoxTop, paint);

    // Center Circle
    canvas.drawCircle(Offset(size.width / 2, size.height / 2), 48, paint);

    // Center Line
    canvas.drawLine(Offset(12, size.height / 2), Offset(size.width - 12, size.height / 2), paint);
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}
