import React from 'react';
import { FaEdit } from "react-icons/fa";
import { Switch } from 'antd';

function ManagementItems({ product, onStatusChange, onEdit }) {
    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
    };

    const getStatusText = (status) => {
        return status === 1 ? 'Hoạt động' : 'Không hoạt động';
    };

    const handleStatusChange = (checked) => {
        onStatusChange(product._id, checked ? 1 : 0);
    };

    return (
        <tr>
            <td>{product.itemName}</td>
            <td>
                {product.images && product.images.length > 0 ? (
                    <img src={product.images[0]} alt={product.itemName} width="50" />
                ) : (
                    <span>Không có ảnh</span>
                )}
            </td>
            <td>{formatPrice(product.price)}</td>
            <td>{getStatusText(product.status)}</td>
            <td>{product.quantity}</td>
            <td className="action-buttons">
                <button className="icon-button edit-button" onClick={() => onEdit(product)}>
                    <FaEdit className='management-icon'/>
                </button>
                <Switch
                    checked={product.status === 1}
                    onChange={handleStatusChange}
                    className="status-switch"
                />
            </td>
        </tr>
    );
}

export default ManagementItems;
