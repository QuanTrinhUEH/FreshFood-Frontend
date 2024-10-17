import React, { useEffect, useState } from 'react'
import '../css/Cart.scss'
import { Link, useNavigate } from 'react-router-dom'
import CartItem from '../components/CartItem'

const Cart = () => {
  const navigate = useNavigate()
  const [cart, setCart] = useState(localStorage.getItem('cart'))
  const [updateCart, setUpdateCart] = useState(JSON.parse(cart))
  console.log(updateCart)


  // handleDelete
  const handleDelte = (name) => {
    const itemIndex = JSON.parse(localStorage.getItem('cart')).findIndex(e => e.itemName == name)
    if (itemIndex !== 0) {
      const newArray = JSON.parse(localStorage.getItem('cart')).splice(itemIndex, 1)
      localStorage.setItem('cart', JSON.stringify(newArray))
      setCart(localStorage.getItem('cart'))
    }
    else {
      localStorage.removeItem('cart')
      setCart(null)
      navigate('/cart')
    }
  }


  // handleQuantity
  const handleQuantity = (name, quantity) => {
    const currCart = JSON.parse(localStorage.getItem('cart'))
    const itemIndex = currCart.findIndex(e => e.itemName == name)
    const newCart = updateCart
    newCart[itemIndex].quantity = quantity
    newCart[itemIndex].price = newCart[itemIndex].originalPrice * quantity
    setUpdateCart(newCart)
  }

  const handleDefine = () => {
    localStorage.setItem('cart', JSON.stringify(updateCart))
    navigate('/cart')
  }


  return (
    localStorage.getItem('user') == null
      ?
      (<>
        <div className="cart-page">
          <div className="container">
            <h1>GIỎ HÀNG</h1>
            <p className='no-cart-item'>Bạn chưa đăng nhập. Đăng nhập tại <Link to={'/signin'}>đây</Link> để mua sắm.</p>
          </div>
        </div>
      </>)
      :
      (<div className="cart-page">
        <div className="container">
          <h1>GIỎ HÀNG</h1>
          {!cart ? (<p className='no-cart-item'>Không có sản phẩm nào trong giỏ hàng của bạn. Quay lại <Link to={'/'}>cửa hàng</Link> để mua sắm.</p>) : (
            <>
              <div className="cart-items">
                <div className="cart-header">
                  <h4 className='cart-header-text'>ẢNH</h4>
                  <h4 className='cart-header-text'>SẢN PHẨM</h4>
                  <h4 className='cart-header-text'>GIÁ</h4>
                  <h4 className='cart-header-text'>SỐ LƯỢNG</h4>
                  <h4 className='cart-header-text'>TỔNG SỐ</h4>
                  <h4 className='cart-header-text'>XÓA</h4>
                </div>
                <ul className="cart-list">
                  {JSON.parse(cart).map((e, i) => (
                    <CartItem props={e} key={i} onClick={handleDelte} onChange={handleQuantity} />
                  ))}
                </ul>
              </div>
              <div className="end-btn">
                <button onClick={handleDefine} className='cart-end-btn'>Cập nhật</button>
                <button onClick={() => { setCart(null); localStorage.removeItem('cart'); navigate('/cart') }} className='cart-end-btn'>Xóa tất cả</button>
                <button onClick={() => navigate('/checkout')} className='cart-end-btn'>Thanh toán</button>
              </div>
            </>
          )}
        </div>
      </div>)
  )
}

export default Cart