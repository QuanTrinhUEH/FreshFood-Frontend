import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import '../css/ProfileUpdate.scss';
import { useNavigate } from 'react-router-dom';
import { fetchIMG, fetchAPIWithoutBody, fetchAPI } from '../../fetchApi.js';

const ProfileUpdate = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('userInfo')));
  const [token, setToken] = useState(localStorage.getItem('tokenInfo'));

  useEffect(() => {
    if (!user || !token)
      navigate('/');
  }, []);

  const [userName, setUserName] = useState(user?.userName || '');
  const [avatarUrl, setAvatarUrl] = useState(user?.profilePicture || '');
  const [avatar, setAvatar] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setLoading(true);
      setError('');
      try {
        const formData = new FormData();
        formData.append('image', file, file.name);

        const response = await fetchIMG('/upload', 'POST', formData, token);
        console.log(response);

        if (response.status === 200) {
          const avatarURL = response.data.fileUrl; // Assuming the API returns an array of image URLs
          setAvatarUrl(avatarURL);
          setAvatar(file);
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Avatar đã được tải lên thành công',
            timer: 3000
          });
        } else {
          throw new Error(response.message || 'Upload failed');
        }
      } catch (err) {
        console.error('Error:', err.message);
        setError('Có lỗi xảy ra khi tải lên avatar, vui lòng thử lại');
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: err.message || 'Có lỗi xảy ra khi tải lên avatar, vui lòng thử lại',
          timer: 3000
        });
      } finally {
        setLoading(false);
      }
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const updateData = {
      userName: userName,
      profileImage: avatarUrl
    }
    try {
      const getUpdatedUser = await fetchAPIWithoutBody('/user/me', 'GET', token);
      const response = await fetchAPI(
        `/user/profile/${getUpdatedUser.data.user._id}`, 
        'PUT', 
        updateData,
        token,
        { 'Content-Type': 'application/json' }
      );

      if (response.status === 201) {
        const updatedUser = { ...user, ...response.data.user };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
        setLoading(false);
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Thay đổi thông tin thành công',
          timer: 3000
        }).then(() => navigate(0));
      } else {
        setError('Thay đổi không thành công');
        setLoading(false);
      }
    } catch (err) {
      console.log(err);
      setError('Có lỗi xảy ra, vui lòng thử lại');
      setLoading(false);
    }
  };

  return (
    <div className="profile-update-container content-container">
      <h2>Cập Nhật Thông Tin Cá Nhân</h2>
      <form onSubmit={handleUpdate}>
        <div className="input-group">
          <label htmlFor="name">Họ và tên</label>
          <input
            type="text"
            id="name"
            name="name"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            required
          />
        </div>
        <div className="input-group">
          <label htmlFor="avatar">Avatar</label>
          <input
            type="file"
            id="avatar"
            accept="image/*"
            onChange={handleAvatarChange}
          />
        </div>
        {avatar && (
          <div className="avatar-preview">
            <img src={avatarUrl} alt="Avatar Preview" />
          </div>
        )}
        {error && <p className="error">{error}</p>}
        <button type="submit" disabled={loading}>
          {loading ? 'Đang cập nhật...' : 'Cập nhật'}
        </button>
      </form>
    </div>
  );
};

export default ProfileUpdate;
