import 'package:flutter/material.dart';
import '../core/network/api_service.dart';
import '../core/constants/api_constants.dart';
import '../models/points_model.dart';
import '../models/squad_slot_model.dart';

class PointsProvider extends ChangeNotifier {
  final ApiService _api = ApiService();

  GameweekPointsModel? _gwPoints;
  bool _isLoading = false;
  int _currentGw = 1;
  String? _errorMessage;

  GameweekPointsModel? get gwPoints => _gwPoints;
  bool get isLoading => _isLoading;
  int get currentGw => _currentGw;
  String? get errorMessage => _errorMessage;

  List<SquadSlotModel> get pitchPicks {
    if (_gwPoints == null || _gwPoints!.picks.isEmpty) {
      return [
        SquadSlotModel(slot: 1, position: 1),
        SquadSlotModel(slot: 2, position: 2),
        SquadSlotModel(slot: 3, position: 3),
        SquadSlotModel(slot: 4, position: 3),
        SquadSlotModel(slot: 5, position: 4),
      ];
    }

    return _gwPoints!.picks.map((pick) {
      return SquadSlotModel(
        slot: pick.slot,
        position: pick.player.position,
        player: pick.player,
        isCaptain: pick.isCaptain,
        isVice: pick.isVice,
        points: pick.calculatedPoints,
      );
    }).toList()..sort((a, b) => a.slot.compareTo(b.slot));
  }

  void setGw(int gw) {
    if (gw < 1 || gw > 38) return;
    _currentGw = gw;
    fetchPoints();
  }

  Future<void> fetchPoints() async {
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      final data = await _api.get('${ApiConstants.points}/$_currentGw');
      if (data != null) {
        _gwPoints = GameweekPointsModel.fromJson(data);
      }
    } catch (e) {
      _errorMessage = e.toString();
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }
}
