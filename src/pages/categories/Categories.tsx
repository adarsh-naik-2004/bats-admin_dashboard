import { useState, useEffect } from "react";
import {
  Button,
  Card,
  Form,
  Input,
  Modal,
  Space,
  Table,
  Select,
  Typography,
  Row,
  Col,
  Tag,
  Divider,
} from "antd";
import { useForm } from "antd/es/form/Form";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import {
  createCategory,
  deleteCategory,
  getCategories,
  updateCategory,
} from "../../http/api";
import { Category, PriceConfiguration, Attribute } from "../../types";

const { Title } = Typography;

export default function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [form] = useForm();
  const [priceConfigs, setPriceConfigs] = useState<PriceConfiguration>({});
  const [attributes, setAttributes] = useState<Attribute[]>([]);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    const res = await getCategories();
    setCategories(res.data);
  };

  interface CategoryFormValues {
    _id?: string;
    name: string;
  }

  const handleSubmit = async (values: CategoryFormValues) => {
    // Create a payload that matches the Category type
    const payload: Category = {
      _id: editingCategory?._id || "", // Provide a fallback for new categories
      name: values.name,
      priceConfiguration: priceConfigs,
      attributes: attributes,
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
    form.setFieldsValue({ name: category.name });
    setPriceConfigs(category.priceConfiguration || {});
    setAttributes(category.attributes || []);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
    form.resetFields();
    setPriceConfigs({});
    setAttributes([]);
  };

  const addPriceConfig = () => {
    const newConfigs = { ...priceConfigs };
    const configName = `config_${Object.keys(priceConfigs).length + 1}`;
    newConfigs[configName] = {
      priceType: "base",
      availableOptions: [],
    };
    setPriceConfigs(newConfigs);
  };

  const removePriceConfig = (name: string) => {
    const newConfigs = { ...priceConfigs };
    delete newConfigs[name];
    setPriceConfigs(newConfigs);
  };

  const updatePriceConfig = (
    name: string,
    field: "name" | "priceType",
    value: string
  ) => {
    const newConfigs = { ...priceConfigs };
    if (!newConfigs[name]) return;

    if (field === "name") {
      // Rename the configuration
      if (value !== name) {
        const config = newConfigs[name];
        delete newConfigs[name];
        newConfigs[value] = config;
      }
    } else if (field === "priceType") {
      if (value === "base" || value === "additional") {
        newConfigs[name] = {
          ...newConfigs[name],
          priceType: value as "base" | "additional",
        };
      }
    }

    setPriceConfigs(newConfigs);
  };

  const addPriceOption = (configName: string) => {
    const newConfigs = { ...priceConfigs };
    if (!newConfigs[configName]) return;

    newConfigs[configName].availableOptions = [
      ...newConfigs[configName].availableOptions,
      `Option ${newConfigs[configName].availableOptions.length + 1}`,
    ];

    setPriceConfigs(newConfigs);
  };

  const removePriceOption = (configName: string, optionIndex: number) => {
    const newConfigs = { ...priceConfigs };
    if (!newConfigs[configName]) return;

    newConfigs[configName].availableOptions = newConfigs[
      configName
    ].availableOptions.filter((_, i) => i !== optionIndex);

    setPriceConfigs(newConfigs);
  };

  const updatePriceOption = (
    configName: string,
    optionIndex: number,
    value: string
  ) => {
    const newConfigs = { ...priceConfigs };
    if (!newConfigs[configName]) return;

    newConfigs[configName].availableOptions = newConfigs[
      configName
    ].availableOptions.map((opt, i) => (i === optionIndex ? value : opt));

    setPriceConfigs(newConfigs);
  };

  const addAttribute = () => {
    setAttributes([
      ...attributes,
      {
        name: `attribute_${attributes.length + 1}`,
        widgetType: "radio",
        defaultValue: "",
        availableOptions: ["Option 1", "Option 2"],
      },
    ]);
  };

  const removeAttribute = (index: number) => {
    setAttributes(attributes.filter((_, i) => i !== index));
  };

  const updateAttribute = (
    index: number,
    field: keyof Attribute,
    value: string | string[]
  ) => {
    const newAttributes = [...attributes];
    if (!newAttributes[index]) return;

    if (field === "name") {
      newAttributes[index] = {
        ...newAttributes[index],
        name: value as string,
      };
    } else {
      newAttributes[index] = {
        ...newAttributes[index],
        [field]: value,
      };
    }

    setAttributes(newAttributes);
  };

  const addAttributeOption = (index: number) => {
    const newAttributes = [...attributes];
    if (!newAttributes[index]) return;

    newAttributes[index].availableOptions = [
      ...newAttributes[index].availableOptions,
      `Option ${newAttributes[index].availableOptions.length + 1}`,
    ];

    setAttributes(newAttributes);
  };

  const removeAttributeOption = (attrIndex: number, optionIndex: number) => {
    const newAttributes = [...attributes];
    if (!newAttributes[attrIndex]) return;

    newAttributes[attrIndex].availableOptions = newAttributes[
      attrIndex
    ].availableOptions.filter((_, i) => i !== optionIndex);

    setAttributes(newAttributes);
  };

  const updateAttributeOption = (
    attrIndex: number,
    optionIndex: number,
    value: string
  ) => {
    const newAttributes = [...attributes];
    if (!newAttributes[attrIndex]) return;

    newAttributes[attrIndex].availableOptions = newAttributes[
      attrIndex
    ].availableOptions.map((opt, i) => (i === optionIndex ? value : opt));

    setAttributes(newAttributes);
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Price Configurations",
      key: "priceConfiguration",
      render: (record: Category) => (
        <div>
          {Object.keys(record.priceConfiguration || {}).map((name) => (
            <Tag key={name}>{name}</Tag>
          ))}
        </div>
      ),
    },
    {
      title: "Attributes",
      key: "attributes",
      render: (record: Category) => (
        <div>
          {(record.attributes || []).map((attr) => (
            <Tag key={attr.name}>{attr.name}</Tag>
          ))}
        </div>
      ),
    },
    {
      title: "Actions",
      key: "actions",
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
    <div className="page-container">
      <Card
        title="Categories"
        extra={
          <Button type="primary" onClick={() => setIsModalOpen(true)}>
            Add Category
          </Button>
        }
      >
        <Table
          columns={columns}
          dataSource={categories}
          rowKey="_id"
          scroll={{ x: true }}
          pagination={{
            pageSize: 10,
            showSizeChanger: false,
            responsive: true,
          }}
          expandable={{
            expandedRowRender: (record) => (
              <div>
                <Title level={5}>Price Configurations:</Title>
                {Object.entries(record.priceConfiguration || {}).map(
                  ([name, config]) => (
                    <div key={name} style={{ marginBottom: 16 }}>
                      <strong>{name}</strong> ({config.priceType})
                      <div>Options: {config.availableOptions.join(", ")}</div>
                    </div>
                  )
                )}

                <Title level={5}>Attributes:</Title>
                {(record.attributes || []).map((attr) => (
                  <div key={attr.name} style={{ marginBottom: 16 }}>
                    <strong>{attr.name}</strong> ({attr.widgetType})
                    <div>Default: {attr.defaultValue}</div>
                    <div>Options: {attr.availableOptions.join(", ")}</div>
                  </div>
                ))}
              </div>
            ),
          }}
        />
      </Card>

      <Modal
        title={editingCategory ? "Edit Category" : "Create Category"}
        open={isModalOpen}
        onCancel={closeModal}
        onOk={() => form.submit()}
        width="90%"
        style={{ maxWidth: 800 }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{ name: "" }}
        >
          <Form.Item
            label="Category Name"
            name="name"
            rules={[{ required: true, message: "Please enter category name" }]}
          >
            <Input placeholder="e.g., Cricket Bats, Protective Gear" />
          </Form.Item>

          <Divider orientation="left">Price Configurations</Divider>
          <div style={{ marginBottom: 16 }}>
            <Button
              type="dashed"
              onClick={addPriceConfig}
              icon={<PlusOutlined />}
              block
            >
              Add Price Configuration
            </Button>
          </div>

          {Object.entries(priceConfigs).map(([name, config]) => (
            <Card
              key={name}
              title={name}
              style={{ marginBottom: 16 }}
              extra={
                <Button
                  type="link"
                  danger
                  icon={<MinusCircleOutlined />}
                  onClick={() => removePriceConfig(name)}
                />
              }
            >
              <Row gutter={[16, 16]}>
                <Col xs={24} sm={12}>
                  <Form.Item label="Configuration Name">
                    <Input
                      value={name}
                      onChange={(e) =>
                        updatePriceConfig(name, "name", e.target.value)
                      }
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item label="Price Type">
                    <Select
                      value={config.priceType}
                      onChange={(value) =>
                        updatePriceConfig(name, "priceType", value)
                      }
                    >
                      <Select.Option value="base">Base Price</Select.Option>
                      <Select.Option value="additional">
                        Additional Price
                      </Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              <Title level={5}>Options:</Title>
              {config.availableOptions.map((option, index) => (
                <div
                  key={index}
                  style={{ marginBottom: 8, display: "flex", gap: 8 }}
                >
                  <Input
                    value={option}
                    onChange={(e) =>
                      updatePriceOption(name, index, e.target.value)
                    }
                  />
                  <Button
                    danger
                    icon={<MinusCircleOutlined />}
                    onClick={() => removePriceOption(name, index)}
                  />
                </div>
              ))}

              <Button
                type="dashed"
                onClick={() => addPriceOption(name)}
                icon={<PlusOutlined />}
                style={{ marginTop: 8 }}
                block
              >
                Add Option
              </Button>
            </Card>
          ))}

          <Divider orientation="left">Attributes</Divider>
          <div style={{ marginBottom: 16 }}>
            <Button
              type="dashed"
              onClick={addAttribute}
              icon={<PlusOutlined />}
              block
            >
              Add Attribute
            </Button>
          </div>

          {attributes.map((attr, index) => (
            <Card
              key={index}
              title={attr.name}
              style={{ marginBottom: 16 }}
              extra={
                <Button
                  type="link"
                  danger
                  icon={<MinusCircleOutlined />}
                  onClick={() => removeAttribute(index)}
                />
              }
            >
              <Row gutter={[16, 16]}>
                <Col xs={24} sm={12}>
                  <Form.Item label="Attribute Name">
                    <Input
                      value={attr.name}
                      onChange={(e) =>
                        updateAttribute(index, "name", e.target.value)
                      }
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item label="Widget Type">
                    <Select
                      value={attr.widgetType}
                      onChange={(value) =>
                        updateAttribute(index, "widgetType", value)
                      }
                    >
                      <Select.Option value="radio">Radio Buttons</Select.Option>
                      <Select.Option value="switch">
                        Toggle Switch
                      </Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              <Title level={5}>Options:</Title>
              {attr.availableOptions.map((option, optIndex) => (
                <div
                  key={optIndex}
                  style={{ marginBottom: 8, display: "flex", gap: 8 }}
                >
                  <Input
                    value={option}
                    onChange={(e) =>
                      updateAttributeOption(index, optIndex, e.target.value)
                    }
                  />
                  <Button
                    danger
                    icon={<MinusCircleOutlined />}
                    onClick={() => removeAttributeOption(index, optIndex)}
                  />
                </div>
              ))}

              <Button
                type="dashed"
                onClick={() => addAttributeOption(index)}
                icon={<PlusOutlined />}
                style={{ marginTop: 8 }}
                block
              >
                Add Option
              </Button>

              {attr.availableOptions.length > 0 && (
                <Form.Item label="Default Value" style={{ marginTop: 16 }}>
                  <Select
                    value={attr.defaultValue}
                    onChange={(value) =>
                      updateAttribute(index, "defaultValue", value)
                    }
                  >
                    {attr.availableOptions.map((option) => (
                      <Select.Option key={option} value={option}>
                        {option}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              )}
            </Card>
          ))}

          <Form.Item style={{ marginTop: 24 }}>
            <Button type="primary" htmlType="submit" block>
              {editingCategory ? "Update Category" : "Create Category"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
