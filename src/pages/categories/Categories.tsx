import { Button, Card, Form, Input, Modal, Space, Table } from "antd";
import { useForm } from "antd/es/form/Form";
import { useEffect, useState } from "react";
import { 
  createCategory, 
  deleteCategory, 
  getCategories, 
  updateCategory 
} from "../../http/api";
import { Category } from "../../types";

export default function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [form] = useForm();

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    const res = await getCategories();
    setCategories(res.data);
  };

  const handleSubmit = async (values: Category) => {
    const payload = {
      ...values,
      priceConfiguration: values.priceConfiguration || {},
      attributes: values.attributes || []
    };

    if (editingCategory) {
      await updateCategory(payload, editingCategory._id!);
    } else {
      await createCategory(payload);
    }
    closeModal();
    loadCategories();
  };

  const handleDelete = async (id: string) => {
    await deleteCategory(id);
    loadCategories();
  };

  const openEditModal = (category: Category) => {
    setEditingCategory(category);
    form.setFieldsValue({
      name: category.name,
      priceConfiguration: category.priceConfiguration,
      attributes: category.attributes
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
    form.resetFields();
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: unknown, record: Category) => (
        <Space>
          <Button onClick={() => openEditModal(record)}>Edit</Button>
          <Button danger onClick={() => handleDelete(record._id!)}>
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <Card 
      title="Categories" 
      extra={
        <Button type="primary" onClick={() => setIsModalOpen(true)}>
          Add Category
        </Button>
      }
    >
      <Table columns={columns} dataSource={categories} rowKey="_id" />
      
      <Modal
        title={editingCategory ? "Edit Category" : "Create Category"}
        open={isModalOpen}
        onCancel={closeModal}
        onOk={() => form.submit()}
      >
        <Form 
          form={form} 
          layout="vertical" 
          onFinish={handleSubmit}
          initialValues={{
            priceConfiguration: {},
            attributes: []
          }}
        >
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: 'Please enter category name' }]}
          >
            <Input placeholder="e.g., Cricket Bats, Protective Gear" />
          </Form.Item>
          
          {/* Hidden fields for required properties */}
          <Form.Item name="priceConfiguration" hidden>
            <Input />
          </Form.Item>
          <Form.Item name="attributes" hidden>
            <Input />
          </Form.Item>
          
          <Form.Item>
            <Button type="primary" htmlType="submit">
              {editingCategory ? "Update" : "Create"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
}