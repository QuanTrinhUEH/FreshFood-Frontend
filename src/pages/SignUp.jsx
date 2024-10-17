import React, { useEffect, useState } from 'react';
import '../css/SignForm.scss';
import NavForm from '../components/NavForm';
import { useNavigate } from 'react-router-dom';
import { fetchAPI, fetchIMG } from '../../fetchApi.js';

const SignUp = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem('user') !== null) {
      navigate('/');
    }
  }, [navigate]);

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (password.length < 8) {
      setError('Mật khẩu phải có ít nhất 8 ký tự');
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp');
      setLoading(false);
      return;
    }

    let formData = new FormData();
    formData.append('email', email);
    formData.append('username', username);
    formData.append('password', password);

    try {
      const response = await fetchIMG('/user/register', 'POST', formData);
      if (response.status === 201) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('refreshToken', response.data.refreshToken);
        localStorage.removeItem('cart');
        setLoading(false);
        navigate(0);
      } else {
        setError('Đăng ký không thành công');
        setLoading(false);
      }
    } catch (err) {
      setError('Có lỗi xảy ra, vui lòng thử lại');
      setLoading(false);
    }
  };

  return (
    <div className="log-form-container">
      <div className="log-form">
        <div className="nav-top">
          <NavForm />
        </div>
        <div className="auth-container">
          <h2>Đăng ký</h2>
          <form onSubmit={handleRegister}>
            <div className="input-group">
              <label htmlFor="name">Họ và tên</label>
              <input
                type="text"
                id="name"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="input-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="input-group">
              <label htmlFor="password">Mật khẩu</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="input-group">
              <label htmlFor="confirmPassword">Xác nhận mật khẩu</label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            {error && <p className="error">{error}</p>}
            <button type="submit" disabled={loading}>
              {loading ? 'Đang đăng ký...' : 'Đăng ký'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
