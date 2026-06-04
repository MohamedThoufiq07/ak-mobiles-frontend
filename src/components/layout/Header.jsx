import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { FiShoppingCart, FiUser, FiSearch, FiMenu, FiX, FiLogOut, FiSettings, FiChevronRight, FiHeart } from 'react-icons/fi';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import logo from '../../assets/logo_dark_text.png';

const Header = () => {
  const { isAuthenticated, user, logout, isAdmin } = useAuth();
  const { cartItemCount } = useCart();
  const { wishlist } = useWishlist();
  const navigate = useNavigate();
  const { pathname, search } = useLocation();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const isActive = (path, exactSearch = '') => {
    if (exactSearch) {
      return pathname === path && search === exactSearch;
    }
    return pathname === path;
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setIsMenuOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    setShowDropdown(false);
    navigate('/');
  };

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b bg-white/95 backdrop-blur-md border-slate-200/80 ${scrolled ? 'py-3.5 shadow-md shadow-slate-100/10' : 'py-5'}`}>
        <div className="w-full pl-2 pr-4 md:pl-4 md:pr-8 xl:pl-6 xl:pr-12 flex items-center justify-between gap-4 lg:gap-8">

          {/* 1. Logo */}
          <Link to="/" className="z-50 group shrink-0 flex items-center">
            <img
              src={logo}
              alt="AK Mobiles"
              className={`w-auto object-contain transition-all duration-300 group-hover:scale-105 -translate-y-1 ${scrolled ? 'h-12' : 'h-16'}`}
            />
          </Link>

          {/* 2. Search Bar (Always visible on desktop) */}
          <div className="hidden lg:block flex-grow max-w-2xl">
            <form onSubmit={handleSearch} className="relative w-full group">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-blue transition-colors" size={20} />
              <input
                type="text"
                placeholder="Search for smartphones, brands, accessories..."
                className="w-full py-2.5 pl-12 pr-4 bg-slate-50 border border-slate-200 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-blue focus:bg-white transition-all text-slate-800 placeholder-slate-400 text-sm rounded-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit" className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-brand-blue hover:bg-brand-blueHover text-white py-1.5 px-4 rounded-full text-xs font-bold transition-colors">
                Search
              </button>
            </form>
          </div>

          {/* Navigation Links (Desktop) */}
          <nav className="hidden lg:flex items-center gap-6 shrink-0">
            {/* 3. Home */}
            <Link to="/" className={`font-semibold transition-colors relative group ${isActive('/') ? 'text-slate-900 font-bold' : 'text-slate-600 hover:text-slate-900'}`}>
              Home
              <span className={`absolute -bottom-1 left-0 h-0.5 bg-brand-blue transition-all ${isActive('/') ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
            </Link>
            {/* 4. Shop */}
            <Link to="/products" className={`font-semibold transition-colors relative group ${isActive('/products') && !search ? 'text-slate-900 font-bold' : 'text-slate-600 hover:text-slate-900'}`}>
              Shop
              <span className={`absolute -bottom-1 left-0 h-0.5 bg-brand-blue transition-all ${isActive('/products') && !search ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
            </Link>

            {/* 6. About */}
            <Link to="/about" className={`font-semibold transition-colors relative group ${isActive('/about') ? 'text-slate-900 font-bold' : 'text-slate-600 hover:text-slate-900'}`}>
              About
              <span className={`absolute -bottom-1 left-0 h-0.5 bg-brand-blue transition-all ${isActive('/about') ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
            </Link>
            {/* 7. Contact */}
            <Link to="/contact" className={`font-semibold transition-colors relative group ${isActive('/contact') ? 'text-slate-900 font-bold' : 'text-slate-600 hover:text-slate-900'}`}>
              Contact
              <span className={`absolute -bottom-1 left-0 h-0.5 bg-brand-blue transition-all ${isActive('/contact') ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
            </Link>
          </nav>

          {/* Actions (Cart & User Profile) */}
          <div className="flex items-center gap-4 z-50 shrink-0">
            {/* Wishlist */}
            <Link to="/wishlist" className="relative text-slate-600 hover:text-red-500 transition-colors p-2 hidden sm:block">
              <FiHeart size={22} />
              {wishlist?.length > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center font-bold border border-white">
                  {wishlist.length}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link to="/cart" className="relative text-slate-600 hover:text-slate-900 transition-colors p-2">
              <FiShoppingCart size={22} />
              {cartItemCount > 0 && (
                <span className="absolute top-0 right-0 bg-brand-orange text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center font-bold border border-white">
                  {cartItemCount}
                </span>
              )}
            </Link>

            {/* 8. User Profile / Login */}
            <div className="relative hidden md:block">
              {isAuthenticated ? (
                <div
                  className="flex items-center gap-2 cursor-pointer hover:bg-slate-100 p-1.5 rounded-full border border-transparent hover:border-slate-200 transition-all"
                  onClick={() => setShowDropdown(!showDropdown)}
                >
                  <div className="bg-gradient-to-r from-brand-blue to-purple-600 h-8 w-8 rounded-full flex items-center justify-center font-bold text-white text-sm uppercase shadow-sm">
                    {user?.name?.charAt(0) || 'U'}
                  </div>
                </div>
              ) : (
                <Link to="/login" className="flex items-center gap-2 text-slate-600 hover:text-slate-900 font-semibold transition-colors">
                  <FiUser size={22} />
                  <span>Login</span>
                </Link>
              )}

              {/* Dropdown Menu */}
              <AnimatePresence>
                {isAuthenticated && showDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-3 w-56 bg-white border border-slate-200 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] py-2 text-slate-700 z-50 overflow-hidden"
                  >
                    <div className="px-5 py-3 border-b border-slate-100 bg-slate-50/50">
                      <p className="font-bold text-base truncate text-slate-800">{user?.name}</p>
                      <p className="text-slate-500 text-xs truncate">{user?.email}</p>
                    </div>

                    <div className="py-2">
                      {isAdmin && (
                        <Link to="/admin" onClick={() => setShowDropdown(false)} className="flex items-center gap-3 px-5 py-2.5 hover:bg-slate-50 text-sm font-semibold text-brand-blue transition-colors">
                          <FiSettings size={18} /> Admin Dashboard
                        </Link>
                      )}
                      <Link to="/profile" onClick={() => setShowDropdown(false)} className="flex items-center gap-3 px-5 py-2.5 hover:bg-slate-50 text-sm font-medium text-slate-750 transition-colors">
                        <FiUser size={18} className="text-slate-500" /> My Profile
                      </Link>
                      <Link to="/my-orders" onClick={() => setShowDropdown(false)} className="flex items-center gap-3 px-5 py-2.5 hover:bg-slate-50 text-sm font-medium text-slate-750 transition-colors">
                        <FiShoppingCart size={18} className="text-slate-500" /> My Orders
                      </Link>
                    </div>

                    <div className="border-t border-slate-100 py-1">
                      <button
                        onClick={handleLogout}
                        className="w-full text-left flex items-center gap-3 px-5 py-2.5 hover:bg-red-50 text-red-650 text-sm font-semibold transition-colors"
                      >
                        <FiLogOut size={18} /> Logout
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              className="lg:hidden text-slate-600 p-2 hover:bg-slate-100 rounded-full transition-colors"
              onClick={() => setIsMenuOpen(true)}
            >
              <FiMenu size={24} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Slide-in Drawer */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-900/30 backdrop-blur-sm z-[60] lg:hidden"
              onClick={closeMenu}
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed top-0 right-0 h-full w-[300px] sm:w-[350px] bg-white/95 backdrop-blur-2xl z-[70] shadow-2xl flex flex-col lg:hidden border-l border-slate-200"
            >
              <div className="flex items-center justify-between p-5 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <img src={logo} alt="AK Mobiles" className="h-10 w-auto object-contain -translate-y-0.5" />
                </div>
                <button onClick={closeMenu} className="p-2 bg-slate-100 rounded-full text-slate-600 hover:text-slate-900 hover:bg-slate-200">
                  <FiX size={20} />
                </button>
              </div>

              <div className="flex-grow overflow-y-auto pb-8">
                <div className="p-5 border-b border-slate-100">
                  <form onSubmit={handleSearch} className="relative">
                    <input
                      type="text"
                      placeholder="Search..."
                      className="w-full py-2.5 pl-11 pr-4 bg-slate-50 rounded-full focus:outline-none focus:ring-2 focus:ring-brand-blue text-slate-800 placeholder-slate-450 border border-slate-250 hover:border-slate-350 transition-all text-sm"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  </form>
                </div>

                <div className="p-3">
                  <ul className="space-y-1">
                    <li>
                      <Link to="/" onClick={closeMenu} className="flex items-center justify-between px-4 py-3 rounded-xl hover:bg-slate-50 text-slate-800 font-semibold">
                        Home <FiChevronRight className="text-slate-400" />
                      </Link>
                    </li>
                    <li>
                      <Link to="/products" onClick={closeMenu} className="flex items-center justify-between px-4 py-3 rounded-xl hover:bg-slate-50 text-slate-650 hover:text-slate-800 font-semibold">
                        Shop <FiChevronRight className="text-slate-400" />
                      </Link>
                    </li>

                    <li>
                      <Link to="/about" onClick={closeMenu} className="flex items-center justify-between px-4 py-3 rounded-xl hover:bg-slate-50 text-slate-650 hover:text-slate-800 font-semibold">
                        About <FiChevronRight className="text-slate-400" />
                      </Link>
                    </li>
                    <li>
                      <Link to="/contact" onClick={closeMenu} className="flex items-center justify-between px-4 py-3 rounded-xl hover:bg-slate-50 text-slate-650 hover:text-slate-800 font-semibold">
                        Contact <FiChevronRight className="text-slate-400" />
                      </Link>
                    </li>
                  </ul>
                </div>

                <div className="p-5 bg-slate-50 mt-auto border-t border-slate-100">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Account</p>
                  {isAuthenticated ? (
                    <ul className="space-y-2">
                      <li>
                        <div className="flex items-center gap-3 mb-4 px-2 py-2 bg-white rounded-xl border border-slate-200">
                          <div className="bg-gradient-to-r from-brand-blue to-purple-600 h-10 w-10 rounded-lg flex items-center justify-center font-bold text-white uppercase">
                            {user?.name?.charAt(0) || 'U'}
                          </div>
                          <div>
                            <p className="font-bold text-sm text-slate-800">{user?.name}</p>
                            <p className="text-xs text-slate-500">{user?.email}</p>
                          </div>
                        </div>
                      </li>
                      {isAdmin && (
                        <li><Link to="/admin" onClick={closeMenu} className="flex items-center gap-3 px-2 py-2 text-brand-blue font-semibold"><FiSettings /> Admin Dashboard</Link></li>
                      )}
                      <li><Link to="/profile" onClick={closeMenu} className="flex items-center gap-3 px-2 py-2 text-slate-650 font-medium hover:text-slate-800"><FiUser /> My Profile</Link></li>
                      <li><Link to="/my-orders" onClick={closeMenu} className="flex items-center gap-3 px-2 py-2 text-slate-650 font-medium hover:text-slate-800"><FiShoppingCart /> My Orders</Link></li>
                      <li><button onClick={() => { handleLogout(); closeMenu(); }} className="flex items-center gap-3 px-2 py-2 text-red-600 font-semibold w-full text-left hover:bg-red-50 rounded-lg"><FiLogOut /> Logout</button></li>
                    </ul>
                  ) : (
                    <div className="space-y-3">
                      <Link to="/login" onClick={closeMenu} className="btn-premium w-full justify-center">Login</Link>
                      <Link to="/register" onClick={closeMenu} className="btn-premium-outline w-full justify-center">Create Account</Link>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;
