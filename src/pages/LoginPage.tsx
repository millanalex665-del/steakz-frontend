import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const ROLE_ROUTES: Record<string, string> = {
  ADMIN: '/admin',
  HQ_MANAGER: '/hq',
  BRANCH_MANAGER: '/branch',
  CHEF: '/chef',
  CASHIER: '/cashier',
  WAITER: '/waiter'
};

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.post('/api/auth/login', { email, password });
      const data = res.data as { token: string; user: { id: number; name: string; role: string; branchId: number | null } };
      login(data.token, data.user);
      navigate(ROLE_ROUTES[data.user.role] ?? '/');
    } catch {
      setError('Invalid email or password.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fbf9f8' }}>
      <div style={{ background: '#fff', padding: 40, borderRadius: 12, boxShadow: '0 4px 24px rgba(0,0,0,0.08)', width: 380 }}>
        <h2 style={{ marginBottom: 8, fontSize: 28, fontFamily: 'serif' }}>🥩 Steakz</h2>
        <p style={{ color: '#666', marginBottom: 28, fontSize: 14 }}>Sign in to your dashboard</p>
        {error && (
          <div style={{ background: '#fdecea', color: '#c0392b', padding: '10px 14px', borderRadius: 8, marginBottom: 16, fontSize: 14 }}>
            {error}
          </div>
        )}
        <form onSubmit={(e) => { void handleSubmit(e); }}>
          <label style={{ fontSize: 13, fontWeight: 600, color: '#555' }}>Email</label>
          <input
            value={email}
            onChange={e => setEmail(e.target.value)}
            required type="email"
            style={{ display: 'block', width: '100%', padding: '10px 12px', margin: '6px 0 16px', border: '1px solid #ddd', borderRadius: 8, fontSize: 14 }}
          />
          <label style={{ fontSize: 13, fontWeight: 600, color: '#555' }}>Password</label>
          <input
            value={password}
            onChange={e => setPassword(e.target.value)}
            required type="password"
            style={{ display: 'block', width: '100%', padding: '10px 12px', margin: '6px 0 24px', border: '1px solid #ddd', borderRadius: 8, fontSize: 14 }}
          />
          <button
            type="submit"
            disabled={loading}
            style={{ width: '100%', padding: 12, background: '#af2b3e', color: '#fff', border: 'none', borderRadius: 8, fontSize: 15, fontWeight: 600, cursor: 'pointer' }}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        <p style={{ marginTop: 16, fontSize: 13, color: '#888', textAlign: 'center' }}>
          <Link to="/menu" style={{ color: '#af2b3e' }}>Browse menu without logging in →</Link>
        </p>
      </div>
    </div>
  );
}