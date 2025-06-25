import { message, Upload, UploadProps } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useState } from 'react';

interface ProductImageProps {
  value?: string | File;
  onChange?: (value: string | File) => void;
}

const ProductImage = ({ value, onChange }: ProductImageProps) => {
  const [messageApi, contextHolder] = message.useMessage();
  const [imageUrl, setImageUrl] = useState<string | null>(
    typeof value === 'string' ? value : null
  );

  const uploaderConfig: UploadProps = {
    name: 'file',
    multiple: false,
    showUploadList: false,
    beforeUpload: (file) => {
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
      if (!isJpgOrPng) {
        messageApi.error('You can only upload JPG/PNG file!');
        return false;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setImageUrl(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      if (onChange) {
        onChange(file);
      }

      return false;
    },
  };

  return (
    <>
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
          <div>
            <PlusOutlined style={{ fontSize: 20 }} />
            <div style={{ fontSize: 14 }}>Upload</div>
          </div>
        )}
      </Upload>
    </>
  );
};

export default ProductImage;