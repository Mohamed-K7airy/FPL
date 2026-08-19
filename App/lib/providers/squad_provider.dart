import 'package:flutter/material.dart';
import '../models/squad_model.dart';
import '../models/player_model.dart';
import '../services/api_service.dart';

class SquadProvider extends ChangeNotifier {
  final ApiService _apiService = ApiService();
  SquadModel? _squad;
  bool _isLoading = false;
  String? _errorMessage;

  SquadModel? get squad => _squad;
  bool get isLoading => _isLoading;
  String? get errorMessage => _errorMessage;

  Future<void> fetchSquad() async {
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      final res = await _apiService.getSquad();
      if (res['squad'] != null) {
        _squad = SquadModel.fromJson(res['squad']);
      } else {
        // Fallback demo squad if fresh user
        _squad = SquadModel(
          gameweek: res['gameweek'] ?? 1,
          startingEleven: [],
          substitutes: [],
          bankBalance: 0.0,
          squadValue: 100.0,
          freeTransfers: 1,
        );
      }
    } catch (e) {
      _errorMessage = 'فشل تحميل بيانات التشكيلة';
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  void toggleCaptain(PlayerModel player) {
    if (_squad == null) return;
    
    final updatedStarters = _squad!.startingEleven.map((p) {
      if (p.id == player.id) {
        return p.copyWith(isCaptain: true, isViceCaptain: false);
      } else if (p.isCaptain) {
        return p.copyWith(isCaptain: false, isViceCaptain: true);
      }
      return p;
    }).toList();

    _squad = SquadModel(
      gameweek: _squad!.gameweek,
      startingEleven: updatedStarters,
      substitutes: _squad!.substitutes,
      bankBalance: _squad!.bankBalance,
      squadValue: _squad!.squadValue,
      freeTransfers: _squad!.freeTransfers,
    );

    notifyListeners();
  }
}
