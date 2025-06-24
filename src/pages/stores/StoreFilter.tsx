import { Card, Col, Form, Input, Row } from 'antd';

type StoresFilterProps = {
    children?: React.ReactNode;
};
const StoreFilter = ({ children }: StoresFilterProps) => {
    return (
        <Card bodyStyle={{ padding: '16px' }}>
            <Row gutter={[16, 16]} justify="space-between" align="middle">
                <Col xs={24} sm={24} md={16}>
                    <Row gutter={[16, 16]}>
                        <Col xs={24} sm={24} md={12} lg={12}>
                            <Form.Item name="q">
                                <Input.Search 
                                    allowClear={true} 
                                    placeholder="Search" 
                                    size="large"
                                />
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

export default StoreFilter;