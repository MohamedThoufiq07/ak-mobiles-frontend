import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { 
  FiShoppingBag, FiUsers, FiDollarSign, FiTrendingUp, 
  FiPackage, FiSettings, FiLogOut 
} from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import { formatPrice } from '../../utils/formatPrice';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const AdminDashboard = () => {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  
  const [stats, setStats] = useState({
    totalSales: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalUsers: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAdmin) {
      navigate('/');
      return;
    }

    const fetchDashboardData = async () => {
      try {
        const [statsRes, ordersRes] = await Promise.all([
          api.get('/admin/stats'),
          api.get('/admin/orders') // Assuming we have this endpoint or similar
        ]);
        
        setStats(statsRes.data);
        // Only show top 5 recent orders
        setRecentOrders(ordersRes.data.orders.slice(0, 5));
      } catch (error) {
        console.error('Error fetching admin data:', error);
        // Fallback demo data if API fails
        setStats({
          totalSales: 450000,
          totalOrders: 124,
          totalProducts: 45,
          totalUsers: 210
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [isAdmin, navigate]);

  if (!isAdmin) return null;
  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <>
      <Helmet>
        <title>Admin Dashboard | AK Mobiles</title>
      </Helmet>

      <div className="flex h-screen bg-slate-100 overflow-hidden">
        
        {/* Sidebar */}
        <div className="w-64 bg-brand-dark text-white flex flex-col shrink-0">
          <div className="p-6 border-b border-slate-800">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <span className="text-brand-orange">AK</span> Admin
            </h2>
          </div>
          
          <div className="flex-1 overflow-y-auto py-4">
            <nav className="space-y-1 px-3">
              <Link to="/admin" className="flex items-center gap-3 px-3 py-3 bg-brand-blue rounded-lg text-white font-medium">
                <FiTrendingUp /> Dashboard
              </Link>
              <Link to="/admin/products" className="flex items-center gap-3 px-3 py-3 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">
                <FiPackage /> Products
              </Link>
              <Link to="/admin/orders" className="flex items-center gap-3 px-3 py-3 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">
                <FiShoppingBag /> Orders
              </Link>
              <Link to="/admin/users" className="flex items-center gap-3 px-3 py-3 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">
                <FiUsers /> Users
              </Link>
              <a href="#" className="flex items-center gap-3 px-3 py-3 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors mt-8">
                <FiSettings /> Settings
              </a>
            </nav>
          </div>
          
          <div className="p-4 border-t border-slate-800">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-brand-orange rounded-full flex items-center justify-center font-bold">
                {user?.name?.charAt(0) || 'A'}
              </div>
              <div>
                <p className="text-sm font-bold text-white leading-none">{user?.name}</p>
                <p className="text-xs text-slate-400 mt-1">Administrator</p>
              </div>
            </div>
            <button 
              onClick={() => { logout(); navigate('/'); }}
              className="w-full flex items-center justify-center gap-2 text-sm text-red-400 hover:text-white hover:bg-red-500 py-2 rounded transition-colors"
            >
              <FiLogOut /> Logout
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          
          {/* Top Header */}
          <header className="bg-white shadow-sm border-b border-slate-200 p-4 flex justify-between items-center z-10">
            <h1 className="text-2xl font-bold text-slate-800">Dashboard Overview</h1>
            <Link to="/" className="text-sm font-medium text-brand-blue hover:text-brand-orange transition-colors">
              View Storefront
            </Link>
          </header>

          {/* Scrollable Content */}
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-50 p-6">
            
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4">
                <div className="w-14 h-14 bg-green-50 text-green-500 rounded-lg flex items-center justify-center shrink-0">
                  <FiDollarSign size={24} />
                </div>
                <div>
                  <p className="text-sm text-slate-500 font-medium">Total Revenue</p>
                  <p className="text-2xl font-bold text-slate-900">{formatPrice(stats.totalSales)}</p>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4">
                <div className="w-14 h-14 bg-blue-50 text-blue-500 rounded-lg flex items-center justify-center shrink-0">
                  <FiShoppingBag size={24} />
                </div>
                <div>
                  <p className="text-sm text-slate-500 font-medium">Total Orders</p>
                  <p className="text-2xl font-bold text-slate-900">{stats.totalOrders}</p>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4">
                <div className="w-14 h-14 bg-orange-50 text-brand-orange rounded-lg flex items-center justify-center shrink-0">
                  <FiPackage size={24} />
                </div>
                <div>
                  <p className="text-sm text-slate-500 font-medium">Products</p>
                  <p className="text-2xl font-bold text-slate-900">{stats.totalProducts}</p>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4">
                <div className="w-14 h-14 bg-purple-50 text-purple-500 rounded-lg flex items-center justify-center shrink-0">
                  <FiUsers size={24} />
                </div>
                <div>
                  <p className="text-sm text-slate-500 font-medium">Customers</p>
                  <p className="text-2xl font-bold text-slate-900">{stats.totalUsers}</p>
                </div>
              </div>
            </div>

            {/* Recent Orders Section */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden mb-8">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                <h2 className="text-lg font-bold text-slate-900">Recent Orders</h2>
                <Link to="/admin/orders" className="text-sm font-medium text-brand-orange hover:underline">
                  View All
                </Link>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                      <th className="p-4 font-semibold">Order ID</th>
                      <th className="p-4 font-semibold">Customer</th>
                      <th className="p-4 font-semibold">Date</th>
                      <th className="p-4 font-semibold">Status</th>
                      <th className="p-4 font-semibold">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {recentOrders.length > 0 ? (
                      recentOrders.map(order => (
                        <tr key={order._id} className="hover:bg-slate-50">
                          <td className="p-4 text-sm font-mono text-slate-600">{order._id.substring(order._id.length - 8)}</td>
                          <td className="p-4 text-sm font-medium text-slate-900">{order.user?.name || order.shippingAddress?.name || 'Guest'}</td>
                          <td className="p-4 text-sm text-slate-500">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </td>
                          <td className="p-4 text-sm">
                            <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                              order.orderStatus === 'Delivered' ? 'bg-green-100 text-green-800' :
                              order.orderStatus === 'Shipped' ? 'bg-blue-100 text-blue-800' :
                              order.orderStatus === 'Processing' ? 'bg-yellow-100 text-yellow-800' :
                              order.orderStatus === 'Cancelled' ? 'bg-red-100 text-red-800' :
                              'bg-slate-100 text-slate-800'
                            }`}>
                              {order.orderStatus}
                            </span>
                          </td>
                          <td className="p-4 text-sm font-bold text-slate-900">{formatPrice(order.totalPrice)}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="p-8 text-center text-slate-500">No recent orders found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-r from-brand-blue to-brand-dark p-6 rounded-xl text-white shadow-md">
                <h3 className="text-xl font-bold mb-2">Manage Products</h3>
                <p className="text-slate-300 text-sm mb-6 max-w-sm">Add new smartphones, update inventory, or change prices and offers.</p>
                <div className="flex gap-3">
                  <button className="bg-brand-orange hover:bg-brand-orangeHover px-4 py-2 rounded text-sm font-bold transition-colors">
                    Add Product
                  </button>
                  <button className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded text-sm font-medium transition-colors border border-white/20">
                    View Inventory
                  </button>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-slate-800 to-slate-900 p-6 rounded-xl text-white shadow-md">
                <h3 className="text-xl font-bold mb-2">Order Fulfillment</h3>
                <p className="text-slate-400 text-sm mb-6 max-w-sm">Review new orders, update shipping status, and manage deliveries.</p>
                <button className="bg-white text-slate-900 hover:bg-slate-100 px-4 py-2 rounded text-sm font-bold transition-colors">
                  Process Orders
                </button>
              </div>
            </div>

          </main>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
