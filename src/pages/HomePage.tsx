import { useEffect, useState } from "react";
import { 
  Button,
  Card,
  Col,
  List,
  Row,
  Space,
  Statistic,
  Tag,
  Typography,
  Empty,
  Spin,
} from "antd";
import Icon from "@ant-design/icons";
import { Link } from "react-router-dom";
import { ComponentType } from "react";
import Orders from "../components/logos/OrdersIcon";
import { useAuthStore } from "../store";
import Graph from "../components/logos/GraphIcon";
import { getOrders, getUsers, getStores, getCategories, getProducts, getCoupons } from "../http/api";
import { format } from "date-fns";
import { colorMapping } from "../constants";
import {Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

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
  } else if (title === "Total stores") {
    bgColor = "#f9f0ff";
    iconColor = "#722ed1"; 
  } else if (title === "Recent orders") {
    bgColor = "#fff7e6"; 
    iconColor = "#fa8c16"; 
  } else if (title === "User Distribution") {
    bgColor = "#f0f5ff";
    iconColor = "#2f54eb";
  }
  else if (title === "Total categories") {
    bgColor = "#e6f7ff"; 
    iconColor = "#1890ff";
  } else if (title === "Total products") {
    bgColor = "#fff7e6"; 
    iconColor = "#fa8c16"; 
  } else if (title === "Total promos") {
    bgColor = "#f6ffed";
    iconColor = "#52c41a";
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

const aggregateData = (data: Record<string, unknown>[], key: string) => {
  return data.reduce((acc: Record<string, number>, item) => {
    const value = String(item[key]);
    acc[value] = (acc[value] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
};

const formatChartData = (data: Record<string, number>) => {
  return Object.entries(data).map(([name, value]) => ({ name, value }));
};

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

function HomePage() {
  const { user } = useAuthStore();
  interface Order {
    _id?: string;
    total?: number;
    createdAt?: string;
    address?: string;
    orderStatus?: string;
    store?: { id: string };
  }

  interface Category {
    _id: string;
    name: string;
  }

  interface Product {
    _id: string;
    name: string;
  }

  interface ProductsResponse {
    data: Product[];
    total: number;
  }

  interface CouponsResponse {
    data: unknown[];
    total: number;
  }

  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalSales, setTotalSales] = useState(0);
  const [loading, setLoading] = useState(true);
  const [userDistribution, setUserDistribution] = useState<{name: string, value: number}[]>([]);
  interface Store {
    id: string;
    name?: string;
    address?: string;
  }
  const [totalStores, setTotalStores] = useState(0);
  const [totalCategories, setTotalCategories] = useState(0);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalPromos, setTotalPromos] = useState(0);


  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        if (user?.role === "manager" && user?.store?.id) {
          const orderParams = new URLSearchParams({
            storeId: String(user.store.id),
            limit: "5",
            sortBy: "createdAt:desc"
          });

          const allOrdersParams = new URLSearchParams({
            storeId: String(user.store.id),
            limit: "0"
          });
          
          const [orderResponse, allOrdersResponse] = await Promise.all([
            getOrders(orderParams.toString()),
            getOrders(allOrdersParams.toString())
          ]);

          setRecentOrders(orderResponse.data?.data || []);
          setTotalOrders(orderResponse.data?.total || 0);
          
          const salesTotal = (allOrdersResponse.data?.data || []).reduce(
            (sum: number, order: Order) => sum + (order.total || 0), 0
          );
          setTotalSales(salesTotal);
        }

        if (user?.role === "admin") {
          const [
            userResponse, 
            storesResponse, 
            categoriesResponse,
            productsResponse,
            couponsResponse
          ] = await Promise.all([
            getUsers(""),
            getStores(""),
            getCategories(),
            getProducts("limit=0"),
            getCoupons("limit=0")
          ]);

          const users = userResponse.data.data || [];
          const roleDistribution = aggregateData(users, 'role');
          setUserDistribution(formatChartData(roleDistribution));
          
          const stores: Store[] = storesResponse.data.data || [];
          setTotalStores(stores.length);

          const categories: Category[] = categoriesResponse.data || [];
          setTotalCategories(categories.length);

          const productsData: ProductsResponse = productsResponse.data;
          setTotalProducts(productsData.total || 0);

          const couponsData: CouponsResponse = couponsResponse.data;
          setTotalPromos(couponsData.total || 0);
        }
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  const capitalizeFirst = (str: string): string => {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  return (
    <div style={{ padding: '12px' }}>
      <Title level={4} style={{ marginBottom: '16px' }}>
        Welcome, {user?.firstName} {user?.role === "manager" && `(${user?.store?.name || "Your Store"})`} 🏏
      </Title>
      
      <Row gutter={[16, 16]}>
        {user?.role === "manager" && (
          <>
            <Col xs={24} sm={12} md={8}>
              <Card
                title={<CardTitle title="Total orders" PrefixIcon={Orders} />}
                variant="borderless"
                loading={loading}
                bodyStyle={{ padding: '16px' }}
              >
                <Statistic value={totalOrders} />
              </Card>
            </Col>
            
            <Col xs={24} sm={12} md={8}>
              <Card
                title={<CardTitle title="Total sale" PrefixIcon={Graph} />}
                variant="borderless"
                loading={loading}
                bodyStyle={{ padding: '16px' }}
              >
                <Statistic 
                  value={totalSales} 
                  precision={2} 
                  prefix="₹" 
                />
              </Card>
            </Col>
          </>
        )}

        {user?.role === "admin" && (
          <>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Card
                title={<CardTitle title="Total stores" PrefixIcon={Graph} />}
                variant="borderless"
                loading={loading}
                bodyStyle={{ padding: '16px' }}
              >
                <Statistic value={totalStores} />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Card
                title={<CardTitle title="Total categories" PrefixIcon={Graph} />}
                variant="borderless"
                loading={loading}
                bodyStyle={{ padding: '16px' }}
              >
                <Statistic value={totalCategories} />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Card
                title={<CardTitle title="Total products" PrefixIcon={Graph} />}
                variant="borderless"
                loading={loading}
                bodyStyle={{ padding: '16px' }}
              >
                <Statistic value={totalProducts} />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Card
                title={<CardTitle title="Total promos" PrefixIcon={Graph} />}
                variant="borderless"
                loading={loading}
                bodyStyle={{ padding: '16px' }}
              >
                <Statistic value={totalPromos} />
              </Card>
            </Col>
          </>
        )}
      </Row>
    
      <Row gutter={[16, 16]} style={{ marginTop: '16px' }}>
        {user?.role === "admin" && (
          <Col xs={24}>
            <Card 
              title={<CardTitle title="User Distribution" PrefixIcon={Graph} />}
              variant="borderless"
              loading={loading}
              bodyStyle={{ padding: '16px' }}
            >
              {userDistribution.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={userDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      label={({ name, percent }) => `${name}: ${((percent ?? 0) * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {userDistribution.map((_,index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <Empty description="No user data available" />
              )}
            </Card>
          </Col>
        )}
      </Row>
      
      {user?.role === "manager" && (
        <Row gutter={[16, 16]} style={{ marginTop: '16px' }}>
          <Col xs={24} xl={24}>
            <Card
              variant="borderless"
              title={<CardTitle title="Recent orders" PrefixIcon={Orders} />}
              bodyStyle={{ padding: '0 16px 16px' }}
            >
              {loading ? (
                <Spin tip="Loading orders..." style={{ padding: '16px', textAlign: 'center' }} />
              ) : recentOrders.length === 0 ? (
                <Empty description="No recent orders" style={{ padding: '16px 0' }} />
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
                      type StatusKey = keyof typeof colorMapping;
                      const status: StatusKey = (order.orderStatus as StatusKey) || "received";
                      
                      return (
                        <List.Item style={{ padding: '12px 0' }}>
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
                  <div style={{ marginTop: '16px', textAlign: 'right' }}>
                    <Button type="link">
                      <Link to="/orders">See all orders</Link>
                    </Button>
                  </div>
                </>
              )}
            </Card>
          </Col>
        </Row>
      )}
    </div>
  );
}

export default HomePage;