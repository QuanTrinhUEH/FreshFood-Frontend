import React from 'react'
import { FaShoppingCart, FaStar } from 'react-icons/fa'
import { Link } from 'react-router-dom'

const SearchItem = ({ props }) => {
  console.log(props)

  const formattedNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }

  // START TEST CODE
  // END TEST CODE



  return (
    <Link to={`/product/${props.ID}`} className='redirect-btn'>
      <div className='item'>
        <div className="discount-percentage">
          <p>-{Math.ceil(props.discount / props.price)}%</p>
          <FaStar />
        </div>
        <div className="top-img">
          <img src={props.images[0]} alt="" />
        </div>
        <div className="price-tags">
          <p className='name-tag'>{props.itemName}</p>
          <h3 className='price-tag'><i>Giá:&nbsp;</i>{formattedNumber(props.price)}₫</h3>
          <del className='discount-tag'><i>Giá: {formattedNumber(props.discount)}₫</i></del>
          <button>
          <FaShoppingCart /><p>Mua hàng</p>
          </button>
        </div>
      </div>
    </Link>
  )
}

export default SearchItem