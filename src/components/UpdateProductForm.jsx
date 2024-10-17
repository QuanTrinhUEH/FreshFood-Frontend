import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { IoClose } from "react-icons/io5";
import "../css/UpdateProductForm.scss";
import { fetchAPI } from '../../fetchApi.js';
import { useNavigate } from 'react-router-dom';

const UpdateProductForm = ({ product, onUpdate, onClose }) => {
    const [updatedProduct, setUpdatedProduct] = useState(product);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate()

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUpdatedProduct({ ...updatedProduct, [name]: value });
    };

    const handleUpdate = async () => {
        setLoading(true);
        fetchAPI(`/item/update/${product.ID}`, 'PUT', { itemName: updatedProduct.itemName, price: updatedProduct.price, description: updatedProduct.description }, localStorage.getItem('token')).then(e => {
            if (e.status === 201) {
                Swal.fire({
                    icon: "success",
                    title: "Success",
                    text: 'Thay đổi thông tin thành công',
                    timer: 10000
                }).then(() => navigate(0))
            }
            else {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: e.message,
                })
            }
        })
        setLoading(false)
    };

    const handleClose = () => {
        onClose();
    };

    return (
        <div className="update-container content-container">
            <h1>Cập Nhật Sản Phẩm</h1>
            <div className="product-details">
                <div className="input-group">
                    <label htmlFor="name">Tên sản phẩm</label>
                    <input
                        type="text"
                        id="name"
                        name="itemName"
                        value={updatedProduct.itemName}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="input-group">
                    <label htmlFor="price">Giá sản phẩm</label>
                    <input
                        min={10000}
                        type="number"
                        id="price"
                        name="price"
                        value={updatedProduct.price}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="input-group">
                    <label htmlFor="description">Mô tả sản phẩm</label>
                    <textarea
                        id="description"
                        name="description"
                        rows={5}
                        value={updatedProduct.description}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="update-btn-div">
                    <button onClick={handleUpdate} disabled={loading}>
                        {loading ? 'Đang cập nhật...' : 'Cập nhật sản phẩm'}
                    </button>
                </div>
            </div>
            <div className="form-close-btn-div">
                <button className='form-close-btn' onClick={handleClose}><IoClose /></button>
            </div>
        </div>
    );
};

export default UpdateProductForm;
