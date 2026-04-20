import { createContext, useContext, useState, useEffect } from 'react';
import { getCart, addToCart, updateCartItem, removeCartItem } from '../services/api';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const CartContext = createContext();

export function CartProvider({ children }) {
  const { isLoggedIn } = useAuth();
  const [cart, setCart]       = useState({ items: [], subtotal: 0, discount: 0, total: 0 });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isLoggedIn) fetchCart();
    else setCart({ items: [], subtotal: 0, discount: 0, total: 0 });
  }, [isLoggedIn]);

  const fetchCart = async () => {
    try {
      const res = await getCart();
      setCart(res.data.cart);
    } catch {}
  };

  const addItem = async (productId, quantity = 1) => {
    try {
      setLoading(true);
      const res = await addToCart({ productId, quantity });
      setCart(res.data.cart);
      toast.success('Added to cart!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add to cart');
    } finally { setLoading(false); }
  };

  const updateItem = async (itemId, quantity) => {
    try {
      const res = await updateCartItem(itemId, { quantity });
      setCart(res.data.cart);
    } catch {}
  };

  const removeItem = async (itemId) => {
    try {
      await removeCartItem(itemId);
      await fetchCart();
      toast.success('Removed from cart');
    } catch {}
  };

  const cartCount = cart.items?.reduce((s, i) => s + i.quantity, 0) || 0;

  return (
    <CartContext.Provider value={{ cart, loading, addItem, updateItem, removeItem, fetchCart, cartCount }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
