import React, { useState, useEffect } from 'react';
import '../css/Cart.scss';
import { message } from 'antd';

const CartItem = ({ item, onDelete, onQuantityChange }) => {
    if (!item) return null; // Add this check to prevent errors when item is undefined

    console.log(item);
    const [quantity, setQuantity] = useState(item.quantity);
    const [totalPrice, setTotalPrice] = useState(item.price);

    useEffect(() => {
        setTotalPrice(item.discountedPrice * quantity);
    }, [quantity, item.discountedPrice]);

    const handleQuantityChange = (e) => {
        const newQuantity = parseInt(e.target.value);
        if (newQuantity <= item.availableQuantity) {
            setQuantity(newQuantity);
            onQuantityChange(newQuantity);
        } else {
            message.warning(`Chỉ còn ${item.availableQuantity} sản phẩm có sẵn.`);
        }
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
    };

    return (
        <div className="cart-item-info">
            <div className="img">
                <img src={item.image} alt={item.itemName} className="cart-item-image" />
            </div>
            <div className="cart-item-details">
                <h4>{item.itemName}</h4>
            </div>
            <div className="cart-item-details">
                <p>Giá: {formatPrice(item.discountedPrice)}</p>
            </div>
            <div className="cart-item-quantity">
                <input
                    type="number"
                    value={quantity}
                    onChange={handleQuantityChange}
                    min="1"
                />
            </div>
            <div className="cart-item-details">
                <p>Tổng: {formatPrice(totalPrice)}</p>
            </div>
            <div className="cart-item-btn">
                <button onClick={() => onDelete(item.itemName)}>Xóa</button>
            </div>
        </div>
    );
};

export default CartItem;
