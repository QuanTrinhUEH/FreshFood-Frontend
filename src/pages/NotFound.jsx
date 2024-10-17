import React from 'react'
import { Link } from 'react-router-dom'

const NotFound = () => {
  return (
    <>
      <img src="/ResponseCode/404 NotFound.png" alt="" style={{
        width: "500px",
        margin: "50px 0 0 50%",
        transform: "translateX(-50%)",
        aspectRatio: "0"
      }} />
      <div className="text" style={{marginLeft: "50%",transform: "translateX(-50%)",textAlign: "center"}}>
        <div className="second-text" style={{display: "flex", justifyContent: "center"}}>
          <h3>Thewe is nothing hewe&nbsp;</h3>
          <img src="/collection/notfound.png" alt="" style={{width: "28px"}} />
        </div>
        <h3 style={{ marginBottom: "100px" }}>Back to <Link to={'/'} style={{color: "#1dc483"}}>home</Link></h3>
      </div>
    </>
  )
}

export default NotFound