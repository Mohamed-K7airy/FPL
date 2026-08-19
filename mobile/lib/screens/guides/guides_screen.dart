import 'package:flutter/material.dart';
import '../../core/constants/app_colors.dart';

class GuidesScreen extends StatelessWidget {
  const GuidesScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.bgLight,
      appBar: AppBar(
        title: const Text('دليل وقواعد اللعبة', style: TextStyle(fontWeight: FontWeight.w900, fontSize: 16)),
        backgroundColor: AppColors.primaryPurple,
        foregroundColor: Colors.white,
        elevation: 0,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // Hero Intro Box
            Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                gradient: const LinearGradient(
                  colors: [AppColors.darkPurple, AppColors.deepPurple],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
                borderRadius: BorderRadius.circular(20),
              ),
              child: const Column(
                children: [
                  Text(
                    'قواعد الفانتازي الخماسية ومصفوفة النقاط',
                    textAlign: TextAlign.center,
                    style: TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.w900),
                  ),
                  SizedBox(height: 8),
                  Text(
                    'اختر 5 لاعبين فقط ونافس في التحديات الأسبوعية مع حساب نقاط مباشر فور تسجيل الأهداف!',
                    textAlign: TextAlign.center,
                    style: TextStyle(color: Color(0xFFCBD5E1), fontSize: 12, height: 1.5),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 20),

            // Scoring Matrix Section
            const Text('مصفوفة احتساب النقاط الرسمية', style: TextStyle(fontSize: 15, fontWeight: FontWeight.w900, color: AppColors.primaryPurple)),
            const SizedBox(height: 10),

            Container(
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(18),
                border: Border.all(color: AppColors.borderLight),
              ),
              child: Column(
                children: [
                  _buildMatrixRow('الحدث / المركز', 'حارس', 'مدافع', 'وسط', 'مهاجم', isHeader: true),
                  const Divider(height: 1, color: Color(0xFFF1F5F9)),
                  _buildMatrixRow('تسجيل هدف', '+6', '+6', '+5', '+4', isHighlight: true),
                  _buildMatrixRow('تمريرة حاسمة', '+3', '+3', '+3', '+3', isHighlight: true),
                  _buildMatrixRow('شباك نظيفة (60+ دقيقة)', '+4', '+4', '+1', '0'),
                  _buildMatrixRow('كل 3 تصديات حاسمة', '+1', '—', '—', '—'),
                  _buildMatrixRow('تصدي ركلة جزاء', '+5', '—', '—', '—'),
                  _buildMatrixRow('بطاقة صفراء', '-1', '-1', '-1', '-1', isNegative: true),
                  _buildMatrixRow('بطاقة حمراء', '-3', '-3', '-3', '-3', isNegative: true),
                ],
              ),
            ),
            const SizedBox(height: 24),

            // 4 Chips Masterclass
            const Text('الخواص الأربعة الذكية (The 4 Chips)', style: TextStyle(fontSize: 15, fontWeight: FontWeight.w900, color: AppColors.primaryPurple)),
            const SizedBox(height: 10),

            _buildChipCard(
              'الوايلد كارد (Wildcard)',
              'إجراء انتقالات مجانية غير محدودة لتعديل تشكيلتك بالكامل دون أي خصم نقاط (-4).',
              'مرتان في الموسم (جولة 1-19 وجولة 20-38)',
              const Color(0xFF0284C7),
            ),
            const SizedBox(height: 10),
            _buildChipCard(
              'الفري هيت (Free Hit)',
              'تغيير التشكيلة لجولة واحدة فقط بحرية تامة، ثم تعود تشكيلتك القديمة تلقائياً.',
              'مرة واحدة في الموسم',
              AppColors.pink,
            ),
            const SizedBox(height: 10),
            _buildChipCard(
              'التريبل كابتن (Triple Captain)',
              'مضاعفة نقاط كابتن فريقك ثلاث مرات (x3) بدلاً من مرتين لتحقيق قفزة نقطية كبيرة.',
              'مرة واحدة في الموسم',
              AppColors.gold,
            ),
            const SizedBox(height: 10),
            _buildChipCard(
              'البنش بوست (Bench Boost)',
              'تعزيز نقاط التشكيلة الإجمالية لتحقيق أعلى عوائد ممكنة في الجولة.',
              'مرة واحدة في الموسم',
              AppColors.emerald,
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildMatrixRow(String action, String gkp, String def, String mid, String fwd, {bool isHeader = false, bool isHighlight = false, bool isNegative = false}) {
    return Container(
      color: isHighlight ? const Color(0xFFF0FDF4) : Colors.transparent,
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
      child: Row(
        children: [
          Expanded(
            flex: 3,
            child: Text(
              action,
              style: TextStyle(
                fontWeight: isHeader || isHighlight ? FontWeight.w900 : FontWeight.w700,
                fontSize: 11.5,
                color: isHeader ? AppColors.primaryPurple : isHighlight ? AppColors.emerald : AppColors.textMain,
              ),
            ),
          ),
          Expanded(child: Text(gkp, textAlign: TextAlign.center, style: TextStyle(fontWeight: FontWeight.w800, fontSize: 11, color: isNegative ? AppColors.dangerRed : null))),
          Expanded(child: Text(def, textAlign: TextAlign.center, style: TextStyle(fontWeight: FontWeight.w800, fontSize: 11, color: isNegative ? AppColors.dangerRed : null))),
          Expanded(child: Text(mid, textAlign: TextAlign.center, style: TextStyle(fontWeight: FontWeight.w800, fontSize: 11, color: isNegative ? AppColors.dangerRed : null))),
          Expanded(child: Text(fwd, textAlign: TextAlign.center, style: TextStyle(fontWeight: FontWeight.w800, fontSize: 11, color: isNegative ? AppColors.dangerRed : null))),
        ],
      ),
    );
  }

  Widget _buildChipCard(String title, String desc, String tag, Color color) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(18),
        border: Border.all(color: color.withOpacity(0.35)),
        boxShadow: const [BoxShadow(color: Colors.black12, blurRadius: 6, offset: Offset(0, 2))],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(title, style: TextStyle(fontWeight: FontWeight.w900, fontSize: 14, color: color)),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                decoration: BoxDecoration(color: color.withOpacity(0.12), borderRadius: BorderRadius.circular(6)),
                child: Text(tag, style: TextStyle(fontSize: 10, fontWeight: FontWeight.w800, color: color)),
              ),
            ],
          ),
          const SizedBox(height: 8),
          Text(desc, style: const TextStyle(fontSize: 12, color: AppColors.textMuted, height: 1.5)),
        ],
      ),
    );
  }
}
