import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import "../css/ChangePassword.scss";
import { fetchAPI } from '../../fetchApi';

function ChangePassword() {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (!localStorage.getItem('userInfo') || !localStorage.getItem('tokenInfo')) {
            navigate('/')
        }
    }, [])

    const handleChangePassword = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Validate passwords
        if (newPassword !== confirmPassword) {
            setLoading(false);
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Mật khẩu xác nhận không khớp!',
                timer: 3000
            });
            return;
        }
        try {
            const data = await fetchAPI('/user/update/password', 'PUT', { password: oldPassword, newPassword }, localStorage.getItem('token'))
            if (data.status == 200) {
                localStorage.setItem('userInfo', JSON.stringify(data.data.user))
                localStorage.setItem('tokenInfo', data.data.token)
                localStorage.setItem('refreshTokenInfo', data.data.refreshToken)
                setLoading(false)   
                Swal.fire(
                    {
                        icon: 'success',
                        title: 'Success',
                        text: 'Đổi mật khẩu thành công',
                        timer: 3000
                    }
                ).then(() => navigate(0))
            }
            else if (data.status == 403) {
                Swal.fire(
                    {
                        icon: 'error',
                        title: 'Oops...',
                        text: 'Sai mật khẩu',
                        timer: 3000
                    }
                )
                setLoading(false)
                return
            }
        }
        catch(e) {
            Swal.fire(
                {
                    icon: 'error',
                    title: 'Oops...',
                    text: e.message,
                    timer: 3000
                }
            )
        }
    };

    return (
        <div className="change-password-container content-container">
            <h2>Thay Đổi Mật Khẩu</h2>
            <form onSubmit={handleChangePassword}>
                <div className="input-group">
                    <label htmlFor="oldPassword">Mật khẩu cũ</label>
                    <input
                        type="password"
                        id="oldPassword"
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                        required
                    />
                </div>
                <div className="input-group">
                    <label htmlFor="newPassword">Mật khẩu mới</label>
                    <input
                        type="password"
                        id="newPassword"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                    />
                </div>
                <div className="input-group">
                    <label htmlFor="confirmPassword">Xác nhận mật khẩu mới</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" disabled={loading}>
                    {loading ? 'Đang thay đổi...' : 'Thay đổi mật khẩu'}
                </button>
            </form>
        </div>
    );
}

export default ChangePassword;
