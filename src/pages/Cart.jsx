import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

// Error Boundary Wrapper
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Cart Error Boundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#F8FAFC',
          padding: '20px',
          fontFamily: 'system-ui, sans-serif'
        }}>
          <div style={{ fontSize: '80px', marginBottom: '20px' }}>⚠️</div>
          <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#0F172A', marginBottom: '10px' }}>
            Something went wrong
          </h2>
          <p style={{ color: '#64748B', marginBottom: '30px', textAlign: 'center' }}>
            We encountered an error loading your cart.
          </p>
          <button 
            onClick={() => {
              localStorage.removeItem('cart');
              localStorage.removeItem('cartItems');
              window.location.reload();
            }}
            style={{
              background: 'linear-gradient(135deg, #EF4444, #DC2626)',
              color: 'white',
              padding: '14px 32px',
              borderRadius: '10px',
              border: 'none',
              fontWeight: '600',
              fontSize: '16px',
              cursor: 'pointer'
            }}
          >
            Reset Cart & Reload
          </button>
        </div>
      );
    }

    return this.props.children; 
  }
}

const CartInner = () => {
  const { 
    cartItems, 
    updateQuantity, 
    removeFromCart 
  } = useCart();

  const navigate = useNavigate();

  // Check if cart is undefined or null before using it
  const safeCartItems = Array.isArray(cartItems) ? cartItems : [];

  // Remove item
  const removeItem = (id) => {
    removeFromCart(id);
  };

  // Update quantity
  const updateQty = (id, qty) => {
    if (qty < 1) return;
    updateQuantity(id, qty);
  };

  // Calculate total, handling both 'quantity' and 'qty', and 'price' safety
  const total = safeCartItems.reduce((sum, item) => {
    const itemPrice = Number(item.price) || 0;
    const itemQty = Number(item.qty || item.quantity) || 1;
    return sum + (itemPrice * itemQty);
  }, 0);

  const gst = Math.round(total * 0.18);
  const grandTotal = total + gst;

  // EMPTY CART UI
  if (safeCartItems.length === 0) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#F8FAFC',
        padding: '20px',
        fontFamily: 'system-ui, sans-serif'
      }}>
        <div style={{ fontSize: '80px', marginBottom: '20px' }}>🛒</div>
        <h2 style={{ 
          fontSize: '24px', 
          fontWeight: '700',
          color: '#0F172A',
          marginBottom: '10px'
        }}>
          Your Cart is Empty
        </h2>
        <p style={{ 
          color: '#64748B', 
          marginBottom: '30px',
          textAlign: 'center'
        }}>
          Looks like you haven't added any phones yet!
        </p>
        <Link to="/products" style={{
          background: 'linear-gradient(135deg, #2563EB, #7C3AED)',
          color: 'white',
          padding: '14px 32px',
          borderRadius: '10px',
          textDecoration: 'none',
          fontWeight: '600',
          fontSize: '16px'
        }}>
          Shop Now →
        </Link>
      </div>
    );
  }

  // CART WITH ITEMS UI
  return (
    <div style={{ 
      minHeight: '100vh',
      background: '#F8FAFC',
      padding: '30px 20px',
      fontFamily: 'system-ui, sans-serif'
    }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        
        <h1 style={{
          fontSize: '28px',
          fontWeight: '700',
          color: '#0F172A',
          marginBottom: '30px'
        }}>
          🛒 Your Cart ({safeCartItems.length} items)
        </h1>

        <div className="flex flex-col lg:grid lg:grid-cols-[1fr_350px] gap-6">
          
          {/* LEFT - Cart Items */}
          <div>
            {safeCartItems.map((item) => {
              const itemId = item.product || item.id;
              const itemQty = item.quantity || item.qty || 1;
              
              return (
                <div key={itemId} className="bg-white rounded-2xl p-4 sm:p-5 mb-4 shadow-[0_2px_8px_rgba(0,0,0,0.06)] flex flex-col sm:flex-row gap-4 sm:gap-6 items-center sm:items-start text-center sm:text-left">
                  {/* Image */}
                  <img
                    src={item.image}
                    alt={item.name}
                    style={{
                      width: '80px',
                      height: '100px',
                      objectFit: 'contain',
                      background: '#F1F5F9',
                      borderRadius: '10px',
                      padding: '8px'
                    }}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 
                      `https://placehold.co/80x100/e2e8f0/475569?text=${encodeURIComponent(item.brand || 'Phone')}`;
                    }}
                  />

                  {/* Details */}
                  <div style={{ flex: 1 }}>
                    <p style={{ 
                      fontSize: '12px',
                      color: '#2563EB',
                      fontWeight: '600',
                      marginBottom: '4px'
                    }}>
                      {item.brand || 'Smartphone'}
                    </p>
                    <h3 style={{ 
                      fontSize: '15px',
                      fontWeight: '700',
                      color: '#0F172A',
                      marginBottom: '8px'
                    }}>
                      {item.name}
                    </h3>
                    <p style={{ 
                      fontSize: '18px',
                      fontWeight: '700',
                      color: '#2563EB'
                    }}>
                      ₹{item.price?.toLocaleString('en-IN')}
                    </p>
                  </div>

                  {/* Quantity + Remove */}
                  <div style={{ 
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '12px'
                  }}>
                    {/* Qty controls */}
                    <div style={{ 
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      border: '1px solid #E2E8F0',
                      borderRadius: '8px',
                      padding: '4px 8px'
                    }}>
                      <button
                        onClick={() => updateQty(itemId, itemQty - 1)}
                        style={{
                          background: 'none',
                          border: 'none',
                          fontSize: '18px',
                          cursor: 'pointer',
                          color: '#2563EB',
                          fontWeight: '700'
                        }}
                      >−</button>
                      <span style={{ fontWeight: '600', minWidth: '20px', textAlign: 'center' }}>
                        {itemQty}
                      </span>
                      <button
                        onClick={() => updateQty(itemId, itemQty + 1)}
                        style={{
                          background: 'none',
                          border: 'none',
                          fontSize: '18px',
                          cursor: 'pointer',
                          color: '#2563EB',
                          fontWeight: '700'
                        }}
                      >+</button>
                    </div>

                    {/* Remove */}
                    <button
                      onClick={() => removeItem(itemId)}
                      style={{
                        background: '#FEE2E2',
                        color: '#EF4444',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '6px 14px',
                        cursor: 'pointer',
                        fontWeight: '600',
                        fontSize: '13px'
                      }}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* RIGHT - Order Summary */}
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
            height: 'fit-content',
            position: 'sticky',
            top: '100px'
          }} className="cart-summary-card">
            <h3 style={{ 
              fontSize: '18px',
              fontWeight: '700',
              color: '#0F172A',
              marginBottom: '20px',
              paddingBottom: '12px',
              borderBottom: '1px solid #F1F5F9'
            }}>
              Order Summary
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748B' }}>Subtotal</span>
                <span style={{ fontWeight: '600' }}>
                  ₹{total.toLocaleString('en-IN')}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748B' }}>GST (18%)</span>
                <span style={{ fontWeight: '600' }}>
                  ₹{gst.toLocaleString('en-IN')}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748B' }}>Delivery</span>
                <span style={{ color: '#10B981', fontWeight: '600' }}>FREE</span>
              </div>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                paddingTop: '12px',
                borderTop: '2px solid #F1F5F9',
                fontSize: '18px',
                fontWeight: '700'
              }}>
                <span>Total</span>
                <span style={{ color: '#2563EB' }}>
                  ₹{grandTotal.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <Link to="/checkout" style={{
              display: 'block',
              background: 'linear-gradient(135deg, #F97316, #EF4444)',
              color: 'white',
              padding: '16px',
              borderRadius: '12px',
              textDecoration: 'none',
              fontWeight: '700',
              fontSize: '16px',
              textAlign: 'center',
              marginTop: '24px'
            }}>
              Proceed to Checkout →
            </Link>

            <Link to="/products" style={{
              display: 'block',
              textAlign: 'center',
              color: '#2563EB',
              marginTop: '12px',
              textDecoration: 'none',
              fontSize: '14px',
              fontWeight: '500'
            }}>
              ← Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

const Cart = () => (
  <ErrorBoundary>
    <CartInner />
  </ErrorBoundary>
);

export default Cart;
