import React from 'react'
import { NavLink } from 'react-router-dom'

function AdminNavbar() {
    return (
        <div className='admin-navbar-content'>
            <NavLink to={"/admin/createItem"} className="nav nav-top">Thêm sản phẩm</NavLink>
            <NavLink to={"/admin/createPromotion"} className="nav">Thêm khuyến mãi</NavLink>
            <NavLink to={"/admin/management"} className="nav">Quản lý sản phẩm</NavLink>
            <NavLink to={"/admin/promotions"} className="nav">Quản lý khuyến mãi</NavLink>
            <NavLink to={"/admin/orderManagement"} className="nav">Quản lý đơn hàng</NavLink>
            <NavLink to={"/admin/feedback"} className="nav nav-bot">Ý kiến khách hàng</NavLink>
        </div>
    )
}

export default AdminNavbar
