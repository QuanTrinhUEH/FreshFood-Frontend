import React from 'react'
import '../css/SignForm.scss'
import { NavLink } from 'react-router-dom'

const NavForm = () => {
    return (
        <>
            <div className="login-nav">
                <NavLink to={'/login'}>Đăng nhập</NavLink>
            </div>
            <div className="register-nav">
                <NavLink to={'/register'}>Đăng ký</NavLink>
            </div>
        </>
    )
}

export default NavForm