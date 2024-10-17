import React from 'react'
import '../css/Rating.scss'

const Rating = ({ props }) => {
  return (
    <div className='rating'>
      <img src={props.user.profile_picture} alt="" />
      <div className="text">
        <div className="rating-text"></div>
        <div className="ok">
          <q>{props.feedback}</q>
        </div>
        <br />
        <span><i>Khách hàng:&nbsp;&nbsp;</i></span><span style={{ color: "#1dc483" }}>{props.user.username}</span>
      </div>
    </div>
  )
}

export default Rating