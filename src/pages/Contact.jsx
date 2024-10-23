import React, { useState } from 'react';
import "../css/Contact.scss"
import { fetchAPI } from '../../fetchApi';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

function Contact() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    feedback: ''
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = await fetchAPI('/feedback/submit', 'POST', formData, localStorage.getItem('tokenInfo'))
    if (data.status == 201) {
      Swal.fire(
        {
          icon: 'success',
          title: 'Success',
          text: 'Gửi phản hồi thành công',
          timer: 3000
        }
      ).then(() => navigate('/'))
    } else {
      Swal.fire(
        {
          icon: 'error',
          title: 'Oops...',
        }
      )
    }
  };

  return (
    <form className='contact-container' onSubmit={handleSubmit}>
      <h2>LIÊN HỆ</h2>
      <div className="contact-info">
        <label htmlFor="feedback">Nội dung</label>
        <textarea
          id='feedback'
          value={formData.feedback}
          onChange={handleChange}
          rows={10}
          cols={50}
        />
      </div>
      <div className="submit">
        <button type="submit" className='submit-btn'>Gửi</button>
      </div>
    </form>
  );
}

export default Contact;
