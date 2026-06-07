import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

interface OrderItem { menuItem: { name: string }; quantity: number }
interface Order { id: number; status: string; totalAmount: string; table: { tableNumber: number }; branch: { name: string; address: string }; items: OrderItem[]; updatedAt: string }

export default function DeliveryPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [msg, setMsg] = useState('');

  useEffect(() => { void reload(); }, []);

  async function reload() {
    const r = await api.get('/api/delivery/orders');
    setOrders(r.data as Order[]);
  }

  async function markDelivered(id: number) {
    await api.patch(`/api/delivery/orders/${id}/delivered`);
    setMsg(`✅ Order #${id} marked as delivered!`);
    void reload();
  }

  return (
    <div style={{ fontFamily: 'Hanken Grotesk, sans-serif', minHeight: '100vh', background: '#fbf9f8', overflow: 'hidden' }}>

      {/* Sidebar */}
      <aside style={{ position: 'fixed', left: 0, top: 0, width: 256, height: '100vh', background: '#efeded', borderRight: '1px solid #c4c7c7', display: 'flex', flexDirection: 'column', padding: '24px 0', zIndex: 50 }}>
        <div style={{ padding: '0 24px', marginBottom: 40 }}>
          <span style={{ fontFamily: 'Libre Caslon Text, serif', fontSize: 48, fontWeight: 700, color: '#000', lineHeight: 1 }}>Steakz</span>
        </div>
        <nav style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', margin: '2px 8px', borderRadius: 4, background: '#000', color: '#fff', fontSize: 14, fontWeight: 600 }}>
            <span className="material-symbols-outlined" style={{ fontSize: 20 }}>delivery_dining</span>
            Deliveries
          </div>
        </nav>
        <div style={{ padding: '16px', borderTop: '1px solid #c4c7c7', margin: '0 8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#c2410c', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700 }}>
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <p style={{ fontSize: 15, fontWeight: 600, color: '#000', margin: 0 }}>{user?.name}</p>
              <p style={{ fontSize: 12, fontWeight: 700, color: '#af2b3e', margin: 0 }}>Delivery</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Header */}
      <header style={{ position: 'sticky', top: 0, marginLeft: 256, zIndex: 40, background: '#fbf9f8', borderBottom: '1px solid #c4c7c7', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span className="material-symbols-outlined">delivery_dining</span>
          <h1 style={{ fontFamily: 'Libre Caslon Text, serif', fontSize: 28, fontWeight: 600, margin: 0 }}>Delivery Dashboard</h1>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ background: '#fef3e2', border: '1px solid #c2410c', padding: '6px 16px', borderRadius: 4 }}>
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 13, fontWeight: 700, color: '#c2410c' }}>{orders.length} PENDING</span>
          </div>
          <button onClick={() => { logout(); navigate('/login'); }} style={{ background: '#000', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: 4, fontFamily: 'Hanken Grotesk', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>LOGOUT</button>
        </div>
      </header>

      <main style={{ marginLeft: 256, padding: 24, height: 'calc(100vh - 80px)', overflowY: 'auto' }}>

        {msg && <div style={{ background: '#f0fdf4', color: '#15803d', padding: '10px 16px', marginBottom: 16, fontFamily: 'Hanken Grotesk', fontSize: 14 }}>{msg}</div>}

        <h2 style={{ fontFamily: 'Libre Caslon Text, serif', fontSize: 24, fontWeight: 600, marginBottom: 24 }}>Orders Ready for Delivery</h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 20 }}>
          {orders.map(o => (
            <div key={o.id} style={{ background: '#fff', border: '2px solid #c4c7c7', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>

              {/* Card Header */}
              <div style={{ background: o.status === 'READY' ? '#c2410c' : '#000', padding: '14px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#fff' }}>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', opacity: 0.8 }}>Order</div>
                  <div style={{ fontFamily: 'Libre Caslon Text, serif', fontSize: 28, fontWeight: 700, lineHeight: 1 }}>#{o.id}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12, background: 'rgba(255,255,255,0.2)', padding: '3px 8px', borderRadius: 3 }}>{o.status}</span>
                  <div style={{ fontSize: 12, marginTop: 4, opacity: 0.8 }}>Table {o.table.tableNumber}</div>
                </div>
              </div>

              {/* Branch Info */}
              <div style={{ padding: '12px 16px', background: '#f5f3f3', borderBottom: '1px solid #c4c7c7' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 16, color: '#af2b3e' }}>location_on</span>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#000' }}>{o.branch.name}</div>
                    <div style={{ fontSize: 12, color: '#444748' }}>{o.branch.address}</div>
                  </div>
                </div>
              </div>

              {/* Items */}
              <div style={{ padding: 16 }}>
                {o.items.map((it, i) => (
                  <div key={i} style={{ fontSize: 14, color: '#1b1c1c', fontWeight: 600, marginBottom: 4 }}>
                    {it.quantity}x {it.menuItem.name}
                  </div>
                ))}
                <div style={{ marginTop: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 12, color: '#747878' }}>{new Date(o.updatedAt).toLocaleTimeString()}</span>
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 16, fontWeight: 700, color: '#af2b3e' }}>£{Number(o.totalAmount).toFixed(2)}</span>
                </div>
              </div>

              {/* Button */}
              <div style={{ padding: '12px 16px', background: '#f5f3f3' }}>
                <button onClick={() => { void markDelivered(o.id); }} style={{ width: '100%', background: '#15803d', color: '#fff', border: 'none', padding: '12px', fontFamily: 'Hanken Grotesk', fontSize: 12, fontWeight: 700, cursor: 'pointer', letterSpacing: '0.05em' }}>
                  ✓ MARK AS DELIVERED
                </button>
              </div>
            </div>
          ))}

          {orders.length === 0 && (
            <div style={{ gridColumn: '1/-1', background: '#fff', border: '2px dashed #c4c7c7', padding: 60, textAlign: 'center' }}>
              <span className="material-symbols-outlined" style={{ fontSize: 56, color: '#c4c7c7', display: 'block', marginBottom: 16 }}>delivery_dining</span>
              <p style={{ fontFamily: 'Libre Caslon Text, serif', fontSize: 20, color: '#747878' }}>No orders to deliver right now</p>
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