import { useState } from "react";
import { Layout, Menu, Switch, Badge, Button, Flex, theme, Space } from "antd";
import { MoonOutlined, SunOutlined, LogoutOutlined } from "@ant-design/icons";
import { useLocation, NavLink, Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../store";
import { logout } from "../http/api";
import { useMutation } from "@tanstack/react-query";
import Icon from "@ant-design/icons";
import HomeIcon from "../components/logos/HomeIcon";
import ProductsIcon from "../components/logos/ProductsIcon";
import OrdersIcon from "../components/logos/OrdersIcon";
import GiftIcon from "../components/logos/GiftIcon";
import UsersIcon from "../components/logos/UsersIcon";
import StoreIcon from "../components/logos/StoreIcon";
import CategoriesIcon from "../components/logos/CategoriesIcon";
import { useThemeStore } from "../store";

const { Sider, Header, Content } = Layout;

const getMenuItems = (role: string) => {
  const menuMap = {
    home: {
      key: "/",
      icon: <Icon component={HomeIcon} />,
      label: <NavLink to="/">Home</NavLink>,
    },
    products: {
      key: "/products",
      icon: <Icon component={ProductsIcon} />,
      label: <NavLink to="/products">Products</NavLink>,
    },
    orders: {
      key: "/orders",
      icon: <Icon component={OrdersIcon} />,
      label: <NavLink to="/orders">Orders</NavLink>,
    },
    promos: {
      key: "/promos",
      icon: <Icon component={GiftIcon} />,
      label: <NavLink to="/promos">Promos</NavLink>,
    },
    users: {
      key: "/users",
      icon: <Icon component={UsersIcon} />,
      label: <NavLink to="/users">Users</NavLink>,
    },
    stores: {
      key: "/stores",
      icon: <Icon component={StoreIcon} />,
      label: <NavLink to="/stores">Stores</NavLink>,
    },
    categories: {
      key: "/categories",
      icon: <Icon component={CategoriesIcon} />,
      label: <NavLink to="/categories">Categories</NavLink>,
    },
  };

  const allowedKeys: (keyof typeof menuMap)[] =
    role === "admin"
      ? ["home", "users", "stores", "categories", "products", "promos"]
      : ["home", "products", "orders", "promos"];
  return allowedKeys.map((key) => menuMap[key]);
};

const Dashboard = () => {
  const location = useLocation();
  const { logout: logoutFromStore } = useAuthStore();
  const { user } = useAuthStore();
  const darkMode = useThemeStore((state) => state.darkMode);
  const toggleDarkMode = useThemeStore((state) => state.toggleDarkMode);

  const { mutate: logoutMutate } = useMutation({
    mutationKey: ["logout"],
    mutationFn: logout,
    onSuccess: async () => {
      logoutFromStore();
    },
  });

  const [collapsed, setCollapsed] = useState(false);
  const [broken, setBroken] = useState(false);

  const {
    token: { colorBgContainer, colorText },
  } = theme.useToken();

  if (!user) {
    return (
      <Navigate
        to={`/auth/login?returnTo=${location.pathname}`}
        replace={true}
      />
    );
  }

  const items = getMenuItems(user.role);

  return (
    <Layout
      style={{
        minHeight: "100vh",
        background: darkMode ? "#000000" : colorBgContainer,
      }}
    >
      <Sider
        collapsible
        theme={darkMode ? "dark" : "light"}
        collapsed={collapsed}
        onCollapse={setCollapsed}
        breakpoint="lg"
        collapsedWidth="0"
        onBreakpoint={(broken) => setBroken(broken)}
      >
        <Menu
          theme={darkMode ? "dark" : "light"}
          selectedKeys={[location.pathname]}
          mode="inline"
          items={items}
          onClick={() => {
            if (broken) {
              setCollapsed(true);
            }
          }}
          style={{ marginTop: "18px" }}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            background: darkMode ? "#000000" : colorBgContainer,
            color: colorText,
            padding: "0 16px",
            height: "auto",
            lineHeight: "normal",
          }}
        >
          <Flex
            justify="space-between"
            align="center"
            wrap="wrap"
            style={{ padding: "12px 0" }}
          >
            <Badge
              text={
                user.role === "admin" ? "You are an admin" : user.store?.name
              }
              status="success"
            />
            <Space size={16} style={{ padding: "8px 0" }}>
              <Switch
                checkedChildren={<MoonOutlined />}
                unCheckedChildren={<SunOutlined />}
                checked={darkMode}
                onChange={toggleDarkMode}
              />
              <Button
                type="text"
                icon={<LogoutOutlined />}
                onClick={() => logoutMutate()}
                style={{ padding: "0 10px" }}
              >
                Logout
              </Button>
            </Space>
          </Flex>
        </Header>
        <Content
          style={{
            margin: "16px",
            padding: "24px",
            background: darkMode ? "#141414" : "#fff",
            borderRadius: "8px",
            minHeight: "280px",
            color: darkMode ? "#ffffff" : "inherit",
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default Dashboard;
