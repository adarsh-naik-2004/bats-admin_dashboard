import { Form, message, Space, Typography, Upload, UploadProps } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useState } from 'react';

const ProductImage = ({ initialImage }: { initialImage: string }) => {
    const [messageApi, contextHolder] = message.useMessage();
    const [imageUrl, setImageUrl] = useState<string | null>(initialImage);

    const uploaderConfig: UploadProps = {
        name: 'file',
        multiple: false,
        showUploadList: false,
        beforeUpload: (file) => {
            const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
            if (!isJpgOrPng) {
                console.error('You can only upload JPG/PNG file!');
                messageApi.error('You can only upload JPG/PNG file!');
            }

            setImageUrl(URL.createObjectURL(file));
            return false; // Prevent automatic upload
        },
    };

    return (
        <Form.Item
            label="Product Image"
            name="image"
            rules={[
                {
                    required: true,
                    message: 'Please upload a product image',
                },
            ]}
            style={{ marginBottom: '1rem' }}
        >
            {contextHolder}
            <Upload
                {...uploaderConfig}
                listType="picture-card"
                className="responsive-upload"
                style={{
                    maxWidth: 200,
                    width: '100%',
                }}
            >
                {imageUrl ? (
                    <img
                        src={imageUrl}
                        alt="product"
                        style={{
                            width: '100%',
                            height: 'auto',
                            borderRadius: 8,
                            objectFit: 'cover',
                        }}
                    />
                ) : (
                    <Space direction="vertical" align="center">
                        <PlusOutlined style={{ fontSize: 20 }} />
                        <Typography.Text style={{ fontSize: 14 }}>Upload</Typography.Text>
                    </Space>
                )}
            </Upload>
        </Form.Item>
    );
};

export default ProductImage;
