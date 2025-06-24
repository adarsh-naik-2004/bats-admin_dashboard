import { Card, Col, Form, Input, Row, Select } from 'antd';

type UsersFilterProps = {
    children?: React.ReactNode;
};
const UsersFilter = ({ children }: UsersFilterProps) => {
    return (
        <Card bodyStyle={{ padding: '16px' }}>
            <Row gutter={[16, 16]} justify="space-between" align="middle">
                <Col xs={24} sm={24} md={16}>
                    <Row gutter={[16, 16]}>
                        <Col xs={24} sm={12} md={12} lg={8}>
                            <Form.Item name="q">
                                <Input.Search allowClear={true} placeholder="Search" size="large" />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12} md={12} lg={8}>
                            <Form.Item name="role">
                                <Select
                                    style={{ width: '100%' }}
                                    allowClear={true}
                                    placeholder="Select role"
                                    size="large">
                                    <Select.Option value="admin">Admin</Select.Option>
                                    <Select.Option value="manager">Manager</Select.Option>
                                    <Select.Option value="customer">Customer</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                </Col>
                <Col xs={24} sm={24} md={8} style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    {children}
                </Col>
            </Row>
        </Card>
    );
};

export default UsersFilter;