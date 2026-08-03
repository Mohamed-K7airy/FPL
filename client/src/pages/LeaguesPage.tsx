import React, { useState, useEffect } from 'react';
import { apiFetch } from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import { GoogleAd } from '../components/GoogleAd';
import { Trophy, Crown, Medal, Users, PlusCircle, UserPlus, Calendar, Award } from 'lucide-react';

export const LeaguesPage: React.FC = () => {
  const { t, isRtl } = useLanguage();
  const [activeTab, setActiveTab] = useState<'global' | 'mini'>('global');
  const [rankingType, setRankingType] = useState<'overall' | 'weekly' | 'monthly'>('overall');
  const [selectedGw, setSelectedGw] = useState<number>(1);
  const [selectedMonth, setSelectedMonth] = useState<string>('august');

  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [myLeagues, setMyLeagues] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [createName, setCreateName] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const months = [
    { key: 'august', nameAr: 'أغسطس (GW1-3)', nameEn: 'August (GW1-3)' },
    { key: 'september', nameAr: 'سبتمبر (GW4-6)', nameEn: 'September (GW4-6)' },
    { key: 'october', nameAr: 'أكتوبر (GW7-10)', nameEn: 'October (GW7-10)' },
    { key: 'november', nameAr: 'نوفمبر (GW11-13)', nameEn: 'November (GW11-13)' },
    { key: 'december', nameAr: 'ديسمبر (GW14-19)', nameEn: 'December (GW14-19)' },
    { key: 'january', nameAr: 'يناير (GW20-24)', nameEn: 'January (GW20-24)' },
    { key: 'february', nameAr: 'فبراير (GW25-27)', nameEn: 'February (GW25-27)' },
    { key: 'march', nameAr: 'مارس (GW28-30)', nameEn: 'March (GW28-30)' },
    { key: 'april', nameAr: 'أبريل (GW31-34)', nameEn: 'April (GW31-34)' },
    { key: 'may', nameAr: 'مايو (GW35-38)', nameEn: 'May (GW35-38)' },
  ];

  const fetchGlobal = async () => {
    setLoading(true);
    try {
      let endpoint = `/leagues/leaderboard?type=${rankingType}`;
      if (rankingType === 'weekly') {
        endpoint += `&gw=${selectedGw}`;
      } else if (rankingType === 'monthly') {
        endpoint += `&month=${selectedMonth}`;
      }

      const data = await apiFetch<{ leaderboard: any[] }>(endpoint);
      setLeaderboard(data.leaderboard || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMyLeagues = async () => {
    setLoading(true);
    try {
      const data = await apiFetch<{ leagues: any[] }>('/leagues');
      setMyLeagues(data.leagues || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'global') fetchGlobal();
    else fetchMyLeagues();
  }, [activeTab, rankingType, selectedGw, selectedMonth]);

  const handleCreateLeague = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    try {
      const data = await apiFetch<{ league: any }>('/leagues', {
        method: 'POST',
        body: JSON.stringify({ name: createName }),
      });
      setMessage({ type: 'success', text: `League "${data.league.name}" created! Code: ${data.league.code}` });
      setCreateName('');
      fetchMyLeagues();
    } catch (err) {
      setMessage({ type: 'error', text: (err as Error).message });
    }
  };

  const handleJoinLeague = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    try {
      const data = await apiFetch<{ message: string }>('/leagues/join', {
        method: 'POST',
        body: JSON.stringify({ code: joinCode }),
      });
      setMessage({ type: 'success', text: data.message });
      setJoinCode('');
      fetchMyLeagues();
    } catch (err) {
      setMessage({ type: 'error', text: (err as Error).message });
    }
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', paddingBottom: '40px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '1.8rem', color: 'var(--fpl-purple)', display: 'flex', alignItems: 'center', gap: '10px', margin: 0 }}>
            <Trophy size={28} style={{ color: 'var(--fpl-gold)' }} />
            <span>{t('leagues')}</span>
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '4px' }}>
            {isRtl ? 'نافِس عالمياً في الترتيب الكلي، الأسبوعي، أو الشهري، أو أنشئ دوريك الخاص' : 'Compete overall, weekly, or monthly, or join private leagues'}
          </p>
        </div>

        {/* Tab Switcher */}
        <div style={{ display: 'flex', gap: '8px', background: '#f1f5f9', padding: '4px', borderRadius: '12px' }}>
          <button
            onClick={() => setActiveTab('global')}
            className={activeTab === 'global' ? 'btn-primary' : 'btn-secondary'}
            style={{ padding: '8px 18px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Trophy size={14} />
            <span>{t('globalStandings')}</span>
          </button>
          <button
            onClick={() => setActiveTab('mini')}
            className={activeTab === 'mini' ? 'btn-primary' : 'btn-secondary'}
            style={{ padding: '8px 18px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Users size={14} />
            <span>{t('myMiniLeagues')}</span>
          </button>
        </div>
      </div>

      {message && (
        <div
          style={{
            padding: '12px 16px',
            borderRadius: '10px',
            marginBottom: '16px',
            background: message.type === 'success' ? '#f0fdf4' : '#fff1f2',
            border: `1px solid ${message.type === 'success' ? '#bbf7d0' : '#fecdd3'}`,
            color: message.type === 'success' ? '#16a34a' : '#e11d48',
            fontSize: '0.9rem',
            fontWeight: 700,
          }}
        >
          {message.text}
        </div>
      )}

      {activeTab === 'global' ? (
        <div>
          {/* Sub-Ranking Type Controls (كلي عام / أسبوعي للجولة / شهري) */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '12px',
              background: '#ffffff',
              padding: '12px 16px',
              borderRadius: '16px',
              border: '1px solid var(--border-color)',
              marginBottom: '16px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
            }}
          >
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              <button
                onClick={() => setRankingType('overall')}
                style={{
                  padding: '8px 14px',
                  borderRadius: '10px',
                  border: 'none',
                  fontSize: '0.82rem',
                  fontWeight: 900,
                  cursor: 'pointer',
                  background: rankingType === 'overall' ? 'var(--fpl-purple)' : '#f1f5f9',
                  color: rankingType === 'overall' ? '#ffffff' : 'var(--text-main)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <Trophy size={14} />
                <span>{isRtl ? 'الترتيب الكلي العام' : 'Overall Standings'}</span>
              </button>

              <button
                onClick={() => setRankingType('weekly')}
                style={{
                  padding: '8px 14px',
                  borderRadius: '10px',
                  border: 'none',
                  fontSize: '0.82rem',
                  fontWeight: 900,
                  cursor: 'pointer',
                  background: rankingType === 'weekly' ? 'var(--fpl-cyan)' : '#f1f5f9',
                  color: rankingType === 'weekly' ? '#ffffff' : 'var(--text-main)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <Award size={14} />
                <span>{isRtl ? 'ترتيب الجولة الأسبوعي' : 'Weekly GW Standings'}</span>
              </button>

              <button
                onClick={() => setRankingType('monthly')}
                style={{
                  padding: '8px 14px',
                  borderRadius: '10px',
                  border: 'none',
                  fontSize: '0.82rem',
                  fontWeight: 900,
                  cursor: 'pointer',
                  background: rankingType === 'monthly' ? 'var(--fpl-magenta)' : '#f1f5f9',
                  color: rankingType === 'monthly' ? '#ffffff' : 'var(--text-main)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <Calendar size={14} />
                <span>{isRtl ? 'الترتيب الشهري' : 'Monthly Standings'}</span>
              </button>
            </div>

            {/* Contextual Sub-Selectors (GW selector for weekly, Month selector for monthly) */}
            {rankingType === 'weekly' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--fpl-purple)' }}>
                  {isRtl ? 'اختر الجولة:' : 'Select GW:'}
                </span>
                <select
                  value={selectedGw}
                  onChange={(e) => setSelectedGw(parseInt(e.target.value, 10))}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-color)',
                    background: '#f8fafc',
                    fontWeight: 800,
                    fontSize: '0.85rem',
                    color: '#0f172a',
                  }}
                >
                  {Array.from({ length: 38 }, (_, i) => i + 1).map((g) => (
                    <option key={g} value={g}>
                      {isRtl ? `الجولة ${g}` : `GW ${g}`}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {rankingType === 'monthly' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--fpl-purple)' }}>
                  {isRtl ? 'اختر الشهر:' : 'Select Month:'}
                </span>
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-color)',
                    background: '#f8fafc',
                    fontWeight: 800,
                    fontSize: '0.85rem',
                    color: '#0f172a',
                  }}
                >
                  {months.map((m) => (
                    <option key={m.key} value={m.key}>
                      {isRtl ? m.nameAr : m.nameEn}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '2px solid var(--border-color)', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '14px 20px', width: '100px' }}>{t('rank')}</th>
                  <th style={{ padding: '14px 20px' }}>{t('teamName')}</th>
                  <th style={{ padding: '14px 20px', textAlign: 'right' }}>
                    {rankingType === 'weekly'
                      ? (isRtl ? `نقاط الجولة ${selectedGw}` : `GW ${selectedGw} Points`)
                      : rankingType === 'monthly'
                        ? (isRtl ? 'نقاط الشهر' : 'Monthly Points')
                        : t('totalPoints')}
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={3} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                      {t('loading')}
                    </td>
                  </tr>
                ) : leaderboard.length === 0 ? (
                  <tr>
                    <td colSpan={3} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                      {isRtl ? 'لا توجد نتائج مسجلة لهذه الفئة حتى الآن.' : 'No recorded scores for this filter yet.'}
                    </td>
                  </tr>
                ) : (
                  leaderboard.map((row) => (
                    <tr key={row.userId} style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '14px 20px', fontWeight: 900 }}>
                        {row.rank === 1 ? (
                          <span style={{ color: 'var(--fpl-gold)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                            <Crown size={16} /> #1
                          </span>
                        ) : row.rank === 2 ? (
                          <span style={{ color: '#64748b', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                            <Medal size={16} /> #2
                          </span>
                        ) : row.rank === 3 ? (
                          <span style={{ color: '#b45309', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                            <Medal size={16} /> #3
                          </span>
                        ) : (
                          <span style={{ color: 'var(--text-muted)' }}>#{row.rank}</span>
                        )}
                      </td>
                      <td style={{ padding: '14px 20px', fontWeight: 700, color: '#0f172a' }}>{row.teamName}</td>
                      <td style={{ padding: '14px 20px', textAlign: 'right', fontWeight: 900, color: 'var(--fpl-green)' }}>
                        {row.totalPoints} {t('pts')}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
          {/* Create League Card */}
          <div className="glass-card">
            <h3 style={{ marginBottom: '16px', color: 'var(--fpl-purple)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <PlusCircle size={20} style={{ color: 'var(--fpl-green)' }} />
              <span>{t('createLeague')}</span>
            </h3>
            <form onSubmit={handleCreateLeague} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <input
                type="text"
                required
                placeholder={t('leagueNamePlaceholder')}
                value={createName}
                onChange={(e) => setCreateName(e.target.value)}
                style={{
                  padding: '12px 14px',
                  borderRadius: '10px',
                  border: '1px solid var(--border-color)',
                  background: '#f8fafc',
                  color: '#0f172a',
                  outline: 'none',
                }}
              />
              <button type="submit" className="btn-primary">
                {t('createBtn')}
              </button>
            </form>
          </div>

          {/* Join League Card */}
          <div className="glass-card">
            <h3 style={{ marginBottom: '16px', color: 'var(--fpl-purple)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <UserPlus size={20} style={{ color: 'var(--fpl-cyan)' }} />
              <span>{t('joinLeague')}</span>
            </h3>
            <form onSubmit={handleJoinLeague} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <input
                type="text"
                required
                placeholder={t('joinCodePlaceholder')}
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value)}
                style={{
                  padding: '12px 14px',
                  borderRadius: '10px',
                  border: '1px solid var(--border-color)',
                  background: '#f8fafc',
                  color: '#0f172a',
                  outline: 'none',
                }}
              />
              <button type="submit" className="btn-secondary">
                {t('joinBtn')}
              </button>
            </form>
          </div>
        </div>
      )}

      <GoogleAd adSlot="7788990011" />
    </div>
  );
};
