import React from 'react'
import { IoMdCart } from 'react-icons/io'
import { Link } from 'react-router-dom'
// import '../css/SearchItem.scss'

const SearchItem = ({ props }) => {
  const formattedNumber = (num) => {
    if (num === undefined || num === null) return '0';
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }

  const discountedPrice = props.promotion
    ? props.price * (1 - props.promotion.discountPercentage / 100)
    : props.price;

  return (
    <Link to={`/product/${props._id}`} className='search-item'>
      {props.promotion && (
        <div className="discount-badge">-{Math.round(props.promotion.discountPercentage)}%</div>
      )}
      <div className="search-item-img">
        <img src={props.images[0]} alt={props.itemName} />
      </div>
      <div className="search-item-info">
        <h3>{props.itemName}</h3>
        <p className="discounted-price">{formattedNumber(Math.round(discountedPrice))}đ</p>
        {props.promotion && (
          <p className="original-price">{formattedNumber(props.price)}đ</p>
        )}
        <button className="buy-button"><IoMdCart /> Mua hàng</button>
      </div>
    </Link>
  )
}

export default SearchItem
