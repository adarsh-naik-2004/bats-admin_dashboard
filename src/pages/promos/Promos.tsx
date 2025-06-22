import { Button, Card, DatePicker, Form, Input, InputNumber, Select, Space, Table, Tag } from "antd";
import { useAuthStore } from "../../store";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  getCoupons, 
  createCoupon, 
  updateCoupon, 
  deactivateCoupon, 
  reactivateCoupon,
  getStores
} from "../../http/api";
import { Coupon, CouponCreatePayload } from "../../types";
import { ColumnsType } from "antd/es/table";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { useState } from "react";
import CustomModal from "../../components/ui/Modal";

const Promos = () => {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [storeFilter, setStoreFilter] = useState<string | undefined>(undefined);
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);

  const { data: coupons, isLoading } = useQuery({
    queryKey: ['coupons', { storeId: storeFilter, status: statusFilter }],
    queryFn: () => 
      getCoupons(
        `storeId=${storeFilter || ''}&isActive=${statusFilter === 'active' ? 'true' : statusFilter === 'inactive' ? 'false' : ''}`
      )
  });

  const { data: stores } = useQuery({
    queryKey: ['stores'],
    queryFn: () => getStores(''),
    enabled: user?.role === 'admin'
  });

  const createMutation = useMutation({
    mutationFn: (coupon: CouponCreatePayload) => createCoupon(coupon),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coupons'] });
      setIsModalOpen(false);
      form.resetFields();
    }
  });

  const updateMutation = useMutation({
    mutationFn: (data: { id: string; coupon: CouponCreatePayload }) =>
      updateCoupon(data.id, data.coupon),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coupons'] });
      setIsModalOpen(false);
      setEditingCoupon(null);
      form.resetFields();
    }
  });

  const deactivateMutation = useMutation({
    mutationFn: (id: string) => deactivateCoupon(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['coupons'] })
  });

  const reactivateMutation = useMutation({
    mutationFn: (id: string) => reactivateCoupon(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['coupons'] })
  });

  const columns: ColumnsType<Coupon> = [
    { title: 'Title', dataIndex: 'title', key: 'title' },
    { title: 'Code', dataIndex: 'code', key: 'code' },
    { 
      title: 'Discount', 
      dataIndex: 'discount', 
      key: 'discount',
      render: value => `${value}%` 
    },
    { 
      title: 'Valid Until', 
      dataIndex: 'validUpto', 
      key: 'validUpto',
      render: date => dayjs(date).format('MMM DD, YYYY') 
    },
    { 
      title: 'Status', 
      dataIndex: 'isActive', 
      key: 'status',
      render: isActive => (
        <Tag color={isActive ? 'green' : 'red'}>
          {isActive ? 'Active' : 'Inactive'}
        </Tag>
      )
    },
    ...(user?.role === 'admin' ? [{
      title: 'Store',
      dataIndex: 'storeId',
      key: 'storeId',
      render: (storeId: string) => stores?.data?.find((s: { id: string }) => s.id === storeId)?.name || storeId
    }] : []),
    {
      title: 'Actions',
      key: 'actions',
      render: (_: unknown, record: Coupon) => (
        <Space>
          <Button 
            icon={<EditOutlined />} 
            onClick={() => handleEdit(record)}
          />
          {record.isActive ? (
            <Button 
              danger 
              icon={<DeleteOutlined />} 
              onClick={() => deactivateMutation.mutate(record.id)}
            />
          ) : (
            <Button 
              type="primary" 
              onClick={() => reactivateMutation.mutate(record.id)}
            >
              Reactivate
            </Button>
          )}
        </Space>
      ),
    },
  ];

  const handleCreate = () => {
    form.resetFields();
    setEditingCoupon(null);
    setIsModalOpen(true);
  };

  const handleEdit = (coupon: Coupon) => {
    form.setFieldsValue({
      ...coupon,
      validUpto: dayjs(coupon.validUpto)
    });
    setEditingCoupon(coupon);
    setIsModalOpen(true);
  };

  const handleSubmit = () => {
    form.validateFields().then(values => {
      const payload: CouponCreatePayload = {
        ...values,
        validUpto: values.validUpto.toISOString(),
        storeId: user?.role === 'manager' ? user.store?.id : values.storeId
      };

      if (editingCoupon) {
        updateMutation.mutate({ id: editingCoupon.id, coupon: payload });
      } else {
        createMutation.mutate(payload);
      }
    });
  };

  return (
    <Card 
      title="Coupons & Promos" 
      extra={
        <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
          Create Coupon
        </Button>
      }
    >
      <Space style={{ marginBottom: 16 }}>
        {user?.role === 'admin' && (
          <Select
            placeholder="Filter by store"
            style={{ width: 200 }}
            allowClear
            onChange={(value: string | undefined) => setStoreFilter(value)}
            options={stores?.data?.map((store: { id: string; name: string }) => ({
              value: store.id,
              label: store.name
            }))}
          />
        )}
        <Select
          placeholder="Filter by status"
          style={{ width: 120 }}
          allowClear
          onChange={setStatusFilter}
          options={[
            { value: 'active', label: 'Active' },
            { value: 'inactive', label: 'Inactive' },
          ]}
        />
      </Space>

      <Table 
        columns={columns} 
        dataSource={coupons?.data} 
        loading={isLoading}
        rowKey="id"
      />

      <CustomModal
        title={editingCoupon ? "Edit Coupon" : "Create New Coupon"}
        open={isModalOpen}
        onOk={handleSubmit}
        onCancel={() => setIsModalOpen(false)}
        confirmLoading={createMutation.isPending || updateMutation.isPending}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="title"
            label="Title"
            rules={[{ required: true, message: 'Please enter title' }]}
          >
            <Input />
          </Form.Item>
          
          <Form.Item
            name="code"
            label="Coupon Code"
            rules={[{ required: true, message: 'Please enter coupon code' }]}
          >
            <Input />
          </Form.Item>
          
          <Form.Item
            name="discount"
            label="Discount (%)"
            rules={[{ 
              required: true, 
              message: 'Please enter discount',
              type: 'number',
              min: 1,
              max: 100
            }]}
          >
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>
          
          <Form.Item
            name="validUpto"
            label="Valid Until"
            rules={[{ required: true, message: 'Please select date' }]}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          
          {user?.role === 'admin' && (
            <Form.Item
              name="storeId"
              label="Store"
              rules={[{ required: true, message: 'Please select store' }]}
            >
              <Select
                options={stores?.data?.map((store: { id: string; name: string }) => ({
                  value: store.id,
                  label: store.name
                }))}
              />
            </Form.Item>
          )}
        </Form>
      </CustomModal>
    </Card>
  );
};

export default Promos;