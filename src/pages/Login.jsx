import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setUser } from '../store/userSlice';
import { fetchAPI } from '../../fetchApi.js';
import NavForm from '../components/NavForm.jsx';

const Login = () => {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [password, setPassword] = useState('');
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

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await fetchAPI('/user/login', 'POST', {
                phoneNumber,
                password
            })

            if (response.status === 200) {
                dispatch(setUser(response.data.user));
                setLoading(false);
                navigate('/');
            } else if (response.status === 403) {
                setError('Sai tài khoản hoặc mật khẩu')
                setLoading(false)
            } else {
                setError(response.error || 'Đăng nhập không thành công');
                setLoading(false)
            }
        } catch (e) {
            setError('Có lỗi xảy ra, vui lòng thử lại');
            setLoading(false)
        }
    };

    return (
        <div className="log-form-container">
            <div className="log-form">
                <div className="nav-top">
                    <NavForm />
                </div>
                <div className="auth-container">
                    <h2>Đăng nhập</h2>
                    <form onSubmit={handleLogin}>
                        <div className="input-group">
                            <label htmlFor="phoneNumber">phoneNumber</label>
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
                        {error && <p className="error">{error}</p>}
                        <button type="submit" disabled={loading}>
                            {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Login;
