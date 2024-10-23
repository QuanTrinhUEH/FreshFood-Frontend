import React, { useState, useEffect } from 'react';
import { Form, Input, InputNumber, DatePicker, Button, message, Select } from 'antd';
import { IoClose } from "react-icons/io5";
import dayjs from 'dayjs'; // Import dayjs
import "../css/UpdateProductForm.scss";
import { fetchAPI, fetchAPIWithoutBody } from '../../fetchApi.js';

const { TextArea } = Input;
const { RangePicker } = DatePicker;
const { Option } = Select;

const UpdatePromotionForm = ({ promotion, onClose, onUpdateSuccess }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [allProducts, setAllProducts] = useState([]);

    useEffect(() => {
        fetchAllProducts();
    }, []);

    const fetchAllProducts = async () => {
        try {
            const response = await fetchAPIWithoutBody('/item/management?pageSize=100', 'GET', localStorage.getItem('tokenInfo'));
            if (response.success) {
                setAllProducts(response.data.items);
                console.log("response:", response);
            } else {
                message.error('Không thể tải danh sách sản phẩm');
            }
        } catch (error) {
            console.error('Error fetching products:', error);
            message.error('Có lỗi xảy ra khi tải danh sách sản phẩm');
        }
    };
    console.log("allProducts:", allProducts);

    const handleUpdate = async (values) => {
        setLoading(true);
        try {
            const updateData = {
                ...values,
                startDate: values.dateRange[0].format('YYYY-MM-DD'),
                endDate: values.dateRange[1].format('YYYY-MM-DD'),
                applicableItems: values.applicableItems
            };
            delete updateData.dateRange;

            console.log("Update data:", updateData);

            const response = await fetchAPI(`/promotion/${promotion._id}`, 'PATCH', updateData, localStorage.getItem('tokenInfo'));

            console.log("Response:", response);

            if (response.status === 200) {
                message.success('Cập nhật khuyến mãi thành công');
                if (typeof onUpdateSuccess === 'function') {
                    onUpdateSuccess(response.data);
                }
                onClose();
            } else {
                throw new Error(response.message || 'Có lỗi xảy ra khi cập nhật khuyến mãi');
            }
        } catch (error) {
            console.error('Error updating promotion:', error);
            message.error(error.message || 'Có lỗi xảy ra khi cập nhật khuyến mãi');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="update-container">
            <div className="update-header">
                <p className='update-title'>Cập Nhật Khuyến Mãi</p>
                <div className="form-close-btn-div">
                    <Button icon={<IoClose />} onClick={onClose} type="text" className="form-close-btn" />
                </div>
            </div>
            <div className="update-form-scroll">
                <Form
                    form={form}
                    layout="vertical"
                    initialValues={{
                        ...promotion,
                        dateRange: [
                            dayjs(promotion.startDate),
                            dayjs(promotion.endDate)
                        ],
                        applicableItems: promotion.applicableItems.map(item => item._id)
                    }}
                    onFinish={handleUpdate}
                >
                    <Form.Item
                        name="promotionName"
                        label="Tên khuyến mãi"
                        rules={[{ required: true, message: 'Vui lòng nhập tên khuyến mãi' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="discountPercentage"
                        label="Phần trăm giảm giá"
                        rules={[
                            { required: true, message: 'Vui lòng nhập phần trăm giảm giá' },
                            { type: 'number', min: 0, max: 100, message: 'Phần trăm giảm giá phải từ 0 đến 100' }
                        ]}
                    >
                        <InputNumber
                            min={0}
                            max={100}
                            formatter={value => `${value}%`}
                            parser={value => value.replace('%', '')}
                            style={{ width: '100%' }}
                        />
                    </Form.Item>
                    <Form.Item
                        name="dateRange"
                        label="Thời gian áp dụng"
                        rules={[{ type: 'array', required: true, message: 'Vui lòng chọn thời gian áp dụng' }]}
                    >
                        <RangePicker style={{ width: '100%' }} />
                    </Form.Item>
                    <Form.Item
                        name="description"
                        label="Mô tả khuyến mãi"
                        rules={[{ required: true, message: 'Vui lòng nhập mô tả khuyến mãi' }]}
                    >
                        <TextArea rows={4} />
                    </Form.Item>
                    <Form.Item
                        name="applicableItems"
                        label="Sản phẩm áp dụng"
                        rules={[{ required: true, message: 'Vui lòng chọn ít nhất một sản phẩm' }]}
                    >
                        <Select
                            mode="multiple"
                            style={{ width: '100%' }}
                            placeholder="Chọn sản phẩm áp dụng"
                            filterOption={(input, option) =>
                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                        >
                            {allProducts.map(product => (
                                <Option key={product._id} value={product._id}>{product.itemName}</Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item>
                        <Button className='update-btn' type="primary" htmlType="submit" loading={loading} block>
                            Cập nhật khuyến mãi
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
};

export default UpdatePromotionForm;
