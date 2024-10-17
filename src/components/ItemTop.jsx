import React from 'react'
import { IoMdCart } from 'react-icons/io'
import { Link } from 'react-router-dom'

const ItemTop = ({ props }) => {
    const formattedNumber = (num) => {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }
    return (
        <>
            <Link to={`/product/${props.ID}`} className='link-product-cart' >
                <img src={props.images[0]} alt="" />
                <div className="description">
                    <h2>{props.itemName}</h2>
                    <strong><i>Giá: </i>{formattedNumber(props.price)}đ</strong><br></br>
                    <del><i>Giá: </i>{formattedNumber(props.discount)}đ</del>
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