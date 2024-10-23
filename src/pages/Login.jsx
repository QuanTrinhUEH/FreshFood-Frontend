import React, { useEffect, useState } from 'react'
import '../css/SignForm.scss'
import NavForm from '../components/NavForm'
import { useNavigate } from 'react-router-dom';
import { fetchAPI } from '../../fetchApi';

const Login = () => {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (localStorage.getItem('userInfo') !== null) {
            navigate('/')
        }
    }, [])

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            console.log(phoneNumber, password)
            const response = await fetchAPI('/user/login', 'POST', {
                phoneNumber,
                password
            })

            if (response.status === 200) {
                console.log("res", response)
                localStorage.setItem('userInfo', JSON.stringify(response.data.user))
                localStorage.setItem('tokenInfo', response.data.token)
                localStorage.setItem('refreshTokenInfo', response.data.refreshToken)
                localStorage.removeItem('cart');
                setLoading(false)
                navigate('/')
            }
            else if (response.status === 403) {
                setError('Sai tài khoản hoặc mật khẩu')
                setLoading(false)
            }
            else {
                setError('Đăng nhập không thành công');
                setLoading(false)
            }
        }
        catch (e) {
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

export default Login