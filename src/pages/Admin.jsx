import React from 'react';
import AdminNavbar from '../components/AdminNavbar.jsx';
import "../css/Admin.scss";
import { Route, Routes, Navigate } from 'react-router-dom';
import Create from './Create.jsx';
import Management from './Management.jsx';
import CustomerFeedback from './CustomerFeedback.jsx';
import PromotionManagement from './PromotionManagement.jsx';
import CreatePromotion from './CreatePromotion.jsx';
import OrderManagement from './OrderManagement.jsx';
function Admin() {
    return (
        <div className='admin-container'>
            <div className='admin-navbar'>
                <AdminNavbar />
            </div>
            <div className='admin-content'>
                <Routes>
                    <Route path='/' element={<Navigate to="/admin/createItem" />} />
                    <Route path='/createItem' element={<Create />}></Route>
                    <Route path='/createPromotion' element={<CreatePromotion />}/>
                    <Route path='/management' element={<Management />}></Route>
                    <Route path="/promotions" element={<PromotionManagement />} />
                    <Route path="/orderManagement" element={<OrderManagement />} />
                    <Route path='/feedback' element={<CustomerFeedback />}/>
                </Routes>
            </div>
        </div>
    );
}

export default Admin;
