import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { IoMdCart } from 'react-icons/io'
import '../css/BodyTop.scss'

const BodyTop = ({ props }) => {
    const formattedNumber = (num) => {
        if (isNaN(num) || num === null) return 'N/A';
        return num.toLocaleString('vi-VN');
    }

    const [itemInfo, setItemInfo] = useState(false)

    const calculateDiscountedPrice = () => {
        if (typeof props.price !== 'number') return 'N/A';
        if (props.promotion && typeof props.promotion.discountPercentage === 'number') {
            return formattedNumber(props.price * (1 - props.promotion.discountPercentage / 100));
        }
        return null; // Trả về null nếu không có giảm giá
    }

    return (
        <>
            <Link to={`/product/${props._id}`} className='item-info' onMouseEnter={() => { setItemInfo(true) }} onMouseLeave={() => { setItemInfo(false) }} style={{background: `url(${props.images[0]})`}}>

                <div className="info" style={!itemInfo ? {
                    visibility: "hidden",
                    opacity: "0"
                } : {
                    visibility: "visible",
                    opacity: "1"
                }}>
                    <div className="info-name">
                        <h2>{props.itemName}</h2>
                    </div>
                    <div className="info-prices">
                        {props.promotion !== null ? (
                            <>
                                <div className="info-price">
                                    <h1>{calculateDiscountedPrice()}đ</h1>
                                </div>
                                <div className="info-discount">
                                    <del>{formattedNumber(props.price)}đ</del>
                                </div>
                            </>
                        ) : (
                            <div className="info-price">
                                <h1>{formattedNumber(props.price)}đ</h1>
                            </div>
                        )}
                    </div>
                    <div className='info-button'>
                        <IoMdCart />
                        <p className="info-button-text">
                            Mua hàng
                        </p>
                    </div>
                </div>
            </Link>
        </>
    )
}

export default BodyTop
