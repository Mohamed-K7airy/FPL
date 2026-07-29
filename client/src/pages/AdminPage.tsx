import React, { useState, useEffect } from 'react';
import { apiFetch } from '../services/api';

export const AdminPage: React.FC = () => {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [gwInput, setGwInput] = useState(1);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const data = await apiFetch<{ logs: any[] }>('/admin/sync-log');
      setLogs(data.logs || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const handleSyncBootstrap = async () => {
    setMessage(null);
    try {
      await apiFetch('/admin/sync/bootstrap', { method: 'POST' });
      setMessage({ type: 'success', text: 'Bootstrap sync completed successfully!' });
      fetchLogs();
    } catch (err) {
      setMessage({ type: 'error', text: (err as Error).message });
    }
  };

  const handleSyncLive = async () => {
    setMessage(null);
    try {
      await apiFetch(`/admin/sync/live/${gwInput}`, { method: 'POST' });
      setMessage({ type: 'success', text: `Live stats sync for GW ${gwInput} completed!` });
      fetchLogs();
    } catch (err) {
      setMessage({ type: 'error', text: (err as Error).message });
    }
  };

  const handleRecalculate = async () => {
    setMessage(null);
    try {
      await apiFetch(`/admin/recalculate/${gwInput}`, { method: 'POST' });
      setMessage({ type: 'success', text: `Recalculated scores for GW ${gwInput}!` });
      fetchLogs();
    } catch (err) {
      setMessage({ type: 'error', text: (err as Error).message });
    }
  };

  const handleDemoSimulate = async () => {
    setMessage(null);
    try {
      const data = await apiFetch<{ message: string }>(`/admin/demo-simulate/${gwInput}`, { method: 'POST' });
      setMessage({ type: 'success', text: data.message });
      fetchLogs();
    } catch (err) {
      setMessage({ type: 'error', text: (err as Error).message });
    }
  };

  const handleResetDemo = async () => {
    if (!window.confirm('هل أنت ممتأكد من تصفير وإلغاء جميع نقاط واختبارات الديمو؟')) return;
    setMessage(null);
    try {
      const data = await apiFetch<{ message: string }>('/admin/reset-demo', { method: 'POST' });
      setMessage({ type: 'success', text: data.message });
      fetchLogs();
    } catch (err) {
      setMessage({ type: 'error', text: (err as Error).message });
    }
  };

  const handleFinalize = async () => {
    setMessage(null);
    try {
      await apiFetch(`/admin/finalize/${gwInput}`, { method: 'POST' });
      setMessage({ type: 'success', text: `Gameweek ${gwInput} finalized successfully!` });
      fetchLogs();
    } catch (err) {
      setMessage({ type: 'error', text: (err as Error).message });
    }
  };

  return (
    <div>
      <h2 style={{ fontSize: '1.6rem', color: 'var(--fpl-magenta)', marginBottom: '8px' }}>
        Admin System Control Panel
      </h2>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '24px' }}>
        Trigger manual data syncs, recalculate gameweeks, and view operational logs
      </p>

      {message && (
        <div
          style={{
            padding: '12px 16px',
            borderRadius: '8px',
            marginBottom: '16px',
            background: message.type === 'success' ? 'rgba(0, 255, 133, 0.15)' : 'rgba(233, 0, 82, 0.15)',
            border: `1px solid ${message.type === 'success' ? 'var(--fpl-green)' : 'var(--fpl-magenta)'}`,
            color: message.type === 'success' ? 'var(--fpl-green)' : '#ff6b9d',
            fontSize: '0.9rem',
          }}
        >
          {message.text}
        </div>
      )}

      {/* Control Actions Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        <div className="glass-card">
          <h3 style={{ marginBottom: '8px', color: 'var(--fpl-green)' }}>Sync FPL Static Data</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '16px' }}>
            Fetch 700+ players, teams, prices, and gameweeks from bootstrap-static.
          </p>
          <button onClick={handleSyncBootstrap} className="btn-primary" style={{ width: '100%' }}>
            Sync Bootstrap Now
          </button>
        </div>

        <div className="glass-card">
          <h3 style={{ marginBottom: '8px', color: 'var(--fpl-cyan)' }}>Gameweek Operations</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Target GW:</label>
            <input
              type="number"
              min={1}
              max={38}
              value={gwInput}
              onChange={(e) => setGwInput(parseInt(e.target.value, 10))}
              style={{
                width: '70px',
                padding: '6px',
                borderRadius: '6px',
                border: '1px solid var(--border-color)',
                background: 'rgba(0,0,0,0.3)',
                color: '#fff',
              }}
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <button
              onClick={handleDemoSimulate}
              style={{
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                color: '#ffffff',
                padding: '10px 14px',
                borderRadius: '10px',
                border: 'none',
                fontWeight: 900,
                fontSize: '0.85rem',
                cursor: 'pointer',
              }}
            >
              🎮 تشغيل محاكاة تجريبية للنقاط (Demo Simulation GW {gwInput})
            </button>
            <button onClick={handleSyncLive} className="btn-secondary">
              Sync Live Stats (GW {gwInput})
            </button>
            <button onClick={handleRecalculate} className="btn-secondary">
              Recalculate Scores (GW {gwInput})
            </button>
            <button onClick={handleFinalize} className="btn-danger">
              Finalize GW {gwInput} (Auto-Subs & Lock)
            </button>
            <button
              onClick={handleResetDemo}
              style={{
                background: '#e11d48',
                color: '#ffffff',
                padding: '10px 14px',
                borderRadius: '10px',
                border: 'none',
                fontWeight: 900,
                fontSize: '0.85rem',
                cursor: 'pointer',
                marginTop: '4px',
              }}
            >
              🗑️ تصفير وإلغاء نقاط الديمو (Reset Demo Data)
            </button>
          </div>
        </div>
      </div>

      {/* Sync Log Table */}
      <h3 style={{ marginBottom: '12px', color: 'var(--text-main)' }}>Sync Operations Log</h3>
      <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
          <thead>
            <tr style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
              <th style={{ padding: '10px 14px' }}>Time</th>
              <th style={{ padding: '10px 14px' }}>Kind</th>
              <th style={{ padding: '10px 14px' }}>GW</th>
              <th style={{ padding: '10px 14px' }}>Status</th>
              <th style={{ padding: '10px 14px' }}>Message</th>
              <th style={{ padding: '10px 14px' }}>Duration</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
                  Loading logs...
                </td>
              </tr>
            ) : logs.map((log) => (
              <tr key={log.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '10px 14px', color: 'var(--text-muted)' }}>
                  {new Date(log.created_at).toLocaleTimeString()}
                </td>
                <td style={{ padding: '10px 14px', fontWeight: 700 }}>{log.kind}</td>
                <td style={{ padding: '10px 14px' }}>{log.gw || '-'}</td>
                <td style={{ padding: '10px 14px' }}>
                  <span
                    style={{
                      background: log.status === 'ok' ? 'rgba(0,255,133,0.15)' : 'rgba(233,0,82,0.15)',
                      color: log.status === 'ok' ? 'var(--fpl-green)' : 'var(--fpl-magenta)',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      fontWeight: 800,
                    }}
                  >
                    {log.status.toUpperCase()}
                  </span>
                </td>
                <td style={{ padding: '10px 14px' }}>{log.message}</td>
                <td style={{ padding: '10px 14px', color: 'var(--text-muted)' }}>{log.duration_ms}ms</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
