import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';
import '../../core/constants/app_colors.dart';
import '../../providers/auth_provider.dart';
import '../guides/guides_screen.dart';

class HomeScreen extends StatelessWidget {
  final Function(int tabIndex)? onNavigateTab;

  const HomeScreen({super.key, this.onNavigateTab});

  @override
  Widget build(BuildContext context) {
    final auth = context.watch<AuthProvider>();

    return Scaffold(
      backgroundColor: AppColors.bgLight,
      appBar: AppBar(
        title: const Text('MINI FPL', style: TextStyle(fontWeight: FontWeight.w900, fontSize: 18, color: AppColors.accentGreen)),
        backgroundColor: AppColors.primaryPurple,
        elevation: 0,
        actions: [
          IconButton(
            icon: const Icon(LucideIcons.bookOpen, color: Colors.white, size: 20),
            tooltip: 'دليل اللعبة',
            onPressed: () {
              Navigator.push(context, MaterialPageRoute(builder: (ctx) => const GuidesScreen()));
            },
          ),
          IconButton(
            icon: const Icon(LucideIcons.logOut, color: Colors.white, size: 20),
            tooltip: 'تسجيل الخروج',
            onPressed: () => auth.logout(),
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // Hero Welcome Banner
            Container(
              padding: const EdgeInsets.all(22),
              decoration: BoxDecoration(
                gradient: const LinearGradient(
                  colors: [AppColors.primaryPurple, AppColors.deepPurple],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
                borderRadius: BorderRadius.circular(22),
                boxShadow: const [
                  BoxShadow(color: Colors.black12, blurRadius: 15, offset: Offset(0, 6)),
                ],
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                    decoration: BoxDecoration(
                      color: AppColors.accentGreen.withOpacity(0.2),
                      borderRadius: BorderRadius.circular(20),
                      border: Border.all(color: AppColors.accentGreen.withOpacity(0.4)),
                    ),
                    child: const Text('GW1 Deadline: 21 Aug, 20:30', style: TextStyle(color: AppColors.accentGreen, fontSize: 11, fontWeight: FontWeight.w800)),
                  ),
                  const SizedBox(height: 14),
                  Text(
                    'مرحباً بك، ${auth.user?.teamName ?? 'المدرب'}! ⚽',
                    style: const TextStyle(color: Colors.white, fontSize: 20, fontWeight: FontWeight.w900),
                  ),
                  const SizedBox(height: 6),
                  const Text(
                    'اختر تشكيلتك الخماسية وتحدَّ أصدقاءك في كل جولة أسبوعية من البريميرليج.',
                    style: TextStyle(color: Color(0xFFCBD5E1), fontSize: 12.5, height: 1.5),
                  ),
                  const SizedBox(height: 18),
                  ElevatedButton.icon(
                    onPressed: () {
                      if (onNavigateTab != null) onNavigateTab!(2); // Go to Transfers Tab
                    },
                    icon: const Icon(LucideIcons.repeat, size: 16),
                    label: const Text('إدارة التشكيلة والانتقالات', style: TextStyle(fontWeight: FontWeight.w900, fontSize: 13)),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppColors.accentGreen,
                      foregroundColor: AppColors.primaryPurple,
                      padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 12),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 20),

            // Quick Stats Row
            Row(
              children: [
                Expanded(
                  child: Container(
                    padding: const EdgeInsets.all(14),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(color: AppColors.borderLight),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text('الترتيب العام', style: TextStyle(fontSize: 11, color: AppColors.textMuted, fontWeight: FontWeight.w700)),
                        const SizedBox(height: 4),
                        Text('#${auth.user?.rank ?? 1}', style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w900, color: AppColors.primaryPurple)),
                      ],
                    ),
                  ),
                ),
                const SizedBox(width: 10),
                Expanded(
                  child: Container(
                    padding: const EdgeInsets.all(14),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(color: AppColors.borderLight),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text('إجمالي النقاط', style: TextStyle(fontSize: 11, color: AppColors.textMuted, fontWeight: FontWeight.w700)),
                        const SizedBox(height: 4),
                        Text('${auth.user?.totalPoints ?? 0}', style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w900, color: AppColors.emerald)),
                      ],
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 20),

            // Quick Access Cards
            const Text('روابط سريعة', style: TextStyle(fontSize: 15, fontWeight: FontWeight.w900, color: AppColors.primaryPurple)),
            const SizedBox(height: 10),

            _buildQuickLink(
              context,
              'نقاط الجولة الحية',
              'تابع نقاط نجومك وتأثير الكابتن فور تسجيل الأهداف',
              LucideIcons.trophy,
              AppColors.gold,
              () => onNavigateTab != null ? onNavigateTab!(1) : null,
            ),
            const SizedBox(height: 10),
            _buildQuickLink(
              context,
              'الدوريات والمنافسات',
              'أنشئ دوريك الخاص وشارك كود الانضمام مع أصدقائك',
              LucideIcons.users,
              AppColors.skyBlue,
              () => onNavigateTab != null ? onNavigateTab!(4) : null,
            ),
            const SizedBox(height: 10),
            _buildQuickLink(
              context,
              'قواعد اللعبة وشرح الخواص',
              'مصفوفة النقاط، طريقة حساب البونص، والخواص الأربعة',
              LucideIcons.bookOpen,
              AppColors.pink,
              () => Navigator.push(context, MaterialPageRoute(builder: (ctx) => const GuidesScreen())),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildQuickLink(BuildContext context, String title, String sub, IconData icon, Color color, VoidCallback onTap) {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.borderLight),
      ),
      child: ListTile(
        onTap: onTap,
        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 6),
        leading: Container(
          width: 42,
          height: 42,
          decoration: BoxDecoration(color: color.withOpacity(0.12), shape: BoxShape.circle),
          alignment: Alignment.center,
          child: Icon(icon, color: color, size: 20),
        ),
        title: Text(title, style: const TextStyle(fontWeight: FontWeight.w900, fontSize: 13.5, color: AppColors.textMain)),
        subtitle: Text(sub, style: const TextStyle(fontSize: 11, color: AppColors.textMuted)),
        trailing: const Icon(Icons.arrow_forward_ios, size: 14, color: AppColors.textMuted),
      ),
    );
  }
}
