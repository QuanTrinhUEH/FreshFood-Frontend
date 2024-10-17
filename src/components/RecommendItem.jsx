import React from 'react'
import '../css/Recommend.scss'

const RecommendItem = ({ props }) => {
  const formattedNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }
  
  return (
    <div className='recommend-item'>
      <img src={props.images[0]} alt="" />
      <div className="description">
        <p>{props.itemName}</p>
        <h4><i>Giá:</i> {formattedNumber(props.price)}</h4>
        <div className="discount">
          <del><i>Giá: {formattedNumber(props.discount)}</i></del>
        </div>
      </div>
    </div>
  )
}

export default RecommendItem