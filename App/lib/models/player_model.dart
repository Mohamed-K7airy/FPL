class PlayerModel {
  final int id;
  final String webName;
  final String firstName;
  final String secondName;
  final int elementType; // 1: GKP, 2: DEF, 3: MID, 4: FWD
  final int team;
  final String teamName;
  final double nowCost;
  final int totalPoints;
  final int eventPoints;
  final String photo;
  final bool isCaptain;
  final bool isViceCaptain;
  final bool isSub;
  final int position;

  PlayerModel({
    required this.id,
    required this.webName,
    required this.firstName,
    required this.secondName,
    required this.elementType,
    required this.team,
    required this.teamName,
    required this.nowCost,
    required this.totalPoints,
    this.eventPoints = 0,
    required this.photo,
    this.isCaptain = false,
    this.isViceCaptain = false,
    this.isSub = false,
    this.position = 0,
  });

  factory PlayerModel.fromJson(Map<String, dynamic> json) {
    return PlayerModel(
      id: json['id'] is int ? json['id'] : int.parse(json['id'].toString()),
      webName: json['web_name'] ?? json['webName'] ?? '',
      firstName: json['first_name'] ?? json['firstName'] ?? '',
      secondName: json['second_name'] ?? json['secondName'] ?? '',
      elementType: json['element_type'] ?? json['elementType'] ?? 1,
      team: json['team'] ?? 1,
      teamName: json['team_name'] ?? json['teamName'] ?? 'Team',
      nowCost: ((json['now_cost'] ?? json['nowCost'] ?? 50) as num).toDouble() / 10.0,
      totalPoints: json['total_points'] ?? json['totalPoints'] ?? 0,
      eventPoints: json['event_points'] ?? json['eventPoints'] ?? 0,
      photo: json['photo'] ?? '',
      isCaptain: json['is_captain'] ?? json['isCaptain'] ?? false,
      isViceCaptain: json['is_vice_captain'] ?? json['isViceCaptain'] ?? false,
      isSub: json['is_sub'] ?? json['isSub'] ?? false,
      position: json['position'] ?? 0,
    );
  }

  String get positionName {
    switch (elementType) {
      case 1:
        return 'GKP';
      case 2:
        return 'DEF';
      case 3:
        return 'MID';
      case 4:
        return 'FWD';
      default:
        return 'SUB';
    }
  }

  PlayerModel copyWith({
    bool? isCaptain,
    bool? isViceCaptain,
    bool? isSub,
    int? position,
  }) {
    return PlayerModel(
      id: id,
      webName: webName,
      firstName: firstName,
      secondName: secondName,
      elementType: elementType,
      team: team,
      teamName: teamName,
      nowCost: nowCost,
      totalPoints: totalPoints,
      eventPoints: eventPoints,
      photo: photo,
      isCaptain: isCaptain ?? this.isCaptain,
      isViceCaptain: isViceCaptain ?? this.isViceCaptain,
      isSub: isSub ?? this.isSub,
      position: position ?? this.position,
    );
  }
}
