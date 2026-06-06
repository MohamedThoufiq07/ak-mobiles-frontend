import { createContext, useState, useEffect, useContext } from 'react';
import { Outlet } from 'react-router-dom';
import adminApi from '../utils/adminApi';

const AdminAuthContext = createContext();

export const useAdminAuth = () => useContext(AdminAuthContext);

// Used as a route element (renders <Outlet/>) so it wraps every /admin path
// with an admin-only session that is independent of the storefront login.
export const AdminAuthProvider = () => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const check = async () => {
      const token = localStorage.getItem('adminToken');
      if (token) {
        try {
          const { data } = await adminApi.get('/auth/profile');
          if (data.user?.role === 'admin') setAdmin(data.user);
          else localStorage.removeItem('adminToken');
        } catch {
          localStorage.removeItem('adminToken');
        }
      }
      setLoading(false);
    };
    check();
  }, []);

  // Verifies the account is an admin BEFORE storing a session.
  const login = async (email, password) => {
    try {
      const { data } = await adminApi.post('/auth/login', { email, password });
      if (data.user?.role !== 'admin') {
        return { success: false, message: 'This account does not have admin access.' };
      }
      localStorage.setItem('adminToken', data.token);
      setAdmin(data.user);
      return { success: true };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Login failed' };
    }
  };

  const logout = () => {
    localStorage.removeItem('adminToken');
    setAdmin(null);
  };

  return (
    <AdminAuthContext.Provider value={{ admin, isAdmin: !!admin, loading, login, logout }}>
      <Outlet />
    </AdminAuthContext.Provider>
  );
};
