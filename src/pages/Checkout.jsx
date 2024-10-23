import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import '../css/Checkout.scss'
import { fetchAPI } from '../../fetchApi'
import Swal from 'sweetalert2'

const Checkout = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      const parsedUser = JSON.parse(userInfo);
      setUser(parsedUser);
      setPhone(parsedUser.phone || '');
    } else {
      navigate('/login');
    }

    const cartInfo = localStorage.getItem('cartInfo');
    if (cartInfo) {
      const parsedCart = JSON.parse(cartInfo);
      setCart(parsedCart);
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const orderData = {
      items: cart.map(item => ({
        itemId: item._id,
        quantity: item.quantity
      })),
      totalAmount: total,
      address: address,
      phoneNumber: phone
    };

    try {
      const tokenInfo = localStorage.getItem('tokenInfo');
      const response = await fetchAPI('/order/', 'POST', orderData, tokenInfo);
      if (response.status === 201) {
        // Xóa giỏ hàng sau khi đặt hàng thành công
        localStorage.removeItem('cartInfo');

        // Hiển thị thông báo đặt hàng thành công
        Swal.fire({
          icon: 'success',
          title: 'Đặt hàng thành công!',
          confirmButtonText: 'OK'
        }).then((result) => {
          if (result.isConfirmed) {
            // Chuyển hướng về trang chủ hoặc trang giỏ hàng
            navigate('/');
          }
        });
      } else {
        // Xử lý lỗi nếu có
        Swal.fire({
          icon: 'error',
          title: 'Đặt hàng thất bại',
          text: 'Vui lòng thử lại sau.',
          confirmButtonText: 'OK'
        });
      }
    } catch (error) {
      console.error('Lỗi khi đặt hàng:', error);
      Swal.fire({
        icon: 'error',
        title: 'Có lỗi xảy ra',
        text: 'Vui lòng thử lại sau.',
        confirmButtonText: 'OK'
      });
    }
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
