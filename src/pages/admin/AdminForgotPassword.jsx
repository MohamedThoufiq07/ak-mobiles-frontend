import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { FiMail, FiLock, FiKey, FiArrowLeft, FiShield } from 'react-icons/fi';
import toast from 'react-hot-toast';
import adminApi from '../../utils/adminApi';
import { Reveal } from '../../components/ui/animations';

const inputCls =
  'w-full pl-10 pr-3 py-3 min-h-[44px] rounded-lg border border-slate-300 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition';

const AdminForgotPassword = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState('request'); // 'request' | 'reset'
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Step 1 — request a reset code (emailed to the admin).
  const requestReset = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const { data } = await adminApi.post('/auth/forgot-password', { email });
      // In dev the API returns the token directly so it can be tested without email.
      if (import.meta.env.DEV && data.resetToken) setToken(data.resetToken);
      toast.success('Reset code sent to your email.');
      setStep('reset');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not send reset code.');
    } finally {
      setSubmitting(false);
    }
  };

  // Step 2 — set a new password using the code.
  const resetPassword = async (e) => {
    e.preventDefault();
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirm) {
      toast.error('Passwords do not match.');
      return;
    }
    setSubmitting(true);
    try {
      await adminApi.post('/auth/reset-password', { token: token.trim(), password });
      toast.success('Password reset successful. Please sign in.');
      navigate('/admin/login', { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid or expired reset code.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Reset Admin Password | AK Mobiles</title>
      </Helmet>

      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 px-4 py-10">
        <Reveal y={16} className="w-full max-w-md">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/30 mb-4">
              <FiShield size={26} />
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900">Reset Admin Password</h1>
            <p className="text-sm text-slate-500 mt-1">
              {step === 'request'
                ? "Enter your admin email and we'll send a reset code."
                : 'Enter the code from your email and a new password.'}
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-7">
            {step === 'request' ? (
              <form className="space-y-4" onSubmit={requestReset}>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Admin Email</label>
                  <div className="relative">
                    <FiMail className="absolute inset-y-0 left-0 ml-3 my-auto text-slate-400" />
                    <input type="email" required className={inputCls} placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} />
                  </div>
                </div>
                <button type="submit" disabled={submitting} className="w-full min-h-[44px] py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold transition-colors disabled:opacity-70 shadow-lg shadow-blue-600/20">
                  {submitting ? 'Sending...' : 'Send Reset Code'}
                </button>
              </form>
            ) : (
              <form className="space-y-4" onSubmit={resetPassword}>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Reset Code</label>
                  <div className="relative">
                    <FiKey className="absolute inset-y-0 left-0 ml-3 my-auto text-slate-400" />
                    <input type="text" required className={inputCls} placeholder="Paste the code from your email" value={token} onChange={(e) => setToken(e.target.value)} />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">New Password</label>
                  <div className="relative">
                    <FiLock className="absolute inset-y-0 left-0 ml-3 my-auto text-slate-400" />
                    <input type="password" required className={inputCls} placeholder="At least 6 characters" value={password} onChange={(e) => setPassword(e.target.value)} />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Confirm Password</label>
                  <div className="relative">
                    <FiLock className="absolute inset-y-0 left-0 ml-3 my-auto text-slate-400" />
                    <input type="password" required className={inputCls} placeholder="Re-enter new password" value={confirm} onChange={(e) => setConfirm(e.target.value)} />
                  </div>
                </div>
                <button type="submit" disabled={submitting} className="w-full min-h-[44px] py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold transition-colors disabled:opacity-70 shadow-lg shadow-blue-600/20">
                  {submitting ? 'Resetting...' : 'Reset Password'}
                </button>
              </form>
            )}

            <div className="mt-5 pt-4 border-t border-slate-100 text-center">
              <Link to="/admin/login" className="text-sm font-medium text-slate-500 hover:text-blue-600 inline-flex items-center gap-1.5">
                <FiArrowLeft size={14} /> Back to Sign In
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    </>
  );
};

export default AdminForgotPassword;
