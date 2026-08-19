import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import '../constants/api_constants.dart';

class ApiException implements Exception {
  final String message;
  final int? statusCode;
  ApiException(this.message, [this.statusCode]);

  @override
  String toString() => message;
}

class ApiService {
  static final ApiService _instance = ApiService._internal();
  factory ApiService() => _instance;
  ApiService._internal();

  String? _token;

  Future<void> init() async {
    final prefs = await SharedPreferences.getInstance();
    _token = prefs.getString('auth_token');
  }

  Future<void> setToken(String? token) async {
    _token = token;
    final prefs = await SharedPreferences.getInstance();
    if (token != null) {
      await prefs.setString('auth_token', token);
    } else {
      await prefs.remove('auth_token');
    }
  }

  String? get token => _token;

  Map<String, String> get _headers {
    final map = <String, String>{
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
    if (_token != null && _token!.isNotEmpty) {
      map['Authorization'] = 'Bearer $_token';
    }
    return map;
  }

  Future<dynamic> get(String endpoint, {Map<String, dynamic>? queryParams}) async {
    try {
      var uri = Uri.parse('${ApiConstants.baseUrl}$endpoint');
      if (queryParams != null && queryParams.isNotEmpty) {
        final queryStr = queryParams.entries.map((e) => '${e.key}=${Uri.encodeComponent(e.value.toString())}').join('&');
        uri = Uri.parse('$uri?$queryStr');
      }

      final response = await http.get(uri, headers: _headers);
      return _handleResponse(response);
    } catch (e) {
      if (e is ApiException) rethrow;
      throw ApiException('تعذر الاتصال بالسيرفر. يرجى التحقق من اتصال الإنترنت: $e');
    }
  }

  Future<dynamic> post(String endpoint, {Map<String, dynamic>? body}) async {
    try {
      final uri = Uri.parse('${ApiConstants.baseUrl}$endpoint');
      final response = await http.post(
        uri,
        headers: _headers,
        body: body != null ? jsonEncode(body) : null,
      );
      return _handleResponse(response);
    } catch (e) {
      if (e is ApiException) rethrow;
      throw ApiException('تعذر الاتصال بالسيرفر: $e');
    }
  }

  Future<dynamic> delete(String endpoint) async {
    try {
      final uri = Uri.parse('${ApiConstants.baseUrl}$endpoint');
      final response = await http.delete(uri, headers: _headers);
      return _handleResponse(response);
    } catch (e) {
      if (e is ApiException) rethrow;
      throw ApiException('تعذر الاتصال بالسيرفر: $e');
    }
  }

  dynamic _handleResponse(http.Response response) {
    dynamic data;
    try {
      data = jsonDecode(response.body);
    } catch (_) {
      data = null;
    }

    if (response.statusCode >= 200 && response.statusCode < 300) {
      return data;
    }

    String errorMsg = 'حدث خطأ غير متوقع (${response.statusCode})';
    if (data is Map) {
      if (data['error'] is Map) {
        final errMap = data['error'] as Map;
        if (errMap['details'] is Map && errMap['details']['fieldErrors'] is Map) {
          final fieldErrors = errMap['details']['fieldErrors'] as Map;
          final List<String> errorList = [];
          fieldErrors.forEach((key, val) {
            if (val is List && val.isNotEmpty) {
              errorList.add('${val.first}');
            }
          });
          if (errorList.isNotEmpty) {
            errorMsg = errorList.join('\n');
          }
        } else if (errMap['message'] != null) {
          errorMsg = errMap['message'].toString();
        }
      } else if (data['message'] != null) {
        errorMsg = data['message'].toString();
      } else if (data['error'] is String) {
        errorMsg = data['error'].toString();
      }
    }

    throw ApiException(errorMsg, response.statusCode);
  }
}
