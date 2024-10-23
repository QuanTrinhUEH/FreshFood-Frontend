import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import '../css/Checkout.scss'

const Checkout = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [total, setTotal] = useState(0);

  useEffect(() => {
    // Lấy thông tin user từ localStorage
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      const parsedUser = JSON.parse(userInfo);
      setUser(parsedUser);
      setPhone(parsedUser.phone || ''); // Đặt số điện thoại mặc định từ thông tin user
    } else {
      navigate('/login'); // Chuyển hướng về trang đăng nhập nếu chưa đăng nhập
    }

    // Lấy thông tin giỏ hàng từ localStorage
    const cartInfo = localStorage.getItem('cartInfo');
    if (cartInfo) {
      const parsedCart = JSON.parse(cartInfo);
      setCart(parsedCart);
      // Tính tổng giá trị đơn hàng
      const cartTotal = parsedCart.reduce((sum, item) => sum + item.price, 0);
      setTotal(cartTotal);
    }
  }, [navigate]);

  const handlePhoneChange = (e) => {
    setPhone(e.target.value);
  };

  const handleAddressChange = (e) => {
    setAddress(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Xử lý logic thanh toán ở đây
    console.log('Đặt hàng với thông tin:', { phone, address, total, cart });
    // Sau khi xử lý thanh toán thành công, có thể chuyển hướng người dùng đến trang xác nhận
    // navigate('/order-confirmation');
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  return (
    <div className="checkout-page">
      <div className="container">
        <h1>Thanh Toán</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="phone">Số điện thoại:</label>
            <input
              type="tel"
              id="phone"
              value={phone}
              onChange={handlePhoneChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="address">Địa chỉ giao hàng:</label>
            <textarea
              id="address"
              value={address}
              onChange={handleAddressChange}
              required
            />
          </div>
          <div className="order-summary">
            <h2>Tóm tắt đơn hàng</h2>
            {cart.map((item, index) => (
              <div key={index} className="order-item">
                <span>{item.itemName} x {item.quantity}</span>
                <span>{formatPrice(item.price)}</span>
              </div>
            ))}
            <div className="order-total">
              <strong>Tổng cộng:</strong>
              <strong>{formatPrice(total)}</strong>
            </div>
          </div>
          <button type="submit" className="checkout-btn">Đặt hàng</button>
        </form>
      </div>
    </div>
  )
}

export default Checkout
