import { createBrowserRouter } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/login/login";
import Dashboard from "./layouts/Dashboard";
import NonAuth from "./layouts/NonAuth";
import Root from "./layouts/Root";
import Users from "./pages/users/Users";
import Stores from "./pages/stores/Store";
import Products from "./pages/products/Products";
import Orders from "./pages/orders/Orders";
import SingleOrder from "./pages/orders/SingleOrder";
import Categories from "./pages/categories/Categories";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      {
        path: "",
        element: <Dashboard />,
        children: [
          {
            path: "",
            element: <HomePage />,
          },
          {
            path: "/users",
            element: <Users />,
          },
          {
            path: "/stores",
            element: <Stores />,
          },

          {
            path: "/products",
            element: <Products />,
          },
          {
            path: "/categories",
            element: <Categories />,
          },
          {
            path: "/orders",
            element: <Orders />,
          },
          {
            path: "/orders/:orderId",
            element: <SingleOrder />,
          },
        ],
      },
      {
        path: "/auth",
        element: <NonAuth />,
        children: [
          {
            path: "login",
            element: <LoginPage />,
          },
        ],
      },
    ],
  },
]);
