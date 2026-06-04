import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { FiArrowLeft, FiLock, FiCheck } from 'react-icons/fi';
import api from '../utils/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { formatPrice } from '../utils/formatPrice';
import toast from 'react-hot-toast';

const CheckoutPage = () => {
  const { cartItems, cartSubtotal, cartTax, cartShipping, cartTotal, clearCart } = useCart();
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [shippingAddress, setShippingAddress] = useState({
    name: '',
    email: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: ''
  });
  
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/login?redirect=checkout');
    } else if (cartItems.length === 0) {
      navigate('/cart');
    } else if (user) {
      // Pre-fill user data
      setShippingAddress({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        addressLine1: user.addresses?.[0]?.addressLine1 || '',
        addressLine2: user.addresses?.[0]?.addressLine2 || '',
        city: user.addresses?.[0]?.city || '',
        state: user.addresses?.[0]?.state || '',
        postalCode: user.addresses?.[0]?.postalCode || ''
      });
    }
  }, [authLoading, isAuthenticated, user, cartItems.length, navigate]);

  const handleChange = (e) => {
    setShippingAddress({ ...shippingAddress, [e.target.name]: e.target.value });
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      // 1. Load Razorpay script
      const res = await loadRazorpayScript();
      if (!res) {
        toast.error('Razorpay SDK failed to load. Are you online?');
        setIsProcessing(false);
        return;
      }

      // 2. Create order on server
      const { data: orderData } = await api.post('/payment/create-order', {
        amount: cartTotal
      });

      // 3. Configure Razorpay options
      const options = {
        key: orderData.key,
        amount: orderData.order.amount,
        currency: orderData.order.currency,
        name: 'AK Mobiles',
        description: 'Purchase from AK Mobiles',
        image: 'https://placehold.co/100x100/F97316/ffffff?text=AK',
        order_id: orderData.order.id,
        handler: async function (response) {
          try {
            // 4. Verify payment on server
            await api.post('/payment/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            });

            // 5. Create actual order in database
            const orderPayload = {
              orderItems: cartItems,
              shippingAddress,
              paymentInfo: {
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
                status: 'Completed'
              },
              itemsPrice: cartSubtotal,
              taxPrice: cartTax,
              shippingPrice: cartShipping,
              totalPrice: cartTotal
            };

            const { data } = await api.post('/orders', orderPayload);
            
            // 6. Clear cart and redirect
            clearCart();
            toast.success('Payment successful! Order placed.');
            navigate(`/order-success/${data.order._id}`);
            
          } catch (error) {
            toast.error('Payment verification failed. Please contact support.');
            setIsProcessing(false);
          }
        },
        prefill: {
          name: shippingAddress.name,
          email: shippingAddress.email,
          contact: shippingAddress.phone
        },
        theme: {
          color: '#0F172A'
        }
      };

      // 4. Open Razorpay modal
      const paymentObject = new window.Razorpay(options);
      
      paymentObject.on('payment.failed', function (response) {
        toast.error(`Payment failed: ${response.error.description}`);
        setIsProcessing(false);
      });
      
      paymentObject.open();
      
    } catch (error) {
      toast.error('Something went wrong initiating payment.');
      setIsProcessing(false);
    }
  };

  if (authLoading || cartItems.length === 0) return null;

  return (
    <>
      <Helmet>
        <title>Checkout | AK Mobiles</title>
      </Helmet>

      <div className="bg-slate-50 py-8 min-h-screen">
        <div className="container mx-auto px-4 max-w-6xl">
          <Link to="/cart" className="inline-flex items-center gap-2 text-slate-500 hover:text-brand-orange mb-6 transition-colors">
            <FiArrowLeft /> Back to Cart
          </Link>
          
          <h1 className="text-3xl font-bold text-slate-900 mb-8">Checkout</h1>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Column - Forms */}
            <div className="lg:w-2/3">
              <form id="checkout-form" onSubmit={handlePayment} className="space-y-8">
                
                {/* Contact Info */}
                <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200">
                  <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                    <span className="w-8 h-8 rounded-full bg-brand-dark text-white flex items-center justify-center text-sm">1</span>
                    Contact Information
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Full Name <span className="text-red-500">*</span></label>
                      <input 
                        type="text" 
                        name="name"
                        value={shippingAddress.name}
                        onChange={handleChange}
                        required
                        className="input-field" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Email <span className="text-red-500">*</span></label>
                      <input 
                        type="email" 
                        name="email"
                        value={shippingAddress.email}
                        onChange={handleChange}
                        required
                        className="input-field" 
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-bold text-slate-700 mb-2">Phone Number <span className="text-red-500">*</span></label>
                      <input 
                        type="text" 
                        name="phone"
                        value={shippingAddress.phone}
                        onChange={handleChange}
                        required
                        className="input-field" 
                        placeholder="10-digit mobile number"
                      />
                    </div>
                  </div>
                </div>

                {/* Shipping Info */}
                <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200">
                  <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                    <span className="w-8 h-8 rounded-full bg-brand-dark text-white flex items-center justify-center text-sm">2</span>
                    Shipping Address
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-bold text-slate-700 mb-2">Address Line 1 <span className="text-red-500">*</span></label>
                      <input 
                        type="text" 
                        name="addressLine1"
                        value={shippingAddress.addressLine1}
                        onChange={handleChange}
                        required
                        className="input-field" 
                        placeholder="House No, Building Name, Street"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-bold text-slate-700 mb-2">Address Line 2</label>
                      <input 
                        type="text" 
                        name="addressLine2"
                        value={shippingAddress.addressLine2}
                        onChange={handleChange}
                        className="input-field" 
                        placeholder="Landmark, Area (Optional)"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">City <span className="text-red-500">*</span></label>
                      <input 
                        type="text" 
                        name="city"
                        value={shippingAddress.city}
                        onChange={handleChange}
                        required
                        className="input-field" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">State <span className="text-red-500">*</span></label>
                      <input 
                        type="text" 
                        name="state"
                        value={shippingAddress.state}
                        onChange={handleChange}
                        required
                        className="input-field" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">PIN Code <span className="text-red-500">*</span></label>
                      <input 
                        type="text" 
                        name="postalCode"
                        value={shippingAddress.postalCode}
                        onChange={handleChange}
                        required
                        className="input-field" 
                      />
                    </div>
                  </div>
                </div>
              </form>
            </div>

            {/* Right Column - Order Summary & Payment */}
            <div className="lg:w-1/3">
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 sticky top-24 overflow-hidden">
                <div className="bg-slate-50 p-6 border-b border-slate-200">
                  <h2 className="text-xl font-bold text-slate-900 mb-4">Order Summary</h2>
                  
                  <div className="space-y-4 mb-4 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                    {cartItems.map((item) => (
                      <div key={item.product} className="flex gap-3">
                        <div className="w-16 h-16 shrink-0 bg-white border border-slate-100 rounded-md p-1 relative">
                          <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                          <span className="absolute -top-2 -right-2 bg-slate-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                            {item.quantity}
                          </span>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-slate-900 line-clamp-2">{item.name}</p>
                          <p className="text-sm font-bold text-slate-500 mt-1">{formatPrice(item.price)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="space-y-3 text-sm mb-6">
                    <div className="flex justify-between text-slate-600">
                      <span>Subtotal</span>
                      <span className="font-semibold text-slate-900">{formatPrice(cartSubtotal)}</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>GST (18%)</span>
                      <span className="font-semibold text-slate-900">{formatPrice(cartTax)}</span>
                    </div>
                    <div className="flex justify-between text-slate-600 border-b border-slate-100 pb-4">
                      <span>Delivery</span>
                      {cartShipping === 0 ? (
                        <span className="font-semibold text-green-600">Free</span>
                      ) : (
                        <span className="font-semibold text-slate-900">{formatPrice(cartShipping)}</span>
                      )}
                    </div>
                    
                    <div className="flex justify-between items-center pt-2">
                      <span className="text-base font-bold text-slate-900">Total to Pay</span>
                      <span className="text-2xl font-bold text-brand-orange">
                        {formatPrice(cartTotal)}
                      </span>
                    </div>
                  </div>

                  <button 
                    type="submit"
                    form="checkout-form"
                    disabled={isProcessing}
                    className="w-full btn-primary h-14 text-lg flex items-center justify-center gap-2 mb-4 shadow-xl shadow-brand-orange/20 disabled:opacity-70 disabled:shadow-none"
                  >
                    {isProcessing ? 'Processing...' : (
                      <>
                        <FiLock /> Pay Securely via Razorpay
                      </>
                    )}
                  </button>
                  
                  <div className="flex flex-wrap justify-center gap-2 text-xs text-slate-500">
                    <span className="flex items-center gap-1"><FiCheck className="text-green-500" /> SSL Encrypted</span>
                    <span className="flex items-center gap-1"><FiCheck className="text-green-500" /> Safe Payments</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CheckoutPage;
