import { Card, Col, Form, Radio, Row, Switch, Typography } from 'antd';
import { Category } from '../../../types';
import { useQuery } from '@tanstack/react-query';
import { getCategory } from '../../../http/api';

type PricingProps = {
    selectedCategory: string;
};

const Attributes = ({ selectedCategory }: PricingProps) => {
    const { data: fetchedCategory } = useQuery<Category>({
        queryKey: ['category', selectedCategory],
        queryFn: () => getCategory(selectedCategory).then((res) => res.data),
        staleTime: 1000 * 60 * 5, // 5 minutes
    });

    if (!fetchedCategory) return null;

    return (
        <Card title={<Typography.Text>Attributes</Typography.Text>} bordered={false} style={{ marginTop: '1rem' }}>
            <Row gutter={[16, 24]}>
                {fetchedCategory.attributes.map((attribute) => (
                    <Col
                        key={attribute.name}
                        xs={24}
                        sm={24}
                        md={attribute.widgetType === 'switch' ? 12 : 24}
                    >
                        {attribute.widgetType === 'radio' ? (
                            <Form.Item
                                label={attribute.name}
                                name={['attributes', attribute.name]}
                                initialValue={attribute.defaultValue}
                                rules={[
                                    {
                                        required: true,
                                        message: `${attribute.name} is required`,
                                    },
                                ]}
                            >
                                <Radio.Group style={{ flexWrap: 'wrap' }}>
                                    {attribute.availableOptions.map((option) => (
                                        <Radio.Button key={option} value={option}>
                                            {option}
                                        </Radio.Button>
                                    ))}
                                </Radio.Group>
                            </Form.Item>
                        ) : attribute.widgetType === 'switch' ? (
                            <Form.Item
                                label={attribute.name}
                                name={['attributes', attribute.name]}
                                valuePropName="checked"
                                initialValue={attribute.defaultValue}
                            >
                                <Switch checkedChildren="Yes" unCheckedChildren="No" />
                            </Form.Item>
                        ) : null}
                    </Col>
                ))}
            </Row>
        </Card>
    );
};

export default Attributes;
