import { Card, Col, Form, FormInstance, Input, Row, Select, Space, Switch, Typography } from 'antd';

import { Category, Store } from '../../../types';
import { useQuery } from '@tanstack/react-query';
import { getCategories, getStores } from '../../../http/api';
import Pricing from './Pricing';
import Attributes from './Attributes';
import ProductImage from './ProductImage';
import { useAuthStore } from '../../../store';

const ProductForm = ({ form }: { form: FormInstance }) => {
    const { user } = useAuthStore();
    const selectedCategory = Form.useWatch('categoryId');
    console.log(selectedCategory);
    const { data: categories } = useQuery({
        queryKey: ['categories'],
        queryFn: () => {
            return getCategories();
        },
    });

    const { data: shops } = useQuery({
        queryKey: ['shops'],
        queryFn: () => {
            return getStores(`perPage=100&currentPage=1`);
        },
    });

    return (
        <Row>
            <Col span={24}>
                <Space direction="vertical" size="large">
                    <Card title="Product info" bordered={false}>
                        <Row gutter={20}>
                            <Col span={12}>
                                <Form.Item
                                    label="Product name"
                                    name="name"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Product name is required',
                                        },
                                    ]}>
                                    <Input size="large" />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    label="Category"
                                    name="categoryId"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Category is required',
                                        },
                                    ]}>
                                    <Select
                                        size="large"
                                        style={{ width: '100%' }}
                                        allowClear={true}
                                        onChange={() => {}}
                                        placeholder="Select category">
                                        {categories?.data.map((category: Category) => (
                                            <Select.Option value={category._id} key={category._id}>
                                                {category.name}
                                            </Select.Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={24}>
                                <Form.Item
                                    label="Description"
                                    name="description"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Description is required',
                                        },
                                    ]}>
                                    <Input.TextArea
                                        rows={2}
                                        maxLength={100}
                                        style={{ resize: 'none' }}
                                        size="large"
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                    </Card>
                    <Card title="Product image" bordered={false}>
                        <Row gutter={20}>
                            <Col span={12}>
                                <ProductImage initialImage={form.getFieldValue('image')} />
                            </Col>
                        </Row>
                    </Card>
                    {user?.role !== 'manager' && (
                        <Card title="Store info" bordered={false}>
                            <Row gutter={24}>
                                <Col span={24}>
                                    <Form.Item
                                        label="Shop"
                                        name="storeId"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Shop is required',
                                            },
                                        ]}>
                                        <Select
                                            size="large"
                                            style={{ width: '100%' }}
                                            allowClear={true}
                                            onChange={() => {}}
                                            placeholder="Select shop">
                                            {shops?.data.data.map((store: Store) => (
                                                <Select.Option
                                                    value={String(store.id)}
                                                    key={store.id}>
                                                    {store.name}
                                                </Select.Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Card>
                    )}

                    {selectedCategory && <Pricing selectedCategory={selectedCategory} />}
                    {selectedCategory && <Attributes selectedCategory={selectedCategory} />}

                    <Card title="Other properties" bordered={false}>
                        <Row gutter={24}>
                            <Col span={24}>
                                <Space>
                                    <Form.Item name="isPublish">
                                        <Switch
                                            defaultChecked={false}
                                            onChange={() => {}}
                                            checkedChildren="Yes"
                                            unCheckedChildren="No"
                                        />
                                    </Form.Item>
                                    <Typography.Text style={{ marginBottom: 22, display: 'block' }}>
                                        Published
                                    </Typography.Text>
                                </Space>
                            </Col>
                        </Row>
                    </Card>
                </Space>
            </Col>
        </Row>
    );
};

export default ProductForm;
