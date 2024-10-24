import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import '../css/Order.scss'
import { fetchAPI, fetchAPIWithoutBody } from '../../fetchApi'
import Swal from 'sweetalert2'

const Order = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [total, setTotal] = useState(0);
  const [availableQuantity, setAvailableQuantity] = useState(0);

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
    
    // Kiểm tra số lượng tồn kho
    const insufficientItems = [];
    for (const item of cart) {
      try {
        console.log(item)
        const response = await fetchAPIWithoutBody(`/item/${item._id}`, 'GET');
        if (response.status === 200) {
          const availableValue = response.data.item.quantity;
          setAvailableQuantity(availableValue);
          if (item.quantity > availableValue) {
            insufficientItems.push({...item, availableValue});
          }
        }
      } catch (error) {
        console.error(`Lỗi khi kiểm tra tồn kho cho sản phẩm ${item.itemName}:`, error);
      }
    }
    
    if (insufficientItems.length > 0) {
      const itemNames = insufficientItems.map(item => item.itemName).join(', ');
      Swal.fire({
        icon: 'error',
        title: 'Số lượng không đủ',
        text: `Các sản phẩm sau không đủ số lượng: ${itemNames}`,
      });
      return;
    }

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
        // Cập nhật số lượng tồn kho
        await updateInventory(cart);

        // Xóa giỏ hàng sau khi đặt hàng thành công
        localStorage.removeItem('cartInfo');

        Swal.fire({
          icon: 'success',
          title: 'Đặt hàng thành công!',
          confirmButtonText: 'OK'
        }).then((result) => {
          if (result.isConfirmed) {
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

  const updateInventory = async (items) => {
    const tokenInfo = localStorage.getItem('tokenInfo');
    for (const item of items) {
      try {
        // Lấy số lượng hiện tại của sản phẩm
        const response = await fetchAPIWithoutBody(`/item/${item._id}`, 'GET');
        if (response.status !== 200) {
          console.error(`Không thể lấy thông tin cho sản phẩm ${item.itemName}`);
          continue;
        }

        const availableQuantity = response.data.item.quantity;
        if (typeof availableQuantity !== 'number' || availableQuantity < item.quantity) {
          console.error(`Số lượng không hợp lệ cho sản phẩm ${item.itemName}`);
          continue;
        }

        const newQuantity = availableQuantity - item.quantity;
        await fetchAPI(`/item/${item._id}`, 'PATCH', {
          quantity: newQuantity
        }, tokenInfo);

        console.log(`Đã cập nhật thành công số lượng cho ${item.itemName}: ${newQuantity}`);
      } catch (error) {
        console.error(`Lỗi khi cập nhật tồn kho cho sản phẩm ${item.itemName}:`, error);
      }
    }
  };

  return (
    <div className="order-page">
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
          <button type="submit" className="order-btn">Đặt hàng</button>
        </form>
      </div>
    </div>
  )
}

export default Order
