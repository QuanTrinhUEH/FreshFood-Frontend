import React, { useState } from 'react';
import "../css/Contact.scss"

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    content: ''
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Xử lý dữ liệu form khi submit
    console.log('Form data submitted:', formData);
    // Bạn có thể thêm mã để gửi dữ liệu tới server ở đây
  };

  return (
    <form className='contact-container' onSubmit={handleSubmit}>
      <h2>LIÊN HỆ</h2>
      <div className="contact-info">
        <label htmlFor="name">Họ và tên</label>
        <input
          type="text"
          id='name'
          value={formData.name}
          onChange={handleChange}
        />
      </div>
      <div className="contact-info">
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id='email'
          value={formData.email}
          onChange={handleChange}
        />
      </div>
      <div className="contact-info">
        <label htmlFor="content">Nội dung</label>
        <textarea
          id='content'
          cols={50}
          rows={4}
          value={formData.content}
          onChange={handleChange}
        />
      </div>
      <div className="submit">
        <button type="submit" className='submit-btn'>Gửi</button>
      </div>
    </form>
  );
}

export default Contact;
