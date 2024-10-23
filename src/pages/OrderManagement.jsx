import React, { useState, useEffect } from 'react';
import { Select, message, DatePicker, Input, Button } from 'antd';
import { fetchAPIWithoutBody, fetchAPI } from '../../fetchApi';
import Swal from 'sweetalert2';
import dayjs from 'dayjs';
import { IoSearch } from "react-icons/io5";
import "../css/Management.scss";

const { Option } = Select;
const { RangePicker } = DatePicker;

const OrderManagement = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [dateRange, setDateRange] = useState([]);
    const [statusFilter, setStatusFilter] = useState('');
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        fetchOrders();
    }, [page, pageSize, statusFilter]);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            let url = `/order?page=${page}&pageSize=${pageSize}`;
            if (searchTerm) url += `&search=${searchTerm}`;
            if (dateRange.length === 2) {
                url += `&startDate=${dateRange[0].format('YYYY-MM-DD')}&endDate=${dateRange[1].format('YYYY-MM-DD')}`;
            }
            if (statusFilter) url += `&status=${statusFilter}`;

            const response = await fetchAPIWithoutBody(url, 'GET', localStorage.getItem('tokenInfo'));
            if (response.success && Array.isArray(response.data.orders)) {
                setOrders(response.data.orders);
                setTotalPages(response.data.totalPages);
            } else {
                setOrders([]);
                message.error('Failed to fetch orders or invalid data received');
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
            message.error('An error occurred while fetching orders');
            setOrders([]);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            const response = await fetchAPI(`/order/${orderId}`, 'PATCH', { status: newStatus }, localStorage.getItem('tokenInfo'));
            if (response.success) {
                message.success('Order status updated successfully');
                setOrders(orders.map(order =>
                    order._id === orderId ? { ...order, status: newStatus } : order
                ));
            } else {
                throw new Error(response.message || 'Failed to update order status');
            }
        } catch (error) {
            console.error('Error updating order status:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.message || 'An error occurred while updating the order status',
            });
        }
    };

    const handleSearch = () => {
        setPage(1);
        fetchOrders();
    };

    const OrderItem = ({ order }) => (
        console.log("order", order),
        <tr>
            <td>{order._id}</td>
            <td>{order.user.userName}</td>
            <td>{dayjs(order.orderDate).format('DD/MM/YYYY HH:mm:ss')}</td>
            <td>{order.totalAmount.toFixed(2)}đ</td>
            <td>
                <Select
                    value={order.status}
                    style={{ width: 120 }}
                    onChange={(value) => handleStatusChange(order._id, value)}
                >
                    <Option value="pending">Pending</Option>
                    <Option value="processing">Processing</Option>
                    <Option value="shipped">Shipped</Option>
                    <Option value="delivered">Delivered</Option>
                    <Option value="cancelled">Cancelled</Option>
                </Select>
            </td>
            <td>{order.address}</td>
            <td>{order.phoneNumber}</td>
        </tr>
    );

    return (
        <div className="product-management content-container">
            <h1>Quản lý đơn hàng</h1>
            <div className="search-bar">
                <input
                    type="text"
                    placeholder="Tìm kiếm theo ID đơn hàng hoặc tên người dùng..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button onClick={handleSearch}><IoSearch /></button>
            </div>
            <div className="filter-options">
                <RangePicker
                    onChange={(dates) => setDateRange(dates)}
                    style={{ marginRight: 16 }}
                />
                <Select
                    placeholder="Lọc theo trạng thái"
                    style={{ width: 150, marginRight: 16 }}
                    onChange={(value) => setStatusFilter(value)}
                    allowClear
                >
                    <Option value="pending">Pending</Option>
                    <Option value="processing">Processing</Option>
                    <Option value="shipped">Shipped</Option>
                    <Option value="delivered">Delivered</Option>
                    <Option value="cancelled">Cancelled</Option>
                </Select>
                <select value={pageSize} onChange={(e) => setPageSize(Number(e.target.value))}>
                    <option value="10">10 đơn hàng/trang</option>
                    <option value="20">20 đơn hàng/trang</option>
                    <option value="50">50 đơn hàng/trang</option>
                </select>
            </div>
            <div className="product-list">
                {orders.length > 0 ? (
                    <table>
                        <thead>
                            <tr>
                                <th>ID đơn hàng</th>
                                <th>Người dùng</th>
                                <th>Ngày đặt hàng</th>
                                <th>Tổng tiền</th>
                                <th>Trạng thái</th>
                                <th>Địa chỉ</th>
                                <th>Số điện thoại</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order) => (
                                <OrderItem key={order._id} order={order} />
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>Không tìm thấy đơn hàng</p>
                )}
            </div>
            <div className="pagination">
                <button onClick={() => setPage(prev => Math.max(prev - 1, 1))} disabled={page === 1}>Trang trước</button>
                <span>Trang {page} / {totalPages}</span>
                <button onClick={() => setPage(prev => Math.min(prev + 1, totalPages))} disabled={page === totalPages}>Trang sau</button>
            </div>
        </div>
    );
};

export default OrderManagement;
