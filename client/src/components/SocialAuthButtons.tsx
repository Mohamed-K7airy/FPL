import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

interface SocialAuthButtonsProps {
  mode?: 'login' | 'register';
}

export const SocialAuthButtons: React.FC<SocialAuthButtonsProps> = ({ mode = 'login' }) => {
  const { isRtl } = useLanguage();
  const navigate = useNavigate();
  const [loadingProvider, setLoadingProvider] = useState<string | null>(null);

  const handleSocialAuth = async (provider: 'google' | 'facebook') => {
    setLoadingProvider(provider);
    try {
      // 1. Fetch OAuth URL from Supabase with skipBrowserRedirect enabled
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: provider,
        options: {
          redirectTo: `${window.location.origin}/squad`,
          skipBrowserRedirect: true,
        },
      });

      if (error) {
        throw error;
      }

      if (data?.url) {
        // Calculate center position for popup window
        const width = 540;
        const height = 650;
        const left = window.screenX + (window.outerWidth - width) / 2;
        const top = window.screenY + (window.outerHeight - height) / 2;

        // Open OAuth in Popup Window instead of main browser page
        const popup = window.open(
          data.url,
          `supabase_oauth_${provider}`,
          `width=${width},height=${height},left=${left},top=${top},scrollbars=yes,status=yes`
        );

        // Check for popup closure / completion
        if (popup) {
          const timer = setInterval(async () => {
            if (popup.closed) {
              clearInterval(timer);
              setLoadingProvider(null);
              const { data: sessionData } = await supabase.auth.getSession();
              if (sessionData?.session) {
                navigate('/squad');
              }
            }
          }, 600);
          return;
        }
      }
    } catch (err: any) {
      console.error(`Social ${provider} sign-in failed:`, err?.message);
      alert(
        isRtl
          ? `تعذر تسجيل الدخول عبر ${provider === 'google' ? 'Google' : 'Facebook'}. يرجى المحاولة مرة أخرى أو استخدام البريد الإلكتروني.`
          : `Unable to sign in with ${provider === 'google' ? 'Google' : 'Facebook'}. Please try again or use email login.`
      );
    } finally {
      setLoadingProvider(null);
    }
  };

  return (
    <div style={{ marginTop: '20px', width: '100%' }}>
      {/* Divider */}
      <div style={{ display: 'flex', alignItems: 'center', margin: '18px 0', color: '#94a3b8', fontSize: '0.82rem', fontWeight: 600 }}>
        <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }} />
        <span style={{ padding: '0 12px' }}>
          {isRtl
            ? mode === 'login' ? 'أو تسجيل الدخول بواسطة' : 'أو إنشاء حساب بواسطة'
            : mode === 'login' ? 'Or sign in with' : 'Or sign up with'}
        </span>
        <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }} />
      </div>

      {/* Icon-Only Social Buttons Row (Google & Facebook) */}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '20px' }}>
        {/* Google Icon-Only Button */}
        <button
          type="button"
          disabled={loadingProvider !== null}
          onClick={() => handleSocialAuth('google')}
          title="تسجيل الدخول بحساب Google"
          aria-label="Google Login"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '54px',
            height: '54px',
            background: '#ffffff',
            border: '1.5px solid #e2e8f0',
            borderRadius: '16px',
            cursor: loadingProvider ? 'wait' : 'pointer',
            opacity: loadingProvider === 'google' ? 0.6 : 1,
            transition: 'all 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.04)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#f8fafc';
            e.currentTarget.style.borderColor = '#cbd5e1';
            e.currentTarget.style.transform = 'translateY(-3px)';
            e.currentTarget.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.08)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = '#ffffff';
            e.currentTarget.style.borderColor = '#e2e8f0';
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.04)';
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
          </svg>
        </button>

        {/* Facebook Icon-Only Button */}
        <button
          type="button"
          disabled={loadingProvider !== null}
          onClick={() => handleSocialAuth('facebook')}
          title="تسجيل الدخول بحساب Facebook"
          aria-label="Facebook Login"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '54px',
            height: '54px',
            background: '#ffffff',
            border: '1.5px solid #e2e8f0',
            borderRadius: '16px',
            cursor: loadingProvider ? 'wait' : 'pointer',
            opacity: loadingProvider === 'facebook' ? 0.6 : 1,
            transition: 'all 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.04)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#f0f7ff';
            e.currentTarget.style.borderColor = '#1877F2';
            e.currentTarget.style.transform = 'translateY(-3px)';
            e.currentTarget.style.boxShadow = '0 8px 20px rgba(24, 119, 242, 0.22)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = '#ffffff';
            e.currentTarget.style.borderColor = '#e2e8f0';
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.04)';
          }}
        >
          <svg width="26" height="26" viewBox="0 0 24 24" fill="#1877F2">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
          </svg>
        </button>
      </div>
    </div>
  );
};
