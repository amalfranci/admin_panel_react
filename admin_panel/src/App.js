import './App.css';
import "bootstrap/dist/css/bootstrap.min.css";
import { Navbar } from './components/layout';
import Footer from './components/footer';
import Home from './pages/Home';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Employees from './pages/Employees';
import NotFound from './pages/NotFound';
import CreateEmployee from './pages/AddEmploye';
import EditEmploye from './pages/EditEmploye';
import Login from './pages/Login';
import ProtectedRoute from './pages/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/employe" element={<ProtectedRoute element={Employees} />} />
        <Route path="/createEmploye" element={<ProtectedRoute element={CreateEmployee} />} />
        <Route path="/employeeEdit/:id" element={<ProtectedRoute element={EditEmploye} />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
