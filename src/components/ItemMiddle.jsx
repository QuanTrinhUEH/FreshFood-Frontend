import React from 'react'
import { FaStar } from 'react-icons/fa'
import { IoMdCart } from 'react-icons/io'
import { Link } from 'react-router-dom'

const ItemMiddle = ({ props }) => {
    const formattedNumber = (num) => {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }

    const discountedPrice = props.promotion
        ? props.price * (1 - props.promotion.discountPercentage / 100)
        : props.price;

    return (
        <Link to={`/product/${props._id}`} className="product-card">
            <img src={props.images[0]} alt={props.itemName} />
            <div className="product-info">
                <h3>{props.itemName}</h3>
                <p className="price">Giá: {formattedNumber(Math.round(discountedPrice))}đ</p>
                {props.promotion && (
                    <p className="original-price">
                        Giá gốc: <del>{formattedNumber(props.price)}đ</del>
                    </p>
                )}
                <button className="buy-button">
                    <IoMdCart />
                    Mua hàng
                </button>
            </div>
        </Link>
    )
}

export default ItemMiddle
