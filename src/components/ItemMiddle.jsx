import React from 'react'
import { IoMdCart } from 'react-icons/io'
import { FaStar } from 'react-icons/fa'
import { Link } from 'react-router-dom'

const ItemMiddle = ({ props }) => {
    const formattedNumber = (num) => {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }

    const discountedPrice = props.promotion
        ? props.price * (1 - props.promotion.discountPercentage / 100)
        : props.price;

    return (
        <>
            <Link to={`/product/${props._id}`} className='link-product-cart-2' >
                {props.promotion && (
                    <div className="discount">
                        <p>-${props.promotion.discountPercentage}%</p>
                        <FaStar />
                    </div>
                )}
                <img src={props.images[0]} alt="" />
                <div className="description">
                    <p className='name'>{props.itemName}</p>
                    <strong className='price'>{formattedNumber(Math.round(discountedPrice))}đ</strong>
                    {props.promotion && (
                        <del><i>Giá gốc: {formattedNumber(props.price)}đ</i></del>
                    )}
                    <div className="btn">
                        <button className='btn-buy'>
                            <IoMdCart />
                            Mua hàng
                        </button>
                    </div>
                </div>
            </Link>
        </>
    )
}

export default ItemMiddle
