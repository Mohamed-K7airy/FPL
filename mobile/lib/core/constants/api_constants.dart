import 'dart:io';
import 'package:flutter/foundation.dart';

class ApiConstants {
  // Automatically select the correct local host URL based on platform
  static String get baseUrl {
    if (kIsWeb) {
      return 'http://localhost:5000/api';
    }
    if (Platform.isAndroid) {
      return 'http://10.0.2.2:5000/api';
    }
    return 'http://localhost:5000/api';
  }

  // Endpoints
  static const String login = '/auth/login';
  static const String register = '/auth/register';
  static const String me = '/auth/me';
  static const String players = '/players';
  static const String squad = '/squad';
  static const String chips = '/squad/chips';
  static const String activateChip = '/squad/chips/activate';
  static const String deactivateChip = '/squad/chips/deactivate';
  static const String points = '/points';
  static const String leagues = '/leagues';
  static const String syncStatus = '/sync/status';
}
