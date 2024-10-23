import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import './App.css'
import Header from './components/Header.jsx'
import HeaderAlt from './components/HeaderAlt.jsx'
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
import UserOrders from './pages/UserOrders';

function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('userInfo');
    const storedToken = localStorage.getItem('tokenInfo');
    const storedRefreshToken = localStorage.getItem('refreshTokenInfo');
    if (storedUser) setUser(JSON.parse(storedUser));
    if (storedToken) setToken(storedToken);
    if (storedRefreshToken) setRefreshToken(storedRefreshToken);
  }, []);

  // const cycleTokenAuth = async () => {
  //   try {
  //     const data = await refreshTokenResetter('/token/request', 'POST', refreshToken);
  //     if (data.status == 200) {
  //       setUser(data.data.user);
  //       setToken(data.data.token);
  //       setRefreshToken(data.data.refreshToken);
  //       localStorage.setItem('userInfo', JSON.stringify(data.data.user));
  //       localStorage.setItem('tokenInfo', data.data.token);
  //       localStorage.setItem('refreshTokenInfo', data.data.refreshToken);
  //     } else {
  //       clearAuth();
  //       navigate(0);
  //     }
  //   } catch (e) {
  //     console.log('Token refresh failed');
  //   }
  // };

  // const clearAuth = () => {
  //   setUser(null);
  //   setToken(null);
  //   setRefreshToken(null);
  //   localStorage.removeItem('userInfo');
  //   localStorage.removeItem('tokenInfo');
  //   localStorage.removeItem('refreshTokenInfo');
  //   localStorage.removeItem('cartInfo');
  // };

  // useEffect(() => {
  //   if (!refreshToken) {
  //     clearAuth();
  //   } else {
  //     // Initial refresh after 500ms
  //     const initialRefresh = setTimeout(() => {
  //       cycleTokenAuth();
  //     }, 500);

  //     // Set up interval to refresh before 1 minute every 10 minutes
  //     const intervalId = setInterval(() => {
  //       cycleTokenAuth();
  //     }, 10 * 60 * 1000);

  //     return () => {
  //       clearTimeout(initialRefresh);
  //       clearInterval(intervalId);
  //     };
  //   }
  // }, [refreshToken]);

  
  return (
    <>
      {(location.pathname === '/login' || location.pathname === '/register') ? <HeaderAlt /> : (location.pathname === '/checkout') ? <></> : <Header />}
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/' element={<Home />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/admin/*' element={<Admin />} />
        <Route path='/account/*' element={<Account />} />
        <Route path='/product/:id' element={<Item />} />
        <Route path="/product/productsCategory/:category" element={<ProductPage />} />
        <Route path='/search' element={<Search />} />
        <Route path='/cart' element={<Cart />} />
        <Route path='/about' element={<About />} />
        <Route path='/checkout' element={<Checkout />} />
        <Route path="/myOrders" element={<UserOrders />} />
        <Route path='*' element={<NotFound />} />
      </Routes>
      {(location.pathname === '/checkout') ? <></> : <Footer/>}
    </>
  )
}

export default App
