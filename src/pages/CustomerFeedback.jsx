import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import '../css/CustomerFeedback.scss';
import { fetchAPI, fetchAPIWithoutBody } from '../../fetchApi';

const CustomerFeedback = () => {
    const [feedbacks, setFeedbacks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchFeedbacks();
    }, []);

    const fetchFeedbacks = async () => {
        try {
            const response = await fetchAPIWithoutBody('/feedback/', 'GET', localStorage.getItem('tokenInfo'));
            if (response.success) {
                if (response.success && Array.isArray(response.data.feedbacks)) {
                    setFeedbacks(response.data.feedbacks);
                } else {
                    console.error('Unexpected data structure:', response.data);
                    throw new Error('Unexpected data structure received from API');
                }
            } else {
                throw new Error(response.message || 'Failed to fetch feedbacks');
            }
        } catch (error) {
            console.error('Error fetching feedbacks:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to load feedbacks. Please try again later.',
            });
        } finally {
            setLoading(false);
        }
    };

    const updateFeedbackStatus = async (feedbackId, newStatus) => {
        try {
            const response = await fetchAPI(`/feedback/status/${feedbackId}`, 'PATCH', { status: newStatus }, localStorage.getItem('tokenInfo'));
            if (response.status === 200) {
                setFeedbacks(feedbacks.map(feedback =>
                    feedback._id === feedbackId ? { ...feedback, status: newStatus } : feedback
                ));
                return true;
            } else {
                throw new Error(response.message || 'Failed to update feedback status');
            }
        } catch (error) {
            console.error('Error updating feedback status:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Cập nhật trạng thái phản hồi không thành công',
            });
            return false;
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'pending': return 'Chờ xử lý';
            case 'reviewed': return 'Đã xem';
            case 'responded': return 'Đã hồi đáp';
            default: return status;
        }
    };

    const handleViewDetail = async (feedback) => {
        try {
            const feedbackDetail = await fetchAPIWithoutBody(`/feedback/${feedback._id}`, 'GET', localStorage.getItem('tokenInfo'));

            if (feedbackDetail.status === 200) {

                Swal.fire({
                    title: '<strong>Chi tiết Phản hồi</strong>',
                    html: `
                        <p><strong>Tên người dùng:</strong> ${feedbackDetail.data.feedback[0].user?.userName}</p>
                        <p><strong>Số điện thoại:</strong> ${feedbackDetail.data.feedback[0].user?.phoneNumber}</p>
                        <p><strong>Nội dung phản hồi:</strong> ${feedback.feedback}</p>
                        <p><strong>Trạng thái:</strong> ${getStatusText(feedback.status)}</p>
                    `,
                    showCloseButton: true,
                    showCancelButton: true,
                    focusConfirm: false,
                    confirmButtonText: 'Đóng',
                    cancelButtonText: 'Cập nhật trạng thái',
                }).then((result) => {
                    if (result.dismiss === Swal.DismissReason.cancel) {
                        Swal.fire({
                            title: 'Cập nhật trạng thái phản hồi',
                            input: 'select',
                            inputOptions: {
                                'pending': 'Chờ xử lý',
                                'reviewed': 'Đã xem',
                                'responded': 'Đã hồi đáp'
                            },
                            inputPlaceholder: 'Chọn một trạng thái',
                            showCancelButton: true,
                            cancelButtonText:"Hủy",
                            inputValidator: (value) => {
                                return new Promise((resolve) => {
                                    if (value === feedback.status) {
                                        resolve('Hãy chọn một trạng thái khác');
                                    } else {
                                        resolve();
                                    }
                                });
                            }
                        }).then((result) => {
                            if (result.isConfirmed) {
                                updateFeedbackStatus(feedback._id, result.value).then(success => {
                                    if (success) {
                                        Swal.fire('Đã cập nhật!', 'Trạng thái của phản hồi đã được cập nhật', 'thành công');
                                    }
                                });
                            }
                        });
                    }
                });
            }
        } catch (error) {
            console.error("Error fetching feedback details:", error);
        }
    };

    if (loading) {
        return <div className="customer-feedback-container content-container">Loading...</div>;
    }

    return (
        <div className="customer-feedback-container content-container">
            <h1>Ý kiến từ khách hàng</h1>
            {feedbacks.length > 0 ? (
                <ul className="feedback-list">
                    {feedbacks.map(feedback => (
                        <li key={feedback._id} onClick={() => handleViewDetail(feedback)}>
                            <div className="feedback-info">
                                <div className="feedback-content">
                                    <p><strong>{feedback.name}</strong></p>
                                    <p>{feedback.email}</p>
                                    <p>{feedback.feedback.substring(0, 50)}...</p>
                                </div>
                                <div className="feedback-status">
                                    <span className={`status-badge ${feedback.status}`}>{getStatusText(feedback.status)}</span>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No feedbacks available.</p>
            )}
        </div>
    );
};

export default CustomerFeedback;
