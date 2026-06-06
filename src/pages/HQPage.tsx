import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

interface BranchStat { id: number; name: string; city: string; totalOrders: number; totalStaff: number; totalRevenue: number }

export default function HQPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<BranchStat[]>([]);
  const [selected, setSelected] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [detail, setDetail] = useState<{ totalOrders: number; revenue: number } | null>(null);

  useEffect(() => {
    void api.get('/api/hq/dashboard').then(r => setStats(r.data as BranchStat[]));
  }, []);

  async function loadDetail() {
    if (!selected) return;
    const params: Record<string, string> = {};
    if (from) params['from'] = from;
    if (to) params['to'] = to;
    const r = await api.get(`/api/hq/branches/${selected}/stats`, { params });
    setDetail(r.data as { totalOrders: number; revenue: number });
  }

  const totalRevenue = stats.reduce((s, b) => s + b.totalRevenue, 0);
  const totalOrders = stats.reduce((s, b) => s + b.totalOrders, 0);

  return (
    <div style={{ minHeight: '100vh', background: '#fbf9f8' }}>
      <div style={{ background: '#1a1a1a', color: '#fff', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 56 }}>
        <span style={{ fontWeight: 700, fontSize: 20 }}>🥩 Steakz MIS</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ fontSize: 13, color: '#ccc' }}>Welcome, {user?.name}</span>
          <span style={{ background: '#8e44ad', padding: '3px 10px', borderRadius: 12, fontSize: 12, fontWeight: 600 }}>HQ MANAGER</span>
          <button onClick={() => { logout(); navigate('/login'); }} style={{ background: '#af2b3e', color: '#fff', border: 'none', padding: '6px 14px', borderRadius: 6, cursor: 'pointer', fontSize: 13 }}>Logout</button>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 16px' }}>
        <h1 style={{ fontSize: 26, marginBottom: 6, fontFamily: 'serif' }}>📊 HQ Dashboard</h1>
        <p style={{ color: '#666', marginBottom: 24 }}>Monitor all branches — read only</p>

        <div style={{ display: 'flex', gap: 16, marginBottom: 28, flexWrap: 'wrap' }}>
          {[
            { label: 'Total Branches', value: String(stats.length), color: '#8e44ad' },
            { label: 'Total Orders', value: String(totalOrders), color: '#2980b9' },
            { label: 'Total Revenue', value: `£${totalRevenue.toFixed(2)}`, color: '#af2b3e' },
          ].map(c => (
            <div key={c.label} style={{ background: '#fff', padding: '20px 24px', borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', flex: 1 }}>
              <p style={{ color: '#888', fontSize: 13, marginBottom: 6 }}>{c.label}</p>
              <p style={{ fontSize: 28, fontWeight: 800, color: c.color, fontFamily: 'monospace' }}>{c.value}</p>
            </div>
          ))}
        </div>

        <div style={{ background: '#fff', borderRadius: 12, padding: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', marginBottom: 24 }}>
          <h3 style={{ marginBottom: 16 }}>All Branch Performance</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
            <thead>
              <tr style={{ background: '#1a1a1a', color: '#fff' }}>
                {['Branch', 'City', 'Orders', 'Staff', 'Revenue'].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '10px 8px' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {stats.map(b => (
                <tr key={b.id} style={{ borderBottom: '1px solid #f5f5f5' }}>
                  <td style={{ padding: '10px 8px', fontWeight: 600 }}>{b.name}</td>
                  <td style={{ padding: '10px 8px', color: '#666' }}>{b.city}</td>
                  <td style={{ padding: '10px 8px' }}>{b.totalOrders}</td>
                  <td style={{ padding: '10px 8px' }}>{b.totalStaff}</td>
                  <td style={{ padding: '10px 8px', fontWeight: 700, color: '#27ae60', fontFamily: 'monospace' }}>£{b.totalRevenue.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ background: '#fff', borderRadius: 12, padding: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
          <h3 style={{ marginBottom: 16 }}>Branch Detail — Filter by Date</h3>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 16 }}>
            <select value={selected} onChange={e => setSelected(e.target.value)}
              style={{ padding: '8px 14px', borderRadius: 8, border: '1px solid #ddd', fontSize: 14 }}>
              <option value="">Select branch</option>
              {stats.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
            </select>
            <input type="date" value={from} onChange={e => setFrom(e.target.value)}
              style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid #ddd', fontSize: 14 }} />
            <input type="date" value={to} onChange={e => setTo(e.target.value)}
              style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid #ddd', fontSize: 14 }} />
            <button onClick={() => { void loadDetail(); }}
              style={{ background: '#8e44ad', color: '#fff', border: 'none', padding: '8px 20px', borderRadius: 8, cursor: 'pointer', fontWeight: 600 }}>
              View
            </button>
          </div>
          {detail && (
            <div style={{ display: 'flex', gap: 16 }}>
              <div style={{ background: '#f9f3ff', padding: '16px 24px', borderRadius: 10 }}>
                <p style={{ color: '#888', fontSize: 13 }}>Orders</p>
                <p style={{ fontSize: 26, fontWeight: 800, color: '#8e44ad', fontFamily: 'monospace' }}>{detail.totalOrders}</p>
              </div>
              <div style={{ background: '#f0fdf4', padding: '16px 24px', borderRadius: 10 }}>
                <p style={{ color: '#888', fontSize: 13 }}>Revenue</p>
                <p style={{ fontSize: 26, fontWeight: 800, color: '#27ae60', fontFamily: 'monospace' }}>£{Number(detail.revenue).toFixed(2)}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}