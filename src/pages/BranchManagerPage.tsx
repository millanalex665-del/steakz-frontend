import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

interface Order { id: number; status: string; totalAmount: string; table: { tableNumber: number }; waiter: { name: string }; createdAt: string }
interface DashData { todayOrders: number; todayRevenue: number; activeStaff: number }

export default function BranchManagerPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [dash, setDash] = useState<DashData | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    void api.get('/api/branch/dashboard').then(r => setDash(r.data as DashData));
    void api.get('/api/branch/orders').then(r => setOrders(r.data as Order[]));
  }, []);

  const STATUS_COLORS: Record<string, string> = {
    PENDING: '#e67e22', PREPARING: '#2980b9', READY: '#27ae60', SERVED: '#8e44ad', PAID: '#555', CANCELLED: '#af2b3e'
  };

  return (
    <div style={{ minHeight: '100vh', background: '#fbf9f8' }}>
      <div style={{ background: '#1a1a1a', color: '#fff', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 56 }}>
        <span style={{ fontWeight: 700, fontSize: 20 }}>🥩 Steakz MIS</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ fontSize: 13, color: '#ccc' }}>Welcome, {user?.name}</span>
          <span style={{ background: '#2980b9', padding: '3px 10px', borderRadius: 12, fontSize: 12, fontWeight: 600 }}>BRANCH MANAGER</span>
          <button onClick={() => { logout(); navigate('/login'); }} style={{ background: '#af2b3e', color: '#fff', border: 'none', padding: '6px 14px', borderRadius: 6, cursor: 'pointer', fontSize: 13 }}>Logout</button>
        </div>
      </div>

      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '32px 16px' }}>
        <h1 style={{ fontSize: 26, marginBottom: 6, fontFamily: 'serif' }}>🏢 Branch Manager Dashboard</h1>
        <p style={{ color: '#666', marginBottom: 24 }}>Your branch data only</p>

        {dash && (
          <div style={{ display: 'flex', gap: 16, marginBottom: 28, flexWrap: 'wrap' }}>
            {[
              { label: "Today's Orders", value: String(dash.todayOrders), color: '#2980b9', icon: '🛒' },
              { label: "Today's Revenue", value: `£${dash.todayRevenue.toFixed(2)}`, color: '#af2b3e', icon: '💷' },
              { label: 'Active Staff', value: String(dash.activeStaff), color: '#27ae60', icon: '👥' },
            ].map(c => (
              <div key={c.label} style={{ background: '#fff', padding: '20px 24px', borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', flex: 1 }}>
                <div style={{ fontSize: 24, marginBottom: 8 }}>{c.icon}</div>
                <p style={{ color: '#888', fontSize: 13 }}>{c.label}</p>
                <p style={{ fontSize: 26, fontWeight: 800, color: c.color, fontFamily: 'monospace' }}>{c.value}</p>
              </div>
            ))}
          </div>
        )}

        <div style={{ background: '#fff', borderRadius: 12, padding: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
          <h3 style={{ marginBottom: 16 }}>Order Queue ({orders.length})</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
            <thead>
              <tr style={{ background: '#1a1a1a', color: '#fff' }}>
                {['#', 'Table', 'Waiter', 'Total', 'Status', 'Time'].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '10px 8px' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orders.map(o => (
                <tr key={o.id} style={{ borderBottom: '1px solid #f5f5f5' }}>
                  <td style={{ padding: '10px 8px', color: '#aaa' }}>#{o.id}</td>
                  <td style={{ padding: '10px 8px', fontWeight: 600 }}>Table {o.table.tableNumber}</td>
                  <td style={{ padding: '10px 8px', color: '#666' }}>{o.waiter.name}</td>
                  <td style={{ padding: '10px 8px', fontWeight: 700, fontFamily: 'monospace' }}>£{Number(o.totalAmount).toFixed(2)}</td>
                  <td style={{ padding: '10px 8px' }}>
                    <span style={{ background: (STATUS_COLORS[o.status] ?? '#555') + '22', color: STATUS_COLORS[o.status] ?? '#555', padding: '3px 10px', borderRadius: 10, fontSize: 12, fontWeight: 700 }}>
                      {o.status}
                    </span>
                  </td>
                  <td style={{ padding: '10px 8px', color: '#aaa', fontSize: 12 }}>{new Date(o.createdAt).toLocaleTimeString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {orders.length === 0 && <p style={{ color: '#aaa', textAlign: 'center', marginTop: 20 }}>No orders yet.</p>}
        </div>
      </div>
    </div>
  );
}