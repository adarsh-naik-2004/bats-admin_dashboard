import { useQuery } from "@tanstack/react-query";
import { Outlet } from "react-router-dom";
import { self } from "../http/api";
import { useAuthStore } from "../store";
import { useEffect } from "react";
import { AxiosError } from "axios";
import { ConfigProvider, theme } from "antd";
import { useThemeStore } from "../store"; // Import the global dark mode store

const getSelf = async () => {
  const { data } = await self();
  return data;
};

const Root = () => {
  const { setUser } = useAuthStore();
  const { darkMode } = useThemeStore(); // Use global dark mode

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

  if (isLoading) {
    return <div>Loading.......</div>;
  }

  return (
    <ConfigProvider theme={{ algorithm: darkMode ? theme.darkAlgorithm : theme.defaultAlgorithm }}>
      <Outlet />
    </ConfigProvider>
  );
};

export default Root;
