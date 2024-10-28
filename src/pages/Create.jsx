import React, { useState, useRef } from 'react';
import { Form, Input, Button, Select, InputNumber } from 'antd';
import Swal from 'sweetalert2';
import { fetchIMG, fetchAPI } from '../../fetchApi'
import "../css/Create.scss";

const { Option } = Select;
const { TextArea } = Input;

const Create = () => {
  const [form] = Form.useForm();
  const [productName, setProductName] = useState('');
  const [productPrice, setProductPrice] = useState(0);
  const [variants, setVariants] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [images, setImages] = useState([]);
  const [imagesData, setImagesData] = useState([]);
  const [foodType, setFoodType] = useState('');
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);
  const [quantity, setQuantity] = useState(1); // New state for quantity

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const totalImages = images.length + files.length;

    if (totalImages > 5) {
      Swal.fire({
        title: 'Giới hạn ảnh',
        text: 'Bạn chỉ có thể tải lên tối đa 5 ảnh.',
        icon: 'warning',
        confirmButtonText: 'OK'
      });
      return;
    }

    const newImages = files.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));
    setImages(prevImages => [...prevImages, ...newImages]);
    setImagesData(prevData => {
      const newData = [...prevData, ...files];
      updateFileInput(newData);
      return newData;
    });
  };

  const handleImageRemove = (index) => {
    setImages(prevImages => prevImages.filter((_, i) => i !== index));
    setImagesData(prevData => {
      const newData = prevData.filter((_, i) => i !== index);
      updateFileInput(newData);
      return newData;
    });
  };

  const updateFileInput = (files) => {
    if (fileInputRef.current) {
      const dataTransfer = new DataTransfer();
      files.forEach(file => {
        dataTransfer.items.add(file);
      });
      fileInputRef.current.files = dataTransfer.files;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (imagesData.length === 0) {
      Swal.fire({
        title: 'Ảnh không được phép bỏ trống',
        icon: 'error',
      });
      setLoading(false);
      return;
    }

    try {
      // Upload images first
      const formData = new FormData();
      imagesData.forEach((file, index) => {
        formData.append(`images`, file);
      });

      const uploadResponse = await fetchIMG('/upload/multiple', 'POST', formData, localStorage.getItem('tokenInfo'));

      if (uploadResponse.status !== 200) {
        throw new Error('Lỗi khi tải ảnh lên');
      }

      const imageUrls = uploadResponse.data.fileUrls;

      // Create product with image URLs
      const productData = {
        itemName: productName,
        price: Number(productPrice),
        variants: variants,
        description: productDescription,
        images: imageUrls,
        foodType: foodType,
        quantity: Number(quantity) // Add quantity to productData
      };

      const createResponse = await fetchAPI('/item/', 'POST', productData, localStorage.getItem('tokenInfo'));

      if (createResponse.status === 201) {
        Swal.fire({
          title: 'Sản phẩm đã được tạo!',
          icon: 'success',
          confirmButtonText: 'OK',
        }).then(() => {
          window.location.reload();
        });
      } else {
        throw new Error(createResponse.message || 'Có lỗi xảy ra khi tạo sản phẩm');
      }
    } catch (error) {
      console.error('Error:', error);
      Swal.fire({
        title: error.message || 'Có lỗi xảy ra khi tạo sản phẩm',
        icon: 'error',
        confirmButtonText: 'OK',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-container content-container">
      <h1>Thêm sản phẩm</h1>
      <Form form={form} onFinish={handleSubmit} className="create-content">
        <Form.Item className="product-info"
          rules={[{ required: true, message: 'Vui lòng nhập tên sản phẩm' }]}>
          <label htmlFor="product-name">Tên sản phẩm</label>
          <Input
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            required
            id="product-name"
          />
        </Form.Item>

        <Form.Item className="product-info"
          rules={[{ required: true, message: 'Vui lòng nhập giá sản phẩm' }]}>
          <label htmlFor="price">Giá bán</label>
          <Input
            type="number"
            min={0}
            value={productPrice}
            onChange={(e) => setProductPrice(Number(e.target.value))}
            required
            id="price"
          />
        </Form.Item>

        <Form.Item className="product-info"
          rules={[{ required: true, message: 'Vui lòng nhập phân loại' }]}>
          <label htmlFor="variants">Phân loại</label>
          <Input
            value={variants}
            onChange={(e) => setVariants(e.target.value)}
            required
            id="variants"
            placeholder="Ví dụ: Vỉ 10 quả"
          />
        </Form.Item>

        <Form.Item className="product-info">
          <label htmlFor="food-type">Loại sản phẩm</label>
          <Select
            value={foodType}
            onChange={(value) => setFoodType(value)}
            required
            id="food-type"
          >
            <Option value="seafood">Hải sản</Option>
            <Option value="vegetables">Rau củ</Option>
            <Option value="meats">Thịt</Option>
            <Option value="fruits">Trái cây</Option>
          </Select>
        </Form.Item>

        <Form.Item className="product-info image-upload-section">
          <label htmlFor="product-images">Ảnh sản phẩm (Tối đa 5 ảnh)</label>
          <input
            type="file"
            id="product-images"
            multiple
            onChange={handleImageChange}
            accept="image/*"
            ref={fileInputRef}
          />
          <label htmlFor="product-images" className="image-upload-label">
            Chọn ảnh
          </label>
          <div className="image-previews">
            {images.map((image, index) => (
              <div key={index} className="image-item">
                <img src={image.preview} alt={`Product Preview ${index + 1}`} />
                <div className="image-item__btn-wrapper">
                  <Button onClick={() => handleImageRemove(index)}>
                    Xóa
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Form.Item>

        <Form.Item className="product-info"
          rules={[{ required: true, message: 'Vui lòng nhập mô tả sản phẩm' }]}>
          <label>Mô tả sản phẩm</label>
          <TextArea
            rows={4}
            value={productDescription}
            onChange={(e) => setProductDescription(e.target.value)}
            required
            className="product-desc"
          />
        </Form.Item>

        <Form.Item className="product-info">
          <label htmlFor="quantity">Số lượng</label>
          <InputNumber
            min={1}
            value={quantity}
            onChange={(value) => setQuantity(value)}
            required
            id="quantity"
          />
        </Form.Item>

        <Form.Item className="create-submit">
          <Button type="primary" htmlType="submit" className="submit-create" loading={loading}>
            Tạo sản phẩm
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Create;
