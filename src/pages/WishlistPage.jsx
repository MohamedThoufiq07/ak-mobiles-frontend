import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { FiHeart, FiSearch, FiShoppingCart } from 'react-icons/fi';
import api from '../utils/api';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/formatPrice';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const WishlistPage = () => {
  const { wishlist, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWishlistProducts = async () => {
      if (!wishlist || wishlist.length === 0) {
        setProducts([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        // Extract IDs based on whether wishlist contains objects or plain strings
        const productIds = wishlist.map(item => typeof item === 'object' ? item._id : item);
        
        // This would ideally be a single API call to fetch multiple products by ID
        // For now, we'll fetch them individually (in a real app, optimize this backend endpoint)
        const promises = productIds.map(id => api.get(`/products/${id}`).catch(() => null));
        const results = await Promise.all(promises);
        
        const validProducts = results
          .filter(res => res && res.data)
          .map(res => res.data.product);
          
        setProducts(validProducts);
      } catch (error) {
        console.error('Error fetching wishlist products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlistProducts();
  }, [wishlist]);

  const handleAddToCart = (product) => {
    addToCart(product, 1);
  };

  const handleRemove = (productId) => {
    toggleWishlist(productId);
    setProducts(products.filter(p => p._id !== productId));
  };

  return (
    <>
      <Helmet>
        <title>My Wishlist | AK Mobiles</title>
      </Helmet>

      <div className="bg-slate-50 py-10 min-h-[80vh]">
        <div className="container mx-auto px-4 max-w-6xl">
          <h1 className="text-3xl font-bold text-slate-900 mb-8 flex items-center gap-3">
            <FiHeart className="text-brand-orange" /> My Wishlist
          </h1>

          {loading ? (
            <LoadingSpinner />
          ) : products.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-12 text-center">
              <div className="w-24 h-24 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mx-auto mb-6">
                <FiHeart size={48} />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Your Wishlist is Empty</h2>
              <p className="text-slate-500 mb-8 max-w-md mx-auto">Found something you like? Add it to your wishlist to keep track of it for later.</p>
              <Link to="/products" className="btn-primary inline-flex items-center gap-2">
                <FiSearch /> Browse Products
              </Link>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="hidden sm:flex bg-slate-50 p-4 border-b border-slate-200 text-sm font-semibold text-slate-600">
                <div className="w-1/2">Product</div>
                <div className="w-1/4 text-center">Price</div>
                <div className="w-1/4 text-right pr-4">Action</div>
              </div>
              
              <div className="divide-y divide-slate-100">
                {products.map((product) => (
                  <div key={product._id} className="p-6 flex flex-col sm:flex-row items-start sm:items-center gap-6 group hover:bg-slate-50 transition-colors">
                    {/* Image & Title */}
                    <div className="flex gap-4 items-center sm:w-1/2 w-full">
                      <div className="w-20 h-20 bg-white rounded-lg p-2 border border-slate-100 shrink-0">
                        <Link to={`/products/${product._id}`}>
                          <img src={product.images[0]?.url} alt={product.name} className="w-full h-full object-contain" />
                        </Link>
                      </div>
                      <div>
                        <Link to={`/products/${product._id}`} className="font-bold text-slate-900 hover:text-brand-orange transition-colors line-clamp-2">
                          {product.name}
                        </Link>
                        <p className="text-sm text-slate-500 mt-1 uppercase tracking-wider">{product.brand}</p>
                        
                        <div className="mt-2 sm:hidden flex items-center gap-3">
                          <span className="font-bold text-slate-900">{formatPrice(product.offerPrice)}</span>
                          {product.stock > 0 ? (
                            <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded">In Stock</span>
                          ) : (
                            <span className="text-xs text-red-500 bg-red-50 px-2 py-1 rounded">Out of Stock</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Price & Stock (Desktop) */}
                    <div className="hidden sm:flex flex-col items-center justify-center sm:w-1/4">
                      <span className="font-bold text-lg text-slate-900">{formatPrice(product.offerPrice)}</span>
                      {product.originalPrice > product.offerPrice && (
                        <span className="text-sm text-slate-400 line-through">{formatPrice(product.originalPrice)}</span>
                      )}
                      {product.stock > 0 ? (
                        <span className="text-xs text-green-600 mt-1">In Stock</span>
                      ) : (
                        <span className="text-xs text-red-500 mt-1">Out of Stock</span>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex sm:justify-end gap-3 w-full sm:w-1/4 mt-2 sm:mt-0">
                      <button 
                        onClick={() => handleRemove(product._id)}
                        className="text-slate-400 hover:text-red-500 p-2 rounded-lg hover:bg-red-50 transition-colors"
                        title="Remove from wishlist"
                      >
                        Remove
                      </button>
                      
                      <button 
                        onClick={() => handleAddToCart(product)}
                        disabled={product.stock <= 0}
                        className="btn-secondary py-2 px-4 flex items-center justify-center gap-2 flex-1 sm:flex-none disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                      >
                        <FiShoppingCart /> Add
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default WishlistPage;
