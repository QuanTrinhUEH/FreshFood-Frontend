import React from 'react';
import { FaEdit } from "react-icons/fa";
import { Switch } from 'antd';
import { format, parseISO } from 'date-fns';

function PromotionItems({ promotion, onStatusChange, onEdit }) {
    const getStatusText = (status) => {
        return status === 1 ? 'Hoạt động' : 'Không hoạt động';
    };

    const handleStatusChange = (checked) => {
        onStatusChange(promotion._id, checked ? 1 : 0);
    };

    const formatDate = (dateString) => {
        return format(parseISO(dateString), 'dd/MM/yyyy');
    };

    return (
        <tr>
            <td>{promotion.promotionName}</td>
            <td>{promotion.discountPercentage}%</td>
            <td>{formatDate(promotion.startDate)}</td>
            <td>{formatDate(promotion.endDate)}</td>
            <td>{getStatusText(promotion.status)}</td>
            <td className="action-buttons">
                <button className="icon-button edit-button" onClick={() => onEdit(promotion)}>
                    <FaEdit className='management-icon'/>
                </button>
                <Switch
                    checked={promotion.status === 1}
                    onChange={handleStatusChange}
                    className="status-switch"
                />
            </td>
        </tr>
    );
}

export default PromotionItems;
