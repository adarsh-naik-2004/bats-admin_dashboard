import { Card, Col, Form, Input, Row } from 'antd';

interface StoreFormProps {
    isEditMode?: boolean;
}

const StoreForm: React.FC<StoreFormProps> = ({ isEditMode }) => {
    return (
        <Row>
            <Col span={24}>
                <Card 
                    title={isEditMode ? "Edit Store" : "Basic Info"} 
                    variant="borderless" 
                    bodyStyle={{ padding: '16px' }}
                >
                    <Row gutter={[16, 16]}>
                        <Col xs={24} sm={24} md={12}>
                            <Form.Item
                                label="Name"
                                name="name"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Name is required',
                                    },
                                ]}>
                                <Input size="large" />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={24} md={12}>
                            <Form.Item
                                label="Address"
                                name="address"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Address is required',
                                    },
                                ]}>
                                <Input size="large" />
                            </Form.Item>
                        </Col>
                    </Row>
                </Card>
            </Col>
        </Row>
    );
};

export default StoreForm;