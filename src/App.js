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
import ProtectedRoute from './pages/authentication/ProtectedRoute';
import AdminProtectedRoute from './pages/authentication/AdminProtectedRoute';
import StaffProtectedRoute from './pages/authentication/StaffProtectedRoute';
import OrderItemsList from './components/OrderItemList';
function App() {

  return (

    <div>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<RegLogin />} />
          <Route path="/admin" element={<AdminProtectedRoute element={<AdminDashboard />} />} />
          <Route path="/admin/orders" element={<AdminProtectedRoute element={<AdminDashboard />} />} />
          <Route path="/admin/products" element={<AdminProtectedRoute element={<AdminDashboard />} />} />
          <Route path="/admin/orders/:orderId" element={<OrderItemsList />} />
          <Route path="/orders/:orderId" element={<OrderItemsList />} />


          <Route path="/staff" element={<StaffProtectedRoute element={<StaffDashboard />} />} />
          <Route path="/staff/orders" element={<StaffProtectedRoute element={<StaffDashboard />} />} />
          <Route path="/staff/products" element={<StaffProtectedRoute element={<StaffDashboard />} />} />



          <Route path="/products" element={<ProductPage />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/admin/products/:id" element={<ProductDetail />} />
          <Route path="/staff/products/:id" element={<ProductDetail />} />

\
          <Route path="/cart" element={<ProtectedRoute element={<CartPage />} />} />
          <Route path="/wishlist" element={<ProtectedRoute element={<WishlistPage />} />} />
          <Route path="/address" element={<ProtectedRoute element={<AddressSelection />} />} />
          <Route path="/payment" element={<ProtectedRoute element={<PaymentPage />} />} />
          <Route path="/userorder" element={<ProtectedRoute element={<UserOrder />} />} />
          <Route path="*" element={<NotFound />} />

        </Routes>
      </Router>
    </div>
  );
}

export default App;
