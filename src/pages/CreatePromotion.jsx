import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Select, DatePicker, InputNumber, message } from 'antd';
import Swal from 'sweetalert2';
import { fetchAPI, fetchAPIWithoutBody } from '../../fetchApi'
import "../css/Create.scss";

const { Option } = Select;
const { TextArea } = Input;
const { RangePicker } = DatePicker;

const CreatePromotion = () => {
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
      } else {
        message.error('Không thể tải danh sách sản phẩm');
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      message.error('Có lỗi xảy ra khi tải danh sách sản phẩm');
    }
  };

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const promotionData = {
        ...values,
        startDate: values.dateRange[0].format('YYYY-MM-DD'),
        endDate: values.dateRange[1].format('YYYY-MM-DD'),
      };
      delete promotionData.dateRange;

      const response = await fetchAPI('/promotion', 'POST', promotionData, localStorage.getItem('tokenInfo'));

      if (response.status === 201) {
        Swal.fire({
          title: 'Khuyến mãi đã được tạo!',
          icon: 'success',
          confirmButtonText: 'OK',
        }).then(() => {
          window.location.reload();
        });
      } else {
        throw new Error(response.message || 'Có lỗi xảy ra khi tạo khuyến mãi');
      }
    } catch (error) {
      console.error('Error:', error);
      Swal.fire({
        title: error.message || 'Có lỗi xảy ra khi tạo khuyến mãi',
        icon: 'error',
        confirmButtonText: 'OK',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-container content-container">
      <h1>Thêm khuyến mãi</h1>
      <Form form={form} onFinish={handleSubmit} layout="vertical" className="create-content">
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

        <Form.Item className="create-submit">
          <Button type="primary" htmlType="submit" className="submit-create" loading={loading}>
            Tạo khuyến mãi
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default CreatePromotion;
