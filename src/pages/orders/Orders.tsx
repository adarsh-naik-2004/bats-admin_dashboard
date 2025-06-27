import { Breadcrumb, Flex, message, Space, Table, Tag, Typography } from "antd";
import { RightOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { Order } from "../../types";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getOrders } from "../../http/api";
import { format } from "date-fns";
import { colorMapping } from "../../constants";
import { capitalizeFirst } from "../products/helpers";
import React from "react";
import socket from "../../lib/socket";
import { useAuthStore } from "../../store";

const columns = [
  {
    title: "Order ID",
    dataIndex: "_id",
    key: "_id",
    render: (_text: string, record: Order) => {
      return <Typography.Text>{record._id}</Typography.Text>;
    },
  },
  {
    title: "Customer",
    dataIndex: "customerId",
    key: "customerId._id",
    render: (_text: string, record: Order) => {
      if (!record.customerId) return "";
      return (
        <Typography.Text>
          {record.customerId.firstName + " " + record.customerId.lastName}
        </Typography.Text>
      );
    },
  },
  {
    title: "Address",
    dataIndex: "address",
    key: "address",
    render: (_text: string, record: Order) => {
      return <Typography.Text>{record.address}</Typography.Text>;
    },
  },
  {
    title: "Comment",
    dataIndex: "comment",
    key: "comment",
    render: (_text: string, record: Order) => {
      return <Typography.Text>{record?.comment}</Typography.Text>;
    },
  },
  {
    title: "Payment Mode",
    dataIndex: "paymentMode",
    key: "paymentMode",
    render: (_text: string, record: Order) => {
      return <Typography.Text>{record.paymentMode}</Typography.Text>;
    },
  },
  {
    title: "Status",
    dataIndex: "orderStatus",
    key: "orderStatus",
    render: (_: boolean, record: Order) => {
      return (
        <>
          <Tag bordered={false} color={colorMapping[record.orderStatus]}>
            {capitalizeFirst(record.orderStatus)}
          </Tag>
        </>
      );
    },
  },
  {
    title: "Total",
    dataIndex: "total",
    key: "total",
    render: (text: string) => {
      return <Typography.Text>₹{text}</Typography.Text>;
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
  {
    title: "Actions",
    render: (_: string, record: Order) => {
      return <Link to={`/orders/${record._id}`}>Details</Link>;
    },
  },
];

const Orders = () => {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const [messageApi, contextHolder] = message.useMessage();

  const storeId = user?.store?.id;

  React.useEffect(() => {
    if (!user) return;

    // Join appropriate rooms based on user role
    if (user.role === "admin") {
      console.log("Admin joining admin room");
      socket.emit("join-admin");
    } else if (storeId) {
      console.log(`Manager joining store room: ${storeId}`);
      socket.emit("join-store", { storeId });
    }

    socket.on("join-ack", (data) => {
      console.log("Joined room:", data.roomId);
    });

    socket.on("order-update", (data) => {
      console.log("Received order update:", data);

      // Only process if user is admin or store matches
      if (user.role === "admin" || data.data.storeId === storeId) {
        queryClient.setQueryData(["orders", storeId], (old: Order[] = []) => [
          data.data,
          ...old,
        ]);
        messageApi.success("New Order Received");
      }
    });

    return () => {
      socket.off("join-ack");
      socket.off("order-update");
    };
  }, [storeId, queryClient, messageApi, user]);

  const { data: ordersResponse } = useQuery({
    queryKey: ["orders", user?.role, storeId],
    queryFn: () => {
      const queryParams = new URLSearchParams({
        page: "1",
        limit: "1000",
      });
      if (user?.role === "manager" && storeId) {
        queryParams.append("storeId", String(storeId));
      }

      return getOrders(queryParams.toString()).then((res) => res.data);
    },
    enabled: !!user,
  });

  return (
    <>
      {contextHolder}
      <div className="page-container">
        <Space direction="vertical" size="large" style={{ width: "100%" }}>
          <Flex justify="space-between" align="center" wrap="wrap" gap="small">
            <Breadcrumb
              separator={<RightOutlined />}
              items={[
                { title: <Link to="/">Dashboard</Link> },
                { title: "Orders" },
              ]}
            />
          </Flex>
          <Table
            columns={columns}
            rowKey={"_id"}
            dataSource={ordersResponse?.data || []}
            scroll={{ x: true }}
            pagination={{
              pageSize: 10,
              showSizeChanger: false,
              responsive: true,
            }}
          />
        </Space>
      </div>
    </>
  );
};
export default Orders;
