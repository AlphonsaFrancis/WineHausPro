import './App.css';
import './pages/authentication/Loginregist.css'; 
import RegLogin from './pages/authentication/RegLogin';
import "@fontsource/inter"; 
import AdminDashboard from './pages/dashboard/AdminDashboard';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NotFound from './pages/NotFound';
import Home from './pages/home/Home';
import ProductPage from './pages/home/productPage';
import Navbar from './components/Navbar';
import ProductDetail from './pages/home/productDetails'
import StaffDashboard from './pages/dashboard/StaffDashboard';
import CartPage from './pages/home/cartPage';
import WishlistPage from './pages/home/wishlistPage';
import AddressSelection from './pages/home/addressPage';
import PaymentPage from './pages/home/paymentPage';
import UserOrder from './pages/home/userOrder';
function App() {

  return (
    
    <div>
      <Router>
      <Routes>
        <Route path="/login" element={<RegLogin/>} />
        <Route path="/admin" element={<AdminDashboard/>} />
        <Route path="/" element={<Home/>} />
        <Route path="*" element={<NotFound />} />
        <Route path="/staff" element={<StaffDashboard/>} />
        <Route path="/products" element={<ProductPage/>} />
        <Route path="/products/:id" element={<ProductDetail/>} />
        <Route path="/cart" element={<CartPage/>} />
        <Route path="/wishlist" element={<WishlistPage/>} />
        <Route path="/address" element={<AddressSelection/>} />
        <Route path="/payment" element={<PaymentPage/>} />
        <Route path="/userorder" element={<UserOrder/>} />

      </Routes>
    </Router>
    </div>
  );
}

export default App;
