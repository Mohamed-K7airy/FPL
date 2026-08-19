class PlayerModel {
  final int id;
  final String webName;
  final String fullName;
  final int position; // 1 GKP, 2 DEF, 3 MID, 4 FWD
  final int nowCost; // 75 = £7.5m
  final int totalPoints;
  final String? teamName;
  final String? teamShort;
  final int? goals;
  final int? assists;
  final int? cleanSheets;
  final int? bonus;
  final String? form;
  final String? status;
  final String? news;
  final int? chanceOfPlaying;

  PlayerModel({
    required this.id,
    required this.webName,
    required this.fullName,
    required this.position,
    required this.nowCost,
    required this.totalPoints,
    this.teamName,
    this.teamShort,
    this.goals,
    this.assists,
    this.cleanSheets,
    this.bonus,
    this.form,
    this.status,
    this.news,
    this.chanceOfPlaying,
  });

  String get formattedPrice => '£${(nowCost / 10).toStringAsFixed(1)}m';

  String get positionNameAr {
    switch (position) {
      case 1:
        return 'حارس';
      case 2:
        return 'مدافع';
      case 3:
        return 'وسط';
      case 4:
        return 'مهاجم';
      default:
        return 'لاعب';
    }
  }

  String get positionNameEn {
    switch (position) {
      case 1:
        return 'GKP';
      case 2:
        return 'DEF';
      case 3:
        return 'MID';
      case 4:
        return 'FWD';
      default:
        return 'PLY';
    }
  }

  factory PlayerModel.fromJson(Map<String, dynamic> json) {
    String? tName;
    String? tShort;
    if (json['fpl_teams'] is Map) {
      tName = json['fpl_teams']['name'];
      tShort = json['fpl_teams']['short_name'];
    } else if (json['teams'] is Map) {
      tName = json['teams']['name'];
      tShort = json['teams']['short_name'];
    } else {
      tName = json['team_name'] ?? json['teamName'];
      tShort = json['team_short'] ?? json['teamShort'];
    }

    return PlayerModel(
      id: json['id'] ?? json['player_id'] ?? 0,
      webName: json['web_name'] ?? json['webName'] ?? 'Player',
      fullName: json['full_name'] ?? json['fullName'] ?? 'Player',
      position: json['position'] ?? 2,
      nowCost: json['now_cost'] ?? json['nowCost'] ?? 50,
      totalPoints: json['total_points'] ?? json['totalPoints'] ?? 0,
      teamName: tName,
      teamShort: tShort,
      goals: json['goals'] ?? json['goals_scored'] ?? 0,
      assists: json['assists'] ?? 0,
      cleanSheets: json['clean_sheets'] ?? 0,
      bonus: json['bonus'] ?? 0,
      form: json['form']?.toString() ?? '0.0',
      status: json['status'],
      news: json['news'],
      chanceOfPlaying: json['chance_of_playing'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'web_name': webName,
      'full_name': fullName,
      'position': position,
      'now_cost': nowCost,
      'total_points': totalPoints,
      'team_name': teamName,
      'team_short': teamShort,
      'goals': goals,
      'assists': assists,
      'clean_sheets': cleanSheets,
      'bonus': bonus,
      'form': form,
      'status': status,
      'news': news,
      'chance_of_playing': chanceOfPlaying,
    };
  }
}
