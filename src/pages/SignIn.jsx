import React, { useEffect, useState } from 'react'
import '../css/SignForm.scss'
import NavForm from '../components/NavForm'
import { useNavigate } from 'react-router-dom';
import { fetchAPI } from '../../fetchApi';

const SignIn = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (localStorage.getItem('user') !== null) {
            navigate('/')
        }
    }, [])

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            console.log(email, password)
            const response = await fetchAPI('/user/login', 'POST', {
                email,
                password
            })

            if (response.status === 200) {
                console.log("res", response)
                localStorage.setItem('user', JSON.stringify(response.data.user))
                localStorage.setItem('token', response.data.token)
                localStorage.setItem('refreshToken', response.data.refreshToken)
                localStorage.removeItem('cart');
                setLoading(false)
                navigate(0)
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

export default SignIn