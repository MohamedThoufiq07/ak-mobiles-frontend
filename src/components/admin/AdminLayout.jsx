import { NavLink, Link, useNavigate, Outlet, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  FiTrendingUp, FiPackage, FiShoppingBag, FiUsers, FiMail, FiZap, FiLogOut, FiExternalLink,
} from 'react-icons/fi';
import { useAdminAuth } from '../../context/AdminAuthContext';

const NAV = [
  { to: '/admin', label: 'Dashboard', icon: FiTrendingUp, end: true },
  { to: '/admin/products', label: 'Products', icon: FiPackage },
  { to: '/admin/orders', label: 'Orders', icon: FiShoppingBag },
  { to: '/admin/flash-sale', label: 'Flash Sale', icon: FiZap },
  { to: '/admin/users', label: 'Users', icon: FiUsers },
  { to: '/admin/messages', label: 'Messages', icon: FiMail },
];

const TITLES = {
  '/admin': 'Dashboard Overview',
  '/admin/products': 'Manage Products',
  '/admin/orders': 'Manage Orders',
  '/admin/flash-sale': 'Flash Sale',
  '/admin/users': 'Customers',
  '/admin/messages': 'Contact Messages',
};

const AdminLayout = () => {
  const { admin: user, logout } = useAdminAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const title = TITLES[pathname] || 'Admin';

  return (
    <>
      <Helmet>
        <title>{title} | AK Mobiles Admin</title>
      </Helmet>

      <div className="flex h-screen bg-slate-50 overflow-hidden">
        {/* Sidebar — light & bright */}
        <div className="w-64 bg-white border-r border-slate-200 flex flex-col shrink-0">
          <div className="p-6 border-b border-slate-100">
            <h2 className="text-xl font-extrabold flex items-center gap-2 text-slate-900">
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-brand-orange text-white text-sm">AK</span>
              Admin
            </h2>
          </div>

          <div className="flex-1 overflow-y-auto py-4">
            <nav className="space-y-1 px-3">
              {NAV.map(({ to, label, icon: Icon, end }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={end}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors font-medium text-sm ${
                      isActive
                        ? 'bg-blue-50 text-blue-700 font-semibold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`
                  }
                >
                  <Icon className="shrink-0" /> {label}
                </NavLink>
              ))}
            </nav>
          </div>

          <div className="p-4 border-t border-slate-100">
            <Link to="/" className="flex items-center gap-2 text-sm text-slate-500 hover:text-blue-600 mb-4 px-1">
              <FiExternalLink size={16} /> View Storefront
            </Link>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 text-white rounded-full flex items-center justify-center font-bold shrink-0">
                {user?.name?.charAt(0) || 'A'}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-slate-900 leading-none truncate">{user?.name}</p>
                <p className="text-xs text-slate-400 mt-1">Administrator</p>
              </div>
            </div>
            <button
              onClick={() => { logout(); navigate('/admin/login'); }}
              className="w-full flex items-center justify-center gap-2 text-sm font-medium text-red-600 hover:text-white hover:bg-red-500 border border-red-200 hover:border-red-500 py-2 rounded-lg transition-colors"
            >
              <FiLogOut /> Logout
            </button>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <header className="bg-white shadow-sm border-b border-slate-200 p-4 px-6 flex justify-between items-center z-10 shrink-0">
            <h1 className="text-2xl font-bold text-slate-800">{title}</h1>
            <Link to="/" className="text-sm font-medium text-blue-600 hover:text-brand-orange transition-colors">
              View Storefront →
            </Link>
          </header>

          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-50 p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </>
  );
};

export default AdminLayout;
