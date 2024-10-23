import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import '../css/ProfileUpdate.scss';
import { useNavigate } from 'react-router-dom';
import { fetchIMG } from '../../fetchApi.js';

const ProfileUpdate = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
    } else {
      navigate('/');
    }
  }, [navigate]);

  const [username, setUsername] = useState(user?.username || '');
  const [avatarUrl, setAvatarUrl] = useState(user?.profile_picture || '');
  const [avatar, setAvatar] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    setAvatar(file);
    if (file && file.type.startsWith('image/')) {
      const avatarURL = URL.createObjectURL(file);
      setAvatarUrl(avatarURL);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const formData = new FormData();
      if (avatar) {
        formData.append('avatar', avatar, avatar.name);
      }
      formData.append('username', username);

      const response = await fetchIMG('/user/update/profile', 'PUT', formData, token);

      if (response.status === 201) {
        const updatedUser = {...user, ...response.data.user};
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
            value={username}
            onChange={(e) => setUsername(e.target.value)}
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
