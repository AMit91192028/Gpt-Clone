import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/home/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import { useEffect, useState } from 'react';
import axios from 'axios';

const AppRoutes = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  function isUser() {
    return axios.get('https://mitra-ul4i.onrender.com/api/auth/check', { withCredentials: true })
      .then(res => setUser(res.data.user))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    isUser();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={user ? <Home /> : <Login isUser={isUser}/>} />
        <Route path="/register" element={<Register />} />
        {/* <Route path="/login" element={<Login isUser={isUser} />} /> */}
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
