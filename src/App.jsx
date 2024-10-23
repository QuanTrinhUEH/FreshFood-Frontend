import { useEffect, useState } from 'react'
import './App.css'
import Header from './components/Header.jsx'
import HeaderAlt from './components/HeaderAlt.jsx'
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Footer from './components/Footer.jsx'
import Contact from './pages/Contact.jsx'
import Admin from './pages/Admin.jsx'
import Item from './pages/Item.jsx'
import NotFound from './pages/NotFound.jsx'
import Search from './pages/Search.jsx'
import About from './pages/About.jsx'
import Register from './pages/Register.jsx'
import Login from './pages/Login.jsx'
import Cart from './pages/Cart.jsx'
import Account from './pages/Account.jsx'
import { refreshTokenResetter } from '../fetchApi.js'
import ProductPage from './pages/ProductPage.jsx'
import Checkout from './pages/Checkout.jsx'

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    const storedRefreshToken = localStorage.getItem('refreshToken');
    if (storedUser) setUser(JSON.parse(storedUser));
    if (storedToken) setToken(storedToken);
    if (storedRefreshToken) setRefreshToken(storedRefreshToken);
  }, []);

  const cycleTokenAuth = async () => {
    try {
      const data = await refreshTokenResetter('/token/request', 'POST', refreshToken);
      if (data.status == 200) {
        setUser(data.data.user);
        setToken(data.data.token);
        setRefreshToken(data.data.refreshToken);
        localStorage.setItem('user', JSON.stringify(data.data.user));
        localStorage.setItem('token', data.data.token);
        localStorage.setItem('refreshToken', data.data.refreshToken);
      } else {
        clearAuth();
        navigate(0);
      }
    } catch (e) {
      console.log('failed');
    }
  };

  const clearAuth = () => {
    setUser(null);
    setToken(null);
    setRefreshToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('cart');
  };

  useEffect(() => {
    if (!refreshToken) {
      clearAuth();
    } else {
      const initialRefresh = setTimeout(() => {
        cycleTokenAuth();
      }, 500);

      const intervalId = setInterval(() => {
        cycleTokenAuth();
      }, 5 * 10000 - 100);

      return () => {
        clearTimeout(initialRefresh);
        clearInterval(intervalId);
      };
    }
  }, [refreshToken]);

  return (
    <>
      {(location.pathname === '/login' || location.pathname === '/register') ? <HeaderAlt /> : (location.pathname === '/checkout') ? <></> : <Header />}
      <Routes>
        <Route path='/login' element={<Login />}></Route>
        <Route path='/register' element={<Register />}></Route>
        <Route path='/' element={<Home />}></Route>
        <Route path='/contact' element={<Contact />}></Route>
        <Route path='/admin/*' element={<Admin />}></Route>
        <Route path='/account/*' element={<Account />}></Route>
        <Route path='/product/:id' element={<Item />}></Route>
        <Route path="/product/productsCategory/:category" element={<ProductPage />} />
        <Route path='/search' element={<Search />}></Route>
        <Route path='/cart' element={<Cart />}></Route>
        <Route path='/about' element={<About />}></Route>
        <Route path='*' element={<NotFound />}></Route>
        <Route path='/checkout' element={<Checkout />}></Route>
      </Routes>
      {(location.pathname === '/checkout') ? <></> : <Footer/>}
    </>
  )
}

export default App
