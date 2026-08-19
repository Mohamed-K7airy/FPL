class LeagueStandingModel {
  final int rank;
  final dynamic userId;
  final String teamName;
  final int totalPoints;
  final int gwPoints;

  LeagueStandingModel({
    required this.rank,
    required this.userId,
    required this.teamName,
    required this.totalPoints,
    required this.gwPoints,
  });

  factory LeagueStandingModel.fromJson(Map<String, dynamic> json) {
    return LeagueStandingModel(
      rank: json['rank'] ?? 1,
      userId: json['user_id'] ?? json['userId'],
      teamName: json['team_name'] ?? json['teamName'] ?? 'Team',
      totalPoints: json['total_points'] ?? json['totalPoints'] ?? 0,
      gwPoints: json['gw_points'] ?? json['gwPoints'] ?? 0,
    );
  }
}

class LeagueModel {
  final dynamic id;
  final String name;
  final String code;
  final dynamic createdBy;
  final int? membersCount;
  final int? userRank;
  final List<LeagueStandingModel> standings;

  LeagueModel({
    required this.id,
    required this.name,
    required this.code,
    this.createdBy,
    this.membersCount,
    this.userRank,
    this.standings = const [],
  });

  factory LeagueModel.fromJson(Map<String, dynamic> json) {
    final list = (json['standings'] as List<dynamic>?)
            ?.map((e) => LeagueStandingModel.fromJson(e as Map<String, dynamic>))
            .toList() ??
        [];

    return LeagueModel(
      id: json['id'],
      name: json['name'] ?? 'League',
      code: json['code'] ?? '',
      createdBy: json['created_by'],
      membersCount: json['members_count'] ?? (list.isNotEmpty ? list.length : 1),
      userRank: json['user_rank'] ?? 1,
      standings: list,
    );
  }
}
