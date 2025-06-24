import { useQuery } from "@tanstack/react-query";
import { Outlet } from "react-router-dom";
import { self } from "../http/api";
import { useAuthStore } from "../store";
import { useEffect } from "react";
import { AxiosError } from "axios";
import { ConfigProvider, Spin, theme } from "antd";
import { useThemeStore } from "../store"; 

const getSelf = async () => {
  const { data } = await self();
  return data;
};

const Root = () => {
  const { setUser } = useAuthStore();
  const { darkMode } = useThemeStore(); 

  const { data, isLoading } = useQuery({
    queryKey: ["self"],
    queryFn: getSelf,
    retry: (failureCount: number, error) => {
      if (error instanceof AxiosError && error.response?.status === 401) {
        return false;
      }
      return failureCount < 3;
    },
  });

  useEffect(() => {
    if (data) {
      setUser(data);
    }
  }, [data, setUser]);

  return (
    <ConfigProvider theme={{ algorithm: darkMode ? theme.darkAlgorithm : theme.defaultAlgorithm }}>
      {isLoading ? (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          background: darkMode ? '#141414' : '#f5f5f5'
        }}>
          <Spin 
            size="large" 
            tip="Initializing..." 
            indicator={
              <div className="custom-spin">
                <div className="spinner">
                  <div className="spinner-sector spinner-sector-top"></div>
                  <div className="spinner-sector spinner-sector-bottom"></div>
                </div>
              </div>
            }
          />
        </div>
      ) : (
        <Outlet />
      )}
    </ConfigProvider>
  );
};

export default Root;