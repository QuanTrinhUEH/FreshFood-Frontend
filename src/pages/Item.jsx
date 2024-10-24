import React, { useEffect, useState } from 'react'
import '../css/Item.scss'
import { FaCartPlus, FaGift, FaPhoneSquareAlt, FaTruck } from 'react-icons/fa';
import { LiaLongArrowAltLeftSolid, LiaLongArrowAltRightSolid } from 'react-icons/lia';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { FaBasketShopping, FaCartShopping } from 'react-icons/fa6';
import RecommendItem from '../components/RecommendItem';
import { fetchAPI } from '../../fetchApi';
import { PuffLoader } from 'react-spinners';
import { Navigate } from 'react-router-dom';

const Item = () => {
  const params = new useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState();
  const [ads, setAds] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [img, setImg] = useState();
  const [totalPrice, setTotalPrice] = useState(0);
  const [showNotification, setShowNotification] = useState(false);
  const [availableQuantity, setAvailableQuantity] = useState(0);
  const [apiStatus, setApiStatus] = useState('idle'); // 'idle', 'loading', 'success', 'error'

  useEffect(() => {
    const storedUser = localStorage.getItem('userInfo');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleImage = (e) => {
    setImg(e.target.src)
  }

  useEffect(() => {
    const fetchData = async () => {
      setApiStatus('loading');
      try {
        const response = await fetchAPI(`/item/${params.id}`, 'GET');
        if (response.status === 200) {
          setData(response.data.item);
          setAvailableQuantity(response.data.item.quantity);
          const adsResponse = await fetchAPI(`/item/foodType/${response.data.item.foodType}`);
          setAds(adsResponse.data.items.slice(0, 4));
          setApiStatus('success');
        } else {
          setApiStatus('error');
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setApiStatus('error');
      }
    };

    fetchData();
  }, [params.id]);

  const getFoodTypeInVietnamese = (foodType) => {
    switch (foodType.toLowerCase()) {
      case 'meats':
        return 'Thịt sạch';
      case 'vegetables':
        return 'Rau sạch';
      case 'seafood':
        return 'Hải sản sạch';
      case 'fruits':
        return 'Hoa quả sạch';
      default:
        return foodType;
    }
  };

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

  const handleBuy = (e) => {
    e.preventDefault();

    if (!user) {
      navigate('/login');
      return;
    }

    const saveItem = {
      _id: data._id,
      itemName: data.itemName,
      originalPrice: data.price,
      discountedPrice: data.promotion ? discountedPrice : data.price,
      variants: data.variants,
      image: data.images[0],
      quantity,
      price: (data.promotion ? discountedPrice : data.price) * quantity,
      type: data.foodType,
    };

    let cart = JSON.parse(localStorage.getItem('cartInfo')) || [];
    const existingItemIndex = cart.findIndex(item => item._id === saveItem._id);

    if (existingItemIndex !== -1) {
      cart[existingItemIndex].quantity += quantity;
      cart[existingItemIndex].price += saveItem.price;
    } else {
      cart.push(saveItem);
    }

    localStorage.setItem('cartInfo', JSON.stringify(cart));
    setShowNotification(true);

    // Thêm dòng này để thông báo giỏ hàng đã thay đổi
    window.dispatchEvent(new Event('cartUpdated'));
  };

  useEffect(() => {
    if (showNotification) {
      const timer = setTimeout(() => {
        setShowNotification(false);
      }, 3000); // Hide notification after 3 seconds

      return () => clearTimeout(timer);
    }
  }, [showNotification]);

  const handleRecommendationClick = (itemId) => {
    window.location.href = `/product/${itemId}`;
  };

  if (apiStatus === 'loading') {
    return <PuffLoader className='loader' color="#1dc483" />;
  } else if (apiStatus === 'error') {
    return <Navigate to="/not-found" />;
  } else if (apiStatus === 'success') {
    return (
      <>
        {showNotification && (
          <div className="notification">
            Sản phẩm đã được thêm vào giỏ hàng thành công!
          </div>
        )}
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
                    <Link to={'/cart'} className="bottom-text">Sản phẩm</Link>
                  </div>
                </div>
              </div>
              <form className="form-buy">
                <div className="left-buy">
                  <div className="quantity">
                    <h3>Số lượng</h3>
                    <input
                      type="number"
                      value={quantity}
                      min={1}
                      max={availableQuantity}
                      name='quantity'
                      onChange={(e) => setQuantity(Math.min(parseInt(e.target.value), availableQuantity))}
                    />
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
                    <p className='type-text'>{getFoodTypeInVietnamese(data.foodType)}</p>
                  </div>
                  <div className="stock">
                    <h3 >Tồn kho</h3>
                    <p className='type-text stock-text'>{availableQuantity}</p>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
        <div className="bottom-item">
          <div className="container">
            <div className="bottom-left">
              <h3>LỢI ÍCH CỦA THỰC PHẨM</h3>
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
                    ads.map((item, i) => (
                      <li key={i}>
                        <Link
                          to={`/product/${item._id}`}
                          onClick={(e) => {
                            e.preventDefault(); // Ngăn chặn hành vi mặc định của Link
                            handleRecommendationClick(item._id);
                          }}
                        >
                          <RecommendItem props={item} />
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
    );
  }
}

export default Item
