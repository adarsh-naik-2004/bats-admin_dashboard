import { Modal, Button } from 'antd';

interface CustomModalProps {
  title: React.ReactNode;
  open: boolean;
  onOk: () => void;
  onCancel: () => void;
  children?: React.ReactNode;
  confirmLoading?: boolean;
  okText?: string;
  cancelText?: string;
}

const CustomModal: React.FC<CustomModalProps> = ({ 
  title, 
  open, 
  onOk, 
  onCancel, 
  children,
  confirmLoading,
  okText = 'Submit',
  cancelText = 'Cancel'
}) => {
  return (
    <Modal
      title={title}
      open={open}
      onOk={onOk}
      onCancel={onCancel}
      footer={[
        <Button key="back" onClick={onCancel}>
          {cancelText}
        </Button>,
        <Button 
          key="submit" 
          type="primary" 
          loading={confirmLoading} 
          onClick={onOk}
        >
          {okText}
        </Button>,
      ]}
    >
      {children}
    </Modal>
  );
};

export default CustomModal;