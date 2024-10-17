import React from 'react'
import { NavLink } from 'react-router-dom'

function AccountNavbar() {
    return (
        <div className='account-navbar-content'>
            <NavLink to={"/account/profileUpdate"} className="nav nav-top">Thông tin cá nhân</NavLink>
            <NavLink to={"/account/changePassword"} className="nav nav-bot">Đổi mật khẩu</NavLink>
        </div>
    )
}

export default AccountNavbar
