import { Card, Col, Form, Input, Row } from 'antd';

type StoresFilterProps = {
    children?: React.ReactNode;
};
const StoreFilter = ({ children }: StoresFilterProps) => {
    return (
        <Card>
            <Row justify="space-between">
                <Col span={16}>
                    <Row gutter={20}>
                        <Col span={12}>
                            <Form.Item name="q">
                                <Input.Search allowClear={true} placeholder="Search" />
                            </Form.Item>
                        </Col>
                    </Row>
                </Col>
                <Col span={8} style={{ display: 'flex', justifyContent: 'end' }}>
                    {children}
                </Col>
            </Row>
        </Card>
    );
};

export default StoreFilter;
