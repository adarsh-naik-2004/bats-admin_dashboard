import { Card, Col, Form, Input, Row } from 'antd';

interface StoreFormProps {
    isEditMode?: boolean;
}

const StoreForm: React.FC<StoreFormProps> = ({ isEditMode }) => {
    return (
        <Row>
            <Col span={24}>
                <Card title={isEditMode ? "Edit Store" : "Basic Info"} variant="borderless" style={{ width: '100%' }}>
                    <Row gutter={20}>
                        <Col span={12}>
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
                        <Col span={12}>
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
