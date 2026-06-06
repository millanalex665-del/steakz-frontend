import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

interface OrderItem { menuItem: { name: string }; quantity: number }
interface Order { id: number; status: string; notes: string | null; table: { tableNumber: number }; items: OrderItem[]; createdAt: string }
interface MenuItem { id: number; name: string; category: string; price: string; available: boolean }

export default function ChefPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [tab, setTab] = useState<'orders' | 'menu'>('orders');
  const [editId, setEditId] = useState<number | null>(null);
  const [editData, setEditData] = useState({ name: '', price: '', available: true });
  const [msg, setMsg] = useState('');

  useEffect(() => { void reload(); }, []);

  async function reload() {
    const [o, m] = await Promise.all([api.get('/api/chef/orders'), api.get('/api/chef/menu')]);
    setOrders(o.data as Order[]);
    setMenu(m.data as MenuItem[]);
  }

  async function markReady(id: number) {
    await api.patch(`/api/chef/orders/${id}/ready`);
    setMsg(`✅ Order #${id} marked as READY`);
    void reload();
  }

  async function saveEdit(id: number) {
    await api.patch(`/api/chef/menu/${id}`, { name: editData.name, price: Number(editData.price), available: editData.available });
    setEditId(null);
    setMsg('✅ Menu item updated');
    void reload();
  }

  return (
    <div style={{ minHeight: '100vh', background: '#fbf9f8' }}>
      <div style={{ background: '#1a1a1a', color: '#fff', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 56 }}>
        <span style={{ fontWeight: 700, fontSize: 20 }}>🥩 Steakz MIS</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ fontSize: 13, color: '#ccc' }}>Welcome, {user?.name}</span>
          <span style={{ background: '#e67e22', padding: '3px 10px', borderRadius: 12, fontSize: 12, fontWeight: 600 }}>CHEF</span>
          <button onClick={() => { logout(); navigate('/login'); }} style={{ background: '#af2b3e', color: '#fff', border: 'none', padding: '6px 14px', borderRadius: 6, cursor: 'pointer', fontSize: 13 }}>Logout</button>
        </div>
      </div>

      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '32px 16px' }}>
        <h1 style={{ fontSize: 26, marginBottom: 6, fontFamily: 'serif' }}>👨‍🍳 Kitchen Display</h1>
        <p style={{ color: '#666', marginBottom: 20 }}>Manage orders and menu</p>
        {msg && <div style={{ background: '#f0fdf4', color: '#16a085', padding: '10px 16px', borderRadius: 8, marginBottom: 20 }}>{msg}</div>}

        <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
          {(['orders', 'menu'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)} style={{ background: tab === t ? '#e67e22' : '#eee', color: tab === t ? '#fff' : '#333', border: 'none', padding: '8px 20px', borderRadius: 8, cursor: 'pointer', fontWeight: 600 }}>
              {t === 'orders' ? `🛒 Orders (${orders.length})` : '🍽️ Menu'}
            </button>
          ))}
        </div>

        {tab === 'orders' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
            {orders.map(o => (
              <div key={o.id} style={{ background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', borderTop: `4px solid ${o.status === 'PENDING' ? '#e67e22' : '#2980b9'}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                  <span style={{ fontWeight: 700, fontSize: 16 }}>Table {o.table.tableNumber}</span>
                  <span style={{ background: o.status === 'PENDING' ? '#fef3e2' : '#eaf4fd', color: o.status === 'PENDING' ? '#e67e22' : '#2980b9', padding: '3px 10px', borderRadius: 10, fontSize: 12, fontWeight: 700 }}>{o.status}</span>
                </div>
                <ul style={{ margin: '0 0 12px', paddingLeft: 16 }}>
                  {o.items.map((it, i) => <li key={i} style={{ fontSize: 14, color: '#444', marginBottom: 4 }}>{it.menuItem.name} × {it.quantity}</li>)}
                </ul>
                {o.notes && <p style={{ fontSize: 12, color: '#e67e22', marginBottom: 12 }}>📝 {o.notes}</p>}
                <button onClick={() => { void markReady(o.id); }} style={{ background: '#27ae60', color: '#fff', border: 'none', padding: '8px', borderRadius: 8, cursor: 'pointer', fontWeight: 600, width: '100%' }}>
                  Mark as READY ✓
                </button>
              </div>
            ))}
            {orders.length === 0 && <p style={{ color: '#aaa', textAlign: 'center', padding: 40 }}>No active orders 🎉</p>}
          </div>
        )}

        {tab === 'menu' && (
          <div style={{ background: '#fff', borderRadius: 12, padding: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
              <thead>
                <tr style={{ background: '#1a1a1a', color: '#fff' }}>
                  {['Name', 'Category', 'Price', 'Available', 'Action'].map(h => (
                    <th key={h} style={{ textAlign: 'left', padding: '10px 8px' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {menu.map(m => (
                  <tr key={m.id} style={{ borderBottom: '1px solid #f5f5f5' }}>
                    {editId === m.id ? (
                      <>
                        <td style={{ padding: '8px 6px' }}><input value={editData.name} onChange={e => setEditData(p => ({ ...p, name: e.target.value }))} style={{ padding: '6px 10px', border: '1px solid #ddd', borderRadius: 6, width: '100%' }} /></td>
                        <td style={{ padding: '8px 6px' }}>{m.category}</td>
                        <td style={{ padding: '8px 6px' }}><input value={editData.price} onChange={e => setEditData(p => ({ ...p, price: e.target.value }))} style={{ padding: '6px 10px', border: '1px solid #ddd', borderRadius: 6, width: 80 }} /></td>
                        <td style={{ padding: '8px 6px' }}>
                          <select value={String(editData.available)} onChange={e => setEditData(p => ({ ...p, available: e.target.value === 'true' }))} style={{ padding: '6px', borderRadius: 6, border: '1px solid #ddd' }}>
                            <option value="true">Yes</option>
                            <option value="false">No</option>
                          </select>
                        </td>
                        <td style={{ padding: '8px 6px', display: 'flex', gap: 6 }}>
                          <button onClick={() => { void saveEdit(m.id); }} style={{ background: '#27ae60', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: 6, cursor: 'pointer' }}>Save</button>
                          <button onClick={() => setEditId(null)} style={{ background: '#aaa', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: 6, cursor: 'pointer' }}>Cancel</button>
                        </td>
                      </>
                    ) : (
                      <>
                        <td style={{ padding: '10px 8px', fontWeight: 600 }}>{m.name}</td>
                        <td style={{ padding: '10px 8px', color: '#666' }}>{m.category}</td>
                        <td style={{ padding: '10px 8px', fontFamily: 'monospace', fontWeight: 700 }}>£{Number(m.price).toFixed(2)}</td>
                        <td style={{ padding: '10px 8px' }}><span style={{ color: m.available ? '#27ae60' : '#af2b3e', fontWeight: 600 }}>{m.available ? '✓ Yes' : '✗ No'}</span></td>
                        <td style={{ padding: '10px 8px' }}>
                          <button onClick={() => { setEditId(m.id); setEditData({ name: m.name, price: m.price, available: m.available }); }} style={{ background: '#e67e22', color: '#fff', border: 'none', padding: '6px 14px', borderRadius: 6, cursor: 'pointer' }}>Edit</button>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}