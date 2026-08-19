import 'player_model.dart';

class SquadModel {
  final int gameweek;
  final List<PlayerModel> startingEleven;
  final List<PlayerModel> substitutes;
  final double bankBalance;
  final double squadValue;
  final int freeTransfers;

  SquadModel({
    required this.gameweek,
    required this.startingEleven,
    required this.substitutes,
    required this.bankBalance,
    required this.squadValue,
    required this.freeTransfers,
  });

  factory SquadModel.fromJson(Map<String, dynamic> json) {
    List<PlayerModel> starters = [];
    List<PlayerModel> subs = [];

    if (json['players'] != null && json['players'] is List) {
      for (var item in json['players']) {
        final player = PlayerModel.fromJson(item);
        if (player.isSub) {
          subs.add(player);
        } else {
          starters.add(player);
        }
      }
    }

    return SquadModel(
      gameweek: json['gameweek'] ?? 1,
      startingEleven: starters,
      substitutes: subs,
      bankBalance: ((json['bank'] ?? 0) as num).toDouble() / 10.0,
      squadValue: ((json['value'] ?? 1000) as num).toDouble() / 10.0,
      freeTransfers: json['freeTransfers'] ?? json['free_transfers'] ?? 1,
    );
  }
}
