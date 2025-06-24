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
import { Coupon, CouponCreatePayload, Store } from "../../types";
import { ColumnsType } from "antd/es/table";
import type { Breakpoint } from "antd/es/_util/responsiveObserver";
import { PlusOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { useState } from "react";
import CustomModal from "../../components/ui/Modal";

const Promos = () => {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [storeFilter, setStoreFilter] = useState<number | undefined>(undefined);
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);

  const { data: couponsResponse, isLoading } = useQuery({
    queryKey: ['coupons', { storeId: storeFilter, status: statusFilter }],
    queryFn: () => {
      const params = new URLSearchParams();
      if (storeFilter !== undefined) {
        params.append('storeId', storeFilter.toString());
      }
      if (statusFilter) {
        params.append('isActive', statusFilter === 'active' ? 'true' : 'false');
      }
      return getCoupons(params.toString()).then(res => res.data);
    }
  });

  const { data: storesResponse } = useQuery({
    queryKey: ['stores'],
    queryFn: () => getStores('').then(res => res.data),
    enabled: user?.role === 'admin'
  });

  const coupons: Coupon[] = couponsResponse?.data || [];
  const total = couponsResponse?.total || 0;
  
  const stores: Store[] = storesResponse?.data || [];

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
    { 
      title: 'Title', 
      dataIndex: 'title', 
      key: 'title',
    },
    { 
      title: 'Code', 
      dataIndex: 'code', 
      key: 'code',
    },
    { 
      title: 'Discount', 
      dataIndex: 'discount', 
      key: 'discount',
      render: (value: number) => `${value}%`,
    },
    { 
      title: 'Valid Until', 
      dataIndex: 'validUpto', 
      key: 'validUpto',
      render: (date: Date) => dayjs(date).format('MMM DD, YYYY'),
    },
    { 
      title: 'Status', 
      dataIndex: 'isActive', 
      key: 'status',
      render: (isActive: boolean) => (
        <Tag color={isActive ? 'green' : 'red'}>
          {isActive ? 'Active' : 'Inactive'}
        </Tag>
      )
    },
    ...(user?.role === 'admin' ? [{
      title: 'Store',
      dataIndex: 'storeId',
      key: 'storeId',
      render: (storeId: number) => {
        const store = stores.find(s => s.id === storeId);
        return store ? store.name : storeId;
      },
      responsive: ['xl' as Breakpoint]
    }] : []),
    {
      title: 'Actions',
      key: 'actions',
      render: (_: unknown, record: Coupon) => (
        <Space>
          <Button 
            onClick={() => handleEdit(record)}
          >
            Edit
          </Button>
          {record.isActive ? (
            <Button 
              danger 
              onClick={() => deactivateMutation.mutate(record.id)}
            >
              Delete
            </Button>
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
        updateMutation.mutate({ 
          id: editingCoupon.id, 
          coupon: payload 
        });
      } else {
        createMutation.mutate(payload);
      }
    });
  };

  return (
    <div className="p-4 md:p-6">
      <Card 
        title="Coupons & Promos" 
        extra={
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            onClick={handleCreate}
            className="mb-4 md:mb-0"
          >
            Create Coupon
          </Button>
        }
        className="shadow-md"
      >
        <Space 
          direction="vertical" 
          className="w-full mb-4"
        >
          <div className="flex flex-col md:flex-row gap-3">
            {user?.role === 'admin' && (
              <Select
                placeholder="Filter by store"
                className="w-full md:w-56"
                allowClear
                onChange={(value: number | undefined) => setStoreFilter(value)}
                options={stores.map(store => ({
                  value: store.id,
                  label: store.name
                }))}
              />
            )}
            <Select
              placeholder="Filter by status"
              className="w-full md:w-40"
              allowClear
              onChange={setStatusFilter}
              options={[
                { value: 'active', label: 'Active' },
                { value: 'inactive', label: 'Inactive' },
              ]}
            />
          </div>
        </Space>

        <Table 
          columns={columns} 
          dataSource={coupons} 
          loading={isLoading}
          rowKey="id"
          scroll={{ x: true }}
          pagination={{
            total: total,
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
            pageSizeOptions: ['5', '10', '20'],
            showSizeChanger: true,
          }}
        />
      </Card>

      <CustomModal
        title={editingCoupon ? "Edit Coupon" : "Create New Coupon"}
        open={isModalOpen}
        onOk={handleSubmit}
        onCancel={() => setIsModalOpen(false)}
        confirmLoading={createMutation.isPending || updateMutation.isPending}
      >
        <Form form={form} layout="vertical">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item
              name="title"
              label="Title"
              rules={[{ required: true, message: 'Please enter title' }]}
              className="mb-3"
            >
              <Input />
            </Form.Item>
            
            <Form.Item
              name="code"
              label="Coupon Code"
              rules={[{ required: true, message: 'Please enter coupon code' }]}
              className="mb-3"
            >
              <Input />
            </Form.Item>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              className="mb-3"
            >
              <InputNumber className="w-full" />
            </Form.Item>
            
            <Form.Item
              name="validUpto"
              label="Valid Until"
              rules={[{ required: true, message: 'Please select date' }]}
              className="mb-3"
            >
              <DatePicker className="w-full" />
            </Form.Item>
          </div>
          
          {user?.role === 'admin' && (
            <Form.Item
              name="storeId"
              label="Store"
              rules={[{ required: true, message: 'Please select store' }]}
              className="mb-3"
            >
              <Select
                className="w-full"
                options={stores.map(store => ({
                  value: store.id,
                  label: store.name
                }))}
              />
            </Form.Item>
          )}
        </Form>
      </CustomModal>
    </div>
  );
};

export default Promos;