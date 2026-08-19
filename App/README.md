# 📱 FPL Mobile App (Flutter)

تطبيق الهواتف الذكية لمشروع **Fantasy Premier League** مبني باستخدام **Flutter** ليعمل بكفاءة عالية على نظامي Android و iOS.

---

## 🏗️ هيكلية المشروع (Project Architecture)

```text
App/
├── pubspec.yaml          # ملف الحزم والاعتمادات
├── lib/
│   ├── main.dart         # نقطة انطلاق التطبيق والأشرطة
│   ├── config/           # الثيمات، الألوان، ورابط الـ API
│   │   └── constants.dart
│   ├── models/           # نماذج البيانات (User, Player, Squad, League)
│   │   ├── user_model.dart
│   │   ├── player_model.dart
│   │   └── squad_model.dart
│   ├── services/         # خدمات الاتصال بالخادم وربط JWT
│   │   └── api_service.dart
│   ├── providers/        # إدارة الحالة (Auth, Squad Management)
│   │   ├── auth_provider.dart
│   │   └── squad_provider.dart
│   └── screens/          # شاشات التطبيق الرئيسية
│       ├── login_screen.dart
│       ├── home_screen.dart
│       ├── pitch_view_screen.dart
│       ├── transfers_screen.dart
│       └── leagues_screen.dart
```

---

## 🚀 كيفية التشغيل (How to Run)

1. **تأكد من تثبيت Flutter SDK** على جهازك.
2. **افتح المجلد في الموجه (Terminal):**
   ```bash
   cd App
   ```
3. **قم بتثبيت الاعتمادات:**
   ```bash
   flutter pub get
   ```
4. **تشغيل التطبيق على المحاكي أو الهاتف:**
   ```bash
   flutter run
   ```

---

## 🌐 التوصيل بالخادم (Backend Connection)

يتم الاتصال بالخادم الرئيسي في Railway تلقائياً:
`https://fpl-production-fb03.up.railway.app/api`

أو يمكنك توجيهه للـ Localhost أثناء التطوير في `lib/config/constants.dart`.
