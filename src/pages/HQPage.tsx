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

  const totalRevenue = stats.reduce((s, b) => s + b.totalRevenue, 0);
  const totalOrders = stats.reduce((s, b) => s + b.totalOrders, 0);

  async function loadDetail() {
    if (!selected) return;
    const params: Record<string, string> = {};
    if (from) params['from'] = from;
    if (to) params['to'] = to;
    const r = await api.get(`/api/hq/branches/${selected}/stats`, { params });
    setDetail(r.data as { totalOrders: number; revenue: number });
  }

  return (
    <div style={{ fontFamily: 'Hanken Grotesk, sans-serif', minHeight: '100vh', background: '#fbf9f8', overflow: 'hidden' }}>
      {/* Sidebar */}
      <aside style={{ position: 'fixed', left: 0, top: 0, width: 256, height: '100vh', background: '#efeded', borderRight: '1px solid #c4c7c7', display: 'flex', flexDirection: 'column', padding: '24px 0', zIndex: 50 }}>
        <div style={{ padding: '0 24px', marginBottom: 40 }}>
          <span style={{ fontFamily: 'Libre Caslon Text, serif', fontSize: 48, fontWeight: 700, color: '#000', lineHeight: 1 }}>Steakz</span>
        </div>
        <nav style={{ flex: 1 }}>
          {[
            { icon: 'dashboard', label: 'Dashboard', active: true },
            { icon: 'inventory_2', label: 'Inventory', active: false },
            { icon: 'groups', label: 'Staff Management', active: false },
            { icon: 'analytics', label: 'Branch Analytics', active: false },
            { icon: 'restaurant_menu', label: 'Menu Editor', active: false },
            { icon: 'settings', label: 'Settings', active: false },
          ].map(item => (
            <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', margin: '2px 8px', borderRadius: 4, background: item.active ? '#000' : 'transparent', color: item.active ? '#fff' : '#444748', cursor: 'pointer', fontSize: 14, fontWeight: item.active ? 600 : 400 }}>
              <span className="material-symbols-outlined" style={{ fontSize: 20 }}>{item.icon}</span>
              {item.label}
            </div>
          ))}
        </nav>
        <div style={{ padding: '16px', borderTop: '1px solid #c4c7c7', margin: '0 8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#c4c7c7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>👤</div>
            <div>
              <p style={{ fontSize: 15, fontWeight: 600, color: '#000', margin: 0 }}>{user?.name}</p>
              <p style={{ fontSize: 12, fontWeight: 700, color: '#af2b3e', margin: 0 }}>HQ Manager</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Header */}
      <header style={{ position: 'sticky', top: 0, marginLeft: 256, zIndex: 40, background: '#fbf9f8', borderBottom: '1px solid #c4c7c7', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span className="material-symbols-outlined">analytics</span>
          <h1 style={{ fontFamily: 'Libre Caslon Text, serif', fontSize: 28, fontWeight: 600, margin: 0 }}>Headquarters Dashboard</h1>
        </div>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          <select style={{ padding: '8px 14px', border: '1px solid #c4c7c7', borderRadius: 4, fontFamily: 'Hanken Grotesk', fontSize: 13, background: '#fff' }}>
            <option>This Month</option>
            <option>This Week</option>
            <option>Today</option>
          </select>
          <button onClick={() => { logout(); navigate('/login'); }} style={{ background: '#000', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: 4, fontFamily: 'Hanken Grotesk', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>LOGOUT</button>
        </div>
      </header>

      {/* Main */}
      <main style={{ marginLeft: 256, padding: 24, height: 'calc(100vh - 80px)', overflowY: 'auto' }}>

        {/* KPI Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24, marginBottom: 24 }}>
          {[
            { label: 'Total Network Sales', value: `£${totalRevenue.toFixed(2)}`, sub: 'Across all branches', color: '#000' },
            { label: 'Customer Footfall', value: String(totalOrders), sub: 'Total orders', color: '#000' },
            { label: 'Total Branches', value: String(stats.length), sub: 'Operating', color: '#af2b3e' },
            { label: 'Top Revenue Branch', value: stats.sort((a,b) => b.totalRevenue - a.totalRevenue)[0]?.city ?? '—', sub: 'Best performer', color: '#000' },
          ].map(k => (
            <div key={k.label} style={{ background: '#fff', border: '1px solid #c4c7c7', padding: 20, boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#444748', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>{k.label}</div>
              <div style={{ fontFamily: 'Libre Caslon Text, serif', fontSize: 36, fontWeight: 700, color: k.color, lineHeight: 1, marginBottom: 6 }}>{k.value}</div>
              <div style={{ fontSize: 12, color: '#747878' }}>{k.sub}</div>
            </div>
          ))}
        </div>

        {/* Branch Table */}
        <div style={{ background: '#fff', border: '1px solid #c4c7c7', marginBottom: 24, boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #c4c7c7' }}>
            <h3 style={{ fontFamily: 'Libre Caslon Text, serif', fontSize: 20, fontWeight: 600, margin: 0 }}>Network Performance Detail</h3>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'Hanken Grotesk', fontSize: 14 }}>
            <thead>
              <tr style={{ background: '#000', color: '#fff' }}>
                {['Branch Name', 'City', 'Total Orders', 'Active Staff', 'Revenue', 'Performance'].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '12px 16px', fontSize: 12, fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {stats.map((b, i) => (
                <tr key={b.id} style={{ borderBottom: '1px solid #c4c7c7', background: i % 2 === 0 ? '#fff' : '#f5f3f3' }}>
                  <td style={{ padding: '14px 16px', fontWeight: 600 }}>{b.name}</td>
                  <td style={{ padding: '14px 16px', color: '#444748' }}>{b.city}</td>
                  <td style={{ padding: '14px 16px', fontFamily: 'JetBrains Mono, monospace' }}>{b.totalOrders}</td>
                  <td style={{ padding: '14px 16px', fontFamily: 'JetBrains Mono, monospace' }}>{b.totalStaff}</td>
                  <td style={{ padding: '14px 16px', fontFamily: 'JetBrains Mono, monospace', fontWeight: 700, color: '#16a085' }}>£{b.totalRevenue.toFixed(2)}</td>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ background: '#e9e8e7', borderRadius: 2, height: 6, width: 120, overflow: 'hidden' }}>
                      <div style={{ height: '100%', background: '#af2b3e', width: b.totalOrders > 0 ? '80%' : '10%' }} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Branch Detail Filter */}
        <div style={{ background: '#fff', border: '1px solid #c4c7c7', padding: 20, boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
          <h3 style={{ fontFamily: 'Libre Caslon Text, serif', fontSize: 20, fontWeight: 600, marginBottom: 16 }}>Branch Drill-Down</h3>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 16 }}>
            <select value={selected} onChange={e => setSelected(e.target.value)}
              style={{ padding: '8px 14px', border: '1px solid #c4c7c7', borderRadius: 4, fontFamily: 'Hanken Grotesk', fontSize: 14, minWidth: 200 }}>
              <option value="">Select branch...</option>
              {stats.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
            </select>
            <input type="date" value={from} onChange={e => setFrom(e.target.value)}
              style={{ padding: '8px 12px', border: '1px solid #c4c7c7', borderRadius: 4, fontFamily: 'Hanken Grotesk', fontSize: 14 }} />
            <input type="date" value={to} onChange={e => setTo(e.target.value)}
              style={{ padding: '8px 12px', border: '1px solid #c4c7c7', borderRadius: 4, fontFamily: 'Hanken Grotesk', fontSize: 14 }} />
            <button onClick={() => { void loadDetail(); }}
              style={{ background: '#000', color: '#fff', border: 'none', padding: '8px 24px', borderRadius: 4, fontFamily: 'Hanken Grotesk', fontSize: 12, fontWeight: 700, cursor: 'pointer', letterSpacing: '0.05em' }}>
              VIEW STATS
            </button>
          </div>
          {detail && (
            <div style={{ display: 'flex', gap: 16 }}>
              <div style={{ background: '#f5f3f3', padding: '16px 24px', borderRadius: 4, border: '1px solid #c4c7c7' }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#444748', textTransform: 'uppercase', marginBottom: 6 }}>Orders</div>
                <div style={{ fontFamily: 'Libre Caslon Text, serif', fontSize: 36, fontWeight: 700, color: '#000' }}>{detail.totalOrders}</div>
              </div>
              <div style={{ background: '#f5f3f3', padding: '16px 24px', borderRadius: 4, border: '1px solid #c4c7c7' }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#444748', textTransform: 'uppercase', marginBottom: 6 }}>Revenue</div>
                <div style={{ fontFamily: 'Libre Caslon Text, serif', fontSize: 36, fontWeight: 700, color: '#af2b3e' }}>£{Number(detail.revenue).toFixed(2)}</div>
              </div>
            </div>
          )}
        </div>
      </main>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Libre+Caslon+Text:wght@400;700&family=Hanken+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@500&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap');
        .material-symbols-outlined { font-variation-settings: 'FILL' 0,'wght' 400,'GRAD' 0,'opsz' 24; font-family: 'Material Symbols Outlined'; }
      `}</style>
    </div>
  );
}
