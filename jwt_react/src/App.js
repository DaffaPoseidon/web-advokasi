import './App.css';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/login/Login';
import Signup from './pages/signup/Signup';
import Dashboard from './pages/dashboard/Dashboard';
import LandingPage from './pages/landingPage/LandingPage';
import DataRekap from './pages/dataRekap/DataRekap';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        {/* <Route path="/register" element={<Signup />} /> */}
        {/* <Route path="/dashboard" element={<Dashboard />} /> */}

        {/* Menggunakan ProtectedRoute untuk melindungi Dashboard */}
        <Route
          path="/dashboard"
          element={<ProtectedRoute element={<Dashboard />} />}
        />
        <Route path="/data-rekap" element={<DataRekap />} />
      </Routes>
    </>
  );
}

export default App;