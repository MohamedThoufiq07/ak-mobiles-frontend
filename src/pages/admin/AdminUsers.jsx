import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import adminApi from '../../utils/adminApi';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await adminApi.get(`/users?page=${page}&limit=20`);
      setUsers(data.users || []);
      setPages(data.pages || 1);
      setTotal(data.total || 0);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  if (loading) return <div className="py-20"><LoadingSpinner /></div>;

  return (
    <>
      <p className="text-sm text-slate-500 mb-6">{total} registered customer{total === 1 ? '' : 's'}</p>

      {users.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-100 p-12 text-center text-slate-500">No customers yet.</div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                  <th className="p-4 font-semibold">Customer</th>
                  <th className="p-4 font-semibold">Email</th>
                  <th className="p-4 font-semibold">Phone</th>
                  <th className="p-4 font-semibold">Wishlist</th>
                  <th className="p-4 font-semibold">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((u) => (
                  <tr key={u._id} className="hover:bg-slate-50">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-brand-blue/10 text-brand-blue rounded-full flex items-center justify-center font-bold uppercase shrink-0">
                          {u.name?.charAt(0) || 'U'}
                        </div>
                        <span className="font-medium text-slate-900 text-sm">{u.name}</span>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-slate-600">{u.email}</td>
                    <td className="p-4 text-sm text-slate-600">{u.phone || '—'}</td>
                    <td className="p-4 text-sm text-slate-600">{u.wishlist?.length || 0}</td>
                    <td className="p-4 text-sm text-slate-500">{new Date(u.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {pages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="px-3 py-1.5 text-sm border border-slate-300 rounded-lg disabled:opacity-40 hover:bg-white">Prev</button>
          <span className="text-sm text-slate-500">Page {page} of {pages}</span>
          <button disabled={page >= pages} onClick={() => setPage((p) => p + 1)} className="px-3 py-1.5 text-sm border border-slate-300 rounded-lg disabled:opacity-40 hover:bg-white">Next</button>
        </div>
      )}
    </>
  );
};

export default AdminUsers;
