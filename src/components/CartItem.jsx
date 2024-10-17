import React, { useEffect, useState } from 'react'
import '../css/Cart.scss'

const CartItem = ({ props, onClick, onChange }) => {
    const [quantity, setQuantity] = useState(props.quantity)
    const handleClick = () => {
        onClick(props.itemName)
    }
    const handleChange = (e) => {
        setQuantity(parseInt(e.target.value))
    }
    useEffect(() => {
        onChange(props.itemName, quantity)
    }, [quantity])
    const formattedNumber = (num) => {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }
    return (
        <div className="cart-item-info">
            <div className="img">
                <img src={props.image} alt="what" />
            </div>
            <div className="cart-item-name">
                <h4>
                    {props.itemName}
                </h4>
            </div>
            <div className="cart-item-name">
                <h4>
                    {formattedNumber(props.originalPrice)}₫
                </h4>
            </div>
            <div className="cart-item-quantity">
                <input type="number" value={quantity} onChange={handleChange} min={1} />
            </div>
            <div className="cart-item-name">
                <h4>
                    {formattedNumber(props.originalPrice * quantity)}₫
                </h4>
            </div>
            <div className="cart-item-btn">
                <button onClick={handleClick}>XÓA</button>
            </div>

        </div>
    )
}

export default CartItem