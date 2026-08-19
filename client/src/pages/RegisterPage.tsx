import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { SocialAuthButtons } from '../components/SocialAuthButtons';
import { Shield, Mail, Lock, Eye, EyeOff, UserCheck } from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const { user, register } = useAuth();
  const { t, isRtl } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  const fromState = (location.state as any)?.from?.pathname;
  const searchParams = new URLSearchParams(location.search);
  const redirectParam = searchParams.get('redirect');
  const storedUrl = sessionStorage.getItem('auth_return_url');

  const returnUrl = fromState || redirectParam || (storedUrl && !storedUrl.includes('/login') && !storedUrl.includes('/register') ? storedUrl : '/transfers');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [teamName, setTeamName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (returnUrl && !returnUrl.includes('/login') && !returnUrl.includes('/register')) {
      sessionStorage.setItem('auth_return_url', returnUrl);
    }
  }, [returnUrl]);

  useEffect(() => {
    if (user) {
      const target = sessionStorage.getItem('auth_return_url') || returnUrl;
      sessionStorage.removeItem('auth_return_url');
      navigate(target, { replace: true });
    }
  }, [user, navigate, returnUrl]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await register(email, password, teamName);
      const target = sessionStorage.getItem('auth_return_url') || returnUrl;
      sessionStorage.removeItem('auth_return_url');
      navigate(target, { replace: true });
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', padding: '20px' }}>
      <div
        className="glass-card"
        style={{
          width: '100%',
          maxWidth: '460px',
          padding: '40px 36px',
          background: '#ffffff',
          borderRadius: '24px',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.06)',
          border: '1px solid #e2e8f0',
          direction: isRtl ? 'rtl' : 'ltr',
        }}
      >
        {/* Brand Logo Header - Clean Standalone Display */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
            <img
              src="/logo.png"
              alt="MINI FPL Official Logo"
              style={{ height: '72px', objectFit: 'contain', filter: 'drop-shadow(0 4px 10px rgba(0, 0, 0, 0.08))' }}
            />
          </div>

          <h2 style={{ fontSize: '1.7rem', fontWeight: 900, color: 'var(--fpl-purple)', margin: '0 0 6px 0', letterSpacing: '-0.02em' }}>
            {isRtl ? 'إنشاء حساب جديد' : 'Create New Account'}
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', margin: 0, lineHeight: 1.5 }}>
            {isRtl ? 'انضم إلى مجتمعنا وابنِ فريق الفانتازي الخاص بك' : 'Join our community & manage your fantasy squad'}
          </p>
        </div>

        {error && (
          <div
            style={{
              background: '#fff1f2',
              border: '1px solid #fecdd3',
              color: '#e11d48',
              padding: '12px 16px',
              borderRadius: '12px',
              marginBottom: '20px',
              fontSize: '0.85rem',
              fontWeight: 700,
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Fantasy Team Name Input */}
          <div>
            <label
              style={{
                fontSize: '0.84rem',
                fontWeight: 700,
                color: '#334155',
                marginBottom: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <Shield size={16} style={{ color: 'var(--fpl-purple)' }} />
              <span>{isRtl ? 'اسم فريق الفانتازي' : 'Fantasy Team Name'}</span>
              <span style={{ color: '#e11d48' }}>*</span>
            </label>
            <input
              type="text"
              required
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              placeholder={isRtl ? 'مثال: أبطال الفانتازي / Gunners XI' : 'e.g. Gunners XI / Al-Ahly FC'}
              style={{
                width: '100%',
                height: '48px',
                padding: '0 16px',
                borderRadius: '12px',
                border: '1px solid #cbd5e1',
                background: '#f8fafc',
                color: '#0f172a',
                fontSize: '0.9rem',
                outline: 'none',
                transition: 'all 0.2s ease',
              }}
            />
          </div>

          {/* Email Address Input */}
          <div>
            <label
              style={{
                fontSize: '0.84rem',
                fontWeight: 700,
                color: '#334155',
                marginBottom: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <Mail size={16} style={{ color: 'var(--fpl-purple)' }} />
              <span>{isRtl ? 'البريد الإلكتروني' : 'Email Address'}</span>
              <span style={{ color: '#e11d48' }}>*</span>
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@gmail.com"
              style={{
                width: '100%',
                height: '48px',
                padding: '0 16px',
                borderRadius: '12px',
                border: '1px solid #cbd5e1',
                background: '#f8fafc',
                color: '#0f172a',
                fontSize: '0.9rem',
                outline: 'none',
                transition: 'all 0.2s ease',
              }}
            />
          </div>

          {/* Password Input with Show/Hide Toggle */}
          <div>
            <label
              style={{
                fontSize: '0.84rem',
                fontWeight: 700,
                color: '#334155',
                marginBottom: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <Lock size={16} style={{ color: 'var(--fpl-purple)' }} />
              <span>{isRtl ? 'كلمة السر' : 'Password'}</span>
              <span style={{ color: '#e11d48' }}>*</span>
            </label>

            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                style={{
                  width: '100%',
                  height: '48px',
                  padding: isRtl ? '0 16px 0 42px' : '0 42px 0 16px',
                  borderRadius: '12px',
                  border: '1px solid #cbd5e1',
                  background: '#f8fafc',
                  color: '#0f172a',
                  fontSize: '0.9rem',
                  outline: 'none',
                  transition: 'all 0.2s ease',
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  [isRtl ? 'left' : 'right']: '12px',
                  background: 'none',
                  border: 'none',
                  color: '#64748b',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: '8px',
              height: '50px',
              background: 'var(--fpl-gradient-primary)',
              color: '#ffffff',
              fontWeight: 800,
              fontSize: '0.95rem',
              borderRadius: '12px',
              border: 'none',
              boxShadow: '0 6px 20px rgba(147, 51, 234, 0.35)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              cursor: 'pointer',
            }}
          >
            <UserCheck size={18} />
            <span>{loading ? t('loading') : (isRtl ? 'إنشاء الحساب' : 'Create Account')}</span>
          </button>
        </form>

        {/* Social Auth Buttons: Google, Facebook, Apple */}
        <SocialAuthButtons mode="register" />

        <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
          {isRtl ? 'لديك حساب بالفعل؟' : 'Already have a team?'}{' '}
          <Link to="/login" style={{ color: 'var(--fpl-purple)', fontWeight: 800 }}>
            {t('login')}
          </Link>
        </p>
      </div>
    </div>
  );
};
