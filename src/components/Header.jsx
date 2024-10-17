import React, { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { PiSignInBold, PiMagnifyingGlassBold } from "react-icons/pi";
import { FaUserAlt, FaFacebookMessenger } from "react-icons/fa";
import { IoIosArrowDown, IoMdCart } from "react-icons/io";
import '../css/Header.scss'

const Header = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')))
  const [searchInput, setSearchInput] = useState('');
  const [verify, setVerify] = useState(false)
  const searchInputChange = (e) => {
    setSearchInput(e.target.value)
  }
  // TODO: INPUT KHÔNG ĐƯỢC TRỐNG
  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchInput === '') {
      setVerify(true)
    }
    else {
      setVerify(false)
      navigate(`/search?q=${searchInput}`)
    }
  }
  const handleSignOut = () => {
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('cart')
    setUser(null)
    navigate(0)
  }
  return (
    <div className='header'>
      <div className="header-top">
        <div className="container">
          {
            user == null ?
              <div className="header-top-left">
                <Link to={'/signin'}>
                  <div className="header-top-left-signin">
                    <PiSignInBold />
                    <p>Đăng nhập</p>
                  </div>
                </Link>
                <Link to={'/signup'}>
                  <div className="header-top-left-signup">
                    <FaUserAlt />
                    <p>Đăng ký</p>
                  </div>
                </Link>
              </div> :
              <div className="header-top-left">
                <div className="header-top-left-profile">
                  <div className="header-top-dropdown">
                    <Link className="dropbtn">
                      Tài khoản <IoIosArrowDown className="nav-arrow" />
                    </Link>
                    <div className="dropdown-content">
                      <div className="nav-profile">
                        <img src={user.profile_picture} alt="" className="profile-img" />
                        <p className="profile-name">{user.username}</p>
                      </div>
                      <Link className='nav-dropdown ' to={'/account'}>Tài khoản</Link>
                      {user.role == 'admin' ? <Link className='nav-dropdown ' to={'/admin'}>Quản lý</Link> : <Link className='nav-dropdown ' to={'/cart'}>Giỏ hàng</Link>}
                      <button className='nav-dropdown sigh-out' onClick={handleSignOut}>Đăng xuất</button>
                    </div>
                  </div>
                </div>
                <Link to={'/cart'}>
                  <div className="header-top-left-cart">
                    <IoMdCart />
                    <p>Giỏ hàng</p>
                    <p>{localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')).map(e => e.quantity).reduce((a, c) => a + c, 0) : 0}</p>
                  </div>
                </Link>
              </div>
          }
          <div className="header-top-right">
            <p className="header-top-right-contact">
              Thông tin liên hệ
            </p>
            <Link>
              <div className="header-top-right-messenger">
                <FaFacebookMessenger />
              </div>
            </Link>
          </div>
        </div>
      </div>
      <div className="header-middle">
        <div className="container">
          {/*display flex, direction vertical*/}
          <div className="logo">
            <Link to={'/'}>
              <img src='/logo-header.png' />
            </Link>
          </div>
          <hr style={{ width: '2rem', margin: '0 auto', color: '#fff', background: '#fff', border: 'none', height: '2px' }} />
          <p className='header-middle-text'>CỬA HÀNG THỰC PHẨM SẠCH</p>
        </div>
        <div className="header-middle-search">
          <form className='header-middle-search-form'>
            <label className='error' style={{ color: 'red', fontWeight: '700', background: '#ffffff4f', width: '20%', borderRadius: '7px', border: '2px solid gold', margin: '0 auto 10px', display: verify ? 'block' : 'none' }}>Thanh nhập không được để trống</label>
            <input className='header-middle-search-form-input' type="text" onChange={(e) => searchInputChange(e)} value={searchInput} placeholder='Từ khóa tìm kiếm' />
            <button className='header-middle-search-form-button' type='submit' onClick={(e) => handleSubmit(e)}><PiMagnifyingGlassBold /></button>
          </form>
        </div>
      </div>
      <div className="header-bottom">
        <div className="container">
          <div className="header-bottom-nav">
            <NavLink to={'/'} className={({ isActive, isPending }) => isActive ? 'active' : isPending ? 'pending' : ''}>TRANG CHỦ</NavLink>
          </div>
          <div className="header-bottom-nav">
            <NavLink to={'/about'} className={({ isActive, isPending }) => isActive ? 'active' : isPending ? 'pending' : ''}>GIỚI THIỆU</NavLink>
          </div>
          <div className="header-bottom-nav header-bottom-dropdown">
            <NavLink to={'/product/productsCategory/all'} className={({ isActive, isPending }) => isActive ? 'dropbtn active' : isPending ? 'dropbtn pending' : 'dropbtn'}>SẢN PHẨM <IoIosArrowDown className="nav-arrow" /></NavLink>
            <div className="dropdown-content">
              <Link className='nav-dropdown' to={'/product/productsCategory/fruits'}>Hoa quả sạch</Link>
              <Link className='nav-dropdown' to={'/product/productsCategory/vegetables'}>Rau sạch</Link>
              <Link className='nav-dropdown' to={'/product/productsCategory/meats'}>Thịt sạch</Link>
              <Link className='nav-dropdown' to={'/product/productsCategory/seafood'}>Hải sản sạch</Link>
            </div>
          </div>
          <div className="header-bottom-nav">
            <NavLink to={'/news'} className={({ isActive, isPending }) => isActive ? 'active' : isPending ? 'pending' : ''}>TIN TỨC</NavLink>
          </div>
          <div className="header-bottom-nav">
            <NavLink to={'/advise'} className={({ isActive, isPending }) => isActive ? 'active' : isPending ? 'pending' : ''}>TƯ VẤN</NavLink>
          </div>
          <div className="header-bottom-nav">
            <NavLink to={'/service'} className={({ isActive, isPending }) => isActive ? 'active' : isPending ? 'pending' : ''}>DỊCH VỤ</NavLink>
          </div>
          <div className="header-bottom-nav">
            <NavLink to={'/contact'} className={({ isActive, isPending }) => isActive ? 'active' : isPending ? 'pending' : ''}>LIÊN HỆ</NavLink>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Header