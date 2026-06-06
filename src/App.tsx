import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import AdminPage from './pages/AdminPage';
import HQPage from './pages/HQPage';
import BranchManagerPage from './pages/BranchManagerPage';
import ChefPage from './pages/ChefPage';
import CashierPage from './pages/CashierPage';
import WaiterPage from './pages/WaiterPage';
import NotFoundPage from './pages/NotFoundPage';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/admin" element={
            <ProtectedRoute allowedRoles={['ADMIN']}><AdminPage /></ProtectedRoute>
          } />
          <Route path="/hq" element={
            <ProtectedRoute allowedRoles={['HQ_MANAGER']}><HQPage /></ProtectedRoute>
          } />
          <Route path="/branch" element={
            <ProtectedRoute allowedRoles={['BRANCH_MANAGER']}><BranchManagerPage /></ProtectedRoute>
          } />
          <Route path="/chef" element={
            <ProtectedRoute allowedRoles={['CHEF']}><ChefPage /></ProtectedRoute>
          } />
          <Route path="/cashier" element={
            <ProtectedRoute allowedRoles={['CASHIER']}><CashierPage /></ProtectedRoute>
          } />
          <Route path="/waiter" element={
            <ProtectedRoute allowedRoles={['WAITER']}><WaiterPage /></ProtectedRoute>
          } />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}