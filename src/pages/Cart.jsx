import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { removeFromCart, updateQuantity, clearCart } from '../store/cartSlice';
import CartItem from '../components/CartItem';

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(state => state.user);
  const cart = useSelector(state => state.cart);

  const handleDelete = (itemName) => {
    dispatch(removeFromCart(itemName));
  };

  const handleQuantity = (itemName, quantity) => {
    dispatch(updateQuantity({ itemName, quantity }));
  };

  const handleDefine = () => {
    // Implement your define logic here
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
              <button onClick={() => dispatch(clearCart())} className='cart-end-btn'>Xóa tất cả</button>
              <button onClick={() => navigate('/checkout')} className='cart-end-btn'>Thanh toán</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Cart;
