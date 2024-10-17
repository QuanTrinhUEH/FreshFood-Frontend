import React, { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import '../css/Footer.scss'

const Footer = () => {
    const [email, setEmail] = useState('');
    const handleChange = (e) => {
        setEmail(e.target.value)
    }
    const handleClick = (e) => {
        e.preventDefault();
    }
    return (
        <div className='footer'>
            {/* <div className="footer-top">
                <div className="container">
                    <div className="footer-top-nav">
                        <NavLink to={'/'} className={({ isActive, isPending }) => isActive ? 'active' : isPending ? 'pending' : ''}>TRANG CHỦ</NavLink>
                    </div>
                    <div className="footer-top-nav">
                        <NavLink to={'/about'} className={({ isActive, isPending }) => isActive ? 'active' : isPending ? 'pending' : ''}>GIỚI THIỆU</NavLink>
                    </div>
                    <div className="footer-top-nav footer-top-dropdown">
                        <NavLink to={'/products/all'} className={({ isActive, isPending }) => isActive ? 'active' : isPending ? 'pending' : ''}>SẢN PHẨM</NavLink>
                    </div>
                    <div className="footer-top-nav">
                        <NavLink to={'/news'} className={({ isActive, isPending }) => isActive ? 'active' : isPending ? 'pending' : ''}>TIN TỨC</NavLink>
                    </div>
                    <div className="footer-top-nav">
                        <NavLink to={'/advise'} className={({ isActive, isPending }) => isActive ? 'active' : isPending ? 'pending' : ''}>TƯ VẤN</NavLink>
                    </div>
                    <div className="footer-top-nav">
                        <NavLink to={'/service'} className={({ isActive, isPending }) => isActive ? 'active' : isPending ? 'pending' : ''}>DỊCH VỤ</NavLink>
                    </div>
                    <div className="footer-top-nav">
                        <NavLink to={'/contact'} className={({ isActive, isPending }) => isActive ? 'active' : isPending ? 'pending' : ''}>LIÊN HỆ</NavLink>
                    </div>
                </div>
            </div> */}
            <div className="footer-middle">
                <div className="container">
                    <div className="footer-middle-left">
                        <form>
                            <h3>Đăng ký nhận email</h3>
                            <p>Cung cấp email của bạn để nhận được tin nhắn khuyên mại của chúng tôi</p>
                            <input type="text" value={email} onChange={(e) => handleChange(e)} placeholder='Email của bạn' />
                            <button type='submit' onClick={(e) => handleClick(e)} style={email !== '' ? { background: "#05a667", color: 'white' } : {}}>Đăng ký</button>
                        </form>
                    </div>
                    <div className="footer-middle-middle">
                        <Link to={'/'}>
                            <img src="/logo-footer.png" alt="SOMETHING WENT WRONG" />
                        </Link>
                    </div>
                    <div className="footer-middle-right">
                        <div className="footer-middle-right-text">
                            <h3>Địa chỉ liên hệ</h3>
                            <p>Đ/C: Tòa nhà Ladeco, Đội Cấn, Ba Đình, Hà Nội</p>
                            <p>Điện thoại: +84 963.647.129</p>
                            <p>Email: vtquy291991@gmail.com</p>
                            <p>website: www.lvteam.com</p>
                        </div>
                        <div className="footer-middle-right-socialmedia">
                            
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Footer