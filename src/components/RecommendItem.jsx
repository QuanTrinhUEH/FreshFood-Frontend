import React from 'react'
import { FaStar } from 'react-icons/fa'
import '../css/Item.scss'
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
      {props.promotion.discountPercentage && (
        <div className="discount-percent">
          <p>-${props.promotion.discountPercentage}%</p>
          <FaStar />
        </div>
      )}
      <img src={props.images[0]} alt="" />
      <div className="detail">
        <p className='name'>{props.itemName}</p>
        <strong className='price'>Giá: {formattedNumber(Math.round(discountedPrice))}đ</strong>
        {props.promotion.discountPercentage && (
          <div className="discount">
            <del><i>Giá gốc: {formattedNumber(props.price)}đ</i></del>
          </div>
        )}
      </div>
    </div>
  )
}

export default RecommendItem