class UserModel {
  final dynamic id;
  final String email;
  final String teamName;
  final String? role;
  final int? rank;
  final int? totalPoints;
  final int? freeTransfers;
  final int? budgetRemaining;

  UserModel({
    required this.id,
    required this.email,
    required this.teamName,
    this.role,
    this.rank,
    this.totalPoints,
    this.freeTransfers,
    this.budgetRemaining,
  });

  factory UserModel.fromJson(Map<String, dynamic> json) {
    return UserModel(
      id: json['id'],
      email: json['email'] ?? '',
      teamName: json['team_name'] ?? json['teamName'] ?? 'My Team',
      role: json['role'],
      rank: json['rank'] ?? 1,
      totalPoints: json['total_points'] ?? json['totalPoints'] ?? 0,
      freeTransfers: json['free_transfers'] ?? json['freeTransfers'] ?? 1,
      budgetRemaining: json['budget_remaining'] ?? json['budgetRemaining'] ?? 500,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'email': email,
      'team_name': teamName,
      'role': role,
      'rank': rank,
      'total_points': totalPoints,
      'free_transfers': freeTransfers,
      'budget_remaining': budgetRemaining,
    };
  }
}
