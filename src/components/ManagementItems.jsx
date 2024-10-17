import React from 'react';
import { MdDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";

function ManagementItems({ product, onDelete, onEdit }) {
    return (
        <tr>
            <td>{product.ID}</td>
            <td>{product.itemName}</td>
            <td><img src={product.images[0]} alt={product.itemName} width="50" /></td>
            <td>{product.price}</td>
            <td className="action-buttons">
                <button className="icon-button del-button" onClick={() => onDelete(product.ID)}><MdDelete className='management-icon'/></button>
                <button className="icon-button edit-button" onClick={() => onEdit(product)}><FaEdit className='management-icon'/></button>
            </td>
        </tr>
    );
}

export default ManagementItems;
