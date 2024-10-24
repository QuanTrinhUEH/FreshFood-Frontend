import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import '../css/ProductPage.scss';
import { fetchAPIWithoutBody } from '../../fetchApi';
import { PuffLoader } from 'react-spinners';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';

const ProductPage = () => {
  const { category } = useParams();
  let categoryName = "";
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(12);

  // Hàm dùng để xử lý mô tả sản phẩm
  const processDescription = (description) => {
    if (!description) return ''; 
    const lines = description.split('\\n');
    const limit = 60;
    const shortDescription = lines.join(' ').slice(0, limit);
    return <>{shortDescription}...</>;
  };

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const endpoint = category !== "all" 
        ? `/item/foodType/${category}?page=${page}&pageSize=${itemsPerPage}`
        : `/item/?page=${page}&pageSize=${itemsPerPage}`;
      
      const response = await fetchAPIWithoutBody(endpoint, 'GET');
      
      if (response.data && Array.isArray(response.data.items)) {
        const processedItems = response.data.items.map(item => ({
          ...item,
          description: processDescription(item.description)
        }));
        setProducts(processedItems);
        setTotalPages(response.data.totalPages || 1);
      }
      setLoading(false);
    };
    fetchProducts();
  }, [category, page, itemsPerPage]);

  const handleChangePage = (event, value) => {
    setPage(value);
  };

  const handleItemsPerPageChange = (event) => {
    const value = parseInt(event.target.value, 10);
    if (!isNaN(value) && value > 0) {
      setItemsPerPage(value);
      setPage(1); // Reset to first page when changing items per page
    }
  };

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

  return (loading ? (
    <div style={{ margin: "120px 0", marginLeft: "50%" }}>
      <PuffLoader color="#1dc483" />
    </div>
  ) : (
    <div className="product-page">
      <h1>{categoryName === 'all' ? 'Tất cả sản phẩm' : `Sản phẩm: ${categoryName}`}</h1>
      <div className="pagination-controls">
        <label htmlFor="itemsPerPage">Số sản phẩm mỗi trang:</label>
        <input
          type="number"
          id="itemsPerPage"
          value={itemsPerPage}
          onChange={handleItemsPerPageChange}
          min="1"
        />
      </div>
      <div className="products-container">
        {products.map((product) => (
          <Link to={`/product/${product._id}`} key={product._id} className="product-link">
            <div className="product-card">
              <img src={`${product.images[0]}`} alt={product.name} className="product-image" />
              <div className="product-details">
                <div className="product-name">
                  <h2 className="product-info">{product.itemName}</h2>
                  <p className="product-info product-description">{product.description}</p>
                </div>
                <div className="product-number">
                  <p className="product-info product-price">{product.price}</p>
                  <p className="product-info">Số lượng: {product.quantity}</p>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
      <Stack spacing={2} alignItems="center" className="pagination">
        <Pagination 
          count={totalPages} 
          page={page} 
          onChange={handleChangePage} 
          color="primary"
        />
      </Stack>
    </div>
  ));
};

export default ProductPage;
