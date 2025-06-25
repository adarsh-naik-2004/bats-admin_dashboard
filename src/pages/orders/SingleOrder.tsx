import {
  Avatar,
  Breadcrumb,
  Card,
  Col,
  Flex,
  List,
  Row,
  Select,
  Space,
  Tag,
  Typography,
} from "antd";
import { RightOutlined } from "@ant-design/icons";
import { Link, useParams } from "react-router-dom";
import { colorMapping } from "../../constants";
import { capitalizeFirst } from "../products/helpers";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { changeStatus, getSingle } from "../../http/api";
import { Order, OrderStatus } from "../../types";
import useBreakpoint from "antd/es/grid/hooks/useBreakpoint";
import { format } from 'date-fns';

const orderStatusOptions = [
  {
    value: "received",
    label: "Received",
  },
  {
    value: "confirmed",
    label: "Confirmed",
  },
  {
    value: "prepared",
    label: "Prepared",
  },
  {
    value: "out_for_delivery",
    label: "Out For Delivery",
  },
  {
    value: "delivered",
    label: "Delivered",
  },
];
const SingleOrder = () => {
  const params = useParams();
  const orderId = params.orderId;

  const { data: order } = useQuery<Order>({
    queryKey: ["order", orderId],
    queryFn: () => {
      const queryString = new URLSearchParams({
        fields:
          "cart,address,paymentMode,storeId,total,comment,orderStatus,paymentStatus,createdAt,customerId",
      }).toString();
      return getSingle(orderId as string, queryString).then((res) => res.data);
    },
  });
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationKey: ["order", orderId],
    mutationFn: (status: OrderStatus) => {
      return changeStatus(orderId as string, { status }).then(
        (res) => res.data
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["order", orderId] });
    },
  });

  const screens = useBreakpoint();

  if (!order) {
    return null;
  }

  const handleStatusChange = (status: OrderStatus) => {
    mutate(status);
  };

  // console.log('order', order);
  return (
    <div className="page-container">
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        <Flex
          justify="space-between"
          align={screens.md ? "center" : "flex-start"}
          wrap="wrap"
          gap="small"
          style={{ rowGap: "16px" }}
        >
          <Breadcrumb
            separator={<RightOutlined />}
            items={[
              { title: <Link to="/">Dashboard</Link> },
              { title: <Link to="/orders">Orders</Link> },
              { title: `Order #${order?._id}` },
            ]}
          />

          <Space>
            <Typography.Text>Change Order Status</Typography.Text>
            <Select
              defaultValue={order.orderStatus}
              style={{ width: 150 }}
              onChange={handleStatusChange}
              options={orderStatusOptions}
            />
          </Space>
        </Flex>

        <Row gutter={[24, 24]}>
          <Col xs={24} lg={14}>
            <Card
              title="Order Details"
              extra={
                <Tag
                  bordered={false}
                  color={colorMapping[order.orderStatus] ?? "processing"}
                >
                  {capitalizeFirst(order.orderStatus)}
                </Tag>
              }
            >
              <List
                itemLayout="horizontal"
                dataSource={order.cart}
                renderItem={(item) => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={<Avatar src={item.image} />}
                      title={item.name}
                      description={item.chosenConfiguration.selectedAccessorys
                        .map((accessory) => accessory.name)
                        .join(", ")}
                    />

                    <Space
                      size={"large"}
                      direction={screens.xs ? "vertical" : "horizontal"}
                    >
                      <Typography.Text>
                        {Object.values(
                          item.chosenConfiguration.priceConfiguration
                        ).join(", ")}
                      </Typography.Text>

                      <Typography.Text>
                        {item.qty} Item{item.qty > 1 ? "s" : ""}
                      </Typography.Text>
                    </Space>
                  </List.Item>
                )}
              />
            </Card>
          </Col>
          <Col xs={24} lg={10}>
            <Card
              title="Customer Details"
              style={{ marginTop: screens.lg ? 0 : "24px" }}
            >
              <Space direction="vertical" style={{ width: "100%" }}>
                <Flex style={{ flexDirection: "column" }}>
                <Typography.Text type="secondary">Name</Typography.Text>
                <Typography.Text>
                  {order.customerId?.firstName + " " + order.customerId?.lastName}
                </Typography.Text>
              </Flex>

              <Flex style={{ flexDirection: "column" }}>
                <Typography.Text type="secondary">Address</Typography.Text>
                <Typography.Text>{order.address}</Typography.Text>
              </Flex>

              <Flex style={{ flexDirection: "column" }}>
                <Typography.Text type="secondary">
                  Payment Method
                </Typography.Text>
                <Typography.Text>
                  {order.paymentMode.toUpperCase()}
                </Typography.Text>
              </Flex>

              <Flex style={{ flexDirection: "column" }}>
                <Typography.Text type="secondary">
                  Payment Status
                </Typography.Text>
                <Typography.Text>
                  {capitalizeFirst(order.paymentStatus)}
                </Typography.Text>
              </Flex>

              <Flex style={{ flexDirection: "column" }}>
                <Typography.Text type="secondary">Order Amount</Typography.Text>
                <Typography.Text>₹{order.total}</Typography.Text>
              </Flex>

              <Flex style={{ flexDirection: "column" }}>
                <Typography.Text type="secondary">Order Time</Typography.Text>
                <Typography.Text>
                  {format(new Date(order.createdAt), "dd/MM/yyyy HH:mm")}
                </Typography.Text>
              </Flex>

              {order.comment && (
                <Flex style={{ flexDirection: "column" }}>
                  <Typography.Text type="secondary">Comment</Typography.Text>
                  <Typography.Text>{order.comment}</Typography.Text>
                </Flex>
              )}
              </Space>
            </Card>
          </Col>
        </Row>
      </Space>
    </div>
  );
};

export default SingleOrder;
