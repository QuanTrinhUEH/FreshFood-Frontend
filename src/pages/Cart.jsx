import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { removeFromCart, updateQuantity, clearCart } from '../store/slice/cartSlice';
import CartItem from '../components/CartItem';

const Cart = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const storedUser = localStorage.getItem('userInfo');
    const storedCart = localStorage.getItem('cart');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }
  }, []);

  const handleDelete = (itemName) => {
    const updatedCart = cart.filter(item => item.name !== itemName);
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const handleQuantity = (itemName, quantity) => {
    const updatedCart = cart.map(item => 
      item.name === itemName ? {...item, quantity} : item
    );
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const handleDefine = () => {
    // Implement your define logic here
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('cart');
  };

  if (!user) {
    return (
      <div className="cart-page">
        <div className="container">
          <h1>GIỎ HÀNG</h1>
          <p className='no-cart-item'>Bạn chưa đăng nhập. Đăng nhập tại <Link to={'/signin'}>đây</Link> để mua sắm.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="container">
        <h1>GIỎ HÀNG</h1>
        {cart.length === 0 ? (
          <p className='no-cart-item'>Không có sản phẩm nào trong giỏ hàng của bạn. Quay lại <Link to={'/'}>cửa hàng</Link> để mua sắm.</p>
        ) : (
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
                {cart.map((item, i) => (
                  <CartItem props={item} key={i} onClick={handleDelete} onChange={handleQuantity} />
                ))}
              </ul>
            </div>
            <div className="end-btn">
              <button onClick={handleDefine} className='cart-end-btn'>Cập nhật</button>
              <button onClick={clearCart} className='cart-end-btn'>Xóa tất cả</button>
              <button onClick={() => navigate('/checkout')} className='cart-end-btn'>Thanh toán</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Cart;
