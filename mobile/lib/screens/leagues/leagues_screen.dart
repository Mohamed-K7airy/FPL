import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';
import '../../core/constants/app_colors.dart';
import '../../providers/leagues_provider.dart';

class LeaguesScreen extends StatefulWidget {
  const LeaguesScreen({super.key});

  @override
  State<LeaguesScreen> createState() => _LeaguesScreenState();
}

class _LeaguesScreenState extends State<LeaguesScreen> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<LeaguesProvider>().fetchLeagues();
    });
  }

  void _showCreateLeagueDialog() {
    final ctrl = TextEditingController();
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        title: const Text('إنشاء دوري خاص', style: TextStyle(fontWeight: FontWeight.w900, color: AppColors.primaryPurple, fontSize: 16)),
        content: TextField(
          controller: ctrl,
          decoration: InputDecoration(
            hintText: 'اسم الدوري (مثلاً: أبطال العمل)',
            border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
          ),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: const Text('إلغاء'),
          ),
          ElevatedButton(
            style: ElevatedButton.styleFrom(backgroundColor: AppColors.primaryPurple, foregroundColor: Colors.white),
            onPressed: () async {
              if (ctrl.text.trim().isNotEmpty) {
                final code = await context.read<LeaguesProvider>().createLeague(ctrl.text);
                if (mounted) {
                  Navigator.pop(ctx);
                  if (code != null) {
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(content: Text('تم إنشاء الدوري! كود الدعوة: $code'), backgroundColor: AppColors.emerald),
                    );
                  }
                }
              }
            },
            child: const Text('إنشاء'),
          ),
        ],
      ),
    );
  }

  void _showJoinLeagueDialog() {
    final ctrl = TextEditingController();
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        title: const Text('الانضمام لدوري بكود', style: TextStyle(fontWeight: FontWeight.w900, color: AppColors.primaryPurple, fontSize: 16)),
        content: TextField(
          controller: ctrl,
          decoration: InputDecoration(
            hintText: 'أدخل كود الدوري هنا...',
            border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
          ),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: const Text('إلغاء'),
          ),
          ElevatedButton(
            style: ElevatedButton.styleFrom(backgroundColor: AppColors.primaryPurple, foregroundColor: Colors.white),
            onPressed: () async {
              if (ctrl.text.trim().isNotEmpty) {
                final success = await context.read<LeaguesProvider>().joinLeague(ctrl.text);
                if (mounted) {
                  Navigator.pop(ctx);
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(
                      content: Text(success ? 'تم الانضمام للدوري بنجاح!' : 'كود الدوري غير صحيح'),
                      backgroundColor: success ? AppColors.emerald : AppColors.dangerRed,
                    ),
                  );
                }
              }
            },
            child: const Text('انضمام'),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final provider = context.watch<LeaguesProvider>();

    return Scaffold(
      backgroundColor: AppColors.bgLight,
      appBar: AppBar(
        title: const Text('الدوريات والترتيب', style: TextStyle(fontWeight: FontWeight.w900, fontSize: 16)),
        backgroundColor: AppColors.primaryPurple,
        foregroundColor: Colors.white,
        elevation: 0,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // Action Buttons (Create / Join)
            Row(
              children: [
                Expanded(
                  child: ElevatedButton.icon(
                    onPressed: _showCreateLeagueDialog,
                    icon: const Icon(LucideIcons.plus, size: 16),
                    label: const Text('إنشاء دوري', style: TextStyle(fontSize: 13, fontWeight: FontWeight.w900)),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppColors.primaryPurple,
                      foregroundColor: Colors.white,
                      padding: const EdgeInsets.symmetric(vertical: 12),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                    ),
                  ),
                ),
                const SizedBox(width: 10),
                Expanded(
                  child: OutlinedButton.icon(
                    onPressed: _showJoinLeagueDialog,
                    icon: const Icon(LucideIcons.users, size: 16),
                    label: const Text('انضمام بكود', style: TextStyle(fontSize: 13, fontWeight: FontWeight.w900)),
                    style: OutlinedButton.styleFrom(
                      foregroundColor: AppColors.primaryPurple,
                      side: const BorderSide(color: AppColors.primaryPurple, width: 1.5),
                      padding: const EdgeInsets.symmetric(vertical: 12),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 20),

            const Text('دورياتي التنافسية', style: TextStyle(fontSize: 15, fontWeight: FontWeight.w900, color: AppColors.primaryPurple)),
            const SizedBox(height: 10),

            provider.isLoading
                ? const Center(child: Padding(padding: EdgeInsets.all(30), child: CircularProgressIndicator(color: AppColors.primaryPurple)))
                : provider.leagues.isEmpty
                    ? Container(
                        padding: const EdgeInsets.all(24),
                        decoration: BoxDecoration(
                          color: Colors.white,
                          borderRadius: BorderRadius.circular(18),
                          border: Border.all(color: AppColors.borderLight),
                        ),
                        child: const Center(
                          child: Text('أنت غير منضم لأي دوري خاص بعد. أنشئ دوريك وادعُ أصدقاءك!', textAlign: TextAlign.center, style: TextStyle(color: AppColors.textMuted)),
                        ),
                      )
                    : ListView.separated(
                        shrinkWrap: true,
                        physics: const NeverScrollableScrollPhysics(),
                        itemCount: provider.leagues.length,
                        separatorBuilder: (ctx, i) => const SizedBox(height: 10),
                        itemBuilder: (ctx, i) {
                          final league = provider.leagues[i];
                          return Container(
                            decoration: BoxDecoration(
                              color: Colors.white,
                              borderRadius: BorderRadius.circular(16),
                              border: Border.all(color: AppColors.borderLight),
                            ),
                            child: ListTile(
                              leading: Container(
                                width: 40,
                                height: 40,
                                decoration: const BoxDecoration(color: Color(0xFFF3E8FF), shape: BoxShape.circle),
                                alignment: Alignment.center,
                                child: const Icon(LucideIcons.trophy, color: AppColors.primaryPurple, size: 20),
                              ),
                              title: Text(league.name, style: const TextStyle(fontWeight: FontWeight.w900, fontSize: 14)),
                              subtitle: Text('كود الدعوة: ${league.code}', style: const TextStyle(fontSize: 11.5, color: AppColors.skyBlue, fontWeight: FontWeight.w700)),
                              trailing: Container(
                                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                                decoration: BoxDecoration(color: const Color(0xFFF1F5F9), borderRadius: BorderRadius.circular(8)),
                                child: Text('رتبتك: #${league.userRank ?? 1}', style: const TextStyle(fontSize: 11.5, fontWeight: FontWeight.w800, color: AppColors.primaryPurple)),
                              ),
                            ),
                          );
                        },
                      ),
          ],
        ),
      ),
    );
  }
}
