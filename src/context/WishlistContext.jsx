import { createContext, useState, useEffect, useContext } from 'react';
import { useAuth } from './AuthContext';
import api from '../utils/api';
import toast from 'react-hot-toast';

const WishlistContext = createContext();

export const useWishlist = () => useContext(WishlistContext);

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);
  const { isAuthenticated, user, setUser } = useAuth();

  useEffect(() => {
    if (isAuthenticated && user && user.wishlist) {
      setWishlist(user.wishlist);
    } else if (!isAuthenticated) {
      // Local wishlist for non-logged in users
      const stored = localStorage.getItem('localWishlist');
      if (stored) {
        try {
          setWishlist(JSON.parse(stored));
        } catch (e) {
          console.error(e);
        }
      } else {
        setWishlist([]);
      }
    }
  }, [isAuthenticated, user]);

  const toggleWishlist = async (productId) => {
    const isWished = wishlist.includes(productId) || (wishlist.some && wishlist.some(item => item._id === productId || item === productId));
    
    if (isAuthenticated) {
      try {
        const { data } = await api.put(`/auth/wishlist/${productId}`);
        setWishlist(data.wishlist);
        if (setUser && user) {
          setUser({ ...user, wishlist: data.wishlist });
        }
        if (isWished) {
          toast.success('Removed from wishlist');
        } else {
          toast.success('Added to wishlist');
        }
      } catch (error) {
        toast.error('Failed to update wishlist');
      }
    } else {
      // Local wishlist logic
      let updated;
      if (isWished) {
        updated = wishlist.filter(id => id !== productId && (id._id ? id._id !== productId : true));
        toast.success('Removed from wishlist');
      } else {
        updated = [...wishlist, productId];
        toast.success('Added to wishlist');
      }
      setWishlist(updated);
      localStorage.setItem('localWishlist', JSON.stringify(updated));
    }
  };

  const isInWishlist = (productId) => {
    if (!wishlist) return false;
    return wishlist.some(item => item === productId || item._id === productId);
  };

  return (
    <WishlistContext.Provider value={{ wishlist, toggleWishlist, isInWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};
