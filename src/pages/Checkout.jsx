import React from 'react'
import { useNavigate } from 'react-router-dom'

const Checkout = () => {
  // TODO: CSS
  const navigate = useNavigate();
  if(localStorage.getItem('token') == null) {
    navigate('/signin')
  }

  const items = localStorage.getItem('cart')

  return (
    <div>Checkout</div>
  )
}

export default Checkout