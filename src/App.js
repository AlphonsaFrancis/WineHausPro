import './App.css';
import './pages/authentication/Loginregist.css'; 
import RegLogin from './pages/authentication/RegLogin';
import "@fontsource/inter"; 
import Admin from './pages/dashboard/Admin';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NotFound from './pages/NotFound';
import Home from './pages/home/Home';
import Staff from  './pages/dashboard/Staff';
import ProductPage from './pages/home/productPage';
import Navbar from './components/Navbar';
import ProductDetail from './pages/home/productDetails'

function App() {

  return (
    
    <div>
      <Router>
      <Routes>
        <Route path="/" element={<RegLogin/>} />
        <Route path="/admin" element={<Admin/>} />
        <Route path="/home" element={<Home/>} />
        <Route path="*" element={<NotFound />} />
        <Route path="/staff" element={<Staff/>} />
        <Route path="/products" element={<ProductPage/>} />
        <Route path="/products/:id" element={<ProductDetail/>} />
      </Routes>
    </Router>
    </div>
  );
}

export default App;
