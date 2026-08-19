import 'player_model.dart';

class SquadSlotModel {
  final int slot;
  final int position; // 1 GKP, 2 DEF, 3 MID, 4 FWD
  final PlayerModel? player;
  final bool isCaptain;
  final bool isVice;
  final int? points;
  final String? fixtureInfo;

  SquadSlotModel({
    required this.slot,
    required this.position,
    this.player,
    this.isCaptain = false,
    this.isVice = false,
    this.points,
    this.fixtureInfo,
  });

  bool get isEmpty => player == null;

  SquadSlotModel copyWith({
    int? slot,
    int? position,
    PlayerModel? player,
    bool? isCaptain,
    bool? isVice,
    int? points,
    String? fixtureInfo,
    bool clearPlayer = false,
  }) {
    return SquadSlotModel(
      slot: slot ?? this.slot,
      position: position ?? this.position,
      player: clearPlayer ? null : (player ?? this.player),
      isCaptain: isCaptain ?? this.isCaptain,
      isVice: isVice ?? this.isVice,
      points: points ?? this.points,
      fixtureInfo: fixtureInfo ?? this.fixtureInfo,
    );
  }
}
