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
} from "antd";
import Icon from "@ant-design/icons";
import { Link } from "react-router-dom";
import { ComponentType } from "react";
import Orders from "../components/logos/OrdersIcon";
import { useAuthStore } from "../store";
import Graph from "../components/logos/GraphIcon";

const { Title, Text } = Typography;


const list = [
  {
    OrderSummary: "SS Cricket Bat, SG Gloves",
    address: "Bandra, Mumbai",
    amount: 3200,
    status: "preparing",
    loading: false,
  },
  {
    OrderSummary: "Kookaburra Ball, SG Helmet",
    address: "Balurghat, West Bengal",
    amount: 4500,
    status: "on the way",
    loading: false,
  },
  {
    OrderSummary: "MRF Bat, Puma Pads",
    address: "Delhi, India",
    amount: 7800,
    status: "delivered",
    loading: false,
  },
  {
    OrderSummary: "Gray-Nicolls Bat, SG Gloves",
    address: "Kolkata, West Bengal",
    amount: 5200,
    status: "preparing",
    loading: false,
  },
  {
    OrderSummary: "SS Ball, SG Helmet",
    address: "Chennai, Tamil Nadu",
    amount: 3000,
    status: "on the way",
    loading: false,
  },
];


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
    <Icon
      component={IconComponent}
      style={{ color: iconColor, fontSize: 16 }}
    />
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
  return (
    <div>
      <Title level={4}>Welcome, {user?.firstName} 🏏</Title>
      <Row className="mt-4" gutter={16}>
        <Col span={12}>
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Card
                title={<CardTitle title="Total orders" PrefixIcon={Orders} />}
                variant="borderless"
              >
                <Statistic value={52} />
              </Card>
            </Col>
            <Col span={12}>
              <Card
                title={<CardTitle title="Total sale" PrefixIcon={Graph} />}
                variant="borderless"
              >
                <Statistic value={70000} precision={2} prefix="₹" />
              </Card>
            </Col>
            <Col span={24}>
              <Card
                title={<CardTitle title="Sales" PrefixIcon={Graph} />}
                variant="borderless"
              >
                {/* Graph content or component here */}
              </Card>
            </Col>
          </Row>
        </Col>
        <Col span={12}>
          <Card
            variant="borderless"
            title={<CardTitle title="Recent orders" PrefixIcon={Orders} />}
          >
            <List
              className="demo-loadmore-list"
              loading={false}
              itemLayout="horizontal"
              dataSource={list}
              renderItem={(item) => (
                <List.Item>
                  <Skeleton avatar title={false} loading={item.loading} active>
                    <List.Item.Meta
                      title={<a href="#">{item.OrderSummary}</a>}
                      description={item.address}
                    />
                    <Row style={{ flex: 1 }} justify="space-between">
                      <Col>
                        <Text strong>₹{item.amount}</Text>
                      </Col>
                      <Col>
                        <Tag
                          color={
                            item.status === "preparing"
                              ? "volcano"
                              : item.status === "on the way"
                              ? "blue"
                              : "green"
                          }
                        >
                          {item.status}
                        </Tag>
                      </Col>
                    </Row>
                  </Skeleton>
                </List.Item>
              )}
            />
            <div style={{ marginTop: 20 }}>
              <Button type="link">
                <Link to="/orders">See all orders</Link>
              </Button>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default HomePage;
