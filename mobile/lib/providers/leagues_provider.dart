import 'package:flutter/material.dart';
import '../core/network/api_service.dart';
import '../core/constants/api_constants.dart';
import '../models/league_model.dart';

class LeaguesProvider extends ChangeNotifier {
  final ApiService _api = ApiService();

  List<LeagueModel> _leagues = [];
  LeagueModel? _selectedLeague;
  bool _isLoading = false;
  String? _errorMessage;

  List<LeagueModel> get leagues => _leagues;
  LeagueModel? get selectedLeague => _selectedLeague;
  bool get isLoading => _isLoading;
  String? get errorMessage => _errorMessage;

  Future<void> fetchLeagues() async {
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      final data = await _api.get(ApiConstants.leagues);
      if (data != null && data['leagues'] is List) {
        _leagues = (data['leagues'] as List)
            .map((e) => LeagueModel.fromJson(e as Map<String, dynamic>))
            .toList();
      }
    } catch (e) {
      _errorMessage = e.toString();
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> fetchLeagueDetails(dynamic leagueId) async {
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      final data = await _api.get('${ApiConstants.leagues}/$leagueId');
      if (data != null && data['league'] != null) {
        _selectedLeague = LeagueModel.fromJson(data['league']);
      }
    } catch (e) {
      _errorMessage = e.toString();
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<String?> createLeague(String name) async {
    try {
      final data = await _api.post(ApiConstants.leagues, body: {'name': name.trim()});
      await fetchLeagues();
      return data?['league']?['code']?.toString();
    } catch (e) {
      return null;
    }
  }

  Future<bool> joinLeague(String code) async {
    try {
      await _api.post('${ApiConstants.leagues}/join', body: {'code': code.trim()});
      await fetchLeagues();
      return true;
    } catch (_) {
      return false;
    }
  }
}
