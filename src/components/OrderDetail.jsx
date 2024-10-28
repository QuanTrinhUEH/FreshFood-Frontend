import React from 'react';
import dayjs from 'dayjs';
import "../css/UserOrders.scss";
import Swal from 'sweetalert2';
import { fetchAPI } from '../../fetchApi';

const OrderDetails = ({ order, onClose, fetchUserOrders }) => {
    if (!order) return null;

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

    const handleCancelOrder = async (orderId) => {
        try {
            const result = await Swal.fire({
                title: 'Bạn có chắc chắn muốn hủy đơn hàng này?',
                text: "Bạn không thể hoàn tác hành động này!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Đồng ý',
                cancelButtonText: 'Hủy bỏ'
            });

            if (result.isConfirmed) {
                const response = await fetchAPI(`/order/cancel/${orderId}`, 'PATCH', {}, localStorage.getItem('tokenInfo'));
                if (response.status === 200) {
                    Swal.fire(
                        'Đã hủy!',
                        'Đơn hàng của bạn đã được hủy.',
                        'success'
                    );
                    fetchUserOrders(); // Refresh the orders list
                } else {
                    Swal.fire(
                        'Lỗi!',
                        'Không thể hủy đơn hàng. Vui lòng thử lại sau.',
                        'error'
                    );
                }
            }
        } catch (error) {
            console.error('Error cancelling order:', error);
            Swal.fire(
                'Lỗi!',
                'Đã xảy ra lỗi khi hủy đơn hàng.',
                'error'
            );
        }
    };

    return (
        <div className="order-details-modal">
            <div className="order-detail">
                <h2>Chi tiết đơn hàng {order._id}</h2>
                <div className="order-header">
                    <span className={`order-status ${getStatusClass(order.status)}`}>
                        {getStatusText(order.status)}
                    </span>
                    <p>Ngày đặt hàng: {dayjs(order.orderDate).format('DD/MM/YYYY HH:mm:ss')}</p>
                    <p>Tổng tiền: {order.totalAmount}đ</p>
                    <p>Địa chỉ: {order.address}</p>
                    <p>Số điện thoại: {order.phoneNumber}</p>
                </div>
                <div className="order-items">
                    <h3>Sản phẩm:</h3>
                    <ul>
                        {order.items.map((item) => (
                            <li key={item._id}>
                                {item.itemName} - Số lượng: {item.quantity} - Giá: {item.price}đ
                            </li>
                        ))}
                    </ul>
                </div>
                {order.status === 'pending' && (
                <button className="cancel-order-btn" onClick={() => handleCancelOrder(order._id)}>
                  Hủy đơn hàng
                </button>
              )}
            </div>
            <div className="close-div">
                <button className="close-btn" onClick={onClose}>X</button>
            </div>
        </div>
    );
};

export default OrderDetails;
