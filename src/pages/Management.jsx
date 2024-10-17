import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import "../css/Management.scss";
import ManagementItems from '../components/ManagementItems';
import { IoSearch } from "react-icons/io5";
import UpdateProductForm from '../components/UpdateProductForm';
import { fetchAPI } from '../../fetchApi';
import { useNavigate } from 'react-router-dom';


function Management() {
    const [products, setProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);

    const navigate = useNavigate()

    useEffect(() => {
        fetchAPI('/item/get-all/1', 'GET').then(e => {
            if (e.status === 200) {
                setProducts(e.data.items)
                setFilteredProducts(e.data.items)
            }
        })
    }, []);

    const handleSearch = () => {
        if (searchTerm.trim() === '') {
            setFilteredProducts(products); // Nếu không có từ khóa tìm kiếm, hiển thị tất cả sản phẩm
        } else {
            const results = products.filter(product => product.name.toLowerCase().includes(searchTerm.toLowerCase()));
            setFilteredProducts(results.length > 0 ? results : []); // Nếu có kết quả, hiển thị kết quả, nếu không, hiển thị mảng rỗng
        }
    };

    const handleDelete = (productId) => {
        Swal.fire({
            title: 'Bạn có chắc chắn muốn xóa sản phẩm này không?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Có, xóa nó!',
            cancelButtonText: 'Hủy',
        }).then((result) => {
            if (result.isConfirmed) {
                fetchAPI(`/item/delete/${productId}`, 'DELETE', [], localStorage.getItem('token')).then(e => console.log(e))

                Swal.fire(
                    {
                        icon: 'success',
                        title: 'Success',
                        text: 'Đã xóa thành công',
                        timer: 5000
                    }
                ).then(() => navigate(0))
            }
        });
    };

    const handleEdit = (product) => {
        setSelectedProduct(product);
    };

    const handleCloseFrame = () => {
        setSelectedProduct(null);
    }

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
            <div className="product-list">
                {products.length > 0 ? (
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Tên sản phẩm</th>
                                <th>Ảnh sản phẩm</th>
                                <th>Giá sản phẩm</th>
                                <th>Chức năng</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((product, i) => (
                                <ManagementItems key={i} product={product} onDelete={handleDelete} onEdit={handleEdit} />
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>Không tìm thấy sản phẩm</p>
                )}
            </div>
            {selectedProduct && (
                <div className='update-frame'>
                    <UpdateProductForm product={selectedProduct} onClose={handleCloseFrame} />
                </div>
            )}
        </div>
    );
}

export default Management;
