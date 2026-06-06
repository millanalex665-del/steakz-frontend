import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div style={{ textAlign: 'center', padding: '80px 20px', background: '#fbf9f8', minHeight: '100vh' }}>
      <div style={{ fontSize: 80 }}>🥩</div>
      <h1 style={{ fontSize: 36, margin: '16px 0 8px' }}>404 — Page Not Found</h1>
      <p style={{ color: '#888', marginBottom: 24 }}>This page does not exist.</p>
      <Link to="/" style={{ background: '#af2b3e', color: '#fff', padding: '12px 28px', borderRadius: 8, fontWeight: 600 }}>
        Go Home
      </Link>
    </div>
  );
}