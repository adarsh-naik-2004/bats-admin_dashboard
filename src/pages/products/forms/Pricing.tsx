import { Card, Col, Form, InputNumber, Row, Space, Typography } from 'antd';
import { Category } from '../../../types';
import { useQuery } from '@tanstack/react-query';
import { getCategory } from '../../../http/api';

type PricingProps = {
    selectedCategory: string;
};

const Pricing = ({ selectedCategory }: PricingProps) => {
    const { data: fetchedCategory } = useQuery<Category>({
        queryKey: ['category', selectedCategory],
        queryFn: () => getCategory(selectedCategory).then((res) => res.data),
        staleTime: 1000 * 60 * 5, // 5 minutes
    });

    if (!fetchedCategory) return null;

    return (
        <Card
            title={<Typography.Text>Product Price</Typography.Text>}
            bordered={false}
            style={{ marginTop: '1rem' }}
        >
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
                {Object.entries(fetchedCategory.priceConfiguration).map(
                    ([configurationKey, configurationValue]) => (
                        <div key={configurationKey}>
                            <Typography.Text strong style={{ marginBottom: 8, display: 'block' }}>
                                {`${configurationKey} (${configurationValue.priceType})`}
                            </Typography.Text>
                            <Row gutter={[16, 16]}>
                                {configurationValue.availableOptions.map((option: string) => (
                                    <Col key={option} xs={24} sm={12} md={8}>
                                        <Form.Item
                                            label={option}
                                            name={[
                                                'priceConfiguration',
                                                JSON.stringify({
                                                    configurationKey,
                                                    priceType: configurationValue.priceType,
                                                }),
                                                option,
                                            ]}
                                        >
                                            <InputNumber
                                                min={0}
                                                style={{ width: '100%' }}
                                                addonAfter="₹"
                                            />
                                        </Form.Item>
                                    </Col>
                                ))}
                            </Row>
                        </div>
                    )
                )}
            </Space>
        </Card>
    );
};

export default Pricing;
