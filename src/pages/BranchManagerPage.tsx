import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

interface Order { id: number; status: string; totalAmount: string; table: { tableNumber: number }; waiter: { name: string }; createdAt: string }
interface DashData { todayOrders: number; todayRevenue: number; activeStaff: number; branchName: string }

const STATUS_COLORS: Record<string,string> = { PENDING:'#c2410c', PREPARING:'#1d4ed8', READY:'#15803d', SERVED:'#6b21a8', PAID:'#444748', CANCELLED:'#af2b3e' };

export default function BranchManagerPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [dash, setDash] = useState<DashData | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    void api.get('/api/branch/dashboard').then(r => setDash(r.data as DashData));
    void api.get('/api/branch/orders').then(r => setOrders(r.data as Order[]));
  }, []);

  return (
    <div style={{ fontFamily: 'Hanken Grotesk, sans-serif', minHeight: '100vh', background: '#fbf9f8', overflow: 'hidden' }}>
      <aside style={{ position: 'fixed', left: 0, top: 0, width: 256, height: '100vh', background: '#efeded', borderRight: '1px solid #c4c7c7', display: 'flex', flexDirection: 'column', padding: '24px 0', zIndex: 50 }}>
        <div style={{ padding: '0 24px', marginBottom: 40 }}>
          <span style={{ fontFamily: 'Libre Caslon Text, serif', fontSize: 48, fontWeight: 700, color: '#000', lineHeight: 1 }}>Steakz</span>
        </div>
        <nav style={{ flex: 1 }}>
          {[
            { icon: 'dashboard', label: 'Dashboard', active: true },
            { icon: 'receipt_long', label: 'Orders', active: false },
            { icon: 'groups', label: 'Staff', active: false },
            { icon: 'inventory_2', label: 'Inventory', active: false },
            { icon: 'analytics', label: 'Analytics', active: false },
          ].map(item => (
            <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', margin: '2px 8px', borderRadius: 4, background: item.active ? '#000' : 'transparent', color: item.active ? '#fff' : '#444748', cursor: 'pointer', fontSize: 14, fontWeight: item.active ? 600 : 400 }}>
              <span className="material-symbols-outlined" style={{ fontSize: 20 }}>{item.icon}</span>
              {item.label}
            </div>
          ))}
        </nav>
        <div style={{ padding: '16px', borderTop: '1px solid #c4c7c7', margin: '0 8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#1d4ed8', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 16, fontWeight: 700 }}>BM</div>
            <div>
              <p style={{ fontSize: 15, fontWeight: 600, color: '#000', margin: 0 }}>{user?.name}</p>
              <p style={{ fontSize: 12, fontWeight: 700, color: '#af2b3e', margin: 0 }}>Branch Manager</p>
            </div>
          </div>
        </div>
      </aside>

      <header style={{ position: 'sticky', top: 0, marginLeft: 256, zIndex: 40, background: '#fbf9f8', borderBottom: '1px solid #c4c7c7', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span className="material-symbols-outlined">store</span>
          <h1 style={{ fontFamily: 'Libre Caslon Text, serif', fontSize: 28, fontWeight: 600, margin: 0 }}>Branch Dashboard</h1>
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <div style={{ background: '#e9e8e7', padding: '6px 14px', borderRadius: 4, fontSize: 12, fontWeight: 700, color: '#444748' }}>{dash?.branchName ?? ''} — YOUR BRANCH ONLY</div>
          <button onClick={() => { logout(); navigate('/login'); }} style={{ background: '#000', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: 4, fontFamily: 'Hanken Grotesk', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>LOGOUT</button>
        </div>
      </header>

      <main style={{ marginLeft: 256, padding: 24, height: 'calc(100vh - 80px)', overflowY: 'auto' }}>
        {dash && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24, marginBottom: 24 }}>
            {[
              { label: "Today's Orders", value: String(dash.todayOrders), icon: 'receipt_long', color: '#1d4ed8' },
              { label: "Today's Revenue", value: `£${dash.todayRevenue.toFixed(2)}`, icon: 'payments', color: '#af2b3e' },
              { label: 'Active Staff', value: String(dash.activeStaff), icon: 'groups', color: '#15803d' },
            ].map(k => (
              <div key={k.label} style={{ background: '#fff', border: '1px solid #c4c7c7', padding: 20, boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#444748', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{k.label}</div>
                  <span className="material-symbols-outlined" style={{ color: k.color, fontSize: 24 }}>{k.icon}</span>
                </div>
                <div style={{ fontFamily: 'Libre Caslon Text, serif', fontSize: 40, fontWeight: 700, color: k.color, lineHeight: 1 }}>{k.value}</div>
              </div>
            ))}
          </div>
        )}

        <div style={{ background: '#fff', border: '1px solid #c4c7c7', boxShadow: '0 1px 2px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #c4c7c7', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontFamily: 'Libre Caslon Text, serif', fontSize: 20, fontWeight: 600, margin: 0 }}>Live Order Queue</h3>
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 13, color: '#af2b3e', fontWeight: 700 }}>{orders.length} orders</span>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'Hanken Grotesk', fontSize: 14 }}>
            <thead>
              <tr style={{ background: '#000', color: '#fff' }}>
                {['Order #', 'Table', 'Waiter', 'Total', 'Status', 'Time'].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '12px 16px', fontSize: 11, fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orders.map((o, i) => (
                <tr key={o.id} style={{ borderBottom: '1px solid #c4c7c7', background: i % 2 === 0 ? '#fff' : '#f5f3f3' }}>
                  <td style={{ padding: '14px 16px', fontFamily: 'JetBrains Mono, monospace', color: '#747878' }}>#{o.id}</td>
                  <td style={{ padding: '14px 16px', fontWeight: 700 }}>Table {o.table.tableNumber}</td>
                  <td style={{ padding: '14px 16px', color: '#444748' }}>{o.waiter.name}</td>
                  <td style={{ padding: '14px 16px', fontFamily: 'JetBrains Mono, monospace', fontWeight: 700 }}>£{Number(o.totalAmount).toFixed(2)}</td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{ background: (STATUS_COLORS[o.status] ?? '#555') + '15', color: STATUS_COLORS[o.status] ?? '#555', padding: '4px 10px', borderRadius: 2, fontSize: 11, fontWeight: 700, letterSpacing: '0.05em' }}>{o.status}</span>
                  </td>
                  <td style={{ padding: '14px 16px', fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: '#747878' }}>{new Date(o.createdAt).toLocaleTimeString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {orders.length === 0 && <div style={{ padding: 40, textAlign: 'center', color: '#747878', fontFamily: 'Hanken Grotesk' }}>No orders yet today.</div>}
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
