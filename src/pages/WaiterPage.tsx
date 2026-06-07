import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

interface TableOrder { id: number; status: string }
interface Table { id: number; tableNumber: number; capacity: number; orders: TableOrder[] }
interface MenuItem { id: number; name: string; category: string; price: string }

const TABLE_BG: Record<string,string> = { EMPTY:'#fff', PENDING:'#fef3e2', PREPARING:'#eaf4fd', READY:'#f0fdf4', SERVED:'#f3e8ff' };
const TABLE_BORDER: Record<string,string> = { EMPTY:'#c4c7c7', PENDING:'#c2410c', PREPARING:'#1d4ed8', READY:'#15803d', SERVED:'#6b21a8' };
const TABLE_STATUS_COLOR: Record<string,string> = { EMPTY:'#747878', PENDING:'#c2410c', PREPARING:'#1d4ed8', READY:'#15803d', SERVED:'#6b21a8' };

export default function WaiterPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [tables, setTables] = useState<Table[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [tab, setTab] = useState<'tables' | 'new'>('tables');
  const [selTable, setSelTable] = useState('');
  const [cart, setCart] = useState<Record<number,number>>({});
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

  async function markServed(tableId: number) {
    await api.patch(`/api/waiter/tables/${tableId}/served`);
    setMsg('✅ Table marked as served');
    const r = await api.get('/api/waiter/tables');
    setTables(r.data as Table[]);
  }

  async function placeOrder(e: React.FormEvent) {
    e.preventDefault();
    const items = Object.entries(cart).filter(([,q]) => q > 0).map(([id,qty]) => ({ menuItemId: Number(id), quantity: qty }));
    if (!selTable || items.length === 0) { setMsg('❌ Select table and add items'); return; }
    try {
      await api.post('/api/waiter/orders', { tableId: Number(selTable), items, notes });
      setMsg('✅ Order placed!'); setCart({}); setNotes(''); setSelTable('');
      const r = await api.get('/api/waiter/tables');
      setTables(r.data as Table[]);
      setTab('tables');
    } catch { setMsg('❌ Error placing order'); }
  }

  const categories = [...new Set(menuItems.map(m => m.category))];
  const orderTotal = Object.entries(cart).filter(([,q]) => q > 0).reduce((s,[id,q]) => {
    const m = menuItems.find(mi => mi.id === Number(id));
    return s + (m ? Number(m.price) * q : 0);
  }, 0);

  return (
    <div style={{ fontFamily: 'Hanken Grotesk, sans-serif', minHeight: '100vh', background: '#fbf9f8', overflow: 'hidden' }}>
      <aside style={{ position: 'fixed', left: 0, top: 0, width: 256, height: '100vh', background: '#efeded', borderRight: '1px solid #c4c7c7', display: 'flex', flexDirection: 'column', padding: '24px 0', zIndex: 50 }}>
        <div style={{ padding: '0 24px', marginBottom: 40 }}>
          <span style={{ fontFamily: 'Libre Caslon Text, serif', fontSize: 48, fontWeight: 700, color: '#000', lineHeight: 1 }}>Steakz</span>
        </div>
        <nav style={{ flex: 1 }}>
          {[
            { icon: 'table_restaurant', label: 'Tables', t: 'tables' },
            { icon: 'add_circle', label: 'New Order', t: 'new' },
          ].map(item => (
            <div key={item.label} onClick={() => setTab(item.t as 'tables' | 'new')} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', margin: '2px 8px', borderRadius: 4, background: tab === item.t ? '#000' : 'transparent', color: tab === item.t ? '#fff' : '#444748', cursor: 'pointer', fontSize: 14, fontWeight: tab === item.t ? 600 : 400 }}>
              <span className="material-symbols-outlined" style={{ fontSize: 20 }}>{item.icon}</span>
              {item.label}
            </div>
          ))}
        </nav>
        <div style={{ padding: '16px', borderTop: '1px solid #c4c7c7', margin: '0 8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#0f766e', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700 }}>W</div>
            <div>
              <p style={{ fontSize: 15, fontWeight: 600, color: '#000', margin: 0 }}>{user?.name}</p>
              <p style={{ fontSize: 12, fontWeight: 700, color: '#af2b3e', margin: 0 }}>Waiter</p>
            </div>
          </div>
        </div>
      </aside>

      <header style={{ position: 'sticky', top: 0, marginLeft: 256, zIndex: 40, background: '#fbf9f8', borderBottom: '1px solid #c4c7c7', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span className="material-symbols-outlined">table_restaurant</span>
          <h1 style={{ fontFamily: 'Libre Caslon Text, serif', fontSize: 28, fontWeight: 600, margin: 0 }}>Table Management</h1>
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <div style={{ background: '#e9e8e7', padding: '6px 14px', borderRadius: 4, fontSize: 12, fontWeight: 700, color: '#444748' }}>YOUR BRANCH ONLY</div>
          <button onClick={() => { logout(); navigate('/login'); }} style={{ background: '#000', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: 4, fontFamily: 'Hanken Grotesk', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>LOGOUT</button>
        </div>
      </header>

      <main style={{ marginLeft: 256, padding: 24, height: 'calc(100vh - 80px)', overflowY: 'auto' }}>
        {msg && <div style={{ background: msg.startsWith('✅') ? '#f0fdf4' : '#fdecea', color: msg.startsWith('✅') ? '#15803d' : '#af2b3e', padding: '10px 16px', marginBottom: 16, fontFamily: 'Hanken Grotesk', fontSize: 14 }}>{msg}</div>}

        {tab === 'tables' && (
          <>
            {/* Legend */}
            <div style={{ display: 'flex', gap: 16, marginBottom: 20, flexWrap: 'wrap' }}>
              {Object.entries(TABLE_STATUS_COLOR).map(([status, color]) => (
                <div key={status} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 700, color }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: color }} />
                  {status}
                </div>
              ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 16 }}>
              {tables.map(t => {
                const st = getStatus(t);
                return (
                  <div key={t.id} style={{ background: TABLE_BG[st] ?? '#fff', border: `2px solid ${TABLE_BORDER[st] ?? '#c4c7c7'}`, padding: 20, textAlign: 'center', position: 'relative' }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: '#444748', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>Table</div>
                    <div style={{ fontFamily: 'Libre Caslon Text, serif', fontSize: 40, fontWeight: 700, color: '#000', lineHeight: 1, marginBottom: 8 }}>
                      {String(t.tableNumber).padStart(2, '0')}
                    </div>
                    <div style={{ fontSize: 12, color: '#747878', marginBottom: 8 }}>Seats {t.capacity}</div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: TABLE_STATUS_COLOR[st] ?? '#747878', letterSpacing: '0.05em', marginBottom: st === 'READY' ? 12 : 0 }}>{st}</div>
                    {st === 'READY' && (
                      <button onClick={() => { void markServed(t.id); }} style={{ background: '#15803d', color: '#fff', border: 'none', padding: '8px', width: '100%', fontFamily: 'Hanken Grotesk', fontSize: 11, fontWeight: 700, cursor: 'pointer', letterSpacing: '0.05em' }}>SERVE ✓</button>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}

        {tab === 'new' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 24 }}>
            {/* Menu */}
            <div style={{ background: '#fff', border: '1px solid #c4c7c7' }}>
              <div style={{ padding: '16px 20px', borderBottom: '1px solid #c4c7c7', background: '#000', color: '#fff' }}>
                <h3 style={{ fontFamily: 'Libre Caslon Text, serif', fontSize: 18, fontWeight: 600, margin: 0 }}>Menu</h3>
              </div>
              <div style={{ padding: 20 }}>
                {categories.map(cat => (
                  <div key={cat} style={{ marginBottom: 24 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: '#af2b3e', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12, borderBottom: '1px solid #c4c7c7', paddingBottom: 6 }}>{cat}</div>
                    {menuItems.filter(m => m.category === cat).map(m => (
                      <div key={m.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #e9e8e7' }}>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: 15 }}>{m.name}</div>
                          <div style={{ fontFamily: 'JetBrains Mono', fontSize: 13, color: '#af2b3e', fontWeight: 500 }}>£{Number(m.price).toFixed(2)}</div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <button onClick={() => setCart(p => ({ ...p, [m.id]: Math.max(0, (p[m.id] ?? 0) - 1) }))} style={{ background: '#e9e8e7', border: 'none', width: 32, height: 32, cursor: 'pointer', fontWeight: 700, fontSize: 18 }}>−</button>
                          <span style={{ fontFamily: 'JetBrains Mono', fontWeight: 700, minWidth: 20, textAlign: 'center' }}>{cart[m.id] ?? 0}</span>
                          <button onClick={() => setCart(p => ({ ...p, [m.id]: (p[m.id] ?? 0) + 1 }))} style={{ background: '#000', color: '#fff', border: 'none', width: 32, height: 32, cursor: 'pointer', fontWeight: 700, fontSize: 18 }}>+</button>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div style={{ background: '#fff', border: '1px solid #c4c7c7', display: 'flex', flexDirection: 'column' }}>
              <div style={{ padding: '16px 20px', borderBottom: '1px solid #c4c7c7', background: '#000', color: '#fff' }}>
                <h3 style={{ fontFamily: 'Libre Caslon Text, serif', fontSize: 18, fontWeight: 600, margin: 0 }}>Order Summary</h3>
              </div>
              <form onSubmit={e => { void placeOrder(e); }} style={{ padding: 20, flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{ marginBottom: 16 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#444748', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>Select Table</div>
                  <select value={selTable} onChange={e => setSelTable(e.target.value)} required style={{ width: '100%', padding: '10px 12px', border: '1px solid #c4c7c7', fontFamily: 'Hanken Grotesk', fontSize: 14 }}>
                    <option value="">Choose table...</option>
                    {tables.map(t => <option key={t.id} value={t.id}>Table {t.tableNumber} — Seats {t.capacity}</option>)}
                  </select>
                </div>

                <div style={{ flex: 1, marginBottom: 16 }}>
                  {Object.entries(cart).filter(([,q]) => q > 0).map(([id, q]) => {
                    const m = menuItems.find(mi => mi.id === Number(id));
                    return m ? (
                      <div key={id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, padding: '6px 0', borderBottom: '1px solid #e9e8e7' }}>
                        <span>{m.name} × {q}</span>
                        <span style={{ fontFamily: 'JetBrains Mono', fontWeight: 700 }}>£{(Number(m.price) * q).toFixed(2)}</span>
                      </div>
                    ) : null;
                  })}
                  {orderTotal === 0 && <p style={{ color: '#747878', fontSize: 13, textAlign: 'center', marginTop: 20 }}>No items added yet</p>}
                </div>

                <div style={{ borderTop: '2px solid #c4c7c7', paddingTop: 12, marginBottom: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: 18 }}>
                    <span style={{ fontFamily: 'Libre Caslon Text, serif' }}>Total</span>
                    <span style={{ fontFamily: 'JetBrains Mono', color: '#af2b3e' }}>£{orderTotal.toFixed(2)}</span>
                  </div>
                </div>

                <div style={{ marginBottom: 16 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#444748', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>Special Notes</div>
                  <input value={notes} onChange={e => setNotes(e.target.value)} placeholder="Allergies, preferences..." style={{ width: '100%', padding: '10px 12px', border: '1px solid #c4c7c7', fontFamily: 'Hanken Grotesk', fontSize: 14 }} />
                </div>

                <button type="submit" style={{ background: '#af2b3e', color: '#fff', border: 'none', padding: '14px', fontFamily: 'Hanken Grotesk', fontSize: 13, fontWeight: 700, cursor: 'pointer', letterSpacing: '0.05em' }}>PLACE ORDER</button>
              </form>
            </div>
          </div>
        )}
      </main>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Libre+Caslon+Text:wght@400;700&family=Hanken+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@500&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap');
        .material-symbols-outlined { font-variation-settings: 'FILL' 0,'wght' 400,'GRAD' 0,'opsz' 24; font-family: 'Material Symbols Outlined'; }
      `}</style>
    </div>
  );
}
