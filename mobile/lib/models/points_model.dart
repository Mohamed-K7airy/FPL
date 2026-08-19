import 'player_model.dart';

class GwPickPointModel {
  final int slot;
  final int playerId;
  final bool isCaptain;
  final bool isVice;
  final int multiplier;
  final int rawPoints;
  final int calculatedPoints;
  final PlayerModel player;

  GwPickPointModel({
    required this.slot,
    required this.playerId,
    required this.isCaptain,
    required this.isVice,
    required this.multiplier,
    required this.rawPoints,
    required this.calculatedPoints,
    required this.player,
  });

  factory GwPickPointModel.fromJson(Map<String, dynamic> json) {
    final pData = json['players'] != null
        ? PlayerModel.fromJson(json['players'])
        : PlayerModel(
            id: json['player_id'] ?? 0,
            webName: json['web_name'] ?? 'Player',
            fullName: json['full_name'] ?? 'Player',
            position: json['position'] ?? 2,
            nowCost: json['now_cost'] ?? 50,
            totalPoints: json['total_points'] ?? 0,
          );

    return GwPickPointModel(
      slot: json['slot'] ?? 1,
      playerId: json['player_id'] ?? 0,
      isCaptain: json['is_captain'] ?? false,
      isVice: json['is_vice'] ?? false,
      multiplier: json['multiplier'] ?? 1,
      rawPoints: json['raw_points'] ?? (json['points'] != null && (json['multiplier'] ?? 1) > 0 ? (json['points'] / (json['multiplier'] ?? 1)).round() : 0),
      calculatedPoints: json['calculated_points'] ?? json['points'] ?? 0,
      player: pData,
    );
  }
}

class GameweekPointsModel {
  final int gw;
  final int userScore;
  final int avgScore;
  final int highestScore;
  final int rank;
  final bool isTripleCaptainActive;
  final bool isBenchBoostActive;
  final List<GwPickPointModel> picks;

  GameweekPointsModel({
    required this.gw,
    required this.userScore,
    required this.avgScore,
    required this.highestScore,
    required this.rank,
    this.isTripleCaptainActive = false,
    this.isBenchBoostActive = false,
    this.picks = const [],
  });

  factory GameweekPointsModel.fromJson(Map<String, dynamic> json) {
    final picksList = (json['picks'] as List<dynamic>?)
            ?.map((e) => GwPickPointModel.fromJson(e as Map<String, dynamic>))
            .toList() ??
        [];

    return GameweekPointsModel(
      gw: json['gw'] ?? 1,
      userScore: json['user_score'] ?? json['userScore'] ?? json['total_points'] ?? 0,
      avgScore: json['avg_score'] ?? json['avgScore'] ?? 0,
      highestScore: json['highest_score'] ?? json['highestScore'] ?? 0,
      rank: json['rank'] ?? 1,
      isTripleCaptainActive: json['is_triple_captain_active'] ?? json['isTripleCaptainActive'] ?? false,
      isBenchBoostActive: json['is_bench_boost_active'] ?? json['isBenchBoostActive'] ?? false,
      picks: picksList,
    );
  }
}
