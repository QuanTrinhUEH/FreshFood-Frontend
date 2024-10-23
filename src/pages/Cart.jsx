import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import CartItem from '../components/CartItem.jsx';
import '../css/Cart.scss';

const Cart = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    if (localStorage.getItem('userInfo')) {
      setUser(JSON.parse(localStorage.getItem('userInfo')));
    }
    const storedCart = localStorage.getItem('cartInfo');
    if (storedCart) {
      try {
        const parsedCart = JSON.parse(storedCart);
        setCart(Array.isArray(parsedCart) ? parsedCart : []);
      } catch (error) {
        console.error("Error parsing cart data:", error);
        setCart([]);
      }
    }
  }, []);

  const handleDelete = (itemName) => {
    const updatedCart = cart.filter(item => item.itemName !== itemName);
    setCart(updatedCart);
    localStorage.setItem('cartInfo', JSON.stringify(updatedCart));
  };

  const handleQuantity = (itemName, quantity) => {
    const updatedCart = cart.map(item => {
      if (item.itemName === itemName) {
        const newQuantity = parseInt(quantity);
        return {
          ...item,
          quantity: newQuantity,
          price: item.originalPrice * newQuantity
        };
      }
      return item;
    });
    setCart(updatedCart);
    localStorage.setItem('cartInfo', JSON.stringify(updatedCart));
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('cartInfo');
  };

  if (!user) {
    return (
      <div className="cart-page">
        <div className="container">
          <h1>GIỎ HÀNG</h1>
          <p className='no-cart-item'>Bạn chưa đăng nhập. Đăng nhập tại <Link to={'/login'}>đây</Link> để mua sắm.</p>
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
                <h4 className='cart-header-text'>TỔNG TIỀN</h4>
                <h4 className='cart-header-text'>XÓA</h4>
              </div>
              <ul className="cart-list">
                {cart.map((item, i) => (
                  <CartItem 
                    key={i} 
                    item={item} 
                    onDelete={() => handleDelete(item.itemName)} 
                    onQuantityChange={(quantity) => handleQuantity(item.itemName, quantity)} 
                  />
                ))}
              </ul>
            </div>
            <div className="end-btn">
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
