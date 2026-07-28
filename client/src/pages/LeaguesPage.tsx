import React, { useState, useEffect } from 'react';
import { apiFetch } from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import { GoogleAd } from '../components/GoogleAd';
import { Trophy, Crown, Medal, Users, PlusCircle, UserPlus } from 'lucide-react';

export const LeaguesPage: React.FC = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'global' | 'mini'>('global');
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [myLeagues, setMyLeagues] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [createName, setCreateName] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchGlobal = async () => {
    setLoading(true);
    try {
      const data = await apiFetch<{ leaderboard: any[] }>('/leagues/leaderboard');
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
  }, [activeTab]);

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
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '1.8rem', color: 'var(--fpl-purple)', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Trophy size={28} style={{ color: 'var(--fpl-gold)' }} />
            <span>{t('leagues')}</span>
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            Compete globally or create custom private mini-leagues
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
        <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '2px solid var(--border-color)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '14px 20px', width: '100px' }}>{t('rank')}</th>
                <th style={{ padding: '14px 20px' }}>{t('teamName')}</th>
                <th style={{ padding: '14px 20px', textAlign: 'right' }}>{t('totalPoints')}</th>
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
                    No scores calculated yet.
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
