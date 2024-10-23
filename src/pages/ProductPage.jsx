import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import '../css/ProductPage.scss';
import { fetchAPI } from '../../fetchApi';
import { PuffLoader } from 'react-spinners';

const ProductPage = () => {
  const { category } = useParams();
  let categoryName = "";
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Hàm dùng để xử lý mô tả sản phẩm
  const processDescription = (description, expanded) => {
    // Loại bỏ các phần tử trong ngoặc vuông
    const cleanDescription = description.replace(/\[.*?\]/g, '');
    // Chia đoạn mô tả thành các dòng
    const lines = cleanDescription.split('\\n');

    // Giới hạn ký tự hiển thị nếu không mở rộng
    const limit = 100;
    const shortDescription = lines.join(' ').slice(0, limit);

    if (expanded) {
      // Nếu mở rộng, hiển thị toàn bộ mô tả
      return lines.map((line, index) => (
        <React.Fragment key={index}>
          {line}
          <br />
        </React.Fragment>
      ));
    } else {
      // Nếu không mở rộng, hiển thị mô tả giới hạn ký tự
      return (
        <React.Fragment>
          {shortDescription}...
        </React.Fragment>
      );
    }
  };

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const response = category != "all" ? await fetchAPI(`/item/get-type/${category}/1`, 'GET') : await fetchAPI(`/item/get-all`, 'GET');
      if (response.data && Array.isArray(response.data.items)) {
        const processedItems = response.data.items.map(item => {
          // Xử lý mô tả sản phẩm
          const processedDescription = processDescription(item.description);
          return { ...item, description: processedDescription };
        });
        setProducts(processedItems);
      }

      setLoading(false);
    };
    fetchProducts();
  }, [category]);
  console.log(products)

  switch (category) {
    case "fruits":
      categoryName = "Hoa quả sạch";
      break;
    case "vegetables":
      categoryName = "Rau sạch";
      break;
    case "meats":
      categoryName = "Thịt sạch";
      break;
    case "seafood":
      categoryName = "Hải sản sạch";
      break;
    default:
      categoryName = "Tất cả";
      break;
  }

  return (loading ? (<div style={{
    margin: "120px 0",
    marginLeft: "50%",
  }}>
    <PuffLoader color="#1dc483" />
  </div>) : (
    <div className="product-page">
      <h1>{categoryName === 'all' ? 'Tất cả sản phẩm' : `Sản phẩm: ${categoryName}`}</h1>
      <div className="products-container">
        {products.map((product) => (
          <Link to={`/product/${product.ID}`} key={product.ID} className="product-link">
            <div className="product-card">
              <img src={`${product.images[0]}`} alt={product.name} className="product-image" />
              <div className="product-details">
                <h2>{product.itemName}</h2>
                <p>{product.description}</p>
                <p className="product-price">{product.price}</p>
                <p className="product-quantity">Số lượng: {product.quantity}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  ));
};

export default ProductPage;
