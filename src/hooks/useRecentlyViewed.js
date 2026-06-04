import { useState, useEffect } from 'react';

export const useRecentlyViewed = () => {
  const [recentlyViewed, setRecentlyViewed] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem('recentlyViewed');
    if (stored) {
      try {
        setRecentlyViewed(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse recently viewed', e);
      }
    }
  }, []);

  const addRecentlyViewed = (product) => {
    if (!product || !product._id) return;
    
    setRecentlyViewed((prev) => {
      // Remove if already exists
      const filtered = prev.filter((p) => p._id !== product._id);
      
      // Add to front, keep max 10
      const updated = [product, ...filtered].slice(0, 10);
      
      localStorage.setItem('recentlyViewed', JSON.stringify(updated));
      return updated;
    });
  };

  return { recentlyViewed, addRecentlyViewed };
};
