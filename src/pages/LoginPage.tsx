import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const ROLE_ROUTES: Record<string, string> = {
  ADMIN: '/admin', HQ_MANAGER: '/hq', BRANCH_MANAGER: '/branch',
  CHEF: '/chef', CASHIER: '/cashier', WAITER: '/waiter',
  CUSTOMER: '/customer', DELIVERY: '/delivery'
};
export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); setError(''); setLoading(true);
    try {
      const res = await api.post('/api/auth/login', { email, password });
      const data = res.data as { token: string; user: { id: number; name: string; role: string; branchId: number | null } };
      login(data.token, data.user);
      navigate(ROLE_ROUTES[data.user.role] ?? '/');
    } catch { setError('Invalid email or password.'); }
    finally { setLoading(false); }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#1a1a1a', display: 'flex', fontFamily: 'Hanken Grotesk, sans-serif' }}>
      {/* Left Panel */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: 48, background: '#000' }}>
        <div>
          <span style={{ fontFamily: 'Libre Caslon Text, serif', fontSize: 48, fontWeight: 700, color: '#fff' }}>Steakz</span>
        </div>
        <div>
          <h2 style={{ fontFamily: 'Libre Caslon Text, serif', fontSize: 40, fontWeight: 700, color: '#fff', marginBottom: 16, lineHeight: 1.2 }}>Fire-Crafted<br/>Excellence</h2>
          <p style={{ color: '#747878', fontSize: 16, lineHeight: 1.6 }}>Premium steakhouse dining across 8 UK locations. Sign in to access your management portal.</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {['Admin', 'HQ', 'Branch', 'Chef', 'Cashier', 'Waiter'].map(r => (
            <div key={r} style={{ background: '#1a1a1a', padding: '4px 10px', fontSize: 11, fontWeight: 700, color: '#747878', letterSpacing: '0.05em' }}>{r.toUpperCase()}</div>
          ))}
        </div>
      </div>

      {/* Right Panel */}
      <div style={{ width: 480, background: '#fbf9f8', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 48 }}>
        <div style={{ width: '100%', maxWidth: 380 }}>
          <h1 style={{ fontFamily: 'Libre Caslon Text, serif', fontSize: 32, fontWeight: 700, color: '#000', marginBottom: 8 }}>Sign In</h1>
          <p style={{ color: '#747878', fontSize: 14, marginBottom: 32 }}>Enter your credentials to access your dashboard</p>

          {error && (
            <div style={{ background: '#ffdad6', color: '#93000a', padding: '12px 16px', marginBottom: 20, fontSize: 14, borderLeft: '4px solid #af2b3e' }}>{error}</div>
          )}

          <form onSubmit={e => { void handleSubmit(e); }}>
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#444748', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>Email Address</label>
              <input value={email} onChange={e => setEmail(e.target.value)} required type="email" placeholder="your@steakz.com"
                style={{ display: 'block', width: '100%', padding: '12px 14px', border: '1px solid #c4c7c7', fontFamily: 'Hanken Grotesk', fontSize: 15, background: '#fff', outline: 'none' }} />
            </div>
            <div style={{ marginBottom: 32 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#444748', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>Password</label>
              <input value={password} onChange={e => setPassword(e.target.value)} required type="password" placeholder="••••••••"
                style={{ display: 'block', width: '100%', padding: '12px 14px', border: '1px solid #c4c7c7', fontFamily: 'Hanken Grotesk', fontSize: 15, background: '#fff', outline: 'none' }} />
            </div>
            <button type="submit" disabled={loading} style={{ width: '100%', padding: '14px', background: '#af2b3e', color: '#fff', border: 'none', fontFamily: 'Hanken Grotesk', fontSize: 13, fontWeight: 700, cursor: 'pointer', letterSpacing: '0.05em' }}>
              {loading ? 'SIGNING IN...' : 'SIGN IN'}
            </button>
          </form>

          <div style={{ marginTop: 24, paddingTop: 24, borderTop: '1px solid #c4c7c7' }}>
           <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
  <Link to="/menu" style={{ fontSize: 13, color: '#af2b3e', fontWeight: 600, textDecoration: 'none' }}>
    Browse menu without signing in →
  </Link>
  <Link to="/register" style={{ fontSize: 13, color: '#444748', textDecoration: 'none' }}>
    New customer? Create an account →
  </Link>
</div>
          </div>
        </div>
      </div>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Libre+Caslon+Text:wght@400;700&family=Hanken+Grotesk:wght@400;500;600;700&display=swap');
      `}</style>
    </div>
  );
}
