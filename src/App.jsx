import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Wishlist from './pages/Wishlist';
import Orders from './pages/Orders';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
            <Navbar />
            <Routes>
              <Route path="/"            element={<Home />} />
              <Route path="/products"    element={<Products />} />
              <Route path="/products/:id" element={<ProductDetail />} />
              <Route path="/cart"        element={<Cart />} />
              <Route path="/wishlist"    element={<Wishlist />} />
              <Route path="/orders"      element={<Orders />} />
              <Route path="/login"       element={<Login />} />
              <Route path="/register"    element={<Register />} />
              <Route path="/profile"     element={<Profile />} />
            </Routes>
            <Footer />
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
