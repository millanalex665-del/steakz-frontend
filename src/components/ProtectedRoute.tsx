import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type { ReactNode } from 'react';

interface Props { children: ReactNode; allowedRoles?: string[]; }

export default function ProtectedRoute({ children, allowedRoles }: Props) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to="/" />;
  return <>{children}</>;
}