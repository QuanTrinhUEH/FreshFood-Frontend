import React, { useState, useEffect } from 'react';
import { fetchAPIWithoutBody, fetchAPI } from '../../fetchApi';
import dayjs from 'dayjs';
import "../css/UserOrders.scss";
import Swal from 'sweetalert2';
import OrderDetails from '../components/OrderDetail';

const UserOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

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

  const handleOrderClick = (order) => {
    setSelectedOrder(order);
  };

  const handleCloseDetails = () => {
    setSelectedOrder(null);
  };

  if (loading) {
    return <div className="loading">Đang tải...</div>;
  }

  return (
    <div className="user-orders content-container">
      <h1>Đơn hàng của bạn</h1>
      {orders.length > 0 ? (
        <div className="orders-list">
          {orders.map((order) => (
            <div key={order._id} className="order-item" onClick={() => handleOrderClick(order)}>
              <div className="order-header">
                <span className="order-id">Mã đơn hàng: {order._id}</span>
                <span className={`order-status ${getStatusClass(order.status)}`}>
                  {getStatusText(order.status)}
                </span>
              </div>
              <div className="order-summary">
                <p>Ngày đặt hàng: {dayjs(order.orderDate).format('DD/MM/YYYY')}</p>
                <p>Tổng tiền: {order.totalAmount}đ</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="no-orders">Bạn chưa có đơn hàng nào.</p>
      )}
      {selectedOrder && <OrderDetails order={selectedOrder} onClose={handleCloseDetails} fetchUserOrders={fetchUserOrders} />}
    </div>
  );
};

export default UserOrders;
