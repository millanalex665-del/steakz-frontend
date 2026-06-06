import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

interface TableOrder { id: number; status: string }
interface Table { id: number; tableNumber: number; capacity: number; orders: TableOrder[] }
interface MenuItem { id: number; name: string; category: string; price: string }

export default function WaiterPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [tables, setTables] = useState<Table[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [tab, setTab] = useState<'tables' | 'new'>('tables');
  const [selTable, setSelTable] = useState('');
  const [cart, setCart] = useState<Record<number, number>>({});
  const [notes, setNotes] = useState('');
  const [msg, setMsg] = useState('');

  useEffect(() => {
    void api.get('/api/waiter/tables').then(r => setTables(r.data as Table[]));
    void api.get('/api/public/menu').then(r => setMenuItems(r.data as MenuItem[]));
  }, []);

  function getStatus(t: Table) {
    if (t.orders.length === 0) return 'EMPTY';
    return t.orders[0]?.status ?? 'EMPTY';
  }

  const TABLE_COLORS: Record<string, string> = {
    EMPTY: '#f5f5f5', PENDING: '#fef3e2', PREPARING: '#eaf4fd', READY: '#f0fdf4', SERVED: '#f3e8ff'
  };
  const TABLE_BORDER: Record<string, string> = {
    EMPTY: '#ddd', PENDING: '#e67e22', PREPARING: '#2980b9', READY: '#27ae60', SERVED: '#8e44ad'
  };

  async function markServed(tableId: number) {
    await api.patch(`/api/waiter/tables/${tableId}/served`);
    setMsg('✅ Table marked as served');
    const r = await api.get('/api/waiter/tables');
    setTables(r.data as Table[]);
  }

  async function placeOrder(e: React.FormEvent) {
    e.preventDefault();
    const items = Object.entries(cart).filter(([, q]) => q > 0).map(([id, qty]) => ({ menuItemId: Number(id), quantity: qty }));
    if (!selTable || items.length === 0) { setMsg('❌ Select table and add items'); return; }
    try {
      await api.post('/api/waiter/orders', { tableId: Number(selTable), items, notes });
      setMsg('✅ Order placed!');
      setCart({}); setNotes(''); setSelTable('');
      const r = await api.get('/api/waiter/tables');
      setTables(r.data as Table[]);
    } catch { setMsg('❌ Error placing order'); }
  }

  const categories = [...new Set(menuItems.map(m => m.category))];

  return (
    <div style={{ minHeight: '100vh', background: '#fbf9f8' }}>
      <div style={{ background: '#1a1a1a', color: '#fff', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 56 }}>
        <span style={{ fontWeight: 700, fontSize: 20 }}>🥩 Steakz MIS</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ fontSize: 13, color: '#ccc' }}>Welcome, {user?.name}</span>
          <span style={{ background: '#16a085', padding: '3px 10px', borderRadius: 12, fontSize: 12, fontWeight: 600 }}>WAITER</span>
          <button onClick={() => { logout(); navigate('/login'); }} style={{ background: '#af2b3e', color: '#fff', border: 'none', padding: '6px 14px', borderRadius: 6, cursor: 'pointer', fontSize: 13 }}>Logout</button>
        </div>
      </div>

      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '32px 16px' }}>
        <h1 style={{ fontSize: 26, marginBottom: 6, fontFamily: 'serif' }}>🍽️ Waiter Dashboard</h1>
        <p style={{ color: '#666', marginBottom: 20 }}>Your branch tables only</p>

        {msg && <div style={{ background: msg.startsWith('✅') ? '#f0fdf4' : '#fdecea', color: msg.startsWith('✅') ? '#16a085' : '#c0392b', padding: '10px 16px', borderRadius: 8, marginBottom: 20 }}>{msg}</div>}

        <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
          {(['tables', 'new'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)} style={{ background: tab === t ? '#16a085' : '#eee', color: tab === t ? '#fff' : '#333', border: 'none', padding: '8px 20px', borderRadius: 8, cursor: 'pointer', fontWeight: 600 }}>
              {t === 'tables' ? '🪑 Tables' : '➕ New Order'}
            </button>
          ))}
        </div>

        {tab === 'tables' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 14 }}>
            {tables.map(t => {
              const st = getStatus(t);
              return (
                <div key={t.id} style={{ background: TABLE_COLORS[st] ?? '#f5f5f5', border: `2px solid ${TABLE_BORDER[st] ?? '#ddd'}`, borderRadius: 12, padding: 16, textAlign: 'center' }}>
                  <p style={{ fontSize: 28, fontWeight: 800, color: '#333', fontFamily: 'monospace' }}>{t.tableNumber}</p>
                  <p style={{ fontSize: 12, color: '#888', marginBottom: 6 }}>Seats {t.capacity}</p>
                  <span style={{ background: (TABLE_BORDER[st] ?? '#ddd') + '33', color: TABLE_BORDER[st] ?? '#ddd', padding: '3px 10px', borderRadius: 10, fontSize: 11, fontWeight: 700 }}>{st}</span>
                  {st === 'READY' && (
                    <button onClick={() => { void markServed(t.id); }} style={{ background: '#27ae60', color: '#fff', border: 'none', padding: '6px', borderRadius: 6, cursor: 'pointer', marginTop: 10, width: '100%', fontSize: 12 }}>Serve ✓</button>
                  )}
                </div>
              );
            })}
            {tables.length === 0 && <p style={{ color: '#aaa', textAlign: 'center', padding: 40, gridColumn: '1/-1' }}>No tables found for your branch.</p>}
          </div>
        )}

        {tab === 'new' && (
          <div style={{ background: '#fff', borderRadius: 12, padding: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
            <h3 style={{ marginBottom: 16 }}>Place New Order</h3>
            <form onSubmit={e => { void placeOrder(e); }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: '#555' }}>Select Table</label>
              <select value={selTable} onChange={e => setSelTable(e.target.value)} required
                style={{ display: 'block', width: '100%', padding: '9px 12px', margin: '6px 0 18px', border: '1px solid #ddd', borderRadius: 8, fontSize: 14 }}>
                <option value="">Choose table...</option>
                {tables.map(t => <option key={t.id} value={t.id}>Table {t.tableNumber} (seats {t.capacity})</option>)}
              </select>

              {categories.map(cat => (
                <div key={cat} style={{ marginBottom: 14 }}>
                  <p style={{ fontSize: 12, color: '#888', fontWeight: 600, marginBottom: 6, textTransform: 'uppercase' }}>{cat}</p>
                  {menuItems.filter(m => m.category === cat).map(m => (
                    <div key={m.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #f5f5f5' }}>
                      <span style={{ fontSize: 14 }}>{m.name} <span style={{ color: '#888', fontSize: 12 }}>£{Number(m.price).toFixed(2)}</span></span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <button type="button" onClick={() => setCart(p => ({ ...p, [m.id]: Math.max(0, (p[m.id] ?? 0) - 1) }))} style={{ background: '#eee', border: 'none', width: 28, height: 28, borderRadius: 6, cursor: 'pointer', fontWeight: 700 }}>−</button>
                        <span style={{ minWidth: 20, textAlign: 'center', fontWeight: 600 }}>{cart[m.id] ?? 0}</span>
                        <button type="button" onClick={() => setCart(p => ({ ...p, [m.id]: (p[m.id] ?? 0) + 1 }))} style={{ background: '#16a085', color: '#fff', border: 'none', width: 28, height: 28, borderRadius: 6, cursor: 'pointer', fontWeight: 700 }}>+</button>
                      </div>
                    </div>
                  ))}
                </div>
              ))}

              <label style={{ fontSize: 13, fontWeight: 600, color: '#555', marginTop: 10, display: 'block' }}>Special Notes</label>
              <input value={notes} onChange={e => setNotes(e.target.value)} placeholder="Allergies, preferences..."
                style={{ display: 'block', width: '100%', padding: '9px 12px', margin: '6px 0 20px', border: '1px solid #ddd', borderRadius: 8, fontSize: 14 }} />

              <button type="submit" style={{ background: '#af2b3e', color: '#fff', border: 'none', padding: 12, borderRadius: 8, cursor: 'pointer', fontWeight: 600, width: '100%', fontSize: 15 }}>
                Place Order
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}