import React, { useState } from 'react';
import { Form, Input, InputNumber, Select, Button, message, Upload } from 'antd';
import { IoClose } from "react-icons/io5";
import { UploadOutlined } from '@ant-design/icons';
import "../css/UpdateProductForm.scss";
import { fetchAPI } from '../../fetchApi.js';

const { TextArea } = Input;
const { Option } = Select;

const UpdateProductForm = ({ product, onClose, onUpdateSuccess }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [fileList, setFileList] = useState(
        product.images ? product.images.map((url, index) => ({
            uid: `-${index}`,
            name: `image-${index}`,
            status: 'done',
            url: url,
        })) : []
    );

    const handleUpdate = async (values) => {
        setLoading(true);
        try {
            // Prepare the data object
            const updateData = {
                ...values,
                images: fileList.map(file => file.url || file.originFileObj)
            };

            console.log("Update data:", updateData);

            const response = await fetchAPI(`/item/${product._id}`, 'PATCH', updateData, localStorage.getItem('tokenInfo'));

            console.log("Response:", response);

            if (response.status === 200) {
                message.success('Cập nhật sản phẩm thành công');
                if (typeof onUpdateSuccess === 'function') {
                    onUpdateSuccess(response.data);
                }
                onClose();
            } else {
                throw new Error(response.message || 'Có lỗi xảy ra khi cập nhật sản phẩm');
            }
        } catch (error) {
            console.error('Error updating product:', error);
            message.error(error.message || 'Có lỗi xảy ra khi cập nhật sản phẩm');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = ({ fileList: newFileList }) => setFileList(newFileList);

    return (
        <div className="update-container">
            <div className="update-header">
                <p className='update-title'>Cập Nhật Sản Phẩm</p>
                <div className="form-close-btn-div">
                    <Button icon={<IoClose />} onClick={onClose} type="text" className="form-close-btn" />
                </div>
            </div>
            <div className="update-form-scroll">
                <Form
                    form={form}
                    layout="vertical"
                    initialValues={product}
                    onFinish={handleUpdate}
                >
                    <Form.Item
                        name="itemName"
                        label="Tên sản phẩm"
                        rules={[{ required: true, message: 'Vui lòng nhập tên sản phẩm' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="price"
                        label="Giá sản phẩm"
                        rules={[
                            { required: true, message: 'Vui lòng nhập giá sản phẩm' },
                            { type: 'number', min: 1000, message: 'Giá phải lớn hơn hoặc bằng 1000' }
                        ]}
                    >
                        <InputNumber
                            formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            parser={value => value.replace(/\$\s?|(,*)/g, '')}
                            style={{ width: '100%' }}
                        />
                    </Form.Item>
                    <Form.Item
                        name="variants"
                        label="Biến thể"
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="foodType"
                        label="Loại thực phẩm"
                        rules={[{ required: true, message: 'Vui lòng chọn loại thực phẩm' }]}
                    >
                        <Select>
                            <Option value="meats">Thịt</Option>
                            <Option value="vegetables">Rau củ</Option>
                            <Option value="fruits">Trái cây</Option>
                            <Option value="seafood">Hải sản</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item
                        name="description"
                        label="Mô tả sản phẩm"
                        rules={[{ required: true, message: 'Vui lòng nhập mô tả sản phẩm' }]}
                    >
                        <TextArea rows={4} />
                    </Form.Item>
                    <Form.Item
                        name="images"
                        label="Hình ảnh sản phẩm"
                    >
                        <Upload
                            listType="picture-card"
                            fileList={fileList}
                            onChange={handleChange}
                            beforeUpload={() => false}
                        >
                            {fileList.length >= 8 ? null : (
                                <div>
                                    <UploadOutlined />
                                    <div style={{ marginTop: 8 }}>Tải lên</div>
                                </div>
                            )}
                        </Upload>
                    </Form.Item>
                    <Form.Item>
                        <Button className='update-btn' type="primary" htmlType="submit" loading={loading} block>
                            Cập nhật sản phẩm
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
};

export default UpdateProductForm;
