import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../config/constants.dart';
import '../providers/squad_provider.dart';
import '../models/player_model.dart';

class PitchViewScreen extends StatefulWidget {
  const PitchViewScreen({super.key});

  @override
  State<PitchViewScreen> createState() => _PitchViewScreenState();
}

class _PitchViewScreenState extends State<PitchViewScreen> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      Provider.of<SquadProvider>(context, listen: false).fetchSquad();
    });
  }

  @override
  Widget build(BuildContext context) {
    final squadProvider = Provider.of<SquadProvider>(context);
    final squad = squadProvider.squad;

    return Scaffold(
      backgroundColor: AppConstants.darkBackground,
      appBar: AppBar(
        backgroundColor: AppConstants.primaryPurple,
        title: Text(
          squad != null ? 'تشكيلتك (الجولة ${squad.gameweek})' : 'تشكيلتي',
          style: const TextStyle(color: AppConstants.primaryGreen, fontWeight: FontWeight.bold),
        ),
        centerTitle: true,
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh, color: AppConstants.primaryGreen),
            onPressed: () => squadProvider.fetchSquad(),
          ),
        ],
      ),
      body: squadProvider.isLoading
          ? const Center(child: CircularProgressIndicator(color: AppConstants.primaryGreen))
          : squad == null
              ? const Center(child: Text('تعذر تحميل البيانات', style: TextStyle(color: Colors.white)))
              : SingleChildScrollView(
                  child: Column(
                    children: [
                      // Header Stats Bar
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                        color: AppConstants.cardBackground,
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.spaceAround,
                          children: [
                            _buildStatTile('الميزانية', '£${squad.bankBalance}m'),
                            _buildStatTile('قيمة الفريق', '£${squad.squadValue}m'),
                            _buildStatTile('الانتقالات المجانية', '${squad.freeTransfers}'),
                          ],
                        ),
                      ),
                      const SizedBox(height: 10),

                      // Football Pitch Container
                      Container(
                        margin: const EdgeInsets.symmetric(horizontal: 12),
                        height: 480,
                        decoration: BoxDecoration(
                          color: AppConstants.pitchGreen,
                          borderRadius: BorderRadius.circular(16),
                          border: Border.all(color: AppConstants.primaryGreen.withOpacity(0.4), width: 2),
                          boxShadow: const [
                            BoxShadow(color: Colors.black45, blurRadius: 10, offset: Offset(0, 4)),
                          ],
                        ),
                        child: Stack(
                          children: [
                            // Pitch Lines
                            Center(
                              child: Container(
                                height: 1,
                                color: AppConstants.pitchLine,
                              ),
                            ),
                            Center(
                              child: Container(
                                width: 100,
                                height: 100,
                                decoration: BoxDecoration(
                                  shape: BoxShape.circle,
                                  border: Border.all(color: AppConstants.pitchLine, width: 1.5),
                                ),
                              ),
                            ),

                            // Pitch Player Rows (GKP, DEF, MID, FWD)
                            Column(
                              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                              children: [
                                _buildPlayerRow(squad.startingEleven.where((p) => p.elementType == 1).toList()),
                                _buildPlayerRow(squad.startingEleven.where((p) => p.elementType == 2).toList()),
                                _buildPlayerRow(squad.startingEleven.where((p) => p.elementType == 3).toList()),
                                _buildPlayerRow(squad.startingEleven.where((p) => p.elementType == 4).toList()),
                              ],
                            ),
                          ],
                        ),
                      ),

                      // Substitutes Bench Container
                      Container(
                        margin: const EdgeInsets.all(12),
                        padding: const EdgeInsets.all(12),
                        decoration: BoxDecoration(
                          color: AppConstants.cardBackground,
                          borderRadius: BorderRadius.circular(14),
                        ),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const Text(
                              'دكة البدلاء (Substitutes)',
                              style: TextStyle(color: AppConstants.primaryGreen, fontWeight: FontWeight.bold),
                            ),
                            const SizedBox(height: 10),
                            Row(
                              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                              children: squad.substitutes.map((player) => _buildPlayerCard(player, isBench: true)).toList(),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
    );
  }

  Widget _buildStatTile(String label, String value) {
    return Column(
      children: [
        Text(label, style: const TextStyle(color: AppConstants.textSecondary, fontSize: 11)),
        const SizedBox(height: 2),
        Text(value, style: const TextStyle(color: AppConstants.primaryGreen, fontWeight: FontWeight.bold, fontSize: 15)),
      ],
    );
  }

  Widget _buildPlayerRow(List<PlayerModel> players) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceEvenly,
      children: players.map((player) => _buildPlayerCard(player)).toList(),
    );
  }

  Widget _buildPlayerCard(PlayerModel player, {bool isBench = false}) {
    final squadProvider = Provider.of<SquadProvider>(context, listen: false);

    return GestureDetector(
      onTap: () {
        if (!isBench) {
          squadProvider.toggleCaptain(player);
        }
      },
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Stack(
            clipBehavior: Clip.none,
            children: [
              // Shirt Icon / Player Avatar
              Container(
                width: 38,
                height: 38,
                decoration: BoxDecoration(
                  color: isBench ? Colors.grey.shade800 : AppConstants.primaryPurple,
                  shape: BoxShape.circle,
                  border: Border.all(
                    color: player.isCaptain ? AppConstants.primaryGreen : Colors.white24,
                    width: player.isCaptain ? 2 : 1,
                  ),
                ),
                child: const Icon(Icons.person, color: Colors.white, size: 22),
              ),
              // Captain Badge (C)
              if (player.isCaptain)
                Positioned(
                  top: -4,
                  right: -4,
                  child: Container(
                    padding: const EdgeInsets.all(3),
                    decoration: const BoxDecoration(
                      color: AppConstants.primaryGreen,
                      shape: BoxShape.circle,
                    ),
                    child: const Text(
                      'C',
                      style: TextStyle(color: Colors.black, fontWeight: FontWeight.bold, fontSize: 9),
                    ),
                  ),
                ),
            ],
          ),
          const SizedBox(height: 3),
          // Player Name Label
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
            decoration: BoxDecoration(
              color: Colors.black87,
              borderRadius: BorderRadius.circular(4),
            ),
            child: Text(
              player.webName.isNotEmpty ? player.webName : 'لاعب',
              style: const TextStyle(color: Colors.white, fontSize: 10, fontWeight: FontWeight.w600),
              overflow: TextOverflow.ellipsis,
            ),
          ),
          // Player Price / Points
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 4, vertical: 1),
            decoration: const BoxDecoration(
              color: AppConstants.surfaceColor,
              borderRadius: BorderRadius.only(
                bottomLeft: Radius.circular(4),
                bottomRight: Radius.circular(4),
              ),
            ),
            child: Text(
              '£${player.nowCost}m',
              style: const TextStyle(color: AppConstants.primaryGreen, fontSize: 9),
            ),
          ),
        ],
      ),
    );
  }
}
