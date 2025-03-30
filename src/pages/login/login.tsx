import { Layout, Card, Space, Form, Input, Checkbox, Button, Flex, Alert, Switch } from 'antd';
import { LockFilled, UserOutlined, LockOutlined, MoonOutlined, SunOutlined } from '@ant-design/icons';
import { login, self, logout } from '../../http/api';
import { Credentials } from '../../types';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useAuthStore } from '../../store';
import { usePermission } from '../../hooks/usePermission';
import { useThemeStore } from '../../store'; // Import your theme store

const loginUser = async (credentials: Credentials) => {
  const { data } = await login(credentials);
  return data;
};

const getSelf = async () => {
  const { data } = await self();
  return data;
};

const LoginPage = () => {
  const { isAllowed } = usePermission();
  const { setUser, logout: logoutFromStore } = useAuthStore();
  const darkMode = useThemeStore((state) => state.darkMode);
  const toggleDarkMode = useThemeStore((state) => state.toggleDarkMode);

  const { refetch } = useQuery({
    queryKey: ['self'],
    queryFn: getSelf,
    enabled: false,
  });

  const { mutate: logoutMutate } = useMutation({
    mutationKey: ['logout'],
    mutationFn: logout,
    onSuccess: async () => {
        logoutFromStore();
        return;
    },
  });

  const { mutate, isPending, isError, error } = useMutation({
    mutationKey: ['login'],
    mutationFn: loginUser,
    onSuccess: async () => {
      const selfDataPromise = await refetch();
      if (!isAllowed(selfDataPromise.data)) {
        logoutMutate();
        return;
      }
      setUser(selfDataPromise.data)
    },
  });

  return (
    <Layout style={{ 
      height: '100vh', 
      display: 'grid', 
      placeItems: 'center',
      backgroundColor: darkMode ? '#141414' : '#fff' // Add dark mode background
    }}>
      <Space direction="vertical" align="center" size="large">
        <Flex gap="middle" align="center" justify="end" style={{ width: '100%' }}>
          <Switch
            checkedChildren={<MoonOutlined />}
            unCheckedChildren={<SunOutlined />}
            checked={darkMode}
            onChange={toggleDarkMode}
          />
        </Flex>
        
        <Card
          variant="borderless"
          style={{ 
            width: 300,
            backgroundColor: darkMode ? '#1f1f1f' : '#fff',
            borderColor: darkMode ? '#434343' : '#f0f0f0'
          }}
          title={
            <Space style={{ 
              width: '100%', 
              fontSize: 16, 
              justifyContent: 'center',
              color: darkMode ? '#fff' : 'inherit'
            }}>
              <LockFilled />
              Sign in
            </Space>
          }>
          <Form
            initialValues={{
                remember: true,
            }}
            onFinish={(values) => {
              mutate({ email: values.username, password: values.password });
            }}>
            {isError && (
              <Alert
                style={{ marginBottom: 24 }}
                type="error"
                message={error?.message}
              />
            )}
            <Form.Item
              name="username"
              rules={[
                  {
                      required: true,
                      message: 'Please input your Username',
                  },
                  {
                      type: 'email',
                      message: 'Email not valid',
                  },
              ]}>
              <Input 
                prefix={<UserOutlined />} 
                placeholder="Username" 
                style={{ backgroundColor: darkMode ? '#141414' : '#fff' }}
              />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[
                  {
                      required: true,
                      message: 'Please input your password',
                  },
              ]}>
              <Input.Password 
                prefix={<LockOutlined />} 
                placeholder="Password" 
                style={{ backgroundColor: darkMode ? '#141414' : '#fff' }}
              />
            </Form.Item>
            <Flex justify="space-between">
              <Form.Item name="remember" valuePropName="checked">
                <Checkbox style={{ color: darkMode ? '#fff' : 'inherit' }}>
                  Remember me
                </Checkbox>
              </Form.Item>
              <a href="" id="login-form-forgot" style={{ color: darkMode ? '#1677ff' : 'inherit' }}>
                Forgot password
              </a>
            </Flex>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                style={{ width: '100%' }}
                loading={isPending}
              >
                Log in
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </Space>
    </Layout>
  )
}

export default LoginPage;