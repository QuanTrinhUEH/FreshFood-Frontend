import React from 'react'
import { FaStar } from 'react-icons/fa'
import { IoMdCart } from 'react-icons/io'
import { Link } from 'react-router-dom'

const ItemBottom = ({ props }) => {
    const formattedNumber = (num) => {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }

    const discountedPrice = props.promotion 
        ? props.price * (1 - props.promotion.discountPercentage / 100) 
        : props.price;

    return (
        <Link to={`/product/${props._id}`} className='link-product-cart-3'>
            {props.promotion && (
                <div className="discount">
                    <p>-{Math.ceil(props.promotion.discountPercentage)}%</p>
                    <FaStar />
                </div>
            )}
            <img src={props.images[0]} alt={props.itemName} />
            <div className="description">
                <h2>{props.itemName}</h2>
                <div className="des-con">
                    <div className="text">
                        <strong><i>
                            Giá: </i>{formattedNumber(discountedPrice)}đ</strong><br></br>
                        {props.promotion && (
                            <del><i>Giá gốc: </i>{formattedNumber(props.price)}đ</del>
                        )}
                    </div>
                    <button className='btn-buy'>
                        <IoMdCart />
                        Mua hàng
                    </button>
                </div>
            </div>
        </Link>
    )
}

export default ItemBottom
