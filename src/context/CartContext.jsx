import { createContext, useState, useEffect, useContext } from 'react';
import toast from 'react-hot-toast';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const storedCart = localStorage.getItem('cart') || localStorage.getItem('cartItems');
      if (storedCart) {
        const parsed = JSON.parse(storedCart);
        if (Array.isArray(parsed)) {
          console.log('CartContext: Initialized cart items from localStorage:', parsed);
          return parsed;
        }
      }
    } catch (e) {
      console.error('CartContext: Failed to parse cart items from localStorage', e);
    }
    return [];
  });
  
  // Derived state
  const safeCartItems = Array.isArray(cartItems) ? cartItems : [];
  const cartItemCount = safeCartItems.reduce((acc, item) => acc + item.quantity, 0);
  const cartSubtotal = safeCartItems.reduce((acc, item) => acc + (Number(item.price) || 0) * item.quantity, 0);
  const cartTax = Math.round(cartSubtotal * 0.18); // 18% GST
  const cartShipping = cartSubtotal > 50000 || safeCartItems.length === 0 ? 0 : 99; // Free shipping over 50k
  const cartTotal = cartSubtotal + cartTax + cartShipping;

  const saveCartToStorage = (items) => {
    const safeItems = Array.isArray(items) ? items : [];
    try {
      localStorage.setItem('cart', JSON.stringify(safeItems));
      localStorage.setItem('cartItems', JSON.stringify(safeItems));
      console.log('CartContext: Saved cart to localStorage:', safeItems);
    } catch (e) {
      console.error('CartContext: Failed to save cart items to localStorage', e);
    }
    setCartItems(safeItems);
  };

  const addToCart = (product, quantity = 1) => {
    console.log('CartContext: addToCart triggered with:', { product, quantity });
    
    if (!product) {
      console.error('CartContext: Cannot add to cart, product is null or undefined');
      toast.error('Failed to add to cart: Invalid product');
      return;
    }

    const productId = product._id || product.id;
    if (!productId) {
      console.error('CartContext: Cannot add to cart, product has no valid ID:', product);
      toast.error('Failed to add to cart: Product has no ID');
      return;
    }

    const productName = product.name || 'Product';
    const productImage = product.images?.[0]?.url || product.image || '';
    const productPrice = product.offerPrice || product.offer || product.price || 0;
    const productStock = product.stock !== undefined ? product.stock : 99;

    const existItem = cartItems.find((x) => x.product === productId);
    let updatedCart;
    
    if (existItem) {
      const newQuantity = existItem.quantity + quantity;
      
      if (newQuantity > productStock) {
        toast.error(`Sorry, only ${productStock} items in stock`);
        return;
      }
      
      updatedCart = cartItems.map((x) =>
        x.product === existItem.product ? { ...x, quantity: newQuantity } : x
      );
    } else {
      if (quantity > productStock) {
        toast.error(`Sorry, only ${productStock} items in stock`);
        return;
      }
      
      updatedCart = [...cartItems, {
        product: productId,
        name: productName,
        brand: product.brand || '',
        image: productImage,
        price: productPrice,
        stock: productStock,
        quantity,
      }];
    }
    
    saveCartToStorage(updatedCart);
    toast.success(`${productName} added to cart!`);
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    const updatedCart = cartItems.map((item) => {
      if (item.product === productId) {
        if (quantity > item.stock) {
          toast.error(`Sorry, only ${item.stock} items in stock`);
          return item;
        }
        return { ...item, quantity };
      }
      return item;
    });
    
    saveCartToStorage(updatedCart);
  };

  const removeFromCart = (productId) => {
    const updatedCart = cartItems.filter((x) => x.product !== productId);
    saveCartToStorage(updatedCart);
    toast.success('Item removed from cart');
  };

  const clearCart = () => {
    saveCartToStorage([]);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems: safeCartItems,
        cartItemCount,
        cartSubtotal,
        cartTax,
        cartShipping,
        cartTotal,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
