import 'package:flutter/material.dart';
import '../core/network/api_service.dart';
import '../core/constants/api_constants.dart';
import '../models/user_model.dart';

class AuthProvider extends ChangeNotifier {
  final ApiService _api = ApiService();
  UserModel? _user;
  bool _isLoading = false;
  String? _errorMessage;

  UserModel? get user => _user;
  bool get isAuthenticated => _user != null && _api.token != null;
  bool get isLoading => _isLoading;
  String? get errorMessage => _errorMessage;

  Future<void> checkAuthStatus() async {
    _isLoading = true;
    notifyListeners();

    try {
      await _api.init();
      if (_api.token != null && _api.token!.isNotEmpty) {
        final data = await _api.get(ApiConstants.me);
        if (data != null && data['user'] != null) {
          _user = UserModel.fromJson(data['user']);
        } else {
          await _api.setToken(null);
          _user = null;
        }
      }
    } catch (_) {
      await _api.setToken(null);
      _user = null;
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<bool> login(String email, String password) async {
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      final data = await _api.post(
        ApiConstants.login,
        body: {'email': email.trim(), 'password': password},
      );

      if (data['accessToken'] != null) {
        await _api.setToken(data['accessToken']);
      } else if (data['token'] != null) {
        await _api.setToken(data['token']);
      }

      if (data['user'] != null) {
        _user = UserModel.fromJson(data['user']);
      } else {
        await checkAuthStatus();
      }

      _isLoading = false;
      notifyListeners();
      return true;
    } catch (e) {
      _errorMessage = e.toString();
      _isLoading = false;
      notifyListeners();
      return false;
    }
  }

  Future<bool> register(String email, String password, String teamName) async {
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      final data = await _api.post(
        ApiConstants.register,
        body: {
          'email': email.trim(),
          'password': password,
          'teamName': teamName.trim(),
          'team_name': teamName.trim(),
        },
      );

      if (data['accessToken'] != null) {
        await _api.setToken(data['accessToken']);
      } else if (data['token'] != null) {
        await _api.setToken(data['token']);
      }

      if (data['user'] != null) {
        _user = UserModel.fromJson(data['user']);
      } else {
        await checkAuthStatus();
      }

      _isLoading = false;
      notifyListeners();
      return true;
    } catch (e) {
      _errorMessage = e.toString();
      _isLoading = false;
      notifyListeners();
      return false;
    }
  }

  Future<void> logout() async {
    await _api.setToken(null);
    _user = null;
    notifyListeners();
  }

  Future<void> refreshUser() async {
    try {
      final data = await _api.get(ApiConstants.me);
      if (data != null && data['user'] != null) {
        _user = UserModel.fromJson(data['user']);
        notifyListeners();
      }
    } catch (_) {}
  }
}
