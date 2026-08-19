import 'dart:convert';
import 'package:dio/dio.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../config/constants.dart';

class ApiService {
  late final Dio _dio;

  ApiService() {
    _dio = Dio(
      BaseOptions(
        baseUrl: AppConstants.apiBaseUrl,
        connectTimeout: const Duration(seconds: 15),
        receiveTimeout: const Duration(seconds: 15),
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      ),
    );

    _dio.interceptors.add(
      InterceptorsWrapper(
        onRequest: (options, handler) async {
          final prefs = await SharedPreferences.getInstance();
          final token = prefs.getString(AppConstants.tokenKey);
          if (token != null && token.isNotEmpty) {
            options.headers['Authorization'] = 'Bearer $token';
          }
          return handler.next(options);
        },
        onError: (DioException error, handler) async {
          if (error.response?.statusCode == 401 || error.response?.statusCode == 403) {
            // Clear token on Auth failure
            final prefs = await SharedPreferences.getInstance();
            await prefs.remove(AppConstants.tokenKey);
          }
          return handler.next(error);
        },
      ),
    );
  }

  // Auth Endpoints
  Future<Map<String, dynamic>> login(String email, String password) async {
    final response = await _dio.post('/auth/login', data: {
      'email': email,
      'password': password,
    });
    return response.data;
  }

  Future<Map<String, dynamic>> register(String email, String password, String teamName, String managerName) async {
    final response = await _dio.post('/auth/register', data: {
      'email': email,
      'password': password,
      'teamName': teamName,
      'managerName': managerName,
    });
    return response.data;
  }

  // Squad Endpoints
  Future<Map<String, dynamic>> getSquad() async {
    final response = await _dio.get('/squad/me');
    return response.data;
  }

  Future<Map<String, dynamic>> saveSquad(List<Map<String, dynamic>> picks) async {
    final response = await _dio.post('/squad/save', data: {
      'picks': picks,
    });
    return response.data;
  }

  // Transfers Endpoints
  Future<List<dynamic>> getAllPlayers() async {
    final response = await _dio.get('/players');
    return response.data['players'] ?? [];
  }

  Future<Map<String, dynamic>> makeTransfers(List<int> transferOutIds, List<int> transferInIds) async {
    final response = await _dio.post('/transfers', data: {
      'transfersOut': transferOutIds,
      'transfersIn': transferInIds,
    });
    return response.data;
  }

  // Leagues Endpoints
  Future<List<dynamic>> getUserLeagues() async {
    final response = await _dio.get('/leagues/me');
    return response.data['leagues'] ?? [];
  }
}
