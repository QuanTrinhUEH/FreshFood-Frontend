import React from 'react'
import '../css/Recommend.scss'

const RecommendItem = ({ props }) => {
  console.log(typeof props.promotion);
  console.log(props.promotion);
  // Kiểm tra xem props có tồn tại không
  if (!props) {
    return <div>Không có thông tin sản phẩm</div>;
  }
  const formattedNumber = (num) => {
    if (num === undefined || num === null) return '0';
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }
  const discountedPrice = props.promotion.discountPercentage
    ? props.price * (1 - props.promotion.discountPercentage / 100)
    : props.price;



  return (
    <div className='recommend-item'>
      <img src={props.images[0]} alt="" />
      {/* <div className="text">
        <h4>{props.itemName}</h4>
        <div className="prices">
          <p className="price">{formattedNumber(Math.round(discountedPrice))}đ</p>
          {props.promotion && (
            <p className="original-price"><del>{formattedNumber(props.price)}đ</del></p>
          )}
        </div> */}
      <div className="description">
        <p>{props.itemName}</p>
        <h4>{formattedNumber(Math.round(discountedPrice))}đ</h4>
        {props.promotion.discountPercentage && (
          <div className="discount">
            <del><i>Giá: {formattedNumber(props.price)}đ</i></del>
          </div>
        )}
      </div>
    </div>
  )
}

export default RecommendItem