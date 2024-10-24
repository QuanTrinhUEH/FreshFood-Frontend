import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import "../css/Management.scss";
import ManagementItems from '../components/ManagementItems';
import { IoSearch } from "react-icons/io5";
import UpdateProductForm from '../components/UpdateProductForm';
import { fetchAPI, fetchAPIWithoutBody } from '../../fetchApi';
import { useNavigate } from 'react-router-dom';

function Management() {
    const [products, setProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [status, setStatus] = useState('');
    const [totalPages, setTotalPages] = useState(1);
    const [selectedProduct, setSelectedProduct] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        fetchProducts();
    }, [page, pageSize, status]);

    const fetchProducts = async () => {
        try {
            const queryParams = new URLSearchParams({
                page,
                pageSize,
                search: searchTerm,
                ...(status !== '' && { status })
            }).toString();

            const response = await fetchAPIWithoutBody(`/item/management?${queryParams}`, 'GET', localStorage.getItem('tokenInfo'));
            console.log(response)
            if (response.success === true) {
                setProducts(response.data.items);
                setTotalPages(response.data.totalPages);
            }
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    const handleSearch = () => {
        setPage(1);
        fetchProducts();
    };

    const handleEdit = (product) => {
        setSelectedProduct(product);
    };

    const handleCloseFrame = () => {
        setSelectedProduct(null);
    };

    const handleStatusChange = async (productId, newStatus) => {
        try {
            const response = await fetchAPI(`/item/${productId}`, 'PATCH', { status: newStatus }, localStorage.getItem('tokenInfo'));
            if (response.status === 200) {
                // Update the product status in the local state
                setProducts(prevProducts => 
                    prevProducts.map(product => 
                        product._id === productId ? { ...product, status: newStatus } : product
                    )
                );
                Swal.fire({
                    icon: 'success',
                    title: 'Trạng thái đã được cập nhật',
                    showConfirmButton: false,
                    timer: 1500
                });
            } else {
                throw new Error(response.message || 'Có lỗi xảy ra khi cập nhật trạng thái');
            }
        } catch (error) {
            console.error('Error updating product status:', error);
            Swal.fire({
                icon: 'error',
                title: 'Lỗi',
                text: error.message || 'Có lỗi xảy ra khi cập nhật trạng thái',
            });
        }
    };

    const handleUpdateSuccess = (updatedProduct) => {
        setProducts(prevProducts => 
            prevProducts.map(product => 
                product._id === updatedProduct._id ? updatedProduct : product
            )
        );
        setSelectedProduct(null);
        Swal.fire({
            icon: 'success',
            title: 'Sản phẩm đã được cập nhật thành công',
            showConfirmButton: false,
            timer: 1500
        });
    };

    const handleQuantityChange = async (productId, newQuantity) => {
        try {
            const response = await fetchAPI(`/item/${productId}`, 'PATCH', { quantity: newQuantity }, localStorage.getItem('tokenInfo'));
            if (response.status === 200) {
                setProducts(prevProducts => 
                    prevProducts.map(product => 
                        product._id === productId ? { ...product, quantity: newQuantity } : product
                    )
                );
                Swal.fire({
                    icon: 'success',
                    title: 'Số lượng đã được cập nhật',
                    showConfirmButton: false,
                    timer: 1500
                });
            } else {
                throw new Error(response.message || 'Có lỗi xảy ra khi cập nhật số lượng');
            }
        } catch (error) {
            console.error('Error updating product quantity:', error);
            Swal.fire({
                icon: 'error',
                title: 'Lỗi',
                text: error.message || 'Có lỗi xảy ra khi cập nhật số lượng',
            });
        }
    };

    console.log("products", products)

    return (
        <div className="product-management content-container">
            <h1>Quản lý sản phẩm</h1>
            <div className="search-bar">
                <input
                    type="text"
                    placeholder="Nhập tên sản phẩm..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button onClick={handleSearch}><IoSearch /></button>
            </div>
            <div className="filter-options">
                <select value={status} onChange={(e) => setStatus(e.target.value)}>
                    <option value="">Tất cả trạng thái</option>
                    <option value="0">Không hoạt động</option>
                    <option value="1">Hoạt động</option>
                </select>
                <select value={pageSize} onChange={(e) => setPageSize(Number(e.target.value))}>
                    <option value="10">10 sản phẩm/trang</option>
                    <option value="20">20 sản phẩm/trang</option>
                    <option value="50">50 sản phẩm/trang</option>
                </select>
            </div>
            <div className="product-list">
                {products.length > 0 ? (
                    <table>
                        <thead>
                            <tr>
                                <th>Tên sản phẩm</th>
                                <th>Ảnh sản phẩm</th>
                                <th>Giá sản phẩm</th>
                                <th>Trạng thái</th>
                                <th>Số lượng</th>
                                <th>Chức năng</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((product, i) => (
                                <ManagementItems 
                                    key={i} 
                                    product={product} 
                                    onStatusChange={handleStatusChange} 
                                    onEdit={handleEdit} 
                                    onQuantityChange={handleQuantityChange} 
                                />
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>Không tìm thấy sản phẩm</p>
                )}
            </div>
            <div className="pagination">
                <button onClick={() => setPage(prev => Math.max(prev - 1, 1))} disabled={page === 1}>Trang trước</button>
                <span>Trang {page} / {totalPages}</span>
                <button onClick={() => setPage(prev => Math.min(prev + 1, totalPages))} disabled={page === totalPages}>Trang sau</button>
            </div>
            {selectedProduct && (
                <div className='update-frame'>
                    <UpdateProductForm 
                        product={selectedProduct} 
                        onClose={handleCloseFrame} 
                        onUpdateSuccess={handleUpdateSuccess} 
                    />
                </div>
            )}
        </div>
    );
}

export default Management;
