import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ChatBot from './components/ChatBot';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Wishlist from './pages/Wishlist';
import Orders from './pages/Orders';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Help from './pages/Help';
import Checkout from './pages/Checkout';
import SizeGuide from './pages/SizeGuide';
import TabDemo from './pages/TabDemo';
import FrameDemo from './pages/FrameDemo';
import MultiSelect from './pages/MultiSelect';
import DragDrop from './pages/DragDrop';
import SessionTimeout from './components/SessionTimeout';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
            <Navbar />
            <SessionTimeout />
            <Routes>
              <Route path="/"               element={<Home />} />
              <Route path="/products"       element={<Products />} />
              <Route path="/products/:id"   element={<ProductDetail />} />
              <Route path="/cart"           element={<Cart />} />
              <Route path="/wishlist"       element={<Wishlist />} />
              <Route path="/orders"         element={<Orders />} />
              <Route path="/login"          element={<Login />} />
              <Route path="/register"       element={<Register />} />
              <Route path="/profile"        element={<Profile />} />
              <Route path="/help"           element={<Help />} />
              <Route path="/checkout"       element={<Checkout />} />
              <Route path="/size-guide"     element={<SizeGuide />} />
              <Route path="/tabs"           element={<TabDemo />} />
              <Route path="/frames"         element={<FrameDemo />} />
              <Route path="/multi-select"   element={<MultiSelect />} />
            </Routes>
            <Footer />
            <ChatBot />
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
