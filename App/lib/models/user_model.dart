class UserModel {
  final String id;
  final String email;
  final String? teamName;
  final String? managerName;
  final int totalPoints;
  final int overallRank;

  UserModel({
    required this.id,
    required this.email,
    this.teamName,
    this.managerName,
    this.totalPoints = 0,
    this.overallRank = 0,
  });

  factory UserModel.fromJson(Map<String, dynamic> json) {
    return UserModel(
      id: json['id']?.toString() ?? '',
      email: json['email'] ?? '',
      teamName: json['team_name'] ?? json['teamName'],
      managerName: json['manager_name'] ?? json['managerName'],
      totalPoints: json['total_points'] ?? json['totalPoints'] ?? 0,
      overallRank: json['overall_rank'] ?? json['overallRank'] ?? 0,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'email': email,
      'teamName': teamName,
      'managerName': managerName,
      'totalPoints': totalPoints,
      'overallRank': overallRank,
    };
  }
}
