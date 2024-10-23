import React from 'react'
import '../css/Recommend.scss'
import { useNavigate } from 'react-router-dom';

const RecommendItem = ({ props }) => {
  const navigate = useNavigate();
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
    <div onClick={() => navigate(`/product/${props._id}`)} className='recommend-item'>
      <img src={props.images[0]} alt="" />
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