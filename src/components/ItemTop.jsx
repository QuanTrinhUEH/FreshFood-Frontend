import React from 'react'
import { IoMdCart } from 'react-icons/io'
import { Link } from 'react-router-dom'

const ItemTop = ({ props }) => {
    const formattedNumber = (num) => {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }
    
    const discountedPrice = props.promotion 
        ? props.price * (1 - props.promotion.discountPercentage / 100) 
        : props.price;

    return (
        <>
            <Link to={`/product/${props._id}`} className='link-product-cart' >
                <img src={props.images[0]} alt="" />
                <div className="description">
                    <h2>{props.itemName}</h2>
                    <strong><i>Giá: </i>{formattedNumber(Math.round(discountedPrice))}đ</strong><br></br>
                    {props.promotion && (
                        <del><i>Giá gốc: </i>{formattedNumber(props.price)}đ</del>
                    )}
                    <button className='btn-buy'>
                        <IoMdCart />
                        Mua hàng
                    </button>
                </div>
            </Link>
        </>
    )
}

export default ItemTop
