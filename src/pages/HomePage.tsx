import { useEffect, useState } from "react";
import { 
  Button,
  Card,
  Col,
  List,
  Row,
  Skeleton,
  Space,
  Statistic,
  Tag,
  Typography,
  Empty,
  Spin
} from "antd";
import Icon from "@ant-design/icons";
import { Link } from "react-router-dom";
import { ComponentType } from "react";
import Orders from "../components/logos/OrdersIcon";
import { useAuthStore } from "../store";
import Graph from "../components/logos/GraphIcon";
import { getOrders } from "../http/api";
import { Order } from "../types";
import { format } from "date-fns";
import { colorMapping } from "../constants";

const { Title, Text } = Typography;

const ColoredIcon = ({
  IconComponent,
  bgColor,
  iconColor,
}: {
  IconComponent: ComponentType;
  bgColor: string;
  iconColor: string;
}) => (
  <div
    style={{
      backgroundColor: bgColor,
      borderRadius: "50%",
      width: 32,
      height: 32,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    <Icon component={IconComponent} style={{ color: iconColor, fontSize: 16 }} />
  </div>
);

interface CardTitleProps {
  title: string;
  PrefixIcon: ComponentType<unknown>;
}

const CardTitle = ({ title, PrefixIcon }: CardTitleProps) => {
  let bgColor = "#f6ffed";
  let iconColor = "#52c41a"; 

  if (title === "Total orders") {
    bgColor = "#e6f7ff"; 
    iconColor = "#1890ff";
  } else if (title === "Total sale") {
    bgColor = "#fff1f0";
    iconColor = "#f5222d"; 
  } else if (title === "Sales") {
    bgColor = "#f9f0ff";
    iconColor = "#722ed1"; 
  } else if (title === "Recent orders") {
    bgColor = "#fff7e6"; 
    iconColor = "#fa8c16"; 
  }

  return (
    <Space>
      <ColoredIcon
        IconComponent={PrefixIcon}
        bgColor={bgColor}
        iconColor={iconColor}
      />
      {title}
    </Space>
  );
};

function HomePage() {
  const { user } = useAuthStore();
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalSales, setTotalSales] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        const params: Record<string, string | number> = {
          limit: 5,
          sortBy: "createdAt:desc"
        };
        
        if (user?.role === "manager" && user?.store?.id) {
          params.storeId = user.store.id;
        }

        // Convert all values to string before passing to URLSearchParams
        const stringParams: Record<string, string> = Object.fromEntries(
          Object.entries(params).map(([key, value]) => [key, String(value)])
        );
        const queryString = new URLSearchParams(stringParams).toString();
        const response = await getOrders(queryString);
        
        setRecentOrders(response.data.data || []);
        setTotalOrders(response.data.total || 0);
        
        // Calculate total sales from orders
        const salesTotal = (response.data.data || []).reduce(
          (sum: number, order: Order) => sum + (order.total || 0), 0
        );
        setTotalSales(salesTotal);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  // Helper function to capitalize first letter
  const capitalizeFirst = (str: string): string => {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  return (
    <div>
      <Title level={4}>
        Welcome, {user?.firstName} {user?.role === "manager" && `(${user?.store?.name || "Your Store"})`} 🏏
      </Title>
      
      <Row className="mt-4" gutter={16}>
        <Col span={12}>
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Card
                title={<CardTitle title="Total orders" PrefixIcon={Orders} />}
                variant="borderless"
              >
                {loading ? (
                  <Skeleton.Input active size="small" />
                ) : (
                  <Statistic value={totalOrders} />
                )}
              </Card>
            </Col>
            
            <Col span={12}>
              <Card
                title={<CardTitle title="Total sale" PrefixIcon={Graph} />}
                variant="borderless"
              >
                {loading ? (
                  <Skeleton.Input active size="small" />
                ) : (
                  <Statistic 
                    value={totalSales} 
                    precision={2} 
                    prefix="₹" 
                  />
                )}
              </Card>
            </Col>
            
            <Col span={24}>
              <Card
                title={<CardTitle title="Sales Overview" PrefixIcon={Graph} />}
                variant="borderless"
              >
                {loading ? (
                  <Skeleton active paragraph={{ rows: 4 }} />
                ) : recentOrders.length > 0 ? (
                  <div style={{ height: 250 }}>
                    <div style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      height: "100%",
                      backgroundColor: "#f5f5f5",
                      borderRadius: 8
                    }}>
                      <Typography.Text type="secondary">
                        Sales chart would appear here
                      </Typography.Text>
                    </div>
                  </div>
                ) : (
                  <Empty description="No sales data available" />
                )}
              </Card>
            </Col>
          </Row>
        </Col>
        
        <Col span={12}>
          <Card
            variant="borderless"
            title={<CardTitle title="Recent orders" PrefixIcon={Orders} />}
          >
            {loading ? (
              <Spin tip="Loading orders..." />
            ) : recentOrders.length === 0 ? (
              <Empty description="No recent orders" />
            ) : (
              <>
                <List
                  className="demo-loadmore-list"
                  loading={false}
                  itemLayout="horizontal"
                  dataSource={recentOrders}
                  renderItem={(order) => {
                    const orderId = order._id ? `Order #${order._id.slice(-6).toUpperCase()}` : "Order";
                    const orderTotal = order.total ? `₹${order.total.toFixed(2)}` : "₹0.00";
                    const createdAt = order.createdAt 
                      ? format(new Date(order.createdAt), 'dd/MM/yyyy HH:mm') 
                      : "Unknown date";
                    const status = order.orderStatus || "unknown";
                    
                    return (
                      <List.Item>
                        <List.Item.Meta
                          title={
                            <Link to={`/orders/${order._id || ''}`}>
                              {orderId}
                            </Link>
                          }
                          description={
                            <Space direction="vertical" size={2}>
                              <Text>{order.address || "No address"}</Text>
                              <Text type="secondary">{createdAt}</Text>
                            </Space>
                          }
                        />
                        <Row style={{ flex: 1 }} justify="space-between">
                          <Col>
                            <Text strong>{orderTotal}</Text>
                          </Col>
                          <Col>
                            <Tag color={colorMapping[status] || "default"}>
                              {capitalizeFirst(status)}
                            </Tag>
                          </Col>
                        </Row>
                      </List.Item>
                    );
                  }}
                />
                <div style={{ marginTop: 20 }}>
                  <Button type="link">
                    <Link to="/orders">See all orders</Link>
                  </Button>
                </div>
              </>
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default HomePage;