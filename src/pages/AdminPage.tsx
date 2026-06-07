import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

interface User { id: number; name: string; email: string; role: string; isActive: boolean; branchId: number | null }
interface Branch { id: number; name: string; city: string; isActive: boolean }

const ROLE_COLORS: Record<string, string> = {
  ADMIN: '#af2b3e', HQ_MANAGER: '#6b21a8', BRANCH_MANAGER: '#1d4ed8',
  CHEF: '#c2410c', CASHIER: '#15803d', WAITER: '#0f766e'
};

export default function AdminPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<'users' | 'branches'>('users');
  const [users, setUsers] = useState<User[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [msg, setMsg] = useState('');
  const [uName, setUName] = useState(''); const [uEmail, setUEmail] = useState('');
  const [uPass, setUPass] = useState(''); const [uRole, setURole] = useState('WAITER');
  const [uBranch, setUBranch] = useState('');
  const [bName, setBName] = useState(''); const [bCity, setBCity] = useState('');
  const [bAddr, setBAddr] = useState(''); const [bPhone, setBPhone] = useState('');

  useEffect(() => { void load(); }, []);

  async function load() {
    const [u, b] = await Promise.all([api.get('/api/admin/users'), api.get('/api/admin/branches')]);
    setUsers(u.data as User[]); setBranches(b.data as Branch[]);
  }

  async function createUser(e: React.FormEvent) {
    e.preventDefault(); setMsg('');
    try {
      await api.post('/api/admin/users', { name: uName, email: uEmail, password: uPass, role: uRole, branchId: uBranch ? Number(uBranch) : undefined });
      setMsg('✅ User created!'); setUName(''); setUEmail(''); setUPass(''); void load();
    } catch { setMsg('❌ Email already in use.'); }
  }

  async function createBranch(e: React.FormEvent) {
    e.preventDefault(); setMsg('');
    try {
      await api.post('/api/admin/branches', { name: bName, city: bCity, address: bAddr, phone: bPhone });
      setMsg('✅ Branch created!'); setBName(''); setBCity(''); setBAddr(''); setBPhone(''); void load();
    } catch { setMsg('❌ Error.'); }
  }

  async function toggleUser(id: number, active: boolean) {
    await api.patch(`/api/admin/users/${id}/${active ? 'deactivate' : 'activate'}`); void load();
  }

  async function deleteUser(id: number) {
    if (!confirm('Are you sure you want to permanently delete this user?')) return;
    await api.delete(`/api/admin/users/${id}`);
    setMsg('✅ User deleted.');
    void load();
  }

  const inp = { display: 'block' as const, width: '100%', padding: '9px 12px', margin: '6px 0 14px', border: '1px solid #c4c7c7', borderRadius: 4, fontFamily: 'Hanken Grotesk', fontSize: 14 };
  const lbl = { fontSize: 12, fontWeight: 700 as const, color: '#444748', textTransform: 'uppercase' as const, letterSpacing: '0.05em', display: 'block' as const };

  return (
    <div style={{ fontFamily: 'Hanken Grotesk, sans-serif', minHeight: '100vh', background: '#fbf9f8', overflow: 'hidden' }}>
      {/* Sidebar */}
      <aside style={{ position: 'fixed', left: 0, top: 0, width: 256, height: '100vh', background: '#efeded', borderRight: '1px solid #c4c7c7', display: 'flex', flexDirection: 'column', padding: '24px 0', zIndex: 50 }}>
        <div style={{ padding: '0 24px', marginBottom: 40 }}>
          <span style={{ fontFamily: 'Libre Caslon Text, serif', fontSize: 48, fontWeight: 700, color: '#000', lineHeight: 1 }}>Steakz</span>
        </div>
        <nav style={{ flex: 1 }}>
          {[
            { icon: 'manage_accounts', label: 'Users', t: 'users' },
            { icon: 'store', label: 'Branches', t: 'branches' },
          ].map(item => (
            <div key={item.label} onClick={() => setTab(item.t as 'users' | 'branches')} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', margin: '2px 8px', borderRadius: 4, background: tab === item.t ? '#000' : 'transparent', color: tab === item.t ? '#fff' : '#444748', cursor: 'pointer', fontSize: 14, fontWeight: tab === item.t ? 600 : 400 }}>
              <span className="material-symbols-outlined" style={{ fontSize: 20 }}>{item.icon}</span>
              {item.label}
            </div>
          ))}
        </nav>
        <div style={{ padding: '16px', borderTop: '1px solid #c4c7c7', margin: '0 8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#af2b3e', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 18, fontWeight: 700 }}>A</div>
            <div>
              <p style={{ fontSize: 15, fontWeight: 600, color: '#000', margin: 0 }}>{user?.name}</p>
              <p style={{ fontSize: 12, fontWeight: 700, color: '#af2b3e', margin: 0 }}>Administrator</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Header */}
      <header style={{ position: 'sticky', top: 0, marginLeft: 256, zIndex: 40, background: '#fbf9f8', borderBottom: '1px solid #c4c7c7', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span className="material-symbols-outlined">admin_panel_settings</span>
          <h1 style={{ fontFamily: 'Libre Caslon Text, serif', fontSize: 28, fontWeight: 600, margin: 0 }}>Admin Portal</h1>
        </div>
        <button onClick={() => { logout(); navigate('/login'); }} style={{ background: '#000', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: 4, fontFamily: 'Hanken Grotesk', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>LOGOUT</button>
      </header>

      <main style={{ marginLeft: 256, padding: 24, height: 'calc(100vh - 80px)', overflowY: 'auto' }}>
        {msg && <div style={{ background: msg.startsWith('✅') ? '#f0fdf4' : '#fdecea', color: msg.startsWith('✅') ? '#16a085' : '#af2b3e', padding: '10px 16px', borderRadius: 4, marginBottom: 20, fontFamily: 'Hanken Grotesk', fontSize: 14 }}>{msg}</div>}

        {tab === 'users' && (
          <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: 24 }}>
            {/* Create User */}
            <div style={{ background: '#fff', border: '1px solid #c4c7c7', padding: 24, boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
              <h3 style={{ fontFamily: 'Libre Caslon Text, serif', fontSize: 20, fontWeight: 600, marginBottom: 20 }}>Create New User</h3>
              <form onSubmit={e => { void createUser(e); }}>
                <label style={lbl}>Full Name</label>
                <input style={inp} value={uName} onChange={e => setUName(e.target.value)} required placeholder="John Smith" />
                <label style={lbl}>Email Address</label>
                <input style={inp} type="email" value={uEmail} onChange={e => setUEmail(e.target.value)} required placeholder="john@steakz.com" />
                <label style={lbl}>Password</label>
                <input style={inp} type="password" value={uPass} onChange={e => setUPass(e.target.value)} required placeholder="••••••••" />
                <label style={lbl}>Role</label>
                <select style={inp} value={uRole} onChange={e => setURole(e.target.value)}>
                  {['HQ_MANAGER', 'BRANCH_MANAGER', 'CHEF', 'CASHIER', 'WAITER', 'CUSTOMER', 'DELIVERY'].map(r => <option key={r} value={r}>{r}</option>)}
                </select>
                <label style={lbl}>Branch</label>
                <select style={inp} value={uBranch} onChange={e => setUBranch(e.target.value)}>
                  <option value="">No branch (HQ roles)</option>
                  {branches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                </select>
                <button type="submit" style={{ background: '#af2b3e', color: '#fff', border: 'none', padding: '12px 24px', fontFamily: 'Hanken Grotesk', fontSize: 12, fontWeight: 700, cursor: 'pointer', width: '100%', letterSpacing: '0.05em' }}>CREATE USER</button>
              </form>
            </div>

            {/* Users Table */}
            <div style={{ background: '#fff', border: '1px solid #c4c7c7', boxShadow: '0 1px 2px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
              <div style={{ padding: '16px 20px', borderBottom: '1px solid #c4c7c7' }}>
                <h3 style={{ fontFamily: 'Libre Caslon Text, serif', fontSize: 20, fontWeight: 600, margin: 0 }}>All Users ({users.length})</h3>
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'Hanken Grotesk', fontSize: 14 }}>
                  <thead>
                    <tr style={{ background: '#000', color: '#fff' }}>
                      {['Name', 'Email', 'Role', 'Branch', 'Status', 'Actions'].map(h => (
                        <th key={h} style={{ textAlign: 'left', padding: '12px 16px', fontSize: 11, fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u, i) => (
                      <tr key={u.id} style={{ borderBottom: '1px solid #c4c7c7', background: i % 2 === 0 ? '#fff' : '#f5f3f3' }}>
                        <td style={{ padding: '12px 16px', fontWeight: 600 }}>{u.name}</td>
                        <td style={{ padding: '12px 16px', color: '#444748', fontSize: 13 }}>{u.email}</td>
                        <td style={{ padding: '12px 16px' }}>
                          <span style={{ background: (ROLE_COLORS[u.role] ?? '#555') + '15', color: ROLE_COLORS[u.role] ?? '#555', padding: '3px 8px', borderRadius: 2, fontSize: 11, fontWeight: 700, letterSpacing: '0.05em' }}>{u.role}</span>
                        </td>
                        <td style={{ padding: '12px 16px', color: '#444748', fontSize: 13 }}>{u.branchId ?? '—'}</td>
                        <td style={{ padding: '12px 16px' }}>
                          <span style={{ color: u.isActive ? '#15803d' : '#af2b3e', fontWeight: 600, fontSize: 13 }}>{u.isActive ? '● Active' : '○ Inactive'}</span>
                        </td>
                        <td style={{ padding: '12px 16px' }}>
                          <div style={{ display: 'flex', gap: 6 }}>
                            <button onClick={() => { void toggleUser(u.id, u.isActive); }} style={{ background: 'transparent', color: u.isActive ? '#af2b3e' : '#15803d', border: `1px solid ${u.isActive ? '#af2b3e' : '#15803d'}`, padding: '4px 10px', cursor: 'pointer', fontFamily: 'Hanken Grotesk', fontSize: 11, fontWeight: 700, letterSpacing: '0.05em' }}>
                              {u.isActive ? 'DEACTIVATE' : 'ACTIVATE'}
                            </button>
                            <button onClick={() => { void deleteUser(u.id); }} style={{ background: '#ba1a1a', color: '#fff', border: 'none', padding: '4px 10px', cursor: 'pointer', fontFamily: 'Hanken Grotesk', fontSize: 11, fontWeight: 700, letterSpacing: '0.05em' }}>
                              DELETE
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {tab === 'branches' && (
          <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: 24 }}>
            <div style={{ background: '#fff', border: '1px solid #c4c7c7', padding: 24, boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
              <h3 style={{ fontFamily: 'Libre Caslon Text, serif', fontSize: 20, fontWeight: 600, marginBottom: 20 }}>Create Branch</h3>
              <form onSubmit={e => { void createBranch(e); }}>
                <label style={lbl}>Branch Name</label>
                <input style={inp} value={bName} onChange={e => setBName(e.target.value)} required placeholder="Steakz Liverpool" />
                <label style={lbl}>City</label>
                <input style={inp} value={bCity} onChange={e => setBCity(e.target.value)} required />
                <label style={lbl}>Address</label>
                <input style={inp} value={bAddr} onChange={e => setBAddr(e.target.value)} required />
                <label style={lbl}>Phone</label>
                <input style={inp} value={bPhone} onChange={e => setBPhone(e.target.value)} required />
                <button type="submit" style={{ background: '#000', color: '#fff', border: 'none', padding: '12px 24px', fontFamily: 'Hanken Grotesk', fontSize: 12, fontWeight: 700, cursor: 'pointer', width: '100%', letterSpacing: '0.05em' }}>CREATE BRANCH</button>
              </form>
            </div>
            <div style={{ background: '#fff', border: '1px solid #c4c7c7', boxShadow: '0 1px 2px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
              <div style={{ padding: '16px 20px', borderBottom: '1px solid #c4c7c7' }}>
                <h3 style={{ fontFamily: 'Libre Caslon Text, serif', fontSize: 20, fontWeight: 600, margin: 0 }}>All Branches ({branches.length})</h3>
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'Hanken Grotesk', fontSize: 14 }}>
                <thead>
                  <tr style={{ background: '#000', color: '#fff' }}>
                    {['Name', 'City', 'Status'].map(h => (
                      <th key={h} style={{ textAlign: 'left', padding: '12px 16px', fontSize: 11, fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {branches.map((b, i) => (
                    <tr key={b.id} style={{ borderBottom: '1px solid #c4c7c7', background: i % 2 === 0 ? '#fff' : '#f5f3f3' }}>
                      <td style={{ padding: '14px 16px', fontWeight: 600 }}>{b.name}</td>
                      <td style={{ padding: '14px 16px', color: '#444748' }}>{b.city}</td>
                      <td style={{ padding: '14px 16px' }}><span style={{ color: b.isActive ? '#15803d' : '#af2b3e', fontWeight: 600 }}>{b.isActive ? '● Active' : '○ Inactive'}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
