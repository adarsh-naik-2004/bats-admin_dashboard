import {
  Card,
  Col,
  Form,
  Input,
  Row,
  Select,
  Space,
  Switch,
  Typography,
} from "antd";

import { Category, Store } from "../../../types";
import { useQuery } from "@tanstack/react-query";
import { getCategories, getStores } from "../../../http/api";
import Pricing from "./Pricing";
import Attributes from "./Attributes";
import ProductImage from "./ProductImage";
import { useAuthStore } from "../../../store";

const ProductForm = () => {
  const { user } = useAuthStore();
  const selectedCategory = Form.useWatch("categoryId");

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  const { data: shops } = useQuery({
    queryKey: ["shops"],
    queryFn: () => getStores(`perPage=100&currentPage=1`),
  });

  return (
    <Row justify="center">
      <Col xs={24} sm={24} md={22} lg={20}>
        <Space direction="vertical" size="large" style={{ width: "100%" }}>
          <Card title="Product Info" variant="borderless">
            <Row gutter={[16, 16]}>
              <Col xs={24} md={12}>
                <Form.Item
                  label="Product Name"
                  name="name"
                  rules={[
                    { required: true, message: "Product name is required" },
                  ]}
                >
                  <Input size="large" />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  label="Category"
                  name="categoryId"
                  rules={[{ required: true, message: "Category is required" }]}
                >
                  <Select
                    size="large"
                    allowClear
                    placeholder="Select category"
                    style={{ width: "100%" }}
                  >
                    {categories?.data.map((category: Category) => (
                      <Select.Option key={category._id} value={category._id}>
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
                    { required: true, message: "Description is required" },
                  ]}
                >
                  <Input.TextArea
                    rows={2}
                    maxLength={100}
                    size="large"
                    style={{ resize: "none" }}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Card>

          <Card title="Product Image" variant="borderless">
            <Row gutter={[16, 16]}>
              <Col xs={24} md={12}>
                <Form.Item
                  name="image"
                  rules={[
                    { required: true, message: "Product image is required" },
                  ]}
                  valuePropName="file"
                >
                  <ProductImage />
                </Form.Item>
              </Col>
            </Row>
          </Card>

          {user?.role !== "manager" && (
            <Card title="Store Info" variant="borderless">
              <Row gutter={[16, 16]}>
                <Col span={24}>
                  <Form.Item
                    label="Shop"
                    name="storeId"
                    rules={[{ required: true, message: "Shop is required" }]}
                  >
                    <Select
                      size="large"
                      allowClear
                      placeholder="Select shop"
                      style={{ width: "100%" }}
                    >
                      {shops?.data.data.map((store: Store) => (
                        <Select.Option key={store.id} value={String(store.id)}>
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
          {selectedCategory && (
            <Attributes selectedCategory={selectedCategory} />
          )}

          <Card title="Other Properties" variant="borderless">
            <Row gutter={[16, 16]}>
              <Col span={24}>
                <Space align="center">
                  <Form.Item name="isPublish" valuePropName="checked" noStyle>
                    <Switch checkedChildren="Yes" unCheckedChildren="No" />
                  </Form.Item>
                  <Typography.Text>Published</Typography.Text>
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
