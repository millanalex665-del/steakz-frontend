import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); setError(''); setLoading(true);
    try {
      await api.post('/api/customer/register', { name, email, password });
      navigate('/login');
    } catch (err: unknown) {
  const error = err as { response?: { data?: { error?: string } } };
  setError(error.response?.data?.error ?? 'Registration failed. Please try again.');
}
    finally { setLoading(false); }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#1a1a1a', display: 'flex', fontFamily: 'Hanken Grotesk, sans-serif' }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: 48, background: '#000' }}>
        <span style={{ fontFamily: 'Libre Caslon Text, serif', fontSize: 48, fontWeight: 700, color: '#fff' }}>Steakz</span>
        <div>
          <h2 style={{ fontFamily: 'Libre Caslon Text, serif', fontSize: 40, fontWeight: 700, color: '#fff', marginBottom: 16, lineHeight: 1.2 }}>Join the<br/>Experience</h2>
          <p style={{ color: '#747878', fontSize: 16, lineHeight: 1.6 }}>Create your account to browse our menu and track your orders across all Steakz locations.</p>
        </div>
        <div />
      </div>
      <div style={{ width: 480, background: '#fbf9f8', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 48 }}>
        <div style={{ width: '100%', maxWidth: 380 }}>
          <h1 style={{ fontFamily: 'Libre Caslon Text, serif', fontSize: 32, fontWeight: 700, color: '#000', marginBottom: 8 }}>Create Account</h1>
          <p style={{ color: '#747878', fontSize: 14, marginBottom: 32 }}>Register as a customer to get started</p>
          {error && <div style={{ background: '#ffdad6', color: '#93000a', padding: '12px 16px', marginBottom: 20, fontSize: 14, borderLeft: '4px solid #af2b3e' }}>{error}</div>}
          <form onSubmit={e => { void handleSubmit(e); }}>
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#444748', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>Full Name</label>
              <input value={name} onChange={e => setName(e.target.value)} required placeholder="John Smith"
                style={{ display: 'block', width: '100%', padding: '12px 14px', border: '1px solid #c4c7c7', fontFamily: 'Hanken Grotesk', fontSize: 15, outline: 'none' }} />
            </div>
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#444748', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>Email Address</label>
              <input value={email} onChange={e => setEmail(e.target.value)} required type="email" placeholder="john@example.com"
                style={{ display: 'block', width: '100%', padding: '12px 14px', border: '1px solid #c4c7c7', fontFamily: 'Hanken Grotesk', fontSize: 15, outline: 'none' }} />
            </div>
            <div style={{ marginBottom: 32 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#444748', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>Password</label>
              <input value={password} onChange={e => setPassword(e.target.value)} required type="password" placeholder="••••••••"
                style={{ display: 'block', width: '100%', padding: '12px 14px', border: '1px solid #c4c7c7', fontFamily: 'Hanken Grotesk', fontSize: 15, outline: 'none' }} />
            </div>
            <button type="submit" disabled={loading} style={{ width: '100%', padding: '14px', background: '#af2b3e', color: '#fff', border: 'none', fontFamily: 'Hanken Grotesk', fontSize: 13, fontWeight: 700, cursor: 'pointer', letterSpacing: '0.05em' }}>
              {loading ? 'CREATING ACCOUNT...' : 'CREATE ACCOUNT'}
            </button>
          </form>
          <div style={{ marginTop: 24, paddingTop: 24, borderTop: '1px solid #c4c7c7' }}>
            <Link to="/login" style={{ fontSize: 13, color: '#af2b3e', fontWeight: 600, textDecoration: 'none' }}>
              Already have an account? Sign in →
            </Link>
          </div>
        </div>
      </div>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Libre+Caslon+Text:wght@400;700&family=Hanken+Grotesk:wght@400;500;600;700&display=swap');`}</style>
    </div>
  );
}