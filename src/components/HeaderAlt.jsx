import React, { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { IoIosArrowDown} from "react-icons/io";
import '../css/Header.scss'

function HeaderAlt() {
    const navigate = useNavigate();
    return (
        <div className='header'>
            <div className="header-middle">
                <div className="container">
                    <div className="logo">
                        <Link to={'/'}>
                            <img src='/logo-header.png' />
                        </Link>
                    </div>
                    <hr style={{ width: '2rem', margin: '0 auto', color: '#fff', background: '#fff', border: 'none', height: '2px' }} />
                    <p className='header-middle-text'>CỬA HÀNG THỰC PHẨM SẠCH</p>
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

export default HeaderAlt
