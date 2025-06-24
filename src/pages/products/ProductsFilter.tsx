import { useQuery } from '@tanstack/react-query';
import { Card, Col, Form, Input, Row, Select, Space, Switch, Typography } from 'antd';
import { Category, Store } from '../../types';
import { useAuthStore } from '../../store';
import { getCategories, getStores } from '../../http/api';

type ProductsFilterProps = {
    children?: React.ReactNode;
};

const ProductsFilter = ({ children }: ProductsFilterProps) => {
    const { user } = useAuthStore();
    const { data: shops } = useQuery({
        queryKey: ['shops'],
        queryFn: () => getStores(`perPage=100&currentPage=1`),
    });

    const { data: categories } = useQuery({
        queryKey: ['categories'],
        queryFn: () => getCategories(),
    });

    return (
        <Card className="mb-4 shadow-sm">
            <Row gutter={[16, 16]} align="middle">
                <Col xs={24} md={16}>
                    <Row gutter={[16, 16]}>
                        <Col xs={24} md={8}>
                            <Form.Item name="q" className="mb-0">
                                <Input.Search 
                                    allowClear={true} 
                                    placeholder="Search" 
                                    className="w-full"
                                />
                            </Form.Item>
                        </Col>

                        <Col xs={24} md={8}>
                            <Form.Item name="categoryId" className="mb-0">
                                <Select
                                    allowClear={true}
                                    placeholder="Select category"
                                    className="w-full"
                                >
                                    {categories?.data.map((category: Category) => (
                                        <Select.Option key={category._id} value={category._id}>
                                            {category.name}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        
                        {user!.role === 'admin' && (
                            <Col xs={24} md={8}>
                                <Form.Item name="StoreId" className="mb-0">
                                    <Select
                                        allowClear={true}
                                        placeholder="Select shop"
                                        className="w-full"
                                    >
                                        {shops?.data.data.map((shop: Store) => (
                                            <Select.Option key={shop.id} value={shop.id}>
                                                {shop.name}
                                            </Select.Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </Col>
                        )}

                        <Col xs={24}>
                            <Form.Item name="isPublish" className="mb-0">
                                <Space className="flex items-center">
                                    <Switch defaultChecked={false} />
                                    <Typography.Text className="font-medium">
                                        Show only published
                                    </Typography.Text>
                                </Space>
                            </Form.Item>
                        </Col>
                    </Row>
                </Col>
                
                <Col xs={24} md={8} className="flex justify-start md:justify-end">
                    {children}
                </Col>
            </Row>
        </Card>
    );
};

export default ProductsFilter;