import React, { useEffect, useState } from 'react';
import '../css/SignForm.scss';
import NavForm from '../components/NavForm.jsx';
import { useNavigate } from 'react-router-dom';
import { fetchAPI } from '../../fetchApi.js';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from '../store/userSlice.js';

const Register = () => {
  const [userName, setUserName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector(state => state.user);

  useEffect(() => {
    if (user !== null) {
      navigate('/')
    }
  }, [user, navigate]);

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

    const userData = {
      userName: userName,
      phoneNumber: phoneNumber,
      password: password,
    };

    try {
      const response = await fetchAPI('/user/register', 'POST', userData);
      if (response.status === 201) {
        dispatch(setUser(response.data.user));
        setLoading(false);
        navigate('/');
      } else {
        setError(response.message || 'Đăng ký không thành công');
        setLoading(false);
      }
    } catch (err) {
      console.log(err)
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
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                required
              />
            </div>
            <div className="input-group">
              <label htmlFor="phoneNumber">Số điện thoại</label>
              <input
                type="tel"
                id="phoneNumber"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
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

export default Register;
