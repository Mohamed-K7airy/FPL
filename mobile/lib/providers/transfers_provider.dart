import 'package:flutter/material.dart';
import '../core/network/api_service.dart';
import '../core/constants/api_constants.dart';
import '../models/player_model.dart';
import '../models/squad_slot_model.dart';

class TransfersProvider extends ChangeNotifier {
  final ApiService _api = ApiService();

  List<PlayerModel> _players = [];
  bool _isLoadingPlayers = false;
  bool _isSubmitting = false;
  String _searchQuery = '';
  int? _positionFilter;
  String _sort = 'total_points';
  int _gw = 1;

  bool _isWildcardActive = false;
  bool _isFreeHitActive = false;
  bool _activatingChip = false;
  bool _hasExistingSquad = false;

  // 5 Slots on Pitch (1: GKP, 2: DEF, 3: MID, 4: MID, 5: FWD)
  Map<int, SquadSlotModel> _squadSlots = {
    1: SquadSlotModel(slot: 1, position: 1),
    2: SquadSlotModel(slot: 2, position: 2),
    3: SquadSlotModel(slot: 3, position: 3),
    4: SquadSlotModel(slot: 4, position: 3),
    5: SquadSlotModel(slot: 5, position: 4),
  };

  int? _selectedSlot;

  // Getters
  List<PlayerModel> get players => _players;
  bool get isLoadingPlayers => _isLoadingPlayers;
  bool get isSubmitting => _isSubmitting;
  String get searchQuery => _searchQuery;
  int? get positionFilter => _positionFilter;
  String get sort => _sort;
  int get gw => _gw;
  bool get isWildcardActive => _isWildcardActive;
  bool get isFreeHitActive => _isFreeHitActive;
  bool get activatingChip => _activatingChip;
  bool get hasExistingSquad => _hasExistingSquad;
  Map<int, SquadSlotModel> get squadSlots => _squadSlots;
  int? get selectedSlot => _selectedSlot;

  List<SquadSlotModel> get pitchPicks => _squadSlots.values.toList()..sort((a, b) => a.slot.compareTo(b.slot));

  int get filledCount => _squadSlots.values.where((s) => !s.isEmpty).length;
  bool get isSquadComplete => filledCount == 5;

  int get totalSquadCost => _squadSlots.values
      .where((s) => !s.isEmpty)
      .fold(0, (sum, s) => sum + (s.player?.nowCost ?? 0));

  double get remainingBudget => (500 - totalSquadCost) / 10.0;
  String get formattedRemainingBudget => '£${remainingBudget.toStringAsFixed(1)}m';

  void setSelectedSlot(int? slot) {
    _selectedSlot = slot;
    if (slot != null && _squadSlots.containsKey(slot)) {
      _positionFilter = _squadSlots[slot]!.position;
    }
    notifyListeners();
  }

  void setSearchQuery(String query) {
    _searchQuery = query;
    fetchPlayers();
  }

  void setPositionFilter(int? pos) {
    _positionFilter = pos;
    fetchPlayers();
  }

  void setSort(String s) {
    _sort = s;
    fetchPlayers();
  }

  void resetFilters() {
    _searchQuery = '';
    _positionFilter = null;
    _sort = 'total_points';
    fetchPlayers();
  }

  void setGw(int g) {
    _gw = g;
    notifyListeners();
  }

  Future<void> init() async {
    await Future.wait([
      fetchPlayers(),
      fetchExistingSquad(),
      fetchActiveChips(),
    ]);
  }

  Future<void> fetchPlayers() async {
    _isLoadingPlayers = true;
    notifyListeners();

    try {
      final queryParams = <String, dynamic>{
        'limit': '150',
        'sort': _sort,
      };
      if (_searchQuery.trim().isNotEmpty) {
        queryParams['search'] = _searchQuery.trim();
      }
      if (_positionFilter != null) {
        queryParams['position'] = _positionFilter.toString();
      }

      final data = await _api.get(ApiConstants.players, queryParams: queryParams);
      if (data != null && data['players'] is List) {
        _players = (data['players'] as List)
            .map((e) => PlayerModel.fromJson(e as Map<String, dynamic>))
            .toList();
      }
    } catch (_) {
      _players = [];
    } finally {
      _isLoadingPlayers = false;
      notifyListeners();
    }
  }

  Future<void> fetchExistingSquad() async {
    try {
      final data = await _api.get(ApiConstants.squad);
      if (data != null && data['squad'] is List && (data['squad'] as List).isNotEmpty) {
        _hasExistingSquad = true;
        final list = data['squad'] as List;

        final newSlots = <int, SquadSlotModel>{
          1: SquadSlotModel(slot: 1, position: 1),
          2: SquadSlotModel(slot: 2, position: 2),
          3: SquadSlotModel(slot: 3, position: 3),
          4: SquadSlotModel(slot: 4, position: 3),
          5: SquadSlotModel(slot: 5, position: 4),
        };

        for (var item in list) {
          final slotNum = item['slot'] ?? 1;
          if (newSlots.containsKey(slotNum)) {
            final pData = item['players'] != null
                ? PlayerModel.fromJson(item['players'])
                : PlayerModel(
                    id: item['player_id'],
                    webName: 'Player',
                    fullName: 'Player',
                    position: newSlots[slotNum]!.position,
                    nowCost: item['purchase_price'] ?? 50,
                    totalPoints: 0,
                  );

            newSlots[slotNum] = newSlots[slotNum]!.copyWith(
              player: pData,
              isCaptain: item['is_captain'] ?? false,
              isVice: item['is_vice'] ?? false,
            );
          }
        }
        _squadSlots = newSlots;
        notifyListeners();
      }
    } catch (_) {}
  }

  Future<void> fetchActiveChips() async {
    try {
      final data = await _api.get(ApiConstants.chips);
      if (data != null && data['chips'] is List) {
        final list = data['chips'] as List;
        _isWildcardActive = list.any((c) => c['chip'] == 'wildcard' && c['is_active'] == true);
        _isFreeHitActive = list.any((c) => c['chip'] == 'freehit' && c['is_active'] == true);
        notifyListeners();
      }
    } catch (_) {}
  }

  bool isPlayerSelected(int playerId) {
    return _squadSlots.values.any((s) => s.player?.id == playerId);
  }

  bool addOrTogglePlayer(PlayerModel player) {
    // If player is already selected, remove him
    for (var entry in _squadSlots.entries) {
      if (entry.value.player?.id == player.id) {
        _squadSlots[entry.key] = entry.value.copyWith(clearPlayer: true, isCaptain: false, isVice: false);
        notifyListeners();
        return true;
      }
    }

    int? targetSlot = _selectedSlot;

    // Position routing rule: GKP goes to slot 1, Outfielders go to slots 2..5
    if (player.position == 1) {
      targetSlot = 1;
    } else {
      if (targetSlot == null || targetSlot == 1 || !_squadSlots[targetSlot]!.isEmpty) {
        final emptyOutfield = [2, 3, 4, 5].firstWhere(
          (s) => _squadSlots[s]!.isEmpty,
          orElse: () => -1,
        );
        if (emptyOutfield == -1) {
          return false; // Squad full
        }
        targetSlot = emptyOutfield;
      }
    }

    final currentFilled = filledCount;
    final isFirst = currentFilled == 0;
    final isSecond = currentFilled == 1;

    _squadSlots[targetSlot] = _squadSlots[targetSlot]!.copyWith(
      player: player,
      isCaptain: isFirst,
      isVice: isSecond,
    );

    _selectedSlot = null;
    notifyListeners();
    return true;
  }

  void removePlayerFromSlot(int slot) {
    if (_squadSlots.containsKey(slot)) {
      _squadSlots[slot] = _squadSlots[slot]!.copyWith(clearPlayer: true, isCaptain: false, isVice: false);
      notifyListeners();
    }
  }

  void setCaptain(int slot) {
    if (!_squadSlots.containsKey(slot) || _squadSlots[slot]!.isEmpty) return;

    final newSlots = <int, SquadSlotModel>{};
    for (var entry in _squadSlots.entries) {
      final isCapt = entry.key == slot;
      final isVc = isCapt ? false : entry.value.isVice;
      newSlots[entry.key] = entry.value.copyWith(isCaptain: isCapt, isVice: isVc);
    }
    _squadSlots = newSlots;
    notifyListeners();
  }

  void setViceCaptain(int slot) {
    if (!_squadSlots.containsKey(slot) || _squadSlots[slot]!.isEmpty) return;
    if (_squadSlots[slot]!.isCaptain) return; // Cannot be both

    final newSlots = <int, SquadSlotModel>{};
    for (var entry in _squadSlots.entries) {
      final isVc = entry.key == slot;
      newSlots[entry.key] = entry.value.copyWith(isVice: isVc);
    }
    _squadSlots = newSlots;
    notifyListeners();
  }

  Future<bool> activateChip(String chipKey) async {
    _activatingChip = true;
    notifyListeners();

    try {
      await _api.post(ApiConstants.activateChip, body: {'chip': chipKey, 'gw': _gw});
      if (chipKey == 'wildcard') _isWildcardActive = true;
      if (chipKey == 'freehit') _isFreeHitActive = true;
      _activatingChip = false;
      notifyListeners();
      return true;
    } catch (_) {
      _activatingChip = false;
      notifyListeners();
      return false;
    }
  }

  Future<bool> deactivateChip(String chipKey) async {
    _activatingChip = true;
    notifyListeners();

    try {
      await _api.post(ApiConstants.deactivateChip, body: {'chip': chipKey, 'gw': _gw});
      if (chipKey == 'wildcard') _isWildcardActive = false;
      if (chipKey == 'freehit') _isFreeHitActive = false;
      _activatingChip = false;
      notifyListeners();
      return true;
    } catch (_) {
      _activatingChip = false;
      notifyListeners();
      return false;
    }
  }

  Future<String?> submitSquad() async {
    if (!isSquadComplete) {
      return 'يرجى اختيار 5 لاعبين لاكتمال التشكيلة';
    }

    _isSubmitting = true;
    notifyListeners();

    try {
      // Find or assign captain and vice
      int captainSlot = _squadSlots.entries.firstWhere((e) => e.value.isCaptain, orElse: () => _squadSlots.entries.first).key;
      int viceSlot = _squadSlots.entries.firstWhere((e) => e.value.isVice && e.key != captainSlot, orElse: () => _squadSlots.entries.firstWhere((e) => e.key != captainSlot)).key;

      final picks = _squadSlots.entries.map((entry) => {
        'player_id': entry.value.player!.id,
        'slot': entry.key,
        'is_captain': entry.key == captainSlot,
        'is_vice': entry.key == viceSlot,
      }).toList();

      await _api.post(ApiConstants.squad, body: {'picks': picks});
      _hasExistingSquad = true;
      _isSubmitting = false;
      notifyListeners();
      return null; // Success with 0 error
    } catch (e) {
      _isSubmitting = false;
      notifyListeners();
      return e.toString();
    }
  }
}
