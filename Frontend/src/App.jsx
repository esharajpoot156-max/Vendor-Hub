import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './routes/ProtectedRoute';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Vendors from './pages/Vendors';
import Quotations from './pages/Quotations';
import Comparison from './pages/Comparison';
import MainLayout from './components/Layout/MainLayout';
import Register from './pages/Register';
import VendorLogin from './pages/VendorLogin';
import VendorDashboard from './pages/VendorDashboard';
import VendorProtectedRoute from './routes/VendorProtectedRoute';
import Profile from './pages/Profile';
import { ThemeProvider } from './context/ThemeContext';

function App() {
  return (
    <ThemeProvider>
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/vendor-login" element={<VendorLogin />} />
          <Route
          path="/vendor-portal" element={
          <VendorProtectedRoute>
            <VendorDashboard />
            </VendorProtectedRoute>
          }
          />

          <Route
            path="/"
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="profile" element={<Profile />} />
            <Route path="vendors" element={<Vendors />} />
            <Route path="quotations" element={<Quotations />} />
            <Route path="comparison" element={<Comparison />} />
          </Route>

          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;