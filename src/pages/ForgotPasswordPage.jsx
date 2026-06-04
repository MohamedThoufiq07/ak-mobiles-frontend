import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { FiMail, FiArrowLeft, FiCheckCircle } from 'react-icons/fi';
import api from '../utils/api';
import toast from 'react-hot-toast';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await api.post('/auth/forgot-password', { email });
      setIsSuccess(true);
      toast.success('Password reset link sent!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Forgot Password | AK Mobiles</title>
      </Helmet>

      <div className="min-h-screen flex items-center justify-center animated-gradient-bg py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Animated Background Orbs */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-[10%] -left-[10%] w-[50vw] h-[50vw] rounded-full mix-blend-screen filter blur-[100px] opacity-30 bg-indigo-600"></div>
          <div className="absolute top-[20%] -right-[10%] w-[40vw] h-[40vw] rounded-full mix-blend-screen filter blur-[100px] opacity-25 bg-purple-600"></div>
        </div>

        <div className="max-w-md w-full glass-card rounded-2xl shadow-xl p-8 relative z-10 border border-slate-200/60 text-center text-slate-800">
          
          {isSuccess ? (
            <div className="py-8">
              <div className="w-20 h-20 bg-green-500/10 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <FiCheckCircle size={40} />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Check Your Email</h2>
              <p className="text-slate-500 mb-8">
                We've sent password reset instructions to <span className="font-bold">{email}</span>. Please check your inbox and spam folder.
              </p>
              <Link to="/login" className="btn-premium inline-block">
                Back to Login
              </Link>
            </div>
          ) : (
            <>
              <div className="w-16 h-16 bg-blue-500/10 text-brand-blue rounded-full flex items-center justify-center mx-auto mb-6">
                <FiLock size={28} />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Forgot Password?</h2>
              <p className="text-slate-500 mb-8 text-sm">
                No worries! Enter your email address and we'll send you a link to reset your password.
              </p>
              
              <form onSubmit={handleSubmit} className="text-left space-y-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <FiMail />
                    </div>
                    <input
                      type="email"
                      required
                      className="input-field pl-10 bg-white/90 border-slate-200 text-slate-850"
                      placeholder="Enter your registered email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full btn-premium py-3 disabled:opacity-70"
                >
                  {isSubmitting ? 'Sending Link...' : 'Send Reset Link'}
                </button>
              </form>
              
              <div className="mt-8 pt-6 border-t border-slate-200/80">
                <Link to="/login" className="text-sm font-bold text-brand-blue flex items-center justify-center gap-2 hover:text-brand-blue/80 transition-colors">
                  <FiArrowLeft /> Back to Login
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

// Import FiLock which was missing above
import { FiLock } from 'react-icons/fi';

export default ForgotPasswordPage;
