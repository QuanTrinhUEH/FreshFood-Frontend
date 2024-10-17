import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { IoMdCart } from 'react-icons/io'
import '../css/BodyTop.scss'

const BodyTop = ({ props }) => {
    const formattedNumber = (num) => {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }
    const [itemInfo, setItemInfo] = useState(false)
    return (
        <>
            <Link to={`/product/${props.ID}`} className='item-info' onMouseEnter={() => { setItemInfo(true) }} onMouseLeave={() => { setItemInfo(false) }} style={{background: `url(${props.images[0]})`}}>

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
                        <div className="info-price"><h1>{formattedNumber(props.price)}đ</h1></div>
                        <div className="info-discount">
                            <del>{formattedNumber(props.discount)}đ</del>
                        </div>
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