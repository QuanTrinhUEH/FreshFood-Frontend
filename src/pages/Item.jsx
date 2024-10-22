import React, { useEffect, useState } from 'react'
import '../css/Item.scss'
import { FaCartPlus, FaGift, FaPhoneSquareAlt, FaTruck } from 'react-icons/fa';
import { LiaLongArrowAltLeftSolid, LiaLongArrowAltRightSolid } from 'react-icons/lia';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { FaBasketShopping, FaCartShopping } from 'react-icons/fa6';
import RecommendItem from '../components/RecommendItem';
import { fetchAPI } from '../../fetchApi';
import { PuffLoader } from 'react-spinners';
import { useDispatch, useSelector } from 'react-redux';

const Item = () => {
  const params = new useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector(state => state.user);
  const cart = useSelector(state => state.cart);
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState();
  const [ads, setAds] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [img, setImg] = useState();
  const [itemList, setItemList] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);

  const handleImage = (e) => {
    setImg(e.target.src)
  }

  useEffect(() => {
    fetchAPI(`/item/${params.id}`, 'GET').then(e => {
      if (e.status == 200) {
        // console.log("item component", e.data.item);
        setData(e.data.item)
        // setItemList(e.data.item.variants.map(type => ({ name: type.name, type: type.type[0] })))
        fetchAPI(`/item/foodType/${e.data.item.foodType}`)
          .then(e => {
            // console.log("ads", e.data.items.slice(0, 4));
            setAds(e.data.items.slice(0, 4))
          })
      }
      else {
        setData(false)
      }
    })
    const timeout = setTimeout(() => {
      setLoading(false)
    }, 500);
    return () => {
      clearTimeout(timeout)
    }
  }, [])

  const formattedNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }
  const discountedPrice = data && data.promotion
    ? data.price * (1 - data.promotion.discountPercentage / 100)
    : data ? data.price : 0;

  useEffect(() => {
    if (data) {
      const price = data.promotion
        ? data.price * (1 - data.promotion.discountPercentage / 100)
        : data.price;
      setTotalPrice(price * quantity);
    }
  }, [data, quantity]);

  // SUBMIT

  const handleBuy = (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login')
    }
    else {
      const saveItem = {
        itemName: data.itemName,
        image: data.images[0],
        quantity,
        originalPrice: data.price,
        price: price * quantity,
        type: [
          ...itemList
        ],
        ID: data.ID
      }
      const existingItemIndex = cart.findIndex(e => e.itemName == saveItem.itemName)
      if (existingItemIndex !== -1) {
        cart[existingItemIndex] = saveItem
        dispatch(setCart(cart));
      }
      else {
        const updatedCart = [...cart, saveItem];
        dispatch(setCart(updatedCart));
      }
      navigate('/cart')
    }
  }

  // Chuyển [b] thành <b> và [/b] thành </b>, chuyển [url] => <a>, [img] => <img>
  // const convertTagsToHtml = (text) => {
  //   const regexURL = /\[url=(.*?)\](.*?)\[\/url\]/g;
  //   const regexIMG = /\[img=(.*?)\]/g;

  //   return text
  //     .replace(/\[b\]/g, "<b>")
  //     .replace(/\[\/b\]/g, "</b>")
  //     .replace(/\[i\]/g, "<i>")
  //     .replace(/\[\/i\]/g, "</i>")
  //     .replace(/\[u\]/g, "<u>")
  //     .replace(/\[\/u\]/g, "</u>")
  //     .replace(regexURL, "<a href='$1'>$2</a>")
  //     .replace(regexIMG, "<img src='$1' style='margin-left: auto;display: block;transform: translateX(-50%);max-width: 480px'>");
  // }


  return loading ? (
    <div style={{
      margin: "120px 0",
      marginLeft: "50%",
    }}>
      <PuffLoader color="#1dc483" />
    </div>
  ) : !data ? (
    navigate('/not-found')
  ) : (
    <>
      <div className="top-item">
        <div className="container">
          <div className="top-item-col1">
            <img src={img || data.images[0]} alt="" className='big-img' />
            <div className="imgs">
              {data.images.map((e, i) => (
                <img key={i} src={e} alt="" className="small-img" onClick={handleImage} />
              ))}
            </div>
          </div>
          <div className="top-item-col2">
            <h1>{data.itemName}</h1>
            <div className="prices">
              <div className="price">
                <h1>{formattedNumber(Math.round(discountedPrice))}đ</h1>
              </div>
              {data.promotion && (
                <div className="discount">
                  <del><i>Giá gốc: {formattedNumber(data.price)}đ</i></del>
                </div>
              )}
            </div>
            <div className="method">
              <div className="tel">
                <div className="tel-icon"><FaPhoneSquareAlt /></div>
                <div className="tel-text">
                  <div className="top-text">Đặt hàng nhanh</div>
                  <a className="bottom-text" href='tel:0963.647.129'>0963.647.129</a>
                </div>
              </div>
              <div className="arrows">
                <LiaLongArrowAltLeftSolid />
                <LiaLongArrowAltRightSolid />
              </div>
              <div className="cart">
                <div className="cart-icon"><FaCartPlus /></div>
                <div className="cart-text">
                  <div className="top-text">Giỏ hàng</div>
                  <Link to={'/cart'} className="bottom-text">0 Sản phẩm</Link>
                </div>
              </div>
            </div>
            <form className="form-buy">
              <div className="left-buy">
                <div className="quantity">
                  <h3>Số lượng</h3>
                  <input type="number" value={quantity} min={1} name='quantity' onChange={(e) => setQuantity(parseInt(e.target.value))} />
                </div>
                <div className="total-price">
                  <h3>Tổng tiền</h3>
                  <p>{formattedNumber(Math.round(totalPrice))}đ</p>
                </div>
                <div className="buy-btn">
                  <button type="submit" onClick={handleBuy}><FaCartShopping /><p>Mua hàng</p></button>
                </div>
              </div>
              <div className="types">
                <div className="type">
                  <h3 className='type-title'>Phân loại</h3>
                  <p className='type-text'>{data.foodType}</p>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
      <div className="bottom-item">
        <div className="container">
          <div className="bottom-left">
            <h3>ĐẶC ĐIỂM NỔI BẬT</h3>
            <div className="st-border"></div>
            <p>{data.description}</p>
            <div className="st-border"></div>
          </div>
          <div className="bottom-right">
            <div className="redirects">
              <Link className="redirect">
                <FaGift />
                <h4>CHÍNH SÁCH QUÀ TẶNG</h4>
              </Link>
              <Link className="redirect">
                <FaTruck />
                <h4>CHÍNH SÁCH VẬN CHUYỂN</h4>
              </Link>
              <Link className="redirect">
                <FaBasketShopping />
                <h4>CHÍNH SÁCH MUA HÀNG</h4>
              </Link>
            </div>
            <div className="recommendations">
              <h4 className='highlighted'>SẢN PHẨM LIÊN QUAN</h4>
              <ul>
                {ads.length > 0 ? (
                  ads.map((e, i) => (
                    <li key={i}>
                      <Link to={`/product/${e.ID}`}>
                        <RecommendItem props={e} />
                      </Link>
                    </li>
                  ))
                ) : (
                  <p>Không có sản phẩm liên quan</p>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Item
