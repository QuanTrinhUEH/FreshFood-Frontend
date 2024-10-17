import React from 'react';
import "../css/Admin.scss";
import ChangePassword from './ChangePassword';
import ProfileUpdate from './Profile';
import AccountNavbar from '../components/AccountNavbar';
import { Navigate, Route, Routes } from 'react-router-dom';

function Account() {
    return (
        <div className='account-container'>
            <div className='account-navbar'>
                <AccountNavbar />
            </div>
            <div className='admin-content'>
                <Routes>
                    <Route path='/' element={<Navigate to="/account/profileUpdate" />} />
                    <Route path='/profileUpdate' element={<ProfileUpdate />}></Route>
                    <Route path='/changePassword' element={<ChangePassword />}></Route>
                </Routes>
            </div>
        </div>
    );
}

export default Account
