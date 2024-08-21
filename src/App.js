import './App.css';
import './pages/authentication/Loginregist.css'; 
import RegLogin from './pages/authentication/RegLogin';
import "@fontsource/inter"; 
import Admin from './pages/dashboard/Admin';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NotFound from './pages/NotFound';

function App() {

  return (
    
    <div>
      <Router>
      <Routes>
        <Route path="/" element={<RegLogin/>} />
        <Route path="/admin" element={<Admin/>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
    </div>
  );
}

export default App;
