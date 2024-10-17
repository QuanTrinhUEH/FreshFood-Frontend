import React from 'react'
import '../css/SignForm.scss'
import { NavLink } from 'react-router-dom'

const NavForm = () => {
    return (
        <>
            <div className="sign-in-nav">
                <NavLink to={'/signin'}>Đăng nhập</NavLink>
            </div>
            <div className="sign-up-nav">
                <NavLink to={'/signup'}>Đăng ký</NavLink>
            </div>
        </>
    )
}

export default NavForm