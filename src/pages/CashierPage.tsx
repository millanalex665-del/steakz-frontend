import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

interface OrderItem { menuItem: { name: string; price: string }; quantity: number; unitPrice: string }
interface Order { id: number; totalAmount: string; table: { tableNumber: number }; items: OrderItem[]; status: string }

export default function CashierPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [selected, setSelected] = useState<Order | null>(null);
  const [method, setMethod] = useState('CASH');
  const [msg, setMsg] = useState('');
  const [receipt, setReceipt] = useState<Order | null>(null);
  const [discountCode, setDiscountCode] = useState('');

  useEffect(() => { void reload(); }, []);

  async function reload() {
    const r = await api.get('/api/cashier/orders');
    setOrders(r.data as Order[]);
    setSelected(null);
  }

  async function processPayment() {
    if (!selected) return;
    await api.patch(`/api/cashier/orders/${selected.id}/pay`, { method });
    setMsg(`✅ Order #${selected.id} paid via ${method}`);
    void reload();
  }

  async function applyDiscount() {
    if (!selected || !discountCode) return;
    try {
      const r = await api.patch(`/api/cashier/orders/${selected.id}/discount`, { code: discountCode });
      const d = r.data as { message: string; newTotal: string };
      setMsg(`✅ ${d.message}`);
      setDiscountCode('');
      void reload();
    } catch { setMsg('❌ Invalid discount code'); }
  }

  async function showReceipt(id: number) {
    const r = await api.get(`/api/cashier/orders/${id}/receipt`);
    setReceipt(r.data as Order);
  }

  return (
    <div style={{ fontFamily: 'Hanken Grotesk, sans-serif', minHeight: '100vh', background: '#fbf9f8', overflow: 'hidden' }}>
      <aside style={{ position: 'fixed', left: 0, top: 0, width: 256, height: '100vh', background: '#efeded', borderRight: '1px solid #c4c7c7', display: 'flex', flexDirection: 'column', padding: '24px 0', zIndex: 50 }}>
        <div style={{ padding: '0 24px', marginBottom: 40 }}>
          <span style={{ fontFamily: 'Libre Caslon Text, serif', fontSize: 48, fontWeight: 700, color: '#000', lineHeight: 1 }}>Steakz</span>
        </div>
        <nav style={{ flex: 1 }}>
          {[{ icon: 'point_of_sale', label: 'Checkout', active: true }, { icon: 'receipt_long', label: 'Transactions', active: false }].map(item => (
            <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', margin: '2px 8px', borderRadius: 4, background: item.active ? '#000' : 'transparent', color: item.active ? '#fff' : '#444748', cursor: 'pointer', fontSize: 14, fontWeight: item.active ? 600 : 400 }}>
              <span className="material-symbols-outlined" style={{ fontSize: 20 }}>{item.icon}</span>
              {item.label}
            </div>
          ))}
        </nav>
        <div style={{ padding: '16px', borderTop: '1px solid #c4c7c7', margin: '0 8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#15803d', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700 }}>C</div>
            <div>
              <p style={{ fontSize: 15, fontWeight: 600, color: '#000', margin: 0 }}>{user?.name}</p>
              <p style={{ fontSize: 12, fontWeight: 700, color: '#af2b3e', margin: 0 }}>Cashier</p>
            </div>
          </div>
        </div>
      </aside>

      <header style={{ position: 'sticky', top: 0, marginLeft: 256, zIndex: 40, background: '#fbf9f8', borderBottom: '1px solid #c4c7c7', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span className="material-symbols-outlined">point_of_sale</span>
          <h1 style={{ fontFamily: 'Libre Caslon Text, serif', fontSize: 28, fontWeight: 600, margin: 0 }}>Checkout Till</h1>
        </div>
        <button onClick={() => { logout(); navigate('/login'); }} style={{ background: '#000', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: 4, fontFamily: 'Hanken Grotesk', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>LOGOUT</button>
      </header>

      <main style={{ marginLeft: 256, padding: 24, height: 'calc(100vh - 80px)', overflowY: 'auto' }}>
        {msg && <div style={{ background: msg.startsWith('✅') ? '#f0fdf4' : '#fdecea', color: msg.startsWith('✅') ? '#15803d' : '#af2b3e', padding: '10px 16px', marginBottom: 16, fontFamily: 'Hanken Grotesk', fontSize: 14 }}>{msg}</div>}

        {/* Receipt Modal */}
        {receipt && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
            <div style={{ background: '#fff', padding: 32, maxWidth: 380, width: '100%', border: '1px solid #c4c7c7' }}>
              <h2 style={{ fontFamily: 'Libre Caslon Text, serif', fontSize: 24, textAlign: 'center', marginBottom: 4 }}>🥩 STEAKZ</h2>
              <p style={{ textAlign: 'center', color: '#747878', fontSize: 12, marginBottom: 20, borderBottom: '2px dashed #c4c7c7', paddingBottom: 16 }}>RECEIPT</p>
              <div style={{ marginBottom: 16 }}>
                <p style={{ fontSize: 13, marginBottom: 4 }}><strong>Order #:</strong> {receipt.id}</p>
                <p style={{ fontSize: 13 }}><strong>Table:</strong> {receipt.table?.tableNumber}</p>
              </div>
              <div style={{ borderTop: '1px dashed #c4c7c7', borderBottom: '1px dashed #c4c7c7', padding: '12px 0', marginBottom: 16 }}>
                {receipt.items?.map((it, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, marginBottom: 6 }}>
                    <span>{it.menuItem.name} × {it.quantity}</span>
                    <span style={{ fontFamily: 'JetBrains Mono, monospace' }}>£{(Number(it.unitPrice) * it.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: 18, marginBottom: 20 }}>
                <span style={{ fontFamily: 'Libre Caslon Text, serif' }}>TOTAL</span>
                <span style={{ fontFamily: 'JetBrains Mono, monospace', color: '#af2b3e' }}>£{Number(receipt.totalAmount).toFixed(2)}</span>
              </div>
              <p style={{ textAlign: 'center', color: '#747878', fontSize: 11, marginBottom: 16 }}>Thank you for dining at Steakz!</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                <button onClick={() => window.print()} style={{ background: '#000', color: '#fff', border: 'none', padding: '10px', fontFamily: 'Hanken Grotesk', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>🖨️ PRINT</button>
                <button onClick={() => setReceipt(null)} style={{ background: 'transparent', color: '#444748', border: '1px solid #c4c7c7', padding: '10px', fontFamily: 'Hanken Grotesk', fontSize: 12, cursor: 'pointer' }}>CLOSE</button>
              </div>
            </div>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 24, height: 'calc(100vh - 160px)' }}>
          {/* Orders List */}
          <div style={{ background: '#fff', border: '1px solid #c4c7c7', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #c4c7c7', background: '#000', color: '#fff' }}>
              <h3 style={{ fontFamily: 'Libre Caslon Text, serif', fontSize: 18, fontWeight: 600, margin: 0 }}>Ready Orders ({orders.length})</h3>
            </div>
            <div style={{ flex: 1, overflowY: 'auto' }}>
              {orders.map((o, i) => (
                <div key={o.id} onClick={() => setSelected(o)} style={{ padding: '16px 20px', borderBottom: '1px solid #c4c7c7', cursor: 'pointer', background: selected?.id === o.id ? '#ffdada' : i % 2 === 0 ? '#fff' : '#f5f3f3', borderLeft: selected?.id === o.id ? '4px solid #af2b3e' : '4px solid transparent', transition: 'all 0.15s' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <span style={{ fontWeight: 700, fontSize: 16 }}>Table {o.table.tableNumber}</span>
                      <span style={{ color: '#747878', fontSize: 13, marginLeft: 12, fontFamily: 'JetBrains Mono' }}>#{o.id}</span>
                    </div>
                    <span style={{ fontFamily: 'Libre Caslon Text, serif', fontSize: 22, fontWeight: 700, color: '#af2b3e' }}>£{Number(o.totalAmount).toFixed(2)}</span>
                  </div>
                  <div style={{ fontSize: 13, color: '#444748', marginTop: 4 }}>{o.items.slice(0,2).map(it => it.menuItem.name).join(', ')}{o.items.length > 2 ? '...' : ''}</div>
                </div>
              ))}
              {orders.length === 0 && <div style={{ padding: 40, textAlign: 'center', color: '#747878' }}>No orders ready for payment.</div>}
            </div>
          </div>

          {/* Payment Panel */}
          <div style={{ background: '#fff', border: '1px solid #c4c7c7', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #c4c7c7', background: '#000', color: '#fff' }}>
              <h3 style={{ fontFamily: 'Libre Caslon Text, serif', fontSize: 18, fontWeight: 600, margin: 0 }}>Payment</h3>
            </div>
            {selected ? (
              <div style={{ padding: 20, flex: 1, overflowY: 'auto' }}>
                <div style={{ marginBottom: 20 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#444748', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>Order #{selected.id} — Table {selected.table.tableNumber}</div>
                  {selected.items.map((it, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, padding: '6px 0', borderBottom: '1px solid #e9e8e7' }}>
                      <span>{it.menuItem.name} × {it.quantity}</span>
                      <span style={{ fontFamily: 'JetBrains Mono' }}>£{(Number(it.unitPrice) * it.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: 20, marginTop: 16, paddingTop: 12, borderTop: '2px solid #c4c7c7' }}>
                    <span style={{ fontFamily: 'Libre Caslon Text, serif' }}>Total</span>
                    <span style={{ fontFamily: 'JetBrains Mono', color: '#af2b3e' }}>£{Number(selected.totalAmount).toFixed(2)}</span>
                  </div>
                </div>

                <div style={{ marginBottom: 16 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#444748', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>Discount Code</div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <input value={discountCode} onChange={e => setDiscountCode(e.target.value)} placeholder="Enter code..." style={{ flex: 1, padding: '8px 12px', border: '1px solid #c4c7c7', fontFamily: 'Hanken Grotesk', fontSize: 14 }} />
                    <button onClick={() => { void applyDiscount(); }} style={{ background: '#000', color: '#fff', border: 'none', padding: '8px 16px', fontFamily: 'Hanken Grotesk', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>APPLY</button>
                  </div>
                </div>

                <div style={{ marginBottom: 20 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#444748', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>Payment Method</div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                    {[{ val: 'CASH', icon: '💵' }, { val: 'CARD', icon: '💳' }, { val: 'APP', icon: '📱' }].map(m => (
                      <button key={m.val} onClick={() => setMethod(m.val)} style={{ padding: '12px 8px', border: `2px solid ${method === m.val ? '#af2b3e' : '#c4c7c7'}`, background: method === m.val ? '#ffdada' : '#fff', cursor: 'pointer', fontFamily: 'Hanken Grotesk', fontSize: 12, fontWeight: 700, color: method === m.val ? '#af2b3e' : '#444748' }}>
                        <div style={{ fontSize: 20, marginBottom: 4 }}>{m.icon}</div>
                        {m.val}
                      </button>
                    ))}
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  <button onClick={() => { void showReceipt(selected.id); }} style={{ background: 'transparent', color: '#000', border: '2px solid #000', padding: '14px', fontFamily: 'Hanken Grotesk', fontSize: 12, fontWeight: 700, cursor: 'pointer', letterSpacing: '0.05em' }}>RECEIPT</button>
                  <button onClick={() => { void processPayment(); }} style={{ background: '#af2b3e', color: '#fff', border: 'none', padding: '14px', fontFamily: 'Hanken Grotesk', fontSize: 12, fontWeight: 700, cursor: 'pointer', letterSpacing: '0.05em' }}>PROCESS PAYMENT</button>
                </div>
              </div>
            ) : (
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#747878', flexDirection: 'column', gap: 8 }}>
                <span className="material-symbols-outlined" style={{ fontSize: 48, color: '#c4c7c7' }}>point_of_sale</span>
                <p style={{ fontSize: 14, fontFamily: 'Hanken Grotesk' }}>Select an order to process</p>
              </div>
            )}
          </div>
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
