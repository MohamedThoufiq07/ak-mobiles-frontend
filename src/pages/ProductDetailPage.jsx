import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { FiShoppingCart, FiHeart, FiCheck, FiTruck, FiShield } from 'react-icons/fi';
import { FaHeart } from 'react-icons/fa';
import api from '../utils/api';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useRecentlyViewed } from '../hooks/useRecentlyViewed';
import { formatPrice } from '../utils/formatPrice';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import RatingStars from '../components/ui/RatingStars';
import ProductCard from '../components/ui/ProductCard';
import { Reveal, RevealStagger, RevealItem } from '../components/ui/animations';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { addRecentlyViewed } = useRecentlyViewed();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');

  useEffect(() => {
    const fetchProductDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data } = await api.get(`/products/${id}`);
        setProduct(data.product);
        addRecentlyViewed(data.product);
        setActiveImage(0); // Reset image on new product

        // Fetch related products
        const relatedRes = await api.get(`/products/${id}/related`);
        setRelatedProducts(Array.isArray(relatedRes.data?.products) ? relatedRes.data.products : []);

      } catch (err) {
        setError('Product not found or error loading details.');
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
    window.scrollTo(0, 0);
  }, [id]); // Re-run when ID changes

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    navigate('/checkout');
  };

  if (loading) return <LoadingSpinner fullScreen />;

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-20 text-center min-h-[60vh] flex flex-col justify-center items-center">
        <div className="text-6xl mb-4 text-slate-300">📱</div>
        <h2 className="text-2xl font-bold mb-4">{error || 'Product not found'}</h2>
        <Link to="/products" className="btn-primary">Back to Products</Link>
      </div>
    );
  }

  const isWished = isInWishlist(product._id);

  // Deduplicate product images by URL
  const uniqueImages = [];
  const seenUrls = new Set();
  (product.images || []).forEach(img => {
    if (img && img.url && !seenUrls.has(img.url)) {
      seenUrls.add(img.url);
      uniqueImages.push(img);
    }
  });

  return (
    <>
      <Helmet>
        <title>{product.name} | AK Mobiles</title>
        <meta name="description" content={product.description.substring(0, 150)} />
      </Helmet>

      {/* Breadcrumb */}
      <div className="bg-slate-100 py-3 border-b border-slate-200 text-sm">
        <div className="container mx-auto px-4 flex text-slate-500">
          <Link to="/" className="hover:text-brand-blue transition-colors">Home</Link>
          <span className="mx-2 text-slate-400">/</span>
          <Link to="/products" className="hover:text-brand-blue transition-colors">Products</Link>
          <span className="mx-2 text-slate-400">/</span>
          <Link to={`/products?category=${product.category}`} className="hover:text-brand-blue transition-colors">{product.category}</Link>
          <span className="mx-2 text-slate-400">/</span>
          <span className="text-slate-800 font-medium truncate">{product.name}</span>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-12 bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100">
          
          {/* Left Column - Images */}
          <Reveal className="lg:w-1/2 min-w-0 flex flex-col md:flex-row-reverse gap-4">
            {/* Main Image */}
            <div className="flex-1 bg-slate-50 rounded-xl p-8 relative flex items-center justify-center border border-slate-100 group">
              {product.discount > 0 && (
                <div className="absolute top-4 left-4 bg-red-500 text-white font-bold px-3 py-1 rounded shadow-md z-10">
                  {product.discount}% OFF
                </div>
              )}
              <img 
                src={uniqueImages[activeImage]?.url} 
                alt={product.name} 
                className="w-full h-auto max-h-[500px] object-contain transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = `https://placehold.co/400x500/f1f5f9/64748b?text=${encodeURIComponent(product.brand)}`;
                }}
              />
            </div>
            
            {/* Thumbnails */}
            <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-visible pb-2 md:pb-0 md:w-20 shrink-0">
              {uniqueImages.map((img, index) => (
                <button 
                  key={index}
                  onClick={() => setActiveImage(index)}
                  className={`w-16 h-16 md:w-20 md:h-20 shrink-0 rounded-lg p-2 border-2 transition-all ${activeImage === index ? 'border-brand-blue bg-white shadow-sm' : 'border-slate-200 bg-slate-50/50 opacity-70 hover:opacity-100'}`}
                >
                  <img
                    src={img.url}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-contain"
                    loading="lazy"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = `https://placehold.co/100x100/f1f5f9/64748b?text=${encodeURIComponent(product.brand)}`;
                    }}
                  />
                </button>
              ))}
            </div>
          </Reveal>

          {/* Right Column - Product Info */}
          <Reveal delay={0.1} className="lg:w-1/2 min-w-0 flex flex-col">
            <div className="mb-2">
              <span className="text-sm font-bold text-brand-blue tracking-wider uppercase">{product.brand}</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">{product.name}</h1>
            
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center bg-slate-50 px-3 py-1 rounded-full border border-slate-200">
                <span className="font-bold mr-2 text-sm text-slate-800">{product.rating.toFixed(1)}</span>
                <RatingStars rating={product.rating} />
              </div>
              <a href="#reviews" className="text-sm text-brand-blue hover:underline">
                {product.numReviews} Reviews
              </a>
              <span className="text-slate-300">|</span>
              <span className="text-sm text-slate-500">{product.numSold} sold</span>
            </div>

            <div className="mb-6 flex items-end gap-3">
              <span className="text-4xl font-bold text-slate-900">{formatPrice(product.offerPrice)}</span>
              {product.originalPrice > product.offerPrice && (
                <span className="text-xl text-slate-400 line-through mb-1">{formatPrice(product.originalPrice)}</span>
              )}
            </div>

            <div className="mb-6 pb-6 border-b border-slate-100">
              <h3 className="font-bold text-slate-800 mb-3">Key Highlights</h3>
              <ul className="space-y-2">
                {product.highlights?.slice(0, 4).map((highlight, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-slate-650">
                    <FiCheck className="text-green-500 mt-1 shrink-0" />
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <span className={`font-semibold ${product.stock > 0 ? 'text-green-600' : 'text-red-500'}`}>
                  {product.stock > 0 ? `In Stock (${product.stock} available)` : 'Out of Stock'}
                </span>
              </div>
              
              <div className="flex flex-col sm:flex-row flex-wrap gap-4">
                {/* Quantity */}
                <div className="flex items-center border border-slate-300 rounded-lg h-12 w-36 shrink-0 bg-white">
                  <button
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    disabled={product.stock <= 0}
                    className="w-11 h-full text-slate-600 hover:bg-slate-100 rounded-l-lg disabled:opacity-50"
                  >-</button>
                  <input
                    type="number"
                    value={quantity}
                    readOnly
                    className="w-full text-center border-x border-slate-300 h-full font-bold focus:outline-none text-slate-800"
                  />
                  <button
                    onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                    disabled={product.stock <= 0 || quantity >= product.stock}
                    className="w-11 h-full text-slate-600 hover:bg-slate-100 rounded-r-lg disabled:opacity-50"
                  >+</button>
                </div>

                <button 
                  onClick={handleAddToCart}
                  disabled={product.stock <= 0}
                  className="flex-1 min-w-[140px] btn-premium h-12 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FiShoppingCart /> Add to Cart
                </button>

                <button 
                  onClick={() => toggleWishlist(product._id)}
                  className="h-12 w-12 shrink-0 border-2 border-slate-200 rounded-lg flex items-center justify-center hover:border-brand-blue hover:bg-blue-50/50 transition-colors text-slate-500 focus:outline-none"
                  title="Wishlist"
                >
                  {isWished ? <FaHeart className="text-brand-blue" size={20} /> : <FiHeart size={20} />}
                </button>
              </div>
              
              <button 
                onClick={handleBuyNow}
                disabled={product.stock <= 0}
                className="w-full mt-4 btn-premium h-12 text-lg shadow-lg shadow-brand-blue/15 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
              >
                Buy it Now
              </button>
            </div>

            {/* Trust Badges */}
            <div className="flex gap-4 p-4 bg-slate-50/50 rounded-xl mt-auto">
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <FiTruck className="text-brand-blue" size={20} />
                <span>Free Delivery</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <FiShield className="text-brand-blue" size={20} />
                <span>1 Year Warranty</span>
              </div>
            </div>
          </Reveal>
        </div>

        {/* Product Details Tabs */}
        <Reveal className="mt-12 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="flex border-b border-slate-200">
            <button 
              className={`flex-1 py-4 font-bold text-center border-b-2 transition-colors ${activeTab === 'description' ? 'border-brand-blue text-brand-blue bg-blue-50/30' : 'border-transparent text-slate-500 hover:bg-slate-50'}`}
              onClick={() => setActiveTab('description')}
            >
              Description
            </button>
            <button 
              className={`flex-1 py-4 font-bold text-center border-b-2 transition-colors ${activeTab === 'specifications' ? 'border-brand-blue text-brand-blue bg-blue-50/30' : 'border-transparent text-slate-500 hover:bg-slate-50'}`}
              onClick={() => setActiveTab('specifications')}
            >
              Specifications
            </button>
            <button 
              id="reviews"
              className={`flex-1 py-4 font-bold text-center border-b-2 transition-colors ${activeTab === 'reviews' ? 'border-brand-blue text-brand-blue bg-blue-50/30' : 'border-transparent text-slate-500 hover:bg-slate-50'}`}
              onClick={() => setActiveTab('reviews')}
            >
              Reviews ({product.numReviews})
            </button>
          </div>

          <div className="p-6 md:p-8">
            {/* Description Tab */}
            {activeTab === 'description' && (
              <div className="prose max-w-none text-slate-600">
                <p className="text-lg leading-relaxed mb-6">{product.description}</p>
                <h3 className="font-bold text-slate-800 text-xl mb-4">All Highlights</h3>
                <ul className="list-disc pl-5 space-y-2">
                  {product.highlights?.map((highlight, idx) => (
                    <li key={idx}>{highlight}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Specifications Tab */}
            {activeTab === 'specifications' && (
              <div>
                <h3 className="font-bold text-slate-800 text-xl mb-6">Technical Specifications</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-0 overflow-hidden rounded-xl border border-slate-200">
                  {Object.entries(product.specifications || {}).map(([key, value], idx) => (
                    <div key={key} className={`flex p-4 ${idx % 2 === 0 ? 'bg-slate-50' : 'bg-white'} border-b border-slate-200 md:border-b-0 md:[&:not(:nth-last-child(-n+2))]:border-b`}>
                      <div className="w-1/3 font-semibold text-slate-700 capitalize">{key}</div>
                      <div className="w-2/3 text-slate-600">{value}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Reviews Tab */}
            {activeTab === 'reviews' && (
              <div>
                <div className="flex flex-col md:flex-row items-center justify-between mb-8 pb-8 border-b border-slate-100">
                  <div className="text-center md:text-left mb-6 md:mb-0">
                    <h3 className="font-bold text-slate-800 text-2xl mb-2">Customer Reviews</h3>
                    <div className="flex items-center justify-center md:justify-start gap-3">
                      <span className="text-4xl font-bold text-slate-900">{product.rating.toFixed(1)}</span>
                      <div>
                        <RatingStars rating={product.rating} size={20} />
                        <p className="text-sm text-slate-500 mt-1">Based on {product.numReviews} reviews</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Note: Full review form logic would go here if authenticated, keeping it simple for UI demo */}
                  <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 max-w-sm w-full text-center">
                    <p className="font-semibold mb-2 text-slate-850">Bought this product?</p>
                    <p className="text-sm text-slate-500 mb-4">Share your experience with other customers</p>
                    <Link to="/login" className="btn-outline w-full block">Write a Review</Link>
                  </div>
                </div>

                <div className="space-y-6">
                  {product.reviews?.length > 0 ? (
                    product.reviews.map((review) => (
                      <div key={review._id} className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-brand-blue text-white rounded-full flex items-center justify-center font-bold uppercase">
                              {review.name.charAt(0)}
                            </div>
                            <div>
                              <p className="font-bold text-slate-800">{review.name}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <RatingStars rating={review.rating} />
                                <span className="text-xs text-slate-500">{new Date(review.createdAt).toLocaleDateString()}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <p className="text-slate-650">{review.comment}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-slate-500 text-center py-8">No reviews yet. Be the first to review this product!</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </Reveal>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <Reveal as="section" className="mt-16">
            <h2 className="text-2xl font-bold text-slate-800 mb-8 border-b border-slate-200 pb-4">You May Also Like</h2>
            <RevealStagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map(related => (
                <RevealItem key={related._id} className="min-w-0">
                  <ProductCard product={related} />
                </RevealItem>
              ))}
            </RevealStagger>
          </Reveal>
        )}
      </div>
    </>
  );
};

export default ProductDetailPage;
