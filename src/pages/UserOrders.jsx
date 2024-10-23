import React, { useState, useEffect } from 'react';
import { fetchAPIWithoutBody } from '../../fetchApi';
import dayjs from 'dayjs';
import { Link } from 'react-router-dom';
import "../css/UserOrders.scss";

const UserOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserOrders();
  }, []);

  const fetchUserOrders = async () => {
    try {
      const response = await fetchAPIWithoutBody('/order/user/myOrders', 'GET', localStorage.getItem('tokenInfo'));
      if (response.status === 200 && Array.isArray(response.data.orders)) {
        setOrders(response.data.orders);
      } else {
        console.error('Failed to fetch orders or invalid data received');
      }
    } catch (error) {
      console.error('Error fetching user orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'pending': return 'status-pending';
      case 'processing': return 'status-processing';
      case 'shipped': return 'status-shipped';
      case 'delivered': return 'status-delivered';
      case 'cancelled': return 'status-cancelled';
      default: return '';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending': return 'Chờ xử lý';
      case 'processing': return 'Đang xử lý';
      case 'shipped': return 'Đã gửi hàng';
      case 'delivered': return 'Đã giao hàng';
      case 'cancelled': return 'Đã hủy';
      default: return status;
    }
  };
  orders.map((order) => {
    console.log("order",typeof order.items);
    console.log("order",order.items);
    console.log("order items",order.items.itemName);
  })

  if (loading) {
    return <div className="loading">Đang tải...</div>;
  }

  return (
    <div className="user-orders content-container">
      <h1>Đơn hàng của bạn</h1>
      {orders.length > 0 ? (
        <div className="orders-list">
          {orders.map((order) => (
            <div key={order._id} className="order-item">
              <div className="order-header">
                <span className="order-id">Mã đơn hàng: {order._id}</span>
                <span className={`order-status ${getStatusClass(order.status)}`}>
                  {getStatusText(order.status)}
                </span>
              </div>
              <div className="order-details">
                <p>Ngày đặt hàng: {dayjs(order.orderDate).format('DD/MM/YYYY HH:mm:ss')}</p>
                <p>Tổng tiền: {order.totalAmount}đ</p>
                <p>Địa chỉ: {order.address}</p>
                <p>Số điện thoại: {order.phoneNumber}</p>
              </div>
              <div className="order-items">
                <h3>Sản phẩm:</h3>
                <ul>
                  {Array.isArray(order.items) && order.items.map((item) => (
                    <li key={item._id || item.id}>
                      {item.itemName || 'Sản phẩm không xác định'} - Số lượng: {item.quantity} - Giá: {item.price || 'N/A'}đ
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="no-orders">Bạn chưa có đơn hàng nào.</p>
      )}
    </div>
  );
};

export default UserOrders;
