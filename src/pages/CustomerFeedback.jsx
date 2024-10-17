import React, { useState } from 'react';
import Swal from 'sweetalert2';
import '../css/CustomerFeedback.scss';

// Giả lập dữ liệu ý kiến khách hàng
const feedbacks = [
    { id: 1, name: 'John Doe', email: 'john@example.com', message: 'Great service!', read: false },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', message: 'Very satisfied with the product.', read: true },
    { id: 3, name: 'Alice Johnson', email: 'alice@example.com', message: 'Fast delivery and excellent support.', read: false },
];

const CustomerFeedback = () => {
    const [selectedFeedback, setSelectedFeedback] = useState(null);

    const handleViewDetail = (feedback) => {
        setSelectedFeedback(feedback);
        feedback.read = true; // Đánh dấu là đã đọc khi xem chi tiết

        Swal.fire({
            title: '<strong>Feedback Detail</strong>',
            html: `
                <p><strong>Name:</strong> ${feedback.name}</p>
                <p><strong>Email:</strong> ${feedback.email}</p>
                <p><strong>Message:</strong> ${feedback.message}</p>
            `,
            showCloseButton: true,
            showCancelButton: true,
            focusConfirm: false,
            confirmButtonText: 'Close',
            cancelButtonText: 'Mark as Unread',
        }).then((result) => {
            if (result.dismiss === Swal.DismissReason.cancel) {
                feedback.read = false; // Đánh dấu là chưa đọc khi người dùng chọn "Mark as Unread"
                setSelectedFeedback(null); // Cập nhật trạng thái để giao diện phản ánh thay đổi
            }
        });
    };

    return (
        <div className="customer-feedback-container content-container">
            <h1>Ý kiến từ khách hàng</h1>
            <ul className="feedback-list">
                {feedbacks.map(feedback => (
                    <li key={feedback.id} onClick={() => handleViewDetail(feedback)}>
                        <div className="feedback-info">
                            <div className="feedback-content">
                                <p><strong>{feedback.name}</strong></p>
                                <p>{feedback.email}</p>
                                <p>{feedback.message.substring(0, 50)}...</p>
                            </div>
                            <div className="checkbox">
                                <input type="checkbox" checked={feedback.read} readOnly />
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default CustomerFeedback;
