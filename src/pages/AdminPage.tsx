import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

interface User { id: number; name: string; email: string; role: string; isActive: boolean; branchId: number | null }
interface Branch { id: number; name: string; city: string; isActive: boolean }

export default function AdminPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<'users' | 'branches'>('users');
  const [users, setUsers] = useState<User[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [msg, setMsg] = useState('');

  // Create user form
  const [uName, setUName] = useState('');
  const [uEmail, setUEmail] = useState('');
  const [uPass, setUPass] = useState('');
  const [uRole, setURole] = useState('WAITER');
  const [uBranch, setUBranch] = useState('');

  // Create branch form
  const [bName, setBName] = useState('');
  const [bCity, setBCity] = useState('');
  const [bAddr, setBAddr] = useState('');
  const [bPhone, setBPhone] = useState('');

  useEffect(() => { void load(); }, []);

  async function load() {
    const [u, b] = await Promise.all([api.get('/api/admin/users'), api.get('/api/admin/branches')]);
    setUsers(u.data as User[]);
    setBranches(b.data as Branch[]);
  }

  async function createUser(e: React.FormEvent) {
    e.preventDefault(); setMsg('');
    try {
      await api.post('/api/admin/users', { name: uName, email: uEmail, password: uPass, role: uRole, branchId: uBranch ? Number(uBranch) : undefined });
      setMsg('✅ User created!');
      setUName(''); setUEmail(''); setUPass('');
      void load();
    } catch { setMsg('❌ Email already in use.'); }
  }

  async function createBranch(e: React.FormEvent) {
    e.preventDefault(); setMsg('');
    try {
      await api.post('/api/admin/branches', { name: bName, city: bCity, address: bAddr, phone: bPhone });
      setMsg('✅ Branch created!');
      setBName(''); setBCity(''); setBAddr(''); setBPhone('');
      void load();
    } catch { setMsg('❌ Error creating branch.'); }
  }

  async function toggleUser(id: number, active: boolean) {
    await api.patch(`/api/admin/users/${id}/${active ? 'deactivate' : 'activate'}`);
    void load();
  }

  function handleLogout() { logout(); navigate('/login'); }

  const inp = { display: 'block' as const, width: '100%', padding: '9px 12px', margin: '6px 0 14px', border: '1px solid #ddd', borderRadius: 8, fontSize: 14 };

  return (
    <div style={{ minHeight: '100vh', background: '#fbf9f8' }}>
      {/* Navbar */}
      <div style={{ background: '#1a1a1a', color: '#fff', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 56 }}>
        <span style={{ fontWeight: 700, fontSize: 20 }}>🥩 Steakz MIS</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ fontSize: 13, color: '#ccc' }}>Welcome, {user?.name}</span>
          <span style={{ background: '#af2b3e', padding: '3px 10px', borderRadius: 12, fontSize: 12, fontWeight: 600 }}>ADMIN</span>
          <button onClick={handleLogout} style={{ background: '#af2b3e', color: '#fff', border: 'none', padding: '6px 14px', borderRadius: 6, cursor: 'pointer', fontSize: 13 }}>Logout</button>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 16px' }}>
        <h1 style={{ fontSize: 26, marginBottom: 6, fontFamily: 'serif' }}>⚙️ Admin Dashboard</h1>
        <p style={{ color: '#666', marginBottom: 24 }}>Manage all users and branches</p>

        {msg && (
          <div style={{ background: msg.startsWith('✅') ? '#f0fdf4' : '#fdecea', color: msg.startsWith('✅') ? '#16a085' : '#c0392b', padding: '10px 16px', borderRadius: 8, marginBottom: 20 }}>
            {msg}
          </div>
        )}

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
          {(['users', 'branches'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)} style={{ background: tab === t ? '#1a1a1a' : '#eee', color: tab === t ? '#fff' : '#333', border: 'none', padding: '8px 20px', borderRadius: 8, cursor: 'pointer', fontWeight: 600, fontSize: 14 }}>
              {t === 'users' ? '👥 Users' : '🏢 Branches'}
            </button>
          ))}
        </div>

        {/* USERS TAB */}
        {tab === 'users' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 24 }}>
            <div style={{ background: '#fff', padding: 24, borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
              <h3 style={{ marginBottom: 16 }}>Create User</h3>
              <form onSubmit={e => { void createUser(e); }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: '#555' }}>Name</label>
                <input style={inp} value={uName} onChange={e => setUName(e.target.value)} required />
                <label style={{ fontSize: 12, fontWeight: 600, color: '#555' }}>Email</label>
                <input style={inp} type="email" value={uEmail} onChange={e => setUEmail(e.target.value)} required />
                <label style={{ fontSize: 12, fontWeight: 600, color: '#555' }}>Password</label>
                <input style={inp} type="password" value={uPass} onChange={e => setUPass(e.target.value)} required />
                <label style={{ fontSize: 12, fontWeight: 600, color: '#555' }}>Role</label>
                <select style={inp} value={uRole} onChange={e => setURole(e.target.value)}>
                  {['HQ_MANAGER', 'BRANCH_MANAGER', 'CHEF', 'CASHIER', 'WAITER'].map(r => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
                <label style={{ fontSize: 12, fontWeight: 600, color: '#555' }}>Branch</label>
                <select style={inp} value={uBranch} onChange={e => setUBranch(e.target.value)}>
                  <option value="">No branch</option>
                  {branches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                </select>
                <button type="submit" style={{ background: '#af2b3e', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: 8, cursor: 'pointer', fontWeight: 600, fontSize: 14, width: '100%' }}>
                  Create User
                </button>
              </form>
            </div>

            <div style={{ background: '#fff', padding: 24, borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
              <h3 style={{ marginBottom: 16 }}>All Users ({users.length})</h3>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                <thead>
                  <tr style={{ background: '#1a1a1a', color: '#fff' }}>
                    {['Name', 'Email', 'Role', 'Status', 'Action'].map(h => (
                      <th key={h} style={{ textAlign: 'left', padding: '10px 8px' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                      <td style={{ padding: '10px 8px', fontWeight: 600 }}>{u.name}</td>
                      <td style={{ padding: '10px 8px', color: '#666' }}>{u.email}</td>
                      <td style={{ padding: '10px 8px' }}>
                        <span style={{ background: '#fdecea', color: '#af2b3e', padding: '2px 8px', borderRadius: 10, fontSize: 11, fontWeight: 700 }}>{u.role}</span>
                      </td>
                      <td style={{ padding: '10px 8px' }}>
                        <span style={{ color: u.isActive ? '#27ae60' : '#c0392b', fontWeight: 600 }}>{u.isActive ? 'Active' : 'Inactive'}</span>
                      </td>
                      <td style={{ padding: '10px 8px' }}>
                        <button onClick={() => { void toggleUser(u.id, u.isActive); }} style={{ background: u.isActive ? '#fdecea' : '#f0fdf4', color: u.isActive ? '#c0392b' : '#27ae60', border: 'none', padding: '4px 10px', borderRadius: 6, cursor: 'pointer', fontSize: 12 }}>
                          {u.isActive ? 'Deactivate' : 'Activate'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* BRANCHES TAB */}
        {tab === 'branches' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 24 }}>
            <div style={{ background: '#fff', padding: 24, borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
              <h3 style={{ marginBottom: 16 }}>Create Branch</h3>
              <form onSubmit={e => { void createBranch(e); }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: '#555' }}>Branch Name</label>
                <input style={inp} value={bName} onChange={e => setBName(e.target.value)} required />
                <label style={{ fontSize: 12, fontWeight: 600, color: '#555' }}>City</label>
                <input style={inp} value={bCity} onChange={e => setBCity(e.target.value)} required />
                <label style={{ fontSize: 12, fontWeight: 600, color: '#555' }}>Address</label>
                <input style={inp} value={bAddr} onChange={e => setBAddr(e.target.value)} required />
                <label style={{ fontSize: 12, fontWeight: 600, color: '#555' }}>Phone</label>
                <input style={inp} value={bPhone} onChange={e => setBPhone(e.target.value)} required />
                <button type="submit" style={{ background: '#2980b9', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: 8, cursor: 'pointer', fontWeight: 600, fontSize: 14, width: '100%' }}>
                  Create Branch
                </button>
              </form>
            </div>

            <div style={{ background: '#fff', padding: 24, borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
              <h3 style={{ marginBottom: 16 }}>All Branches ({branches.length})</h3>
              {branches.map(b => (
                <div key={b.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #f0f0f0' }}>
                  <div>
                    <p style={{ fontWeight: 600, fontSize: 15 }}>{b.name}</p>
                    <p style={{ color: '#888', fontSize: 13 }}>{b.city}</p>
                  </div>
                  <span style={{ color: b.isActive ? '#27ae60' : '#c0392b', fontWeight: 600, fontSize: 13 }}>{b.isActive ? 'Active' : 'Inactive'}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}