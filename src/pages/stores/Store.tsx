import {
    Breadcrumb,
    Button,
    Drawer,
    Flex,
    Form,
    Space,
    Spin,
    Table,
    Typography,
    theme,
} from 'antd';
import { RightOutlined, PlusOutlined, LoadingOutlined } from '@ant-design/icons';
import { Link, Navigate } from 'react-router-dom';
import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../../store';
import React from 'react';
import StoreFilter from './StoreFilter';
import { createStore, getStores, updateStore } from '../../http/api';
import StoreForm from './forms/StoreForm';
import { StoreData } from '../../types';
import { PER_PAGE } from '../../constants';

const Stores = () => {
    const {
        token: { colorBgLayout },
    } = theme.useToken();

    const [form] = Form.useForm();
    const [filterForm] = Form.useForm();
    const [queryParams, setQueryParams] = React.useState({
        perPage: PER_PAGE,
        currentPage: 1,
    });
    const [drawerOpen, setDrawerOpen] = React.useState(false);
    const [currentEditingStore, setCurrentEditingStore] = React.useState<StoreData | null>(null);

    const {
        data: stores,
        isFetching,
        isError,
        error,
    } = useQuery({
        queryKey: ['stores', queryParams],
        queryFn: () => {
            const filteredParams = Object.fromEntries(
                Object.entries(queryParams).filter((item) => !!item[1])
            );
            const queryString = new URLSearchParams(
                filteredParams as unknown as Record<string, string>
            ).toString();
            return getStores(queryString).then((res) => res.data);
        },
        placeholderData: keepPreviousData,
    });

    const { user } = useAuthStore();
    const queryClient = useQueryClient();
    
    const { mutate: storeMutate } = useMutation({
        mutationKey: ['store'],
        mutationFn: async (data: StoreData ) => createStore(data).then((res) => res.data),
        onSuccess: async () => {
            queryClient.invalidateQueries({ queryKey: ['stores'] });
            return;
        },
    });

    const { mutate: updateStoreMutation } = useMutation({
        mutationKey: ['update-store'],
        mutationFn: async (data: StoreData ) => 
            updateStore(data, currentEditingStore!.id).then((res) => res.data),
        onSuccess: async () => {
            queryClient.invalidateQueries({ queryKey: ['stores'] });
            return;
        },
    });

    const onHandleSubmit = async () => {
        await form.validateFields();
        if (currentEditingStore) {
            await updateStoreMutation(form.getFieldsValue());
        } else {
            await storeMutate(form.getFieldsValue());
        }
        form.resetFields();
        setCurrentEditingStore(null);
        setDrawerOpen(false);
    };

    if (user?.role !== 'admin') {
        return <Navigate to="/" replace={true} />;
    }

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Address',
            dataIndex: 'address',
            key: 'address',
        },
        {
            title: 'Actions',
            render: (_: string, record: StoreData ) => (
                <Space>
                    <Button type="link" onClick={() => {
                        setCurrentEditingStore(record);
                        setDrawerOpen(true);
                        form.setFieldsValue(record);
                    }}>
                        Edit
                    </Button>
                </Space>
            ),
        },
    ];

    return (
        <div style={{ padding: '16px' }}>
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
                <Flex justify="space-between" align="center" wrap="wrap" gap={8}>
                    <Breadcrumb
                        separator={<RightOutlined />}
                        items={[{ title: <Link to="/">Dashboard</Link> }, { title: 'Stores' }]}
                    />
                    {isFetching && (
                        <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
                    )}
                    {isError && <Typography.Text type="danger">{error.message}</Typography.Text>}
                </Flex>

                <Form form={filterForm}>
                    <StoreFilter>
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            onClick={() => {
                                setCurrentEditingStore(null);
                                setDrawerOpen(true);
                            }}>
                            Add Shop
                        </Button>
                    </StoreFilter>
                </Form>

                <Table
                    columns={columns}
                    dataSource={stores?.data}
                    rowKey={'id'}
                    pagination={{
                        total: stores?.total,
                        pageSize: queryParams.perPage,
                        current: queryParams.currentPage,
                        onChange: (page) => {
                            setQueryParams((prev) => ({
                                ...prev,
                                currentPage: page,
                            }));
                        },
                        showTotal: (total: number, range: number[]) => {
                            return `Showing ${range[0]}-${range[1]} of ${total} items`;
                        },
                        responsive: true,
                        showSizeChanger: true,
                        pageSizeOptions: ['5', '10', '20', '50'],
                        onShowSizeChange: (_current, size) => {
                            setQueryParams((prev) => ({
                                ...prev,
                                perPage: size,
                                currentPage: 1,
                            }));
                        },
                    }}
                    scroll={{ x: true }}
                />

                <Drawer
                    title={currentEditingStore ? 'Edit Store' : 'Create Store'}
                    styles={{ body: { backgroundColor: colorBgLayout, padding: '16px' } }}
                    width={window.innerWidth > 720 ? 720 : '100%'}
                    destroyOnClose={true}
                    open={drawerOpen}
                    onClose={() => {
                        form.resetFields();
                        setCurrentEditingStore(null);
                        setDrawerOpen(false);
                    }}
                    extra={
                        <Space>
                            <Button
                                onClick={() => {
                                    form.resetFields();
                                    setDrawerOpen(false);
                                }}>
                                Cancel
                            </Button>
                            <Button type="primary" onClick={onHandleSubmit}>
                                Submit
                            </Button>
                        </Space>
                    }>
                    <Form layout="vertical" form={form}>
                        <StoreForm isEditMode={!!currentEditingStore} />
                    </Form>
                </Drawer>
            </Space>
        </div>
    );
};

export default Stores;