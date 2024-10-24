import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import "../css/Management.scss";
import { IoSearch } from "react-icons/io5";
import { fetchAPI, fetchAPIWithoutBody } from '../../fetchApi';
import { useNavigate } from 'react-router-dom';
import PromotionItems from '../components/PromotionItems';
import UpdatePromotionForm from '../components/UpdatePromotionForm';

function PromotionManagement() {
    const [promotions, setPromotions] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [status, setStatus] = useState('');
    const [totalPages, setTotalPages] = useState(1);
    const [selectedPromotion, setSelectedPromotion] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        fetchPromotions();
    }, [page, pageSize, status]);

    const fetchPromotions = async () => {
        try {
            const queryParams = new URLSearchParams({
                page,
                pageSize,
                search: searchTerm,
                ...(status !== '' && { status })
            }).toString();

            const response = await fetchAPIWithoutBody(`/promotion/?${queryParams}`, 'GET', localStorage.getItem('tokenInfo'));
            if (response.success === true) {
                setPromotions(response.data.promotions);
                setTotalPages(response.data.totalPages);
            }
        } catch (error) {
            console.error('Error fetching promotions:', error);
        }
    };

    const handleSearch = () => {
        setPage(1);
        fetchPromotions();
    };

    const handleEdit = (promotion) => {
        setSelectedPromotion(promotion);
    };

    const handleCloseFrame = () => {
        setSelectedPromotion(null);
        fetchPromotions();
    };

    const handleStatusChange = async (promotionId, newStatus) => {
        try {
            const response = await fetchAPI(`/promotion/${promotionId}`, 'PATCH', { status: newStatus }, localStorage.getItem('tokenInfo'));
            if (response.status === 200) {
                // Update the product status in the local state
                setPromotions(prevPromotions =>
                    prevPromotions.map(promotion =>
                        promotion._id === promotionId ? { ...promotion, status: newStatus } : promotion
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
            console.error('Error updating promotion status:', error);
            Swal.fire({
                icon: 'error',
                title: 'Lỗi',
                text: error.message || 'Có lỗi xảy ra khi cập nhật trạng thái',
            });
        }
    };

    return (
        <div className="product-management content-container">
            <h1>Quản lý khuyến mãi</h1>
            <div className="search-bar">
                <input
                    type="text"
                    placeholder="Nhập tên khuyến mãi..."
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
                    <option value="10">10 khuyến mãi/trang</option>
                    <option value="20">20 khuyến mãi/trang</option>
                    <option value="50">50 khuyến mãi/trang</option>
                </select>
            </div>
            <div className="product-list">
                {promotions.length > 0 ? (
                    <table>
                        <thead>
                            <tr>
                                <th>Tên khuyến mãi</th>
                                <th>Phần trăm giảm giá</th>
                                <th>Ngày bắt đầu</th>
                                <th>Ngày kết thúc</th>
                                <th>Trạng thái</th>
                                <th>Chức năng</th>
                            </tr>
                        </thead>
                        <tbody>
                            {promotions.map((promotion, i) => (
                                <PromotionItems
                                    key={i}
                                    promotion={promotion}
                                    onStatusChange={handleStatusChange}
                                    onEdit={handleEdit}
                                />
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>Không tìm thấy khuyến mãi</p>
                )}
            </div>
            <div className="pagination">
                <button onClick={() => setPage(prev => Math.max(prev - 1, 1))} disabled={page === 1}>Trang trước</button>
                <span>Trang {page} / {totalPages}</span>
                <button onClick={() => setPage(prev => Math.min(prev + 1, totalPages))} disabled={page === totalPages}>Trang sau</button>
            </div>
            {selectedPromotion && (
                <div className='update-frame'>
                    <UpdatePromotionForm promotion={selectedPromotion} onClose={handleCloseFrame} />
                </div>
            )}
        </div>
    );
}

export default PromotionManagement;
