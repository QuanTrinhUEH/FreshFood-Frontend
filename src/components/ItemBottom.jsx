import React from 'react'
import { FaStar } from 'react-icons/fa'
import { IoMdCart } from 'react-icons/io'
import { Link } from 'react-router-dom'

const ItemBottom = ({ props }) => {
    const formattedNumber = (num) => {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }
    return (
        <>
            <Link to={`/product/${props.ID}`} className='link-product-cart-3' >
                <div className="discount">
                    <p>-{Math.ceil(props.discount / props.price)}%</p>
                    <FaStar />
                </div>
                <img src={props.images[0]} alt="" />
                <div className="description">
                    <h2>{props.itemName}</h2>
                    <div className="des-con">
                        <div className="text">
                            <strong><i>Giá: </i>{formattedNumber(props.price)}đ</strong><br></br>
                            <del><i>Giá: </i>{formattedNumber(props.discount)}đ</del>
                        </div>
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

export default ItemBottom