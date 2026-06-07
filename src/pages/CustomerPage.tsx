import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

interface MenuItem { id: number; name: string; description: string | null; category: string; price: string; available: boolean }
interface Order { id: number; status: string; totalAmount: string; createdAt: string; branch: { name: string; city: string }; items: { menuItem: { name: string; price: string }; quantity: number }[] }

export default function CustomerPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<'menu' | 'orders'>('menu');
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    void api.get('/api/customer/menu').then(r => setMenu(r.data as MenuItem[]));
    void api.get('/api/customer/orders').then(r => setOrders(r.data as Order[]));
  }, []);

  const categories = [...new Set(menu.map(m => m.category))];

  const STATUS_COLORS: Record<string, string> = {
    PENDING: '#c2410c', PREPARING: '#1d4ed8', READY: '#15803d',
    SERVED: '#6b21a8', PAID: '#444748', CANCELLED: '#af2b3e'
  };

  return (
    <div style={{ fontFamily: 'Hanken Grotesk, sans-serif', minHeight: '100vh', background: '#fbf9f8', overflow: 'hidden' }}>

      {/* Sidebar */}
      <aside style={{ position: 'fixed', left: 0, top: 0, width: 256, height: '100vh', background: '#efeded', borderRight: '1px solid #c4c7c7', display: 'flex', flexDirection: 'column', padding: '24px 0', zIndex: 50 }}>
        <div style={{ padding: '0 24px', marginBottom: 40 }}>
          <span style={{ fontFamily: 'Libre Caslon Text, serif', fontSize: 48, fontWeight: 700, color: '#000', lineHeight: 1 }}>Steakz</span>
        </div>
        <nav style={{ flex: 1 }}>
          {[
            { icon: 'restaurant_menu', label: 'Browse Menu', t: 'menu' },
            { icon: 'receipt_long', label: 'My Orders', t: 'orders' },
          ].map(item => (
            <div key={item.label} onClick={() => setTab(item.t as 'menu' | 'orders')} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', margin: '2px 8px', borderRadius: 4, background: tab === item.t ? '#000' : 'transparent', color: tab === item.t ? '#fff' : '#444748', cursor: 'pointer', fontSize: 14, fontWeight: tab === item.t ? 600 : 400 }}>
              <span className="material-symbols-outlined" style={{ fontSize: 20 }}>{item.icon}</span>
              {item.label}
            </div>
          ))}
        </nav>
        <div style={{ padding: '16px', borderTop: '1px solid #c4c7c7', margin: '0 8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#af2b3e', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700 }}>
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <p style={{ fontSize: 15, fontWeight: 600, color: '#000', margin: 0 }}>{user?.name}</p>
              <p style={{ fontSize: 12, fontWeight: 700, color: '#af2b3e', margin: 0 }}>Customer</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Header */}
      <header style={{ position: 'sticky', top: 0, marginLeft: 256, zIndex: 40, background: '#fbf9f8', borderBottom: '1px solid #c4c7c7', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span className="material-symbols-outlined">person</span>
          <h1 style={{ fontFamily: 'Libre Caslon Text, serif', fontSize: 28, fontWeight: 600, margin: 0 }}>Customer Dashboard</h1>
        </div>
        <button onClick={() => { logout(); navigate('/login'); }} style={{ background: '#000', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: 4, fontFamily: 'Hanken Grotesk', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>LOGOUT</button>
      </header>

      <main style={{ marginLeft: 256, padding: 24, height: 'calc(100vh - 80px)', overflowY: 'auto' }}>

        {/* MENU TAB */}
        {tab === 'menu' && (
          <div>
            <h2 style={{ fontFamily: 'Libre Caslon Text, serif', fontSize: 24, fontWeight: 600, marginBottom: 24 }}>Our Menu</h2>
            {categories.map(cat => (
              <div key={cat} style={{ marginBottom: 40 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
                  <h3 style={{ fontFamily: 'Libre Caslon Text, serif', fontSize: 20, fontWeight: 600, color: '#000' }}>{cat}</h3>
                  <div style={{ height: 1, flex: 1, background: '#c4c7c7' }} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
                  {menu.filter(m => m.category === cat).map(item => (
                    <div key={item.id} style={{ background: '#fff', border: '1px solid #c4c7c7', overflow: 'hidden' }}>
                      <div style={{ padding: 16 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                          <h4 style={{ fontFamily: 'Libre Caslon Text, serif', fontSize: 17, fontWeight: 600, color: '#000', flex: 1 }}>{item.name}</h4>
                          <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 15, fontWeight: 700, color: '#af2b3e', marginLeft: 12 }}>£{Number(item.price).toFixed(2)}</span>
                        </div>
                        {item.description && <p style={{ color: '#444748', fontSize: 13, lineHeight: 1.5, marginBottom: 10 }}>{item.description}</p>}
                        <span style={{ background: item.available ? '#f0fdf4' : '#fdecea', color: item.available ? '#15803d' : '#af2b3e', fontSize: 11, fontWeight: 700, padding: '3px 8px' }}>
                          {item.available ? '✓ Available' : '✗ Unavailable'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ORDERS TAB */}
        {tab === 'orders' && (
          <div>
            <h2 style={{ fontFamily: 'Libre Caslon Text, serif', fontSize: 24, fontWeight: 600, marginBottom: 24 }}>My Orders</h2>
            {orders.length === 0 && (
              <div style={{ background: '#fff', border: '1px solid #c4c7c7', padding: 40, textAlign: 'center' }}>
                <span className="material-symbols-outlined" style={{ fontSize: 48, color: '#c4c7c7', display: 'block', marginBottom: 16 }}>receipt_long</span>
                <p style={{ color: '#747878', fontFamily: 'Hanken Grotesk' }}>No orders yet.</p>
              </div>
            )}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {orders.map(o => (
                <div key={o.id} style={{ background: '#fff', border: '1px solid #c4c7c7', padding: 20 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <div>
                      <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 13, color: '#747878' }}>Order #{o.id}</span>
                      <span style={{ fontSize: 13, color: '#444748', marginLeft: 12 }}>{o.branch.name} — {o.branch.city}</span>
                    </div>
                    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                      <span style={{ background: (STATUS_COLORS[o.status] ?? '#555') + '15', color: STATUS_COLORS[o.status] ?? '#555', padding: '4px 10px', fontSize: 11, fontWeight: 700, letterSpacing: '0.05em' }}>{o.status}</span>
                      <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 16, fontWeight: 700, color: '#af2b3e' }}>£{Number(o.totalAmount).toFixed(2)}</span>
                    </div>
                  </div>
                  <div style={{ borderTop: '1px solid #e9e8e7', paddingTop: 12 }}>
                    {o.items.map((it, i) => (
                      <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#444748', marginBottom: 4 }}>
                        <span>{it.menuItem.name} × {it.quantity}</span>
                        <span style={{ fontFamily: 'JetBrains Mono, monospace' }}>£{(Number(it.menuItem.price) * it.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                  <p style={{ fontSize: 12, color: '#747878', marginTop: 10 }}>{new Date(o.createdAt).toLocaleString()}</p>
                </div>
              ))}
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