import { Card, Col, Form, Input, Row, Select, Space } from 'antd';
import { getStores } from '../../../http/api';
import { useQuery } from '@tanstack/react-query';
import { Store } from '../../../types';

const UserForm = ({ isEditMode = false }: { isEditMode: boolean }) => {
    const selectedRole = Form.useWatch('role');

    const { data: stores } = useQuery({
        queryKey: ['stores'],
        queryFn: () => {
            // TODO: make this dynamic, like search for stores in the input
            return getStores(`perPage=100&currentPage=1`).then((res) => res.data);
        },
    });

    return (
        <Row>
            <Col span={24}>
                <Space direction="vertical" size="large">
                    <Card title="Basic info" variant="borderless">
                        <Row gutter={20}>
                            <Col span={12}>
                                <Form.Item
                                    label="First name"
                                    name="firstName"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'First name is required',
                                        },
                                    ]}>
                                    <Input size="large" />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    label="Last name"
                                    name="lastName"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Last name is required',
                                        },
                                    ]}>
                                    <Input size="large" />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    label="Email"
                                    name="email"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Email is required',
                                        },
                                        {
                                            type: 'email',
                                            message: 'Email is not valid',
                                        },
                                    ]}>
                                    <Input size="large" />
                                </Form.Item>
                            </Col>
                        </Row>
                    </Card>
                    {!isEditMode && (
                        <Card title="Security info" variant="borderless">
                            <Row gutter={20}>
                                <Col span={12}>
                                    <Form.Item
                                        label="Passoword (Minimum 8 Characters)"
                                        name="password"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Password required',
                                            },
                                        ]}>
                                        <Input size="large" type="password" />
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Card>
                    )}

                    <Card title="Role" variant="borderless">
                        <Row gutter={20}>
                            <Col span={12}>
                                <Form.Item
                                    label="Role"
                                    name="role"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Role is required',
                                        },
                                    ]}>
                                    <Select
                                        id="selectBoxInUserForm"
                                        size="large"
                                        style={{ width: '100%' }}
                                        allowClear={true}
                                        onChange={() => {}}
                                        placeholder="Select role">
                                        <Select.Option value="admin">Admin</Select.Option>
                                        <Select.Option value="manager">Manager</Select.Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                            {selectedRole === 'manager' && (
                                <Col span={12}>
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
                                            {stores?.data.map((store: Store) => (
                                                <Select.Option value={store.id} key={store.id}>
                                                    {store.name}
                                                </Select.Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                </Col>
                            )}
                        </Row>
                    </Card>
                </Space>
            </Col>
        </Row>
    );
};

export default UserForm;
