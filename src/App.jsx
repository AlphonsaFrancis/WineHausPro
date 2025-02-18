import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/home/Home';
import ProductDetail from './pages/home/productDetails';
// ... other imports

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/products/:id" element={<ProductDetail />} />
                {/* ... other routes ... */}
            </Routes>
        </Router>
    );
}

export default App; 