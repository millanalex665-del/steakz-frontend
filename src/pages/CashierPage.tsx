import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

interface OrderItem { menuItem: { name: string; price: string }; quantity: number; unitPrice: string }
interface Order { id: number; totalAmount: string; table: { tableNumber: number }; items: OrderItem[] }

export default function CashierPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [method, setMethod] = useState<Record<number, string>>({});
  const [msg, setMsg] = useState('');
  const [receipt, setReceipt] = useState<Order | null>(null);
  const [discountCode, setDiscountCode] = useState<Record<number, string>>({});

  useEffect(() => { void reload(); }, []);

  async function reload() {
    const r = await api.get('/api/cashier/orders');
    setOrders(r.data as Order[]);
  }

  async function processPayment(id: number) {
    const m = method[id] ?? 'CASH';
    await api.patch(`/api/cashier/orders/${id}/pay`, { method: m });
    setMsg(`✅ Order #${id} paid via ${m}`);
    void reload();
  }

  async function applyDiscount(id: number) {
    const code = discountCode[id] ?? '';
    if (!code) return;
    try {
      const r = await api.patch(`/api/cashier/orders/${id}/discount`, { code });
      const d = r.data as { message: string; newTotal: string };
      setMsg(`✅ ${d.message}`);
      void reload();
    } catch { setMsg('❌ Invalid discount code'); }
  }

  async function showReceipt(id: number) {
    const r = await api.get(`/api/cashier/orders/${id}/receipt`);
    setReceipt(r.data as Order);
  }

  return (
    <div style={{ minHeight: '100vh', background: '#fbf9f8' }}>
      <div style={{ background: '#1a1a1a', color: '#fff', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 56 }}>
        <span style={{ fontWeight: 700, fontSize: 20 }}>🥩 Steakz MIS</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ fontSize: 13, color: '#ccc' }}>Welcome, {user?.name}</span>
          <span style={{ background: '#27ae60', padding: '3px 10px', borderRadius: 12, fontSize: 12, fontWeight: 600 }}>CASHIER</span>
          <button onClick={() => { logout(); navigate('/login'); }} style={{ background: '#af2b3e', color: '#fff', border: 'none', padding: '6px 14px', borderRadius: 6, cursor: 'pointer', fontSize: 13 }}>Logout</button>
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '32px 16px' }}>
        <h1 style={{ fontSize: 26, marginBottom: 6, fontFamily: 'serif' }}>💷 Cashier Station</h1>
        <p style={{ color: '#666', marginBottom: 20 }}>Process payments for ready orders</p>

        {msg && <div style={{ background: msg.startsWith('✅') ? '#f0fdf4' : '#fdecea', color: msg.startsWith('✅') ? '#16a085' : '#c0392b', padding: '10px 16px', borderRadius: 8, marginBottom: 20 }}>{msg}</div>}

        {receipt && (
          <div style={{ background: '#fff', border: '2px dashed #ddd', borderRadius: 12, padding: 24, marginBottom: 24, maxWidth: 380 }}>
            <h3 style={{ textAlign: 'center', marginBottom: 4, fontFamily: 'serif' }}>🥩 STEAKZ</h3>
            <p style={{ textAlign: 'center', color: '#888', fontSize: 12, marginBottom: 16 }}>— RECEIPT —</p>
            <p style={{ marginBottom: 4 }}><strong>Order #:</strong> {receipt.id}</p>
            <p style={{ marginBottom: 12 }}><strong>Table:</strong> {receipt.table?.tableNumber}</p>
            <hr style={{ margin: '12px 0', border: 'none', borderTop: '1px dashed #ddd' }} />
            {receipt.items?.map((it, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, fontSize: 14 }}>
                <span>{it.menuItem.name} × {it.quantity}</span>
                <span>£{(Number(it.unitPrice) * it.quantity).toFixed(2)}</span>
              </div>
            ))}
            <hr style={{ margin: '12px 0', border: 'none', borderTop: '1px dashed #ddd' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: 16 }}>
              <span>TOTAL</span>
              <span>£{Number(receipt.totalAmount).toFixed(2)}</span>
            </div>
            <p style={{ textAlign: 'center', color: '#888', fontSize: 11, marginTop: 16 }}>Thank you for dining at Steakz!</p>
            <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
              <button onClick={() => window.print()} style={{ background: '#1a1a1a', color: '#fff', border: 'none', padding: '8px 14px', borderRadius: 8, cursor: 'pointer', flex: 1 }}>🖨️ Print</button>
              <button onClick={() => setReceipt(null)} style={{ background: '#aaa', color: '#fff', border: 'none', padding: '8px 14px', borderRadius: 8, cursor: 'pointer', flex: 1 }}>Close</button>
            </div>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {orders.map(o => (
            <div key={o.id} style={{ background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <div>
                  <span style={{ fontWeight: 700, fontSize: 17 }}>Order #{o.id}</span>
                  <span style={{ color: '#888', fontSize: 14, marginLeft: 12 }}>Table {o.table.tableNumber}</span>
                </div>
                <span style={{ fontSize: 22, fontWeight: 800, color: '#af2b3e', fontFamily: 'monospace' }}>£{Number(o.totalAmount).toFixed(2)}</span>
              </div>
              <ul style={{ margin: '0 0 14px', paddingLeft: 18 }}>
                {o.items.map((it, i) => (
                  <li key={i} style={{ fontSize: 13, color: '#555', marginBottom: 2 }}>
                    {it.menuItem.name} × {it.quantity} — £{(Number(it.unitPrice) * it.quantity).toFixed(2)}
                  </li>
                ))}
              </ul>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
                <select value={method[o.id] ?? 'CASH'} onChange={e => setMethod(p => ({ ...p, [o.id]: e.target.value }))}
                  style={{ padding: '8px 14px', borderRadius: 8, border: '1px solid #ddd', fontSize: 14 }}>
                  <option value="CASH">💵 Cash</option>
                  <option value="CARD">💳 Card</option>
                  <option value="APP">📱 App</option>
                </select>
                <input placeholder="Discount code" value={discountCode[o.id] ?? ''} onChange={e => setDiscountCode(p => ({ ...p, [o.id]: e.target.value }))}
                  style={{ padding: '8px 12px', border: '1px solid #ddd', borderRadius: 8, fontSize: 14, width: 140 }} />
                <button onClick={() => { void applyDiscount(o.id); }} style={{ background: '#8e44ad', color: '#fff', border: 'none', padding: '8px 14px', borderRadius: 8, cursor: 'pointer', fontWeight: 600 }}>Apply</button>
                <button onClick={() => { void processPayment(o.id); }} style={{ background: '#27ae60', color: '#fff', border: 'none', padding: '8px 14px', borderRadius: 8, cursor: 'pointer', fontWeight: 600 }}>✓ Pay</button>
                <button onClick={() => { void showReceipt(o.id); }} style={{ background: '#2980b9', color: '#fff', border: 'none', padding: '8px 14px', borderRadius: 8, cursor: 'pointer', fontWeight: 600 }}>🧾 Receipt</button>
              </div>
            </div>
          ))}
          {orders.length === 0 && <div style={{ background: '#fff', borderRadius: 12, padding: 40, textAlign: 'center', color: '#aaa' }}>No orders ready for payment.</div>}
        </div>
      </div>
    </div>
  );
}