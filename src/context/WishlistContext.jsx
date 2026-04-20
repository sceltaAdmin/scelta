import { createContext, useContext, useState, useEffect } from 'react';
import { getWishlist, toggleWishlist } from '../services/api';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const WishlistContext = createContext();

export function WishlistProvider({ children }) {
  const { isLoggedIn } = useAuth();
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    if (isLoggedIn) fetchWishlist();
    else setWishlist([]);
  }, [isLoggedIn]);

  const fetchWishlist = async () => {
    try {
      const res = await getWishlist();
      setWishlist(res.data.wishlist || []);
    } catch {}
  };

  const toggle = async (productId) => {
    try {
      const res = await toggleWishlist({ productId });
      await fetchWishlist();
      toast.success(res.data.action === 'added' ? 'Added to wishlist!' : 'Removed from wishlist');
    } catch (err) {
      toast.error('Please login to use wishlist');
    }
  };

  const isInWishlist = (productId) => wishlist.some(p => (p._id || p) === productId);

  return (
    <WishlistContext.Provider value={{ wishlist, toggle, isInWishlist, fetchWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
}

export const useWishlist = () => useContext(WishlistContext);
