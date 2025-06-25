import {
  Breadcrumb,
  Button,
  Drawer,
  Flex,
  Form,
  Image,
  Space,
  Spin,
  Table,
  Tag,
  theme,
  Typography,
  Modal,
  message,
} from "antd";
import {
  RightOutlined,
  PlusOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import ProductsFilter from "./ProductsFilter";
import { FieldData, Product } from "../../types";
import React from "react";
import { PER_PAGE } from "../../constants";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  createProduct,
  getProducts,
  updateProduct,
  deleteProduct,
} from "../../http/api";
import { format } from "date-fns";
import { debounce } from "lodash";
import { useAuthStore } from "../../store";
import ProductForm from "./forms/ProductForm";
import { makeFormData } from "./helpers";

const columns = [
  {
    title: "Product Name",
    dataIndex: "name",
    key: "name",
    render: (_text: string, record: Product) => {
      return (
        <div>
          <Space>
            <Image width={60} src={record.image} preview={false} />
            <Typography.Text>{record.name}</Typography.Text>
          </Space>
        </div>
      );
    },
  },
  {
    title: "Description",
    dataIndex: "description",
    key: "description",
  },
  {
    title: "Status",
    dataIndex: "isPublish",
    key: "isPublish",
    render: (_: boolean, record: Product) => {
      return (
        <>
          {record.isPublish ? (
            <Tag color="green">Published</Tag>
          ) : (
            <Tag color="red">Draft</Tag>
          )}
        </>
      );
    },
  },
  {
    title: "CreatedAt",
    dataIndex: "createdAt",
    key: "createdAt",
    render: (text: string) => {
      return (
        <Typography.Text>
          {format(new Date(text), "dd/MM/yyyy HH:mm")}
        </Typography.Text>
      );
    },
  },
];

const Products = () => {
  const [modal, contextHolderModal] = Modal.useModal();
  const [messageApi, contextHolder] = message.useMessage();

  const [filterForm] = Form.useForm();
  const [form] = Form.useForm();

  const [selectedProduct, setCurrentProduct] = React.useState<Product | null>(
    null
  );
  React.useEffect(() => {
    if (selectedProduct) {
      setDrawerOpen(true);

      console.log("seletedProduct", selectedProduct.priceConfiguration);

      const priceConfiguration = Object.entries(
        selectedProduct.priceConfiguration
      ).reduce((acc, [key, value]) => {
        const stringifiedKey = JSON.stringify({
          configurationKey: key,
          priceType: value.priceType,
        });

        return {
          ...acc,
          [stringifiedKey]: value.availableOptions,
        };
      }, {});

      const attributes = selectedProduct.attributes.reduce((acc, item) => {
        return {
          ...acc,
          [item.name]: item.value,
        };
      }, {});

      form.setFieldsValue({
        ...selectedProduct,
        priceConfiguration,
        attributes,
        // todo: fix this
        categoryId: selectedProduct.category._id,
      });
    }
  }, [selectedProduct, form]);

  const { user } = useAuthStore();

  const {
    token: { colorBgLayout },
  } = theme.useToken();
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  const [queryParams, setQueryParams] = React.useState({
    limit: PER_PAGE,
    page: 1,
    storeId: user!.role === "manager" ? user?.store?.id : undefined,
  });

  const {
    data: products,
    isFetching,
    isError,
    error,
  } = useQuery({
    queryKey: ["products", queryParams],
    queryFn: () => {
      const filteredParams = Object.fromEntries(
        Object.entries(queryParams).filter((item) => !!item[1])
      );

      const queryString = new URLSearchParams(
        filteredParams as unknown as Record<string, string>
      ).toString();
      return getProducts(queryString).then((res) => res.data);
    },
    placeholderData: keepPreviousData,
  });

  const debouncedQUpdate = React.useMemo(() => {
    return debounce((value: string | undefined) => {
      setQueryParams((prev) => ({ ...prev, q: value, page: 1 }));
    }, 500);
  }, []);

  const onFilterChange = (changedFields: FieldData[]) => {
    const changedFilterFields = changedFields
      .map((item) => ({
        [item.name[0]]: item.value,
      }))
      .reduce((acc, item) => ({ ...acc, ...item }), {});
    if ("q" in changedFilterFields) {
      debouncedQUpdate(changedFilterFields.q);
    } else {
      setQueryParams((prev) => ({ ...prev, ...changedFilterFields, page: 1 }));
    }
  };
  const queryClient = useQueryClient();
  const { mutate: productMutate, isPending: isCreateLoading } = useMutation({
    mutationKey: ["product"],
    mutationFn: async (data: FormData) => {
      if (selectedProduct) {
        // edit mode
        return updateProduct(data, selectedProduct._id).then((res) => res.data);
      } else {
        return createProduct(data).then((res) => res.data);
      }
    },
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      form.resetFields();
      setDrawerOpen(false);
      return;
    },
  });

  const onHandleSubmit = async () => {
    try {
      await form.validateFields();

      const priceConfiguration = form.getFieldValue("priceConfiguration");
      const pricing = Object.entries(priceConfiguration).reduce(
        (acc, [key, value]) => {
          const parsedKey = JSON.parse(key);
          return {
            ...acc,
            [parsedKey.configurationKey]: {
              priceType: parsedKey.priceType,
              availableOptions: value,
            },
          };
        },
        {}
      );

      const categoryId = form.getFieldValue("categoryId");

      const attributes = Object.entries(form.getFieldValue("attributes")).map(
        ([key, value]) => {
          return {
            name: key,
            value: value,
          };
        }
      );

      const postData = {
        ...form.getFieldsValue(),
        storeId:
          user!.role === "manager"
            ? user?.store?.id
            : form.getFieldValue("storeId"),
        isPublish: form.getFieldValue("isPublish") ? true : false,
        categoryId,
        priceConfiguration: pricing,
        attributes,
      };

      const formData = makeFormData(postData);
      await productMutate(formData);
    } catch (error) {
      console.error("Form validation failed:", error);
      messageApi.error("Please fill all required fields correctly");
    }
  };

  const { mutate: deleteProductMutation } = useMutation({
    mutationKey: ["deleteProduct"],
    mutationFn: (productId: string) =>
      deleteProduct(productId).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      messageApi.success("Product deleted successfully");
    },
    onError: (error: Error) => {
      messageApi.error(`Delete failed: ${error.message}`);
    },
  });

  const handleDelete = (productId: string) => {
    modal.confirm({
      title: "Delete Product?",
      content: "This action cannot be undone",
      okText: "Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk: async () => {
        try {
          await deleteProductMutation(productId);
          messageApi.success("Product deleted");
        } catch (err) {
          console.error(err);
          messageApi.error("Delete failed");
        }
      },
    });
  };

  return (
    <>
      {contextHolderModal}
      {contextHolder}
      <div
        style={{
          paddingInline: "1rem",
          paddingBlock: "1rem",
          maxWidth: "100%",
          overflowX: "hidden",
        }}
      >
        <Space direction="vertical" size="large" style={{ width: "100%" }}>
          <Flex
            justify="space-between"
            align="center"
            wrap="wrap"
            style={{ rowGap: "1rem" }}
          >
            <Breadcrumb
              separator={<RightOutlined />}
              items={[
                { title: <Link to="/">Dashboard</Link> },
                { title: "Products" },
              ]}
            />
            {isFetching && (
              <Spin
                indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}
              />
            )}
            {isError && (
              <Typography.Text type="danger">{error.message}</Typography.Text>
            )}
          </Flex>

          <Form form={filterForm} onFieldsChange={onFilterChange}>
            <ProductsFilter>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => {
                  setDrawerOpen(true);
                }}
              >
                Add Product
              </Button>
            </ProductsFilter>
          </Form>

          <div style={{ overflowX: "auto" }}>
            <Table
              scroll={{ x: true }}
              columns={[
                ...columns,
                {
                  title: "Actions",
                  render: (_, record: Product) => (
                    <Space wrap>
                      <Button
                        onClick={() => setCurrentProduct(record)}
                      >
                        Edit
                      </Button>
                      {user?.role === "admin" && (
                        <Button
                          danger
                          onClick={() => handleDelete(record._id)}
                        >
                          Delete
                        </Button>
                      )}
                    </Space>
                  ),
                },
              ]}
              dataSource={products?.data}
              rowKey="_id"
              pagination={{
                total: products?.total,
                pageSize: queryParams.limit,
                current: queryParams.page,
                onChange: (page) =>
                  setQueryParams((prev) => ({ ...prev, page })),
                showTotal: (total, range) =>
                  `Showing ${range[0]}-${range[1]} of ${total} items`,
              }}
            />
          </div>

          <Drawer
            title={selectedProduct ? "Update Product" : "Add Product"}
            width={window.innerWidth < 768 ? "100%" : 720}
            styles={{
              body: { backgroundColor: colorBgLayout, paddingBottom: "2rem" },
            }}
            destroyOnClose
            open={drawerOpen}
            onClose={() => {
              setCurrentProduct(null);
              form.resetFields();
              setDrawerOpen(false);
            }}
            extra={
              <Space>
                <Button
                  onClick={() => {
                    setCurrentProduct(null);
                    form.resetFields();
                    setDrawerOpen(false);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="primary"
                  onClick={onHandleSubmit}
                  loading={isCreateLoading}
                >
                  Submit
                </Button>
              </Space>
            }
          >
            <Form layout="vertical" form={form}>
              <ProductForm/>
            </Form>
          </Drawer>
        </Space>
      </div>
    </>
  );
};

export default Products;
